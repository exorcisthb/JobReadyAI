// Port of D:\model\lipsync_vi.py. Shared-time smoothstep equals the Python
// horizontal-handle Bezier interpolation. PRNG is seeded Mulberry32 rather than
// Python's Mersenne Twister: the ±10% timing jitter is deterministic, not identical.
import { MOUTH_KEYS, normalizedMouthWeights } from './chilinh_morph_controller.js';
const DIGITS = ['không','một','hai','ba','bốn','năm','sáu','bảy','tám','chín'];
export const smoothstep = x => { x = Math.max(0, Math.min(1, x)); return x*x*(3-2*x); };
export const removeTone = s => String(s).toLowerCase().normalize('NFD').replace(/[\u0300\u0301\u0303\u0309\u0323]/gu,'').normalize('NFC');
function triplet(n, forced = false) {
  const h = Math.floor(n/100), t = Math.floor(n/10)%10, u = n%10, out = [];
  if (h || forced) out.push(DIGITS[h], 'trăm');
  if (t > 1) out.push(DIGITS[t], 'mươi');
  else if (t === 1) out.push('mười');
  else if (u && (h || forced)) out.push('linh');
  if (u) out.push(u===1 && t>1 ? 'mốt' : u===5 && t>0 ? 'lăm' : DIGITS[u]);
  return out;
}
export function readInteger(value) {
  let n = BigInt(value);
  if (!n) return DIGITS[0];
  if (n<0n) return 'âm '+readInteger(-n);
  if (n>=1000000000000000n) return [...n.toString()].map(c=>DIGITS[Number(c)]).join(' ');
  const groups=[], units=['','nghìn','triệu','tỷ','nghìn tỷ'], words=[];
  while (n) {groups.push(Number(n%1000n)); n/=1000n;}
  for (let i=groups.length-1;i>=0;i--) if (groups[i]) {
    words.push(...triplet(groups[i], words.length>0 && groups[i]<100));
    if (i) words.push(units[i]);
  }
  return words.join(' ');
}
export function normalizeText(text) {
  return String(text).normalize('NFC').replace(/[+-]?\d+(?:[.,]\d+)?/gu, raw=>{
    const negative=raw.startsWith('-');
    const parts=raw.replace(/^[+-]/u,'').split(/[.,]/u);
    const integer=parts[0].length>1 && parts[0].startsWith('0')
      ? [...parts[0]].map(c=>DIGITS[Number(c)]).join(' ') : readInteger(parts[0]);
    return ' '+(negative?'âm ':'')+integer+(parts.length>1?' phẩy '+[...parts[1]].map(c=>DIGITS[Number(c)]).join(' '):'')+' ';
  }).replace(/\s+/gu,' ').trim();
}
export function syllableParts(word, map) {
  const plain=removeTone(word).replace(/[^\p{L}]/gu,''), vowels=new Set(Object.keys(map.vowels));
  let first=[...plain].findIndex(c=>vowels.has(c)); if(first<0)first=plain.length;
  let onset=plain.slice(0,first), body=plain.slice(first), final='';
  if(plain.startsWith('gi') && plain.length>2 && vowels.has(plain[2])) {onset='gi';body=plain.slice(2);}
  for(const ending of ['ng','nh','ch','m','p','n','t','c']) if(body.endsWith(ending) && body.length>ending.length){final=ending;body=body.slice(0,-ending.length);break;}
  let sequence=[...body].filter(c=>vowels.has(c)); if(!sequence.length)sequence=['ơ'];
  sequence=sequence.filter((v,i)=>i===0 || sequence[i-1]!==v);
  return {plain,onset,final,nucleus:sequence.join(''),vowels:sequence,fallback:first===plain.length};
}
function randomFor(text, seed) {
  let h=seed>>>0;for(const ch of text)h=Math.imul(h^ch.codePointAt(0),16777619)>>>0;
  return ()=>{h=(h+0x6D2B79F5)>>>0;let t=h;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};
}
export function buildPlan(text, {map, fps=24, seed=20261022, wordTimings=null} = {}) {
  if(!map?.vowels)throw new Error('Thiếu vowels trong viseme_map_vi.json');
  if(!(fps>0))throw new Error('fps phải > 0');
  const normalized=normalizeText(text), random=randomFor(normalized,seed), entries=[], knots=new Map(), syllables=[];
  const timing=map.timing_default || {}, base=timing.syllable_seconds??.25, gap=timing.word_gap_seconds??.15, punct=timing.punctuation_gap_seconds??.35;
  let cursor=0;
  if(wordTimings!==null){
    const list=Array.isArray(wordTimings)?wordTimings:wordTimings.words??wordTimings.timings;
    if(!Array.isArray(list))throw new Error('wordTimings phải là mảng word/start/end');
    let previousEnd=0;
    for(const item of list){
      const start=Number(item.start),end=Number(item.end);
      if(!Number.isFinite(start)||!Number.isFinite(end)||start<previousEnd-1e-9||end<=start)throw new Error('Mốc từ phải tăng, không chồng nhau');
      const tokens=normalizeText(item.word).match(/\p{L}+/gu)||[], total=tokens.reduce((s,w)=>s+removeTone(w).length,0);let at=start;
      for(const word of tokens){const duration=(end-start)*removeTone(word).length/total;entries.push({word,start:at,end:at+duration});at+=duration;}
      previousEnd=end;
    }
    cursor=previousEnd+punct;
  }else{
    const tokens=normalized.match(/\p{L}+|[,.;:!?…]/gu)||[];let pending=0;
    for(const token of tokens){
      if(/^[,.;:!?…]$/u.test(token)){pending=Math.max(pending,punct);continue;}
      const start=cursor+pending, end=start+base*(.9+random()*.2);entries.push({word:token,start,end});cursor=end;pending=gap;
    }
    cursor+=Math.max(pending,/[,.;:!?…]$/u.test(normalized)?punct:gap);
  }
  const add=(t,w)=>knots.set(Number(Math.max(0,t).toFixed(9)),normalizedMouthWeights(w));
  const scaled=(w,f)=>normalizedMouthWeights(Object.fromEntries(Object.entries(w).map(([k,v])=>[k,v*f])));
  add(0,{});
  for(const entry of entries){
    const {word,start,end}=entry,duration=end-start,parts=syllableParts(word,map),amp=.9+random()*.2,peak=.4+random()*.1, events=[];
    add(start,{});
    function event(phase,t,w,vowel){const weights=normalizedMouthWeights(w);add(t,weights);events.push({phase,time:t,frame:1+t*fps,weights,...(vowel?{vowel}:{} )});}
    const initial=map.initial_consonants?.[parts.onset];
    if(initial)event('initial',start+duration*.22,{[initial]:Math.min(1,amp)});
    else event('approach',start+duration*.2,scaled(map.vowels[parts.vowels[0]],amp*.28));
    parts.vowels.forEach((v,i)=>event('nucleus',start+duration*(parts.vowels.length===1?peak:peak+(.76-peak)*i/(parts.vowels.length-1)),scaled(map.vowels[v],amp),v));
    let tail;
    if((map.closed_finals||['m','p']).includes(parts.final))tail={Mouth_Closed:Math.min(1,amp)};
    else if((map.near_closed_finals||['n','t','ng','c','nh','ch']).includes(parts.final)){
      tail=Object.fromEntries(Object.entries(map.vowels[parts.vowels.at(-1)]).map(([k,v])=>[k,v*.1]));tail.Jaw_Open_New=Math.max(tail.Jaw_Open_New||0,.04);
    }else tail=scaled(map.vowels[parts.vowels.at(-1)],.25);
    event(parts.final?'final':'release',start+duration*.91,tail);add(end,{});
    syllables.push({syllable:word,start,end,frame_start:1+start*fps,frame_end:1+end*fps,parts,events});
  }
  const endFrame=Math.max(2,Math.ceil(cursor*fps)+1),duration=(endFrame-1)/fps;add(duration,{});
  return {schema:'chilinh.lipsync.vi.js.v1',text,normalized_text:normalized,fps,seed,duration,end_frame:endFrame,weight_cap:1,public_keys:[...MOUTH_KEYS],syllables,keyframes:[...knots.entries()].sort((a,b)=>a[0]-b[0]).map(([time,weights])=>({time,frame:1+time*fps,weights}))};
}
export function weightsAt(plan,time){
  const frames=plan.keyframes;if(!Number.isFinite(time))return normalizedMouthWeights({});
  if(time<=frames[0].time)return {...frames[0].weights};if(time>=frames.at(-1).time)return {...frames.at(-1).weights};
  let lo=0,hi=frames.length-1;while(hi-lo>1){const mid=(lo+hi)>>1;if(frames[mid].time<=time)lo=mid;else hi=mid;}
  const a=frames[lo],b=frames[hi],e=smoothstep((time-a.time)/(b.time-a.time));
  return normalizedMouthWeights(Object.fromEntries(MOUTH_KEYS.map(k=>[k,a.weights[k]*(1-e)+b.weights[k]*e])));
}
export const keyframeJSON=(text,options)=>buildPlan(text,options);
export const realtimeWeights=(plan,time)=>weightsAt(plan,time);
