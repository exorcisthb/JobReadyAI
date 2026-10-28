import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from './meshopt_decoder.mjs';
import { createCompleteController, normalizedMouthWeights } from './chilinh_morph_controller.js';
import { buildPlan, weightsAt } from './lipsync_vi.js';
import { createGestureController } from './chilinh_gesture_controller.js';

// Model bytes stay on R2. This URL is public; no R2 credentials belong in this client.
const DEFAULT_MODEL_URL = 'https://pub-f6001b97e5cc46cdaf48b42c033220e9.r2.dev/Model%20Linh/ChiLinh_Gesture_ArmFix_Final.glb';
const CHANNEL = 'jobready.chilinh.v1';
const viewport = document.getElementById('viewport');
const clamp = (x, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, Number(x) || 0));
let renderer, scene, camera, root, arms, facial, map, resizeObserver, raf = 0;
let disposed = false, initialized = false, modelUrl = DEFAULT_MODEL_URL;
let state = { active: false, speaking: false, listening: false, playback: null };
let receivedAt = 0, last = performance.now(), turn = null, transcript = '', plan = null;
let speaking = false, envelope = 0, mouth = normalizedMouthWeights({});
let frameCount = 0, fps = 0, fpsAt = last, angle = 0;
let fullBounds = null, poseBounds = null, loadingAt = last;
let desk = null, deskBasePosition, deskBaseScale, deskLiftLocal, deskBaseBox;
let deskScaleX = 1, deskLift = 0, tableTop = 0;
const contactShadows = [];
let chair = null, chairSeatedPosition = null;
let chairRearward = 0, chairDrop = 0;
const cameraPitch = THREE.MathUtils.degToRad(8);
const viewUp = new THREE.Vector3(0, Math.cos(cameraPitch), -Math.sin(cameraPitch));

function notify(type, data = {}) {
  if (window.parent !== window) window.parent.postMessage({ channel: CHANNEL, type, ...data }, location.origin);
}

function actorBounds() {
  const bounds = new THREE.Box3();
  root.traverse(mesh => {
    if (!mesh.isMesh || mesh === desk) return;
    for (let node = mesh; node && node !== root; node = node.parent) if (!node.visible) return;
    if (mesh.isSkinnedMesh) { mesh.skeleton.update(); mesh.computeBoundingBox(); }
    bounds.union(new THREE.Box3().setFromObject(mesh));
  });
  return bounds;
}

function handSupport(side) {
  const points = [], handBone = side === 'L' ? 'Bone007' : 'Bone011';
  root.getObjectByName('Character')?.traverse(mesh => {
    if (!mesh.isSkinnedMesh) return;
    mesh.skeleton.update();
    const names = mesh.skeleton.bones.map(bone => bone.name);
    const indices = mesh.geometry.attributes.skinIndex, weights = mesh.geometry.attributes.skinWeight;
    for (let index = 0; index < indices.count; index++) {
      let handWeight = 0;
      for (let k = 0; k < 4; k++) {
        const name = names[indices.getComponent(index, k)];
        if (name === handBone || name?.startsWith('Finger_' + side + '_')) handWeight += weights.getComponent(index, k);
      }
      if (handWeight > .5) points.push(mesh.getVertexPosition(index, new THREE.Vector3()).applyMatrix4(mesh.matrixWorld));
    }
  });
  points.sort((a, b) => a.y - b.y);
  if (!points.length) return null;
  const anchor = new THREE.Vector3();
  const count = Math.max(1, Math.round(points.length * .08));
  for (const point of points.slice(0, count)) anchor.add(point);
  anchor.divideScalar(count);
  const wrist = root.getObjectByName(handBone);
  return { side, minY: points[0].y, anchor: wrist.worldToLocal(anchor), wrist };
}

function setupDeskAndContact() {
  desk = root.getObjectByName('DeskTop');
  if (!desk) throw new Error('Missing DeskTop in approved model');
  deskBasePosition = desk.position.clone();
  deskBaseScale = desk.scale.clone();
  deskBaseBox = new THREE.Box3().setFromObject(desk);
  const supports = ['L', 'R'].map(handSupport).filter(Boolean);
  // Lift only the display table, leaving 0.3 mm clearance under the lowest hand.
  // The source GLB, rig, keys and gesture clips are never edited.
  deskLift = supports.length ? clamp(Math.min(...supports.map(item => item.minY)) - deskBaseBox.max.y - .0003, 0, .012) : 0;
  const origin = desk.getWorldPosition(new THREE.Vector3());
  const lifted = desk.parent.worldToLocal(origin.clone().add(new THREE.Vector3(0, deskLift, 0)));
  deskLiftLocal = lifted.sub(deskBasePosition);
  tableTop = deskBaseBox.max.y + deskLift;

  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(64, 64, 10, 64, 64, 63);
  gradient.addColorStop(0, 'rgba(0,0,0,.9)');
  gradient.addColorStop(.4, 'rgba(0,0,0,.45)');
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  for (const support of supports) {
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(.16, .16), new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: .18, depthWrite: false, toneMapped: false }));
    shadow.rotation.x = -Math.PI / 2;
    shadow.renderOrder = 1;
    scene.add(shadow);
    contactShadows.push({ ...support, shadow });
  }
  applyDeskAndContact();
}

