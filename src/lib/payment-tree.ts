export type TreeSeason = "spring" | "summer" | "autumn";
export type TreeColor = "pink" | "purple" | "red" | "gold" | "blue" | "ice";

export const TREE_COLORS: Record<TreeColor, string> = {
  pink: "#e9a3b4", purple: "#a473c4", red: "#ef3d43",
  gold: "#e9a600", blue: "#388af3", ice: "#dce7ec",
};

type Voxel = { x: number; y: number; z: number; size: number; color: string; leaf?: boolean; tint?: number };

const seasonStyles = {
  spring: {
    leaves: ["#d77e9f", "#eba7bc", "#f5bfce", "#f8d3dc", "#d58bab", "#ffe3eb"],
    grass: "#9fbb68", falling: "#e5a1bb", density: 112, drift: 0.05, particles: 7,
  },
  summer: {
    leaves: ["#679b32", "#83b83d", "#9bc94c", "#afcf5b", "#74ab36", "#c0db76"],
    grass: "#7cab4e", falling: "#9cb751", density: 135, drift: 0.07, particles: 5,
  },
  autumn: {
    leaves: ["#ba5b2e", "#d77c32", "#e5a33c", "#edb95a", "#a74d30", "#f3cd79"],
    grass: "#aaa15a", falling: "#d58c35", density: 95, drift: 0.11, particles: 12,
  },
};

function tintColor(hex: string, amount: number) {
  const channels = [1, 3, 5].map(offset => {
    const channel = parseInt(hex.slice(offset, offset + 2), 16);
    return Math.round(amount >= 0 ? channel + (255 - channel) * amount : channel * (1 + amount));
  });
  return `rgb(${channels.join(", ")})`;
}

// Seeded geometry stays stable when switching between the QR and tree views.
function createTree(season: TreeSeason) {
  const style = seasonStyles[season];
  let seed = 8721;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const voxels: Voxel[] = [];
  const add = (x: number, y: number, z: number, size: number, color: string, leaf = false) =>
    voxels.push({ x, y, z, size, color, leaf });

  // A small tiled garden, with a taller grass edge.
  for (let x = -6; x <= 6; x++) {
    for (let z = -6; z <= 6; z++) {
      const edge = Math.abs(x) === 6 || Math.abs(z) === 6;
      add(x * 8, -3, z * 8, 8, edge ? style.grass : random() > 0.45 ? "#dddcc8" : "#eeecd9");
      if (edge && random() > 0.3) add(x * 8, 2 + random() * 3, z * 8, 3, style.grass);
    }
  }
  for (let y = 0; y < 100; y += 6) add(0, y, 0, 7 - y / 45, "#885a35");
  const branches = [
    [-27, 76, -10], [26, 87, 6], [-16, 104, 19], [9, 122, -13], [0, 139, 0],
  ];
  for (const [bx, by, bz] of branches) {
    for (let i = 0; i < 10; i++) {
      const f = i / 10;
      add(bx * f, 48 + (by - 48) * f, bz * f, 4, "#996b3d");
    }
  }
  for (const [cx, cy, cz] of branches) {
    for (let i = 0; i < style.density; i++) {
      const x = (random() * 2 - 1) * 30;
      const y = (random() * 2 - 1) * 28;
      const z = (random() * 2 - 1) * 27;
      if ((x / 30) ** 2 + (y / 28) ** 2 + (z / 27) ** 2 > 1) continue;
      add(cx + x, cy + y, cz + z, 5 + random() * 3, style.leaves[Math.floor(random() * style.leaves.length)], true);
      voxels[voxels.length - 1].tint = random() * 0.5 - 0.2;
    }
  }
  return voxels;
}

const trees = {
  spring: createTree("spring"), summer: createTree("summer"), autumn: createTree("autumn"),
};

export type QrModule = { x: number; y: number; size: number };
export type TreeMorphParticle = { source: QrModule; target: Voxel; rgb: number[]; delay: number };

/** Read qrcode.react's rendered horizontal runs, including its quiet zone. */
export function readPaymentQrModules(path: string, cells: number, qrSize: number, frameSize: number): QrModule[] {
  if (!path || cells <= 0 || qrSize <= 0 || frameSize <= 0) return [];
  const runs = [...path.matchAll(/M(\d+)[ ,]+(\d+)\s*h(\d+)v1H\d+z/g)];
  // Never substitute made-up QR pixels if the SVG format changes.
  if (runs.map(run => run[0]).join("") !== path) return [];
  const scale = qrSize / cells / frameSize * 240;
  const offset = (frameSize - qrSize) / 2 / frameSize * 240;
  return runs.flatMap(run => Array.from({ length: Number(run[3]) }, (_, i) => ({
    x: offset + (Number(run[1]) + i) * scale,
    y: offset + Number(run[2]) * scale,
    size: scale,
  })));
}

