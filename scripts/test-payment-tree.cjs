const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { QRCodeSVG } = require("qrcode.react");

function load(relativePath, dependencies = {}) {
  const output = {};
  const source = fs.readFileSync(path.join(__dirname, "..", relativePath), "utf8");
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  vm.runInNewContext(code, {
    exports: output,
    require: (name) => {
      if (name in dependencies) return dependencies[name];
      throw new Error(`Unexpected dependency: ${name}`);
    },
  });
  return output;
}

const tree = load("src/lib/payment-tree.ts");
const { createPaymentTreeRenderer } = load("src/lib/payment-tree-renderer.ts", {
  "./payment-tree": tree,
});

function qr(value, minVersion = 1) {
  const markup = renderToStaticMarkup(
    React.createElement(QRCodeSVG, {
      value,
      size: 190,
      marginSize: 4,
      level: "M",
      minVersion,
    }),
  );
  const path = markup.match(/<path[^>]*fill="#000000"[^>]*d="([^"]+)"/)[1];
  const cells = Number(markup.match(/viewBox="0 0 (\d+)/)[1]);
  return { path, modules: tree.readPaymentQrModules(path, cells, 190, 222) };
}

test("read every dark cell from the actual QR SVG at different code densities", () => {
  for (const value of [
    "order-one",
    "https://example.com/demo-order?reference=" + "1234567890".repeat(20),
  ]) {
    for (const version of [1, 10, 20]) {
      const { path, modules } = qr(value, version);
      const expected = [...path.matchAll(/h(\d+)v1/g)].reduce(
        (sum, match) => sum + Number(match[1]),
        0,
      );
      assert.equal(modules.length, expected);
      assert.equal(new Set(modules.map((cell) => `${cell.x}:${cell.y}`)).size, expected);
    }
  }
  assert.equal(tree.readPaymentQrModules("unknown path format", 29, 190, 222).length, 0);
});

test("top-down camera preserves every QR coordinate regardless of tree height", () => {
  const { modules } = qr("https://example.com/payment-preview");
  const scene = tree.createPaymentTreeScene(modules, "summer", null);
  const camera = tree.paymentTreeCamera(0, scene.span);
  for (const cell of modules) {
    for (const height of [0, 50, 200]) {
      const projected = camera.project({ x: cell.x - 120, y: height, z: cell.y - 120 });
      assert.ok(Math.abs(projected.x - cell.x) < 1e-9);
      assert.ok(Math.abs(projected.y - cell.y) < 1e-9);
    }
    // At least one top surface of the fixed garden occupies the exact dark cell.
    const match = scene.faces.some((face) => {
      if (face.material !== "leaf" && face.material !== "grass") return false;
      const points = face.points;
      return (
        points.length === 4 &&
        points.every((point) => point.y === points[0].y) &&
        Math.abs(Math.min(...points.map((point) => point.x)) - (cell.x - 120)) < 1e-8 &&
        Math.abs(Math.min(...points.map((point) => point.z)) - (cell.y - 120)) < 1e-8 &&
        Math.abs(Math.max(...points.map((point) => point.x)) - (cell.x + cell.size - 120)) < 1e-8
      );
    });
    assert.ok(match, "dark cells must not be reassigned to arbitrary tree positions");
  }
});

test("season and color changes recolor the same geometry", () => {
  const { modules } = qr("demo payment order " + "A1234567890".repeat(10));
  const initial = tree.createPaymentTreeScene(modules, "summer", null);
  const points = JSON.stringify(initial.faces.map((face) => face.points));
  for (const season of ["spring", "summer", "autumn"]) {
    for (const color of [null, ...Object.keys(tree.TREE_COLORS)]) {
      const scene = tree.createPaymentTreeScene(modules, season, color);
      assert.equal(scene.moduleCount, modules.length);
      assert.equal(JSON.stringify(scene.faces.map((face) => face.points)), points);
      assert.ok(
        scene.faces.every((face) =>
          face.color.every((channel) => Number.isFinite(channel) && channel >= 0 && channel <= 255),
        ),
      );
    }
  }
});

test("QR uses the tree hue across seasons and swatches without changing its pattern", () => {
  const value = "https://example.com/payment-preview";
  const baseline = qr(value);
  const green = tree.paymentQrColor("summer", null);
  assert.ok(parseInt(green.slice(3, 5), 16) > parseInt(green.slice(1, 3), 16));
  for (const season of ["spring", "summer", "autumn"]) {
    for (const color of [null, ...Object.keys(tree.TREE_COLORS)]) {
      const shade = tree.paymentQrColor(season, color);
      assert.notEqual(shade, "#000000");
      const markup = renderToStaticMarkup(
        React.createElement(QRCodeSVG, {
          value,
          size: 190,
          marginSize: 4,
          level: "M",
          fgColor: shade,
        }),
      );
      const paths = [...markup.matchAll(/<path[^>]*d="([^"]+)"/g)];
      assert.equal(paths.at(-1)[1], baseline.path);
      assert.ok(markup.includes(`fill="${shade}"`));
      const scene = tree.createPaymentTreeScene(baseline.modules, season, color);
      assert.equal(
        scene.qrColor.map((c) => c.toString(16).padStart(2, "0")).join(""),
        shade.slice(1),
      );
      const brightness = scene.qrColor.reduce((sum, c, i) => {
        const channel = c / 255;
        const linear = channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
        return sum + linear * [0.2126, 0.7152, 0.0722][i];
      }, 0);
      assert.ok(
        brightness <= 0.18,
        "Even pale swatches retain contrast on the white QR background",
      );
    }
  }
});

test("GPU orbit reuses one geometry upload and releases its resources", () => {
  let uploads = 0,
    draws = 0,
    deletedBuffers = 0,
    deletedPrograms = 0,
    data,
    qrUniform;
  const gl = new Proxy(
    {
      createShader: () => ({}),
      createProgram: () => ({}),
      createBuffer: () => ({}),
      getShaderParameter: () => true,
      getProgramParameter: () => true,
      getAttribLocation: () => 0,
      getUniformLocation: (_, name) => name,
      bufferData: (_, values) => {
        uploads++;
        data = values;
      },
      uniform3f: (name, ...channels) => {
        if (name === "u_qrColor") qrUniform = channels;
      },
      drawArrays: (_, start, count) => {
        draws++;
        assert.equal(start, 0);
        assert.equal(count, data.length / 7);
      },
      deleteBuffer: () => {
        deletedBuffers++;
      },
      deleteProgram: () => {
        deletedPrograms++;
      },
    },
    { get: (object, key) => (key in object ? object[key] : () => {}) },
  );
  const canvas = { width: 444, height: 444, getContext: (type) => (type === "webgl" ? gl : null) };
  const renderer = createPaymentTreeRenderer(canvas);
  const scene = tree.createPaymentTreeScene(qr("test order").modules, "summer", null);
  const before = JSON.stringify(scene);
  renderer.setScene(scene);
  assert.equal(JSON.stringify(qrUniform), JSON.stringify(scene.qrColor.map((c) => c / 255)));
  for (const progress of [0, 0.2, 0.6, 1, 0.6, 0.2, 0]) renderer.draw(1.5, progress);
  assert.equal(uploads, 1, "camera frames must not rebuild or shuffle the QR geometry");
  assert.equal(draws, 7);
  assert.ok([...data].every(Number.isFinite));
  assert.equal(JSON.stringify(scene), before);
  renderer.dispose();
  assert.equal(deletedBuffers, 1);
  assert.equal(deletedPrograms, 1);
});

test("unavailable graphics returns a fallback result instead of breaking QR display", () => {
  assert.equal(createPaymentTreeRenderer({ getContext: () => null }), null);
});

test("shared shader uniforms and varyings declare matching precision", () => {
  const sources = [];
  const gl = new Proxy(
    {
      createShader: () => ({}),
      createProgram: () => ({}),
      createBuffer: () => ({}),
      shaderSource: (_, source) => sources.push(source),
      getShaderParameter: () => true,
      getProgramParameter: () => true,
      getAttribLocation: () => 0,
      getUniformLocation: () => ({}),
    },
    { get: (object, key) => (key in object ? object[key] : () => {}) },
  );
  const renderer = createPaymentTreeRenderer({ getContext: () => gl });
  assert.equal(renderer.surface, "webgl");
  const declarations = (source) =>
    new Map(
      [
        ...source.matchAll(
          /\b(uniform|varying)\s+(?:(lowp|mediump|highp)\s+)?(float|vec[234])\s+(\w+)\s*;/g,
        ),
      ].map((match) => [match[4], { kind: match[1], precision: match[2] }]),
    );
  const vertex = declarations(sources[0]);
  const fragment = declarations(sources[1]);
  for (const [name, declaration] of fragment) {
    assert.ok(vertex.has(name), `${name} must exist in both shader stages`);
    assert.ok(declaration.precision, `${name} must not rely on differing stage defaults`);
    assert.equal(vertex.get(name).precision, declaration.precision, name);
  }
  renderer.dispose();
});

test("shader, linker, driver and context failures use an independent 2D surface", () => {
  for (const failure of ["compile", "link", "driver", "context"]) {
    let drawn = 0;
    const context = new Proxy(
      {
        fillRect: () => {
          drawn++;
        },
      },
      {
        get: (object, key) => (key in object ? object[key] : () => {}),
      },
    );
    const gl = new Proxy(
      {
        createShader: () => ({}),
        createProgram: () => ({}),
        createBuffer: () => ({}),
        getShaderParameter: () => failure !== "compile",
        getProgramParameter: () => failure !== "link",
        isContextLost: () => failure === "context",
      },
      { get: (object, key) => (key in object ? object[key] : () => {}) },
    );
    const primary = {
      getContext: (type) => {
        assert.equal(type, "webgl", "never ask a claimed WebGL canvas for a 2D context");
        if (failure === "driver") throw new Error("graphics driver unavailable");
        return gl;
      },
    };
    const fallback = {
      width: 444,
      height: 444,
      getContext: (type) => {
        assert.equal(type, "2d");
        return context;
      },
    };
    const renderer = createPaymentTreeRenderer(primary, fallback);
    assert.equal(renderer.surface, "fallback", failure);
    renderer.setScene(tree.createPaymentTreeScene(qr("fallback order").modules, "summer", null));
    renderer.draw(1.5, 1);
    renderer.draw(1.5, 0);
    assert.equal(drawn, 2, "both tree and QR endpoints render despite WebGL failure");
    renderer.dispose();
  }
});