function setupChairPresentation() {
  chair = root.getObjectByName('ChairBack');
  if (!chair) return;
  root.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(chair);
  let cutProjection = -Infinity;
  chair.traverse(mesh => {
    if (!mesh.isMesh) return;
    const positions = mesh.geometry.attributes.position;
    for (let index = 0; index < positions.count; index++) {
      const point = new THREE.Vector3().fromBufferAttribute(positions, index).applyMatrix4(mesh.matrixWorld);
      if (point.y <= bounds.min.y + .003) cutProjection = Math.max(cutProjection, point.dot(viewUp));
    }
  });
  chairRearward = .06;
  const deskBackProjection = tableTop * viewUp.y + deskBaseBox.min.z * viewUp.z;
  // The source contains a cropped backrest. Recess it and conceal the cut edge
  // behind the tabletop rather than showing an unsupported edge against the floor.
  chairDrop = clamp((cutProjection - chairRearward * viewUp.z - deskBackProjection + .006) / viewUp.y, .025, .06);
  const seatedWorld = chair.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, -chairDrop, -chairRearward));
  chairSeatedPosition = chair.parent.worldToLocal(seatedWorld);
  chair.position.copy(chairSeatedPosition);
  root.updateMatrixWorld(true);
}

function applyDeskAndContact() {
  if (!desk) return;
  if (chairSeatedPosition) chair.position.copy(chairSeatedPosition);
  desk.position.copy(deskBasePosition).add(deskLiftLocal);
  desk.scale.copy(deskBaseScale);
  desk.scale.x *= deskScaleX;
  // Preserve the center of the wood slab when stretching for ultra-wide panels.
  const localCenterX = (desk.geometry.boundingBox.min.x + desk.geometry.boundingBox.max.x) / 2;
  desk.position.x += (1 - deskScaleX) * localCenterX * deskBaseScale.x;
  root.updateMatrixWorld(true);
  for (const contact of contactShadows) {
    const p = contact.wrist.localToWorld(contact.anchor.clone());
    const gap = Math.max(0, p.y - tableTop);
    contact.shadow.position.set(p.x, tableTop + .0002, p.z);
    contact.shadow.material.opacity = .22 * Math.exp(-gap / .022);
    contact.shadow.visible = p.z >= deskBaseBox.min.z && p.z <= deskBaseBox.max.z && gap < .12;
  }
}

function resize() {
  if (!renderer || !fullBounds || !deskBaseBox) return;
  const width = viewport.clientWidth, height = viewport.clientHeight;
  if (!width || !height) return;
  renderer.setSize(width, height, false);
  const aspect = width / height;
  const deskCenter = deskBaseBox.getCenter(new THREE.Vector3());
  // Crop the cut-off bottom at the desk front, so there is no floating slab/floor strip.
  const bottom = (deskBaseBox.min.y + deskLift) * viewUp.y + deskBaseBox.max.z * viewUp.z + .001;
  const actorTop = fullBounds.max.y * viewUp.y + fullBounds.min.z * viewUp.z;
  const halfWidth = Math.max(Math.abs(fullBounds.min.x - deskCenter.x), Math.abs(fullBounds.max.x - deskCenter.x));
  const halfHeight = Math.max((actorTop - bottom + .025) / 2, halfWidth * 1.025 / aspect);
  camera.left = -halfHeight * aspect;
  camera.right = halfHeight * aspect;
  camera.top = halfHeight;
  camera.bottom = -halfHeight;
  camera.updateProjectionMatrix();
  const center = viewUp.clone().multiplyScalar(bottom + halfHeight);
  center.x = deskCenter.x;
  camera.position.copy(center).add(new THREE.Vector3(0, Math.sin(cameraPitch), Math.cos(cameraPitch)).multiplyScalar(2));
  camera.up.copy(viewUp);
  camera.lookAt(center);
  deskScaleX = Math.max(1, (2 * halfHeight * aspect * 1.004) / (deskBaseBox.max.x - deskBaseBox.min.x));
  applyDeskAndContact();
}

