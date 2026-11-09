export type TreeSeason = "spring" | "summer" | "autumn";
export type TreeColor = "pink" | "purple" | "green" | "gold" | "blue" | "ice";
export type QrModule = { x: number; y: number; size: number };
type RGB = [number, number, number];
type Point = { x: number; y: number; z: number };
type Material = "leaf" | "grass" | "wood" | "ground" | "petal" | "fallingLeaf" | "rain" | "sunMote";
type Face = { points: Point[]; center: Point; color: RGB; material: Material; phase: number };
export type PaymentTreeScene = {
  faces: Face[];
  span: number;
  moduleCount: number;
  qrColor: RGB;
  backgroundColor: RGB;
  wind: number;
};

export const TREE_COLORS: Record<TreeColor, string> = {
  pink: "#e9a3b4",
  purple: "#a473c4",
  green: "#78b83b",
  gold: "#e9a600",
  blue: "#388af3",
  ice: "#dce7ec",
};
const palettes = {
  spring: ["#eba8c0", "#f6c6d5", "#f9dce6", "#df9aba", "#fbe3ed"],
  summer: ["#8cbe43", "#a0cc50", "#b1d966", "#79ad38", "#c1df7d"],
  autumn: ["#d89536", "#eab94e", "#cc7431", "#f0c969", "#b86932"],
};
const seasons = {
  spring: {
    spread: 0.96,
    height: 1.03,
    retention: 0.91,
    layers: 0.7,
    lower: 0.42,
    grass: 0.8,
    wind: 0.55,
    backdrop: 0.96,
  },
  summer: {
    spread: 1.03,
    height: 1,
    retention: 1,
    layers: 1,
    lower: 0.85,
    grass: 1.2,
    wind: 0.8,
    backdrop: 0.94,
  },
  autumn: {
    spread: 0.96,
    height: 0.98,
    retention: 0.72,
    layers: 0.52,
    lower: 0.24,
    grass: 0.45,
    wind: 2.3,
    backdrop: 0.91,
  },
};
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const mix = (a: number, b: number, amount: number) => a + (b - a) * amount;
const smooth = (from: number, to: number, value: number) => {
  const t = clamp((value - from) / (to - from));
  return t * t * (3 - 2 * t);
};
const rgb = (hex: string): RGB => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as RGB;
const tint = (color: RGB, amount: number): RGB =>
  color.map((c) => Math.round(amount >= 0 ? c + (255 - c) * amount : c * (1 + amount))) as RGB;

