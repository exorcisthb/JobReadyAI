type Voxel = { x: number; y: number; z: number; size: number; color: string; leaf?: boolean };

// Seeded geometry stays stable when switching between the QR and tree views.
function createTree() {
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
      add(x * 8, -3, z * 8, 8, edge ? "#7cab4e" : random() > 0.45 ? "#dddcc8" : "#eeecd9");
      if (edge && random() > 0.3) add(x * 8, 2 + random() * 3, z * 8, 3, "#8bbf45");
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
  const greens = ["#679b32", "#83b83d", "#9bc94c", "#afcf5b", "#74ab36", "#c0db76"];
  for (const [cx, cy, cz] of branches) {
    for (let i = 0; i < 135; i++) {
      const x = (random() * 2 - 1) * 30;
      const y = (random() * 2 - 1) * 28;
      const z = (random() * 2 - 1) * 27;
      if ((x / 30) ** 2 + (y / 28) ** 2 + (z / 27) ** 2 > 1) continue;
      add(cx + x, cy + y, cz + z, 5 + random() * 3, greens[Math.floor(random() * greens.length)], true);
    }
  }
  return voxels;
}

const tree = createTree();

/** Lightweight isometric voxels, drawn locally without a WebGL dependency. */
export function drawPaymentTree(context: CanvasRenderingContext2D, size: number, time: number) {
  context.clearRect(0, 0, size, size);
  context.save();
  context.scale(size / 240, size / 240);
  const angle = Math.PI / 4 + Math.sin(time * 0.22) * 0.12;
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);
  const project = (x: number, y: number, z: number) => ({
    x: 120 + x * cos - z * sin,
    y: 193 + (x * sin + z * cos) * 0.42 - y * 0.94,
  });

  const shadow = context.createRadialGradient(120, 197, 8, 120, 197, 85);
  shadow.addColorStop(0, "rgba(55, 79, 26, 0.18)");
  shadow.addColorStop(1, "rgba(55, 79, 26, 0)");
  context.fillStyle = shadow;
  context.save();
  context.translate(0, 122);
  context.scale(1, 0.38);
  context.fillRect(25, 100, 190, 190);
  context.restore();

  const sorted = tree.map(voxel => ({
    ...voxel,
    x: voxel.x + (voxel.leaf ? Math.sin(time * 1.1 + voxel.y * 0.04) * 1.3 : 0),
    depth: voxel.x * sin + voxel.z * cos + voxel.y * 0.55,
  })).sort((a, b) => a.depth - b.depth);

  const face = (points: { x: number; y: number }[], color: string) => {
    context.fillStyle = color;
    context.beginPath();
    points.forEach((point, index) => index === 0 ? context.moveTo(point.x, point.y) : context.lineTo(point.x, point.y));
    context.closePath();
    context.fill();
  };
  for (const voxel of sorted) {
    const { x, y, z, color } = voxel;
    const h = voxel.size / 2;
    const top = [project(x - h, y + h, z - h), project(x + h, y + h, z - h), project(x + h, y + h, z + h), project(x - h, y + h, z + h)];
    const bottomRight = project(x + h, y - h, z + h);
    face([top[1], project(x + h, y - h, z - h), bottomRight, top[2]], color);
    face([top[3], project(x - h, y - h, z + h), bottomRight, top[2]], color);
    face([top[1], project(x + h, y - h, z - h), bottomRight, top[2]], "rgba(25, 50, 15, 0.24)");
    face([top[3], project(x - h, y - h, z + h), bottomRight, top[2]], "rgba(25, 50, 15, 0.1)");
    face(top, color);
  }

  // A few drifting leaves give the garden a little life.
  for (let i = 0; i < 5; i++) {
    const phase = (time * 0.07 + i * 0.21) % 1;
    const x = 94 + Math.sin(phase * 5 + i * 2) * 47;
    const y = 60 + phase * 120;
    context.save();
    context.translate(x, y);
    context.rotate(phase * 5 + i);
    context.globalAlpha = Math.sin(phase * Math.PI) * 0.75;
    context.fillStyle = "#9cb751";
    context.fillRect(-2, -1, 4, 2);
    context.restore();
  }
  context.restore();
}