function smoothBlink(time) {
  const phase = time % 5;
  const x = phase < 4.7 ? 0 : phase < 4.8 ? (phase - 4.7) / .1 : 1 - (phase - 4.8) / .2;
  const t = clamp(x);
  return t * t * (3 - 2 * t);
}

function restSpeech() {
  if (speaking) arms.setSpeaking(false);
  speaking = false;
  mouth = normalizedMouthWeights({});
  envelope = 0;
}

function updateSpeech(now, dt) {
  const playback = state.playback;
  // Parent heartbeat expiry prevents a frozen mouth after navigation/disconnect.
  const fresh = now - receivedAt < 1200;
  const live = fresh && state.active && state.speaking && playback?.playing;
  if (!live) { restSpeech(); return; }

  const nextTurn = playback.turn;
  const text = typeof playback.text === 'string' ? playback.text.slice(0, 12000).normalize('NFC') : '';
  if (turn !== nextTurn) {
    turn = nextTurn;
    transcript = '';
    plan = null;
    arms.setSpeechPlan('', null);
  }
  if (text && text !== transcript) {
    transcript = text;
    plan = buildPlan(text, { map, fps: 24, seed: 20261022 });
    arms.setSpeechPlan(text, plan);
  }
  if (!speaking) { arms.setSpeaking(true); speaking = true; }

  const elapsed = Math.max(0, Number(playback.time) || 0) + Math.min(.12, (now - receivedAt) / 1000);
  const targetEnvelope = clamp((Number(playback.level) || 0) * 3);
  envelope += (targetEnvelope - envelope) * (1 - Math.exp(-dt / .045));
  if (plan) {
    // Output transcription has no phoneme timestamps. Fit its deterministic
    // syllable plan to the PCM duration received so far; this is approximate sync.
    const duration = Math.max(plan.duration, Number(playback.bufferedDuration) || 0);
    const at = elapsed * plan.duration / duration;
    mouth = weightsAt(plan, Math.min(at, Math.max(0, plan.duration - .05)));
    mouth = normalizedMouthWeights(Object.fromEntries(Object.entries(mouth).map(([k, v]) => [k, v * envelope])));
  } else {
    // Audio can precede text. A small envelope-driven jaw avoids speaking frozen.
    mouth = normalizedMouthWeights({ Jaw_Open_New: .28 * envelope });
  }
  arms.setAudioLevel(envelope);
  return elapsed;
}

function tick(now) {
  if (disposed) return;
  const dt = Math.min(.25, Math.max(0, (now - last) / 1000));
  last = now;
  if (!document.hidden && root) {
    const speechTime = updateSpeech(now, dt);
    const blink = smoothBlink(now / 1000);
    facial.apply(mouth, { dt, cheeksEnabled: true, blink: { Blink_L: blink, Blink_R: blink } });
    // Consume elapsed time in safe substeps even on slower mobile GPUs.
    for (let offset = 0; offset < dt;) {
      const step = Math.min(.05, dt - offset);
      offset += step;
      arms.update(step, speechTime === undefined ? undefined : Math.max(0, speechTime - dt + offset));
    }
    applyDeskAndContact();
    renderer.render(scene, camera);
    frameCount++;
    if (now - fpsAt >= 1000) { fps = frameCount * 1000 / (now - fpsAt); frameCount = 0; fpsAt = now; }
  }
  raf = requestAnimationFrame(tick);
}

async function initialize() {
  if (initialized || disposed) return;
  initialized = true;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setClearColor(0x000000, 0);
    viewport.append(renderer.domElement);
    renderer.domElement.addEventListener('webglcontextlost', event => {
      event.preventDefault();
      notify('error', { message: 'Kết nối đồ họa bị gián đoạn. Hãy thử tải lại nhân vật.' });
    });
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-.7, .7, .5, -.5, .001, 10);
    scene.add(new THREE.HemisphereLight(0xe7f4ff, 0x777064, 1.45));
    for (const [color, intensity, position] of [[0xffeee2, 2.7, [-.15, .9, .12]], [0xe1efff, 1.3, [.2, .72, .17]]]) {
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(...position);
      light.target.position.set(-.003214, .64741, -.207);
      scene.add(light, light.target);
    }
    const data = await Promise.all(['driver_schema.json', 'viseme_map_vi.json', 'gesture_manifest.json'].map(async file => {
      const response = await fetch(new URL(file, import.meta.url));
      if (!response.ok) throw new Error('Không tải được dữ liệu nhân vật: ' + file);
      return response.json();
    }));
    const [schema, visemeMap, manifest] = data;
    map = visemeMap;
    const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(modelUrl, event => {
      notify('progress', { progress: event.total ? clamp(event.loaded / event.total) : null });
    });
    if (disposed) { disposeObject(gltf.scene); return; }
    root = gltf.scene;
    root.traverse(mesh => { if (mesh.isMesh) mesh.frustumCulled = false; });
    scene.add(root);
    facial = createCompleteController(root, schema, THREE);
    arms = createGestureController(root, gltf.animations, manifest);
    arms.setParameters({ gestureIntensity: .8, gestureRate: 1 });
    facial.apply({});
    arms.preview('hands_idle_v2', 0);
    root.updateMatrixWorld(true);
    setupDeskAndContact();
    fullBounds = actorBounds();
    poseBounds = fullBounds.clone();
    // Sample existing arm clips solely to keep raised hands inside the viewport.
    for (const clip of manifest.clips.filter(clip => /open_palm|both_open/.test(clip.name))) {
      arms.preview(clip.name, clip.strokePeak);
      root.updateMatrixWorld(true);
      fullBounds.union(actorBounds());
    }
    arms.rest();
    setupChairPresentation();
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(viewport);
    resize();
    notify('ready', { loadMs: Math.round(performance.now() - loadingAt) });
    last = performance.now();
    raf = requestAnimationFrame(tick);
  } catch (error) {
    console.error('[ChiLinh]', error);
    notify('error', { message: 'Chưa tải được nhân vật 3D. Kiểm tra mạng và CORS của model R2, rồi thử lại.' });
    dispose();
  }
}