/** Use the leaf hue for QR cells, with enough depth to stay clear on white. */
export function paymentQrColor(season: TreeSeason, color: TreeColor | null): string {
  const channels = rgb(color ? TREE_COLORS[color] : palettes[season][0]);
  const luminance = (values: RGB) =>
    values.reduce((sum, channel, index) => {
      const value = channel / 255;
      const linear = value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      return sum + linear * [0.2126, 0.7152, 0.0722][index];
    }, 0);
  let shade: RGB = channels;
  for (let factor = 0.98; luminance(shade) > 0.18 && factor > 0; factor -= 0.02) {
    shade = channels.map((channel) => Math.round(channel * factor)) as RGB;
  }
  return `#${shade.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

/** Read the real SVG cells, including their original quiet-zone offset. */
export function readPaymentQrModules(
  path: string,
  cells: number,
  qrSize: number,
  frameSize: number,
): QrModule[] {
  if (!path || cells <= 0 || qrSize <= 0 || frameSize <= 0) return [];
  const runs = [...path.matchAll(/M(\d+)[ ,]+(\d+)\s*h(\d+)v1H\d+z/g)];
  if (runs.map((run) => run[0]).join("") !== path) return [];
  const scale = (qrSize / cells / frameSize) * 240;
  const offset = ((frameSize - qrSize) / 2 / frameSize) * 240;
  return runs.flatMap((run) =>
    Array.from({ length: Number(run[3]) }, (_, i) => ({
      x: offset + (Number(run[1]) + i) * scale,
      y: offset + Number(run[2]) * scale,
      size: scale,
    })),
  );
}

/** A fixed anamorphic garden: dark cells keep their QR x/z positions at all times. */
export function createPaymentTreeScene(
  modules: QrModule[],
  season: TreeSeason,
  color: TreeColor | null,
): PaymentTreeScene {
  const faces: Face[] = [];
  const qrColor = rgb(paymentQrColor(season, color));
  const themeColor = rgb(color ? TREE_COLORS[color] : palettes[season][0]);
  const profile = seasons[season];
  const backgroundColor = tint(themeColor, profile.backdrop);
  const wind = profile.wind;
  if (!modules.length) return { faces, span: 180, moduleCount: 0, qrColor, backgroundColor, wind };
  const min = Math.min(...modules.map((cell) => Math.min(cell.x, cell.y)));
  const max = Math.max(...modules.map((cell) => Math.max(cell.x + cell.size, cell.y + cell.size)));
  const span = max - min,
    half = span / 2,
    cellSize = modules[0].size;
  let seed = 8721;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const face = (points: Point[], color: RGB, material: Material, phase = 0) => {
    const center = points.reduce(
      (sum, p) => ({
        x: sum.x + p.x / points.length,
        y: sum.y + p.y / points.length,
        z: sum.z + p.z / points.length,
      }),
      { x: 0, y: 0, z: 0 },
    );
    faces.push({ points, center, color, material, phase });
  };
  const box = (
    x: number,
    z: number,
    top: number,
    width: number,
    height: number,
    color: RGB,
    material: Material,
  ) => {
    const h = width / 2;
    const a = { x: x - h, y: top, z: z - h },
      b = { x: x + h, y: top, z: z - h };
    const c = { x: x + h, y: top, z: z + h },
      d = { x: x - h, y: top, z: z + h };
    face(
      [b, { ...b, y: top - height }, { ...c, y: top - height }, c],
      tint(color, -0.22),
      material,
    );
    face(
      [d, { ...d, y: top - height }, { ...c, y: top - height }, c],
      tint(color, -0.12),
      material,
    );
    face([a, b, c, d], color, material);
  };
  // Light paving forms the QR background; it is part of the same scene.
  const tiles = 13,
    tileSize = span / tiles;
  for (let row = 0; row < tiles; row++)
    for (let col = 0; col < tiles; col++) {
      box(
        min - 120 + (col + 0.5) * tileSize,
        min - 120 + (row + 0.5) * tileSize,
        -2,
        tileSize + 0.03,
        4,
        tint(themeColor, random() > 0.4 ? 0.9 : 0.82),
        "ground",
      );
    }
  for (const module of modules) {
    const x = module.x + module.size / 2 - 120,
      z = module.y + module.size / 2 - 120;
    const radius = Math.hypot(
      x / (half * 0.74 * profile.spread),
      z / (half * 0.69 * profile.spread),
    );
    const retained = random() < profile.retention;
    const palette = palettes[season];
    const paletteIndex = Math.floor(random() * palette.length);
    const leafColor = tint(
      rgb(color ? TREE_COLORS[color] : palette[paletteIndex]),
      random() * 0.22 - 0.08,
    );
    if (radius < 1 && retained) {
      const shape = Math.pow(Math.max(0, 1 - radius * radius), 0.64);
      const height =
        (86 + shape * 112 + Math.sin(x * 0.11 + z * 0.06) * 9 + Math.cos(z * 0.14) * 7) *
        profile.height;
      // Leaf columns stay directly above their source QR cell, including all layers.
      box(
        x,
        z,
        height,
        module.size,
        module.size * (season === "summer" ? 1.3 : 0.4),
        season === "spring" ? tint(leafColor, 0.12) : leafColor,
        "leaf",
      );
      if (random() < profile.layers)
        box(
          x,
          z,
          height - 13 - random() * 16,
          module.size * 0.97,
          module.size * (season === "summer" ? 1.2 : 0.6),
          tint(leafColor, -0.04),
          "leaf",
        );
      if (random() < profile.lower)
        box(x, z, height * 0.66, module.size * 0.9, module.size, tint(leafColor, 0.08), "leaf");
      const petals = season === "spring" ? 4 : 2;
      for (let i = 0; i < petals; i++) {
        const angle = (i / petals) * Math.PI * 2;
        const lx =
            x + (season === "spring" ? Math.cos(angle) * 0.18 : random() - 0.5) * module.size * 0.5,
          lz =
            z + (season === "spring" ? Math.sin(angle) * 0.18 : random() - 0.5) * module.size * 0.5;
        const w = module.size * (season === "spring" ? 0.25 : 0.2),
          y = height + 0.2 + random() * module.size * 0.3;
        face(
          [
            { x: lx - w, y, z: lz },
            { x: lx, y: y + w, z: lz - w },
            { x: lx + w, y, z: lz },
            { x: lx, y: y - w, z: lz + w },
          ],
          tint(leafColor, season === "spring" ? 0.45 : 0.16),
          "leaf",
        );
      }
    } else {
      const grass = tint(themeColor, -0.12);
      box(x, z, 0.6, module.size, 2.6, tint(grass, random() * 0.25), "grass");
      for (let i = 0; i < 3; i++) {
        const gx = x + (random() - 0.5) * module.size * 0.6,
          gz = z + (random() - 0.5) * module.size * 0.6;
        const height = cellSize * (0.6 + random() * 1.1) * profile.grass;
        face(
          [
            { x: gx - module.size * 0.12, y: 0.6, z: gz },
            { x: gx + module.size * 0.12, y: 0.6, z: gz },
            { x: gx + module.size * 0.15, y: height, z: gz },
          ],
          tint(grass, random() * 0.3),
          "grass",
        );
      }
    }
  }
  const wood = rgb("#875937");
  for (let y = 0; y < 164; y += 5)
    box(
      Math.sin(y * 0.026) * 2,
      0,
      y + 5,
      Math.max(2.5, 7 - y * 0.025),
      5,
      tint(wood, random() * 0.12),
      "wood",
    );
  for (const [bx, by, bz] of [
    [-35, 130, -12],
    [36, 143, 16],
    [-20, 163, 27],
    [11, 180, -24],
  ]) {
    for (let i = 0; i < 15; i++) {
      const f = i / 15;
      box(bx * f, bz * f, 55 + (by - 55) * f, 3.5 - f * 2, 5, wood, "wood");
    }
  }
  // Seasonal weather is independent of the chosen hue and fades out in QR view.
  const particles: [Material, number][] =
    season === "spring"
      ? [["petal", 26]]
      : season === "autumn"
        ? [
            ["fallingLeaf", 28],
            ["rain", 85],
          ]
        : [["sunMote", 12]];
  for (const [material, count] of particles) {
    for (let i = 0; i < count; i++) {
      const x = (random() - 0.5) * span * 1.15;
      const z = (random() - 0.5) * span;
      const y = 145 + random() * 70;
      const phase = random();
      const w = material === "rain" ? 0.28 : material === "sunMote" ? 0.7 : 1.1;
      const h = material === "rain" ? 8 : material === "fallingLeaf" ? 2.2 : w;
      const particleColor = tint(themeColor, material === "rain" ? -0.25 : 0.28);
      face(
        [
          { x: x - w, y, z },
          { x, y: y + h, z },
          { x: x + w, y, z },
          { x, y: y - h, z },
        ],
        particleColor,
        material,
        phase,
      );
    }
  }
  return { faces, span, moduleCount: modules.length, qrColor, backgroundColor, wind };
}

/** Shared seasonal motion for CPU rendering and regression checks. */
export function paymentTreeFaceMotion(face: Face, time: number, progress: number, wind: number) {
  const material = face.material;
  if (!["petal", "fallingLeaf", "rain", "sunMote"].includes(material))
    return { x: 0, y: 0, z: 0, opacity: 1 };
  const speed =
    material === "petal"
      ? 0.07
      : material === "fallingLeaf"
        ? 0.18
        : material === "rain"
          ? 0.7
          : 0.035;
  const cycle = (((time * speed + face.phase) % 1) + 1) % 1;
  const angle = time + face.phase * Math.PI * 2;
  return {
    x:
      (material === "rain" ? cycle * 8 : Math.sin(angle) * (material === "fallingLeaf" ? 10 : 5)) *
      wind *
      progress,
    y: material === "sunMote" ? Math.sin(angle) * 8 : -cycle * (material === "rain" ? 210 : 150),
    z: Math.cos(angle * 0.7) * (material === "rain" ? 0 : 3) * progress,
    opacity:
      Math.sin(cycle * Math.PI) * smooth(0.5, 0.95, progress) * (material === "rain" ? 0.38 : 0.8),
  };
}

/** One orbiting camera, from a top-down QR to a three-quarter garden view. */
export function paymentTreeCamera(progress: number, span: number) {
  const p = clamp(progress),
    azimuth = (p * Math.PI) / 4;
  const elevation = mix(Math.PI / 2, Math.PI * 0.18, p);
  const zoom = mix(1, Math.min(0.84, 202 / (span * Math.SQRT2)), p);
  const sin = Math.sin(azimuth),
    cos = Math.cos(azimuth),
    se = Math.sin(elevation),
    ce = Math.cos(elevation);
  return {
    project: (point: Point) => ({
      x: 120 + (point.x * cos - point.z * sin) * zoom,
      y: mix(120, 176, p) + ((point.x * sin + point.z * cos) * se - point.y * ce) * zoom,
    }),
    depth: (point: Point) => (point.x * sin + point.z * cos) * ce + point.y * se,
  };
}

export function drawPaymentTreeScene(
  context: CanvasRenderingContext2D,
  size: number,
  time: number,
  progress: number,
  scene: PaymentTreeScene,
) {
  const p = clamp(progress),
    camera = paymentTreeCamera(p, scene.span);
  const colorAmount = smooth(0, 0.16, p),
    woodOpacity = smooth(0.025, 0.22, p);
  context.clearRect(0, 0, size, size);
  context.save();
  context.scale(size / 240, size / 240);
  context.fillStyle = `rgb(${scene.backgroundColor.map((channel) => Math.round(mix(255, channel, p))).join(",")})`;
  context.fillRect(0, 0, 240, 240);
  const sorted = scene.faces
    .map((face) => {
      const motion = paymentTreeFaceMotion(face, time, p, scene.wind);
      return {
        face,
        motion,
        depth: camera.depth({
          x: face.center.x + motion.x,
          y: face.center.y + motion.y,
          z: face.center.z + motion.z,
        }),
      };
    })
    .sort((a, b) => a.depth - b.depth);
  for (const { face, motion } of sorted) {
    if (motion.opacity <= 0) continue;
    if (face.material === "wood" && woodOpacity === 0) continue;
    const base: RGB = face.material === "ground" ? [255, 255, 255] : scene.qrColor;
    context.fillStyle = `rgb(${face.color.map((c, index) => Math.round(mix(base[index], c, colorAmount))).join(",")})`;
    context.globalAlpha = (face.material === "wood" ? woodOpacity : 1) * motion.opacity;
    context.beginPath();
    face.points.forEach((point, i) => {
      const sway =
        face.material === "leaf"
          ? Math.sin(time * 1.1 + point.y * 0.035) * 0.55 * scene.wind * p
          : 0;
      const projected = camera.project({
        x: point.x + sway + motion.x,
        y: point.y + motion.y,
        z: point.z + motion.z,
      });
      if (i === 0) context.moveTo(projected.x, projected.y);
      else context.lineTo(projected.x, projected.y);
    });
    context.closePath();
    context.fill();
  }
  context.restore();
}
