import { drawPaymentTreeScene } from "./payment-tree";
import type { PaymentTreeScene } from "./payment-tree";

export type PaymentTreeRenderer = {
  surface: "webgl" | "fallback";
  setScene(scene: PaymentTreeScene): void;
  draw(time: number, progress: number): void;
  dispose(): void;
};

const vertexSource = `
  attribute vec3 a_position;
  attribute vec3 a_color;
  attribute float a_material;
  uniform mediump float u_progress;
  uniform float u_span;
  uniform float u_time;
  uniform vec3 u_qrColor;
  varying mediump vec3 v_color;
  varying mediump float v_material;
  void main() {
    float p = clamp(u_progress, 0.0, 1.0);
    float azimuth = p * 0.7853981634;
    float elevation = mix(1.5707963268, 0.5654866776, p);
    float zoom = mix(1.0, min(0.84, 202.0 / (u_span * 1.4142135624)), p);
    vec3 point = a_position;
    if (a_material > 0.5 && a_material < 1.5) {
      point.x += sin(u_time * 1.1 + point.y * 0.035) * 0.55 * p;
    }
    float horizontal = point.x * cos(azimuth) - point.z * sin(azimuth);
    float forward = point.x * sin(azimuth) + point.z * cos(azimuth);
    float x = 120.0 + horizontal * zoom;
    float y = mix(120.0, 176.0, p) + (forward * sin(elevation) - point.y * cos(elevation)) * zoom;
    float depth = forward * cos(elevation) + point.y * sin(elevation);
    gl_Position = vec4(x / 120.0 - 1.0, 1.0 - y / 120.0, -depth / 400.0, 1.0);
    float amount = smoothstep(0.0, 0.16, p);
    vec3 base = a_material < 0.5 ? vec3(1.0) : u_qrColor;
    v_color = mix(base, a_color, amount);
    v_material = a_material;
  }
`;
const fragmentSource = `
  precision mediump float;
  uniform mediump float u_progress;
  varying mediump vec3 v_color;
  varying mediump float v_material;
  void main() {
    float alpha = v_material > 2.5 ? smoothstep(0.025, 0.22, u_progress) : 1.0;
    if (alpha < 0.001) discard;
    gl_FragColor = vec4(v_color, alpha);
  }
`;

/** Upload fixed geometry once; each animation frame changes only camera uniforms. */
function createWebGLRenderer(canvas: HTMLCanvasElement): PaymentTreeRenderer | null {
  const gl = canvas.getContext("webgl", { alpha: false, antialias: true, depth: true });
  if (!gl || gl.isContextLost()) return null;
  const shader = (type: number, source: string) => {
    const compiled = gl.createShader(type);
    if (!compiled) return null;
    gl.shaderSource(compiled, source);
    gl.compileShader(compiled);
    if (gl.getShaderParameter(compiled, gl.COMPILE_STATUS)) return compiled;
    gl.deleteShader(compiled);
    return null;
  };
  const vertex = shader(gl.VERTEX_SHADER, vertexSource);
  const fragment = shader(gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  const buffer = gl.createBuffer();
  if (!vertex || !fragment || !program || !buffer) {
    if (vertex) gl.deleteShader(vertex);
    if (fragment) gl.deleteShader(fragment);
    if (program) gl.deleteProgram(program);
    if (buffer) gl.deleteBuffer(buffer);
    return null;
  }
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    gl.deleteBuffer(buffer);
    return null;
  }
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  const stride = 7 * Float32Array.BYTES_PER_ELEMENT;
  for (const [name, size, offset] of [
    ["a_position", 3, 0],
    ["a_color", 3, 3],
    ["a_material", 1, 6],
  ] as const) {
    const location = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(
      location,
      size,
      gl.FLOAT,
      false,
      stride,
      offset * Float32Array.BYTES_PER_ELEMENT,
    );
  }
  const progressUniform = gl.getUniformLocation(program, "u_progress");
  const timeUniform = gl.getUniformLocation(program, "u_time");
  const spanUniform = gl.getUniformLocation(program, "u_span");
  const qrColorUniform = gl.getUniformLocation(program, "u_qrColor");
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  let count = 0;
  let backgroundColor = [255, 255, 255];
  return {
    surface: "webgl",
    setScene(scene) {
      backgroundColor = scene.backgroundColor;
      const values: number[] = [];
      const materialIds = { ground: 0, leaf: 1, grass: 2, wood: 3 };
      for (const face of scene.faces) {
        for (let i = 1; i < face.points.length - 1; i++) {
          for (const point of [face.points[0], face.points[i], face.points[i + 1]]) {
            values.push(
              point.x,
              point.y,
              point.z,
              ...face.color.map((c) => c / 255),
              materialIds[face.material],
            );
          }
        }
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(values), gl.STATIC_DRAW);
      gl.uniform1f(spanUniform, scene.span);
      gl.uniform3f(
        qrColorUniform,
        scene.qrColor[0] / 255,
        scene.qrColor[1] / 255,
        scene.qrColor[2] / 255,
      );
      count = values.length / 7;
    },
    draw(time, progress) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(
        (255 + (backgroundColor[0] - 255) * progress) / 255,
        (255 + (backgroundColor[1] - 255) * progress) / 255,
        (255 + (backgroundColor[2] - 255) * progress) / 255,
        1,
      );
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniform1f(progressUniform, progress);
      gl.uniform1f(timeUniform, time);
      gl.drawArrays(gl.TRIANGLES, 0, count);
    },
    dispose() {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    },
  };
}

/** A failed WebGL canvas cannot become 2D; use an independent fallback canvas. */
export function createPaymentTreeRenderer(
  canvas: HTMLCanvasElement,
  fallbackCanvas: HTMLCanvasElement = canvas,
): PaymentTreeRenderer | null {
  try {
    const renderer = createWebGLRenderer(canvas);
    if (renderer) return renderer;
  } catch {
    // A driver/context error should not disable the tree control.
  }
  try {
    const context = fallbackCanvas.getContext("2d");
    if (!context) return null;
    let scene: PaymentTreeScene | null = null;
    return {
      surface: "fallback",
      setScene(next) {
        scene = next;
      },
      draw(time, progress) {
        if (!scene) return;
        context.setTransform(fallbackCanvas.width / 240, 0, 0, fallbackCanvas.height / 240, 0, 0);
        drawPaymentTreeScene(context, 240, time, progress, scene);
      },
      dispose() {
        scene = null;
      },
    };
  } catch {
    return null;
  }
}