function receive(event) {
  if (event.origin !== location.origin || event.source !== window.parent || event.data?.channel !== CHANNEL) return;
  if (event.data.type === 'init') {
    if (typeof event.data.modelUrl === 'string') {
      const url = new URL(event.data.modelUrl, location.href);
      if (url.protocol === 'https:' || url.origin === location.origin) modelUrl = url.href;
    }
    initialize();
  } else if (event.data.type === 'state') {
    state = event.data.state || {};
    receivedAt = performance.now();
  }
}

function disposeObject(object) {
  const geometries = new Set(), materials = new Set(), textures = new Set();
  object?.traverse(node => {
    if (node.geometry) geometries.add(node.geometry);
    for (const material of [].concat(node.material || [])) {
      materials.add(material);
      for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
    }
    node.skeleton?.dispose();
  });
  for (const item of geometries) item.dispose();
  for (const item of textures) { item.source?.data?.close?.(); item.dispose(); }
  for (const item of materials) item.dispose();
}

function dispose() {
  disposed = true;
  cancelAnimationFrame(raf);
  resizeObserver?.disconnect();
  arms?.mixer.stopAllAction();
  if (root) { arms?.mixer.uncacheRoot(root); disposeObject(root); }
  for (const contact of contactShadows) disposeObject(contact.shadow);
  renderer?.dispose();
  renderer?.forceContextLoss();
  window.removeEventListener('message', receive);
}

window.addEventListener('message', receive);
window.addEventListener('pagehide', dispose, { once: true });
document.addEventListener('visibilitychange', () => { last = performance.now(); });
notify('boot');

// Diagnostics expose measurements only. No model mutation hooks or demo controls.
window.ChiLinhDiagnostics = () => ({
  ready: Boolean(root) && !disposed, fps, speaking, mouth,
  arms: arms?.status(), modelUrl, render: renderer?.info.render,
  bones: root ? (() => { let n = 0; root.traverse(o => { if (o.isBone) n++; }); return n; })() : 0,
  chair: chair ? { rearwardMm: chairRearward * 1000, loweredMm: chairDrop * 1000, position: chair.position.toArray() } : null,
  desk: { liftMm: deskLift * 1000, topY: tableTop, scaleX: deskScaleX,
    restGapMm: Object.fromEntries(contactShadows.map(contact => [contact.side, (contact.minY - tableTop) * 1000])),
    screenEdges: desk ? (() => {
      const box = new THREE.Box3().setFromObject(desk);
      const left = new THREE.Vector3(box.min.x, tableTop, box.max.z).project(camera);
      const right = new THREE.Vector3(box.max.x, tableTop, box.max.z).project(camera);
      return { leftPx: (left.x + 1) * .5 * viewport.clientWidth, rightPx: (right.x + 1) * .5 * viewport.clientWidth, widthPx: viewport.clientWidth };
    })() : null,
  },
  bounds: poseBounds ? { min: poseBounds.min.toArray(), max: poseBounds.max.toArray() } : null,
  morphs: root ? (() => {
    const values = {};
    root.getObjectByName('Character')?.traverse(mesh => {
      if (!mesh.morphTargetDictionary) return;
      for (const [key, index] of Object.entries(mesh.morphTargetDictionary)) {
        if (/^(Blink_|Cheek_)/.test(key)) values[key] = mesh.morphTargetInfluences[index];
      }
    });
    return values;
  })() : {},
});