/** Each dark QR module becomes exactly one tree voxel, and keeps its origin. */
export function createPaymentTreeMorph(modules: QrModule[], season: TreeSeason, color: TreeColor | null) {
  const geometry = trees[season];
  return modules.map((source, index): TreeMorphParticle => {
    // Spread adjacent QR cells across the garden rather than moving whole rows.
    const target = geometry[Math.floor(((index * 0.61803398875) % 1) * geometry.length)];
    const shade = target.leaf && color ? tintColor(TREE_COLORS[color], target.tint ?? 0) : target.color;
    const rgb = shade.startsWith("rgb(")
      ? shade.slice(4, -1).split(",").map(Number)
      : [1, 3, 5].map(offset => parseInt(shade.slice(offset, offset + 2), 16));
    const group = Math.floor(index / geometry.length);
    return {
      source,
      target: {
        ...target,
        // Dense QR codes contribute several small voxels to each branch/leaf.
        x: target.x + Math.sin(index * 2.4) * Math.min(group, 3) * 1.5,
        y: target.y + Math.cos(index * 1.7) * Math.min(group, 3) * 1.5,
        size: target.size * Math.min(1, Math.sqrt(geometry.length / Math.max(modules.length, 1))),
      },
      rgb,
      delay: ((index * 0.61803398875) % 1) * 0.18,
    };
  });
}

/** Interpolate the actual QR squares into isometric tree faces; no image swap. */
export function drawPaymentTreeMorph(
  context: CanvasRenderingContext2D,
  size: number,
  time: number,
  progress: number,
  particles: TreeMorphParticle[],
) {
  context.clearRect(0, 0, size, size);
  context.save();
  context.scale(size / 240, size / 240);
  const p = Math.max(0, Math.min(1, progress));
  context.fillStyle = `rgb(${255 - Math.round(8 * p)}, ${255 - Math.round(7 * p)}, ${255 - Math.round(17 * p)})`;
  context.fillRect(0, 0, 240, 240);
  const angle = Math.PI / 4 + Math.sin(time * 0.22) * 0.12;
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);
  const project = (x: number, y: number, z: number) => ({
    x: 120 + x * cos - z * sin,
    y: 193 + (x * sin + z * cos) * 0.42 - y * 0.94,
  });
  const mix = (a: number, b: number, amount: number) => a + (b - a) * amount;
  const sorted = particles.map((particle, index) => {
    const linear = Math.max(0, Math.min(1, (p - particle.delay) / (1 - particle.delay)));
    const amount = linear * linear * (3 - 2 * linear);
    return {
      particle, index, amount,
      depth: mix(particle.source.y, particle.target.x * sin + particle.target.z * cos + particle.target.y * 0.55, amount),
    };
  }).sort((a, b) => a.depth - b.depth);
  const face = (points: { x: number; y: number }[], color: string) => {
    context.fillStyle = color;
    context.beginPath();
    points.forEach((point, index) => index === 0 ? context.moveTo(point.x, point.y) : context.lineTo(point.x, point.y));
    context.closePath();
    context.fill();
  };
  for (const { particle, amount, index } of sorted) {
    const { source, target, rgb } = particle;
    const x = target.x + (target.leaf ? Math.sin(time * 1.1 + target.y * 0.04) * 1.3 : 0);
    const { y, z } = target;
    const h = target.size / 2;
    const square = [
      { x: source.x, y: source.y }, { x: source.x + source.size, y: source.y },
      { x: source.x + source.size, y: source.y + source.size }, { x: source.x, y: source.y + source.size },
    ];
    const cube = [project(x - h, y + h, z - h), project(x + h, y + h, z - h), project(x + h, y + h, z + h), project(x - h, y + h, z + h)];
    // A shallow arc makes the individual squares visibly lift off the QR plane.
    const lift = Math.sin(amount * Math.PI) * (10 + (index % 7) * 2);
    const morphPoint = (from: { x: number; y: number }, to: { x: number; y: number }) => ({
      x: mix(from.x, to.x, amount), y: mix(from.y, to.y, amount) - lift,
    });
    const top = cube.map((point, i) => morphPoint(square[i], point));
    const fill = `rgb(${rgb.map(channel => Math.round(channel * amount)).join(", ")})`;
    if (amount > 0) {
      const bottomRight = morphPoint(square[2], project(x + h, y - h, z + h));
      const right = [top[1], morphPoint(square[1], project(x + h, y - h, z - h)), bottomRight, top[2]];
      const left = [top[3], morphPoint(square[3], project(x - h, y - h, z + h)), bottomRight, top[2]];
      face(right, fill);
      face(left, fill);
      face(right, `rgba(25, 50, 15, ${0.24 * amount})`);
      face(left, `rgba(25, 50, 15, ${0.1 * amount})`);
    }
    face(top, fill);
  }
  context.restore();
}
