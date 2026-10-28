import { evaluateDriver } from './driver_expressions.js';
// Call applyChiLinhMouth AFTER mixer.update(dt). Play blink_talk as one clip;
// blink and talk must not play together on the same morph-weight binding.
export const MOUTH_KEYS = Object.freeze([
  'Mouth_A', 'Mouth_E', 'Mouth_I', 'Mouth_O', 'Mouth_U',
  'Mouth_Closed', 'Mouth_FV', 'Jaw_Open_New'
]);
const MOUTH_OBJECTS = new Set([
  'Character', 'Lips_Upper', 'Lips_Lower', 'Mouth_Inner',
  'Teeth_Upper', 'Teeth_Lower', 'Tongue'
]);

/** w_i = max(0,v_i) / max(1,sum positive v). Sum <= 1. */
export function dentalWeights(raw = {}) {
  const values = MOUTH_KEYS.map(k => {
    const v = Number(raw[k] ?? 0);
    return Number.isFinite(v) ? Math.max(0, v) : 0;
  });
  const denominator = Math.max(1, values.reduce((a,b) => a+b, 0));
  return Object.fromEntries(MOUTH_KEYS.map((k,i) => [k, values[i]/denominator]));
}

export const normalizedMouthWeights = dentalWeights;

/** Supports Three.js GLTFLoader material-split child meshes by ancestor name. */
export function applyChiLinhMouth(root, raw = {}) {
  const mouth = normalizedMouthWeights(raw);
  const dental = dentalWeights(mouth);
  root.traverse(mesh => {
    const dictionary = mesh.morphTargetDictionary;
    if (!mesh.isMesh || !dictionary || !mesh.morphTargetInfluences ||
        !MOUTH_KEYS.some(k => dictionary[k] !== undefined)) return;
    let owner = mesh;
    while (owner && !MOUTH_OBJECTS.has(owner.name)) owner = owner.parent;
    if (!owner) return;
    const weights = /^(Teeth_Upper|Teeth_Lower|Tongue)$/.test(owner.name)
      ? dental : mouth;
    for (const key of MOUTH_KEYS) {
      const index = dictionary[key];
      if (index !== undefined) mesh.morphTargetInfluences[index] = weights[key];
    }
    // Blink targets untouched. Lip_Hide is already baked into the GLB Basis.
  });
  return { mouth, dental };
}

// Example: applyChiLinhMouth(gltf.scene, {Mouth_E: 0.63, Mouth_I: 0.31});
// Stress input: dentalWeights({Mouth_E:1,Mouth_I:1}) -> E=0.5, I=0.5.

// C1b additions: all original mouth functions above remain byte-for-byte.
export const CHEEK_KEYS_C1B=['Cheek_Raise_L','Cheek_Raise_R','Cheek_Pucker_L','Cheek_Pucker_R','Cheek_Jaw_L','Cheek_Jaw_R'];
export function cheekTargetsC1b(w={}){const c=x=>Math.min(1,Math.max(0,x)),r=c(.8*(w.Mouth_I||0)+.5*(w.Mouth_E||0)+.2*(w.Mouth_A||0)),p=c((w.Mouth_U||0)+.7*(w.Mouth_O||0)),j=c(.7*(w.Mouth_A||0)+(w.Jaw_Open_New||0)+.15*(w.Mouth_O||0));return{Cheek_Raise_L:r,Cheek_Raise_R:r,Cheek_Pucker_L:p,Cheek_Pucker_R:p,Cheek_Jaw_L:j,Cheek_Jaw_R:j};}
export function smoothCheeksC1b(previous,target,dt){const a=1-Math.exp(-Math.max(0,dt)/.045);return Object.fromEntries(CHEEK_KEYS_C1B.map(k=>[k,(previous[k]||0)+a*((target[k]||0)-(previous[k]||0))]));}
export function createCompleteController(root,schema,THREE){
 const nodes=new Map(Object.keys(schema.objects).map(n=>[n,root.getObjectByName(n)]));let previous={};

 function apply(raw={},options={}){
  const w=normalizedMouthWeights(raw),cache=new Map(),blink=options.blink||{Blink_L:0,Blink_R:0};let cheeks=options.cheeks||cheekTargetsC1b(w);if(options.dt!==undefined&&!options.cheeks)cheeks=smoothCheeksC1b(previous,cheeks,options.dt);previous={...cheeks};
  const incoming=(owner,k)=>{if(MOUTH_KEYS.includes(k))return w[k]||0;if(k.startsWith('Cheek_'))return options.cheeksEnabled===false?0:cheeks[k]||0;if(/^Blink_[LR]$/.test(k)){const b=blink[k]||0;return owner.startsWith('EyelidCover')?Math.min(1,1.6*b):b;}return 0;};
  function read(kind,id,path,index=0){const key=[kind,id,path,index].join('|');if(cache.has(key))return cache.get(key);const owner=kind==='Key'?schema.keys[id]:id,rec=schema.objects[owner];if(!rec)return 0;const d=rec.drivers.find(x=>x.scope===kind&&x.path===path&&x.index===index);let value;
   if(d){const names=d.variables.map(v=>v.name),args=d.variables.map(v=>{const t=v.targets[0];return read(t.kind,t.id,t.path)});value=evaluateDriver(d.expression,Object.fromEntries(names.map((n,i)=>[n,args[i]])));}
   else if(kind==='Key'){const m=path.match(/^key_blocks\["(.+)"\]\.value$/);value=m?incoming(owner,m[1]):0;}
   else if(path.startsWith('["'))value=rec.properties[path.slice(2,-2)]||0;
   else if(path==='location')value=rec.location[index];else if(path==='scale')value=rec.scale[index];else if(path==='hide_render')value=rec.hide_render;else value=0;
   if(typeof value==='number')value=Math.fround(value);cache.set(key,value);return value;
  }
  for(const [name,node] of nodes){if(!node)continue;const r=schema.objects[name];const p=new THREE.Vector3(...[0,1,2].map(i=>read('Object',name,'location',i))),q=new THREE.Quaternion(r.quaternion[1],r.quaternion[2],r.quaternion[3],r.quaternion[0]),s=new THREE.Vector3(...[0,1,2].map(i=>read('Object',name,'scale',i)));const native=new THREE.Matrix4().compose(p,q,s),pi=new THREE.Matrix4().set(...r.parent_inverse.flat()),B=new THREE.Matrix4().set(1,0,0,0,0,0,1,0,0,-1,0,0,0,0,0,1);native.premultiply(pi);native.premultiply(B);native.multiply(B.clone().invert());native.decompose(node.position,node.quaternion,node.scale);node.visible=!read('Object',name,'hide_render');
   node.traverse(m=>{if(!m.isMesh||!m.morphTargetDictionary)return;let a=m;while(a&&!schema.objects[a.name])a=a.parent;if(a!==node)return;for(const [k,i] of Object.entries(m.morphTargetDictionary))m.morphTargetInfluences[i]=read('Key',r.key_id,'key_blocks["'+k+'"].value');});
  }root.updateMatrixWorld(true);return{mouth:w,cheeks};
 }
 return{apply};
}
