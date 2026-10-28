import * as THREE from 'three';
const TYPES=['open_palm','beat','point_soft','list_count','both_open','hand_chest'];
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const ease=x=>{x=clamp(x);return x*x*x*(10+x*(-15+6*x))};
function rng(seed){return()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296)}
const plain=s=>(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').toLowerCase();

export function planGestureEvents(text,plan,manifest,options={}){
 const random=rng(options.seed??20261027),rate=clamp(options.gestureRate??1,0,2),words=plan?.syllables||[];
 const available=new Map(manifest.clips.map(c=>[c.name,c]));const events=[];let previousType='',side=random()<.5?'L':'R',previousEnd=-Infinity,chestUsed=false;
 // Sentence bounds come from the actual normalized speech words and punctuation.
 const sentences=String(plan?.normalized_text||text).normalize('NFC').split(/(?<=[.!?])\s*/u).filter(s=>s.trim());let cursor=0;
 for(const sentence of sentences){
  const count=(sentence.match(/[\p{L}\p{N}]+/gu)||[]).length;
  const group=words.slice(cursor,Math.min(words.length,cursor+count));cursor+=count;if(group.length<4||rate===0)continue;
  const base=group.length<=8?1:group.length<=18?2:3;const quota=Math.min(group.length<=8?1:3,Math.round(base*rate));let used=0;
  for(let j=0;j<quota;j++){
   const fraction=quota===1?.53:(j+.6)/(quota+.15),desired=group[0].start+(group.at(-1).end-group[0].start)*fraction;
   const window=group.map((w,i)=>({w,i,peak:w.events?.find(e=>e.phase==='nucleus')?.time??(w.start+w.end)/2})).filter(x=>x.i>=2);
   if(!window.length)continue;
   window.sort((a,b)=>Math.abs(a.peak-desired)-Math.abs(b.peak-desired));let chosen=null;
   for(const x of window){const start=x.peak-.62;if(start<.35)continue;if(events.length&&(start<previousEnd+.8||start>previousEnd+2.5))continue;chosen=x;break}
   if(!chosen)continue;
   const local=plain(group.slice(Math.max(0,chosen.i-2),chosen.i+3).map(w=>w.syllable).join(' '));let type='open_palm',reason='mệnh đề/âm tiết nhấn';
   if(/thu (nhat|hai|ba)|dau tien|ba buoc|mot la|hai la/.test(local)){type='list_count';reason='liệt kê'}
   else if(/tat ca|tong the|moi nguoi|nhin chung/.test(local)){type='both_open';reason='ý tổng quát'}
   else if(/rat|quan trong|can|chinh|luu y/.test(local)){type='beat';reason='từ nhấn'}
   else if(/ban|o day|ben nay/.test(local)&&random()<.4){type='point_soft';reason='chỉ dẫn nhẹ'}
   else if(/toi|cam on|chan thanh/.test(local)&&!chestUsed&&random()<.10){type='hand_chest';chestUsed=true;reason='ngôi thứ nhất, tần suất thấp'}
   if(type==='point_soft'&&!available.has('gesture_point_soft_L')){type='open_palm';reason+='; chỉ ngón chưa duyệt'}
   if(type===previousType){type=type==='open_palm'?'beat':'open_palm';reason+='; tránh lặp'}
   const nextSide=side==='L'?'R':'L';const clip=available.get(`gesture_${type}_${nextSide}`);if(!clip)continue;
   const start=chosen.peak-(clip.strokePeak??.62),gap=events.length?start-previousEnd:null;
   if(gap!==null&&(gap<.8-1e-6||gap>2.5+1e-6))continue;
   side=nextSide;events.push({clip:clip.name,type,side,start,end:start+clip.duration,word:chosen.w.syllable,wordIndex:words.indexOf(chosen.w),wordPeak:chosen.peak,strokePeakTime:start+(clip.strokePeak??.62),gapAfterPrevious:gap,reason});previousEnd=start+clip.duration;previousType=type;used++;
  }
 }
 return events;
}

export function createGestureController(root,clips,manifest){
 const mixer=new THREE.AnimationMixer(root),byName=new Map(clips.map(c=>[c.name,c])),meta=new Map(manifest.clips.map(c=>[c.name,c]));
 const idle=mixer.clipAction(byName.get('hands_idle_v2')).setLoop(THREE.LoopRepeat,Infinity).play(),bones=[];root.traverse(o=>{if(o.isBone)bones.push(o)});
 let intensity=.8,rate=1,audio=0,speaking=false,current=null,elapsed=0,clock=0,nextReady=0,events=[],eventIndex=0,speechStart=0,speechPlan=null,text='',returning=null,queued=null,side='R',stopAt=null,record=[],previewing=false;
 let idlePhase=0, holdGain=null, releaseGain=null;
 const copyPose=()=>bones.map(b=>({p:b.position.clone(),q:b.quaternion.clone(),s:b.scale.clone()}));
 function begin(kind='open_palm',which){
  if(kind==='left'||kind==='right'){which=kind==='left'?'L':'R';kind='open_palm'}
  if(!TYPES.includes(kind))throw Error('Không có cử chỉ '+kind);which=which==='left'?'L':which==='right'?'R':which||side;
  const name=`gesture_${kind}_${which}`,clip=byName.get(name);if(!clip)throw Error('Thiếu clip '+name);
  if(current||returning){queued={kind,which};return false}
  if(previewing){mixer.stopAllAction();idle.reset();previewing=false}idle.enabled=true;idle.paused=false;idle.play();current=mixer.clipAction(clip).reset().setLoop(THREE.LoopOnce,1).play();current.clampWhenFinished=true;elapsed=0;stopAt=null;holdGain=null;releaseGain=null;side=which==='L'?'R':'L';record.push({event:'start',clip:name,clock});return true;
 }
 function startReturn(){const pose=copyPose();current?.stop();current=null;stopAt=null;idle.enabled=true;idle.paused=false;idle.setEffectiveWeight(1).play();returning={pose,time:0};record.push({event:'retract-start',clock})}
 function setSpeaking(value){if(previewing){mixer.stopAllAction();idle.reset().setEffectiveWeight(1).play();previewing=false}speaking=Boolean(value);if(speaking){speechStart=clock;eventIndex=0;if(!idle.isRunning())idle.reset().play()}else{events=[];eventIndex=0;queued=null;if(current){const m=meta.get(current.getClip().name),t=elapsed;stopAt=t<m.anticipation?m.anticipation:t<m.strokeEnd?m.strokeEnd:t<m.retractStart?m.retractStart:m.duration;}record.push({event:'speech-end',clock,finishPhaseAt:stopAt})}}
 function setSpeechPlan(s,p){text=s;speechPlan=p;events=p?planGestureEvents(s,p,manifest,{gestureRate:rate,seed:20261027}):[];eventIndex=0;speechStart=clock;record.push({event:'plan',text:s,events});return events}
 function update(dt,speechTime){
  dt=clamp(dt,0,.1);clock+=dt;
  // Advance idle breathing only outside the static hold. It must not leak into wrist/fingers through blend weight.
  let idleDt=dt;
  if(current){const previous=elapsed;elapsed+=dt;const m=meta.get(current.getClip().name);
   const overlap=Math.max(0,Math.min(elapsed,m.retractStart)-Math.max(previous,m.strokeEnd));idleDt-=overlap;
   const fade=ease(elapsed/.18)*(1-ease((elapsed-m.duration+.18)/.18));let gain=clamp(intensity*(1+.2*audio))*fade;
   if(elapsed>=m.strokeEnd&&elapsed<=m.retractStart){if(holdGain===null)holdGain=gain;gain=holdGain}
   else if(elapsed>m.retractStart&&holdGain!==null){const f=ease((elapsed-m.retractStart)/.12);gain=holdGain*(1-f)+gain*f}
   current.setEffectiveWeight(gain);idle.setEffectiveWeight(1-gain)
  }else idle.setEffectiveWeight(1);
  idlePhase+=Math.max(0,idleDt);idle.time=idlePhase%idle.getClip().duration;idle.paused=true;
  mixer.update(dt);
  if(current&&stopAt!==null&&elapsed>=stopAt&&elapsed<current.getClip().duration-.01)startReturn();
  if(returning){returning.time+=dt;const a=ease(returning.time/.5);for(let i=0;i<bones.length;i++){const b=bones[i],s=returning.pose[i],p=b.position.clone(),q=b.quaternion.clone(),sc=b.scale.clone();b.position.lerpVectors(s.p,p,a);b.quaternion.copy(s.q).slerp(q,a);b.scale.lerpVectors(s.s,sc,a)}if(returning.time>=.5){returning=null;nextReady=clock+.8;record.push({event:'idle',clock})}}
  if(current&&elapsed>=current.getClip().duration){current.stop();current=null;idle.setEffectiveWeight(1);nextReady=clock+.8;record.push({event:'idle',clock})}
  if(!current&&!returning&&clock>=nextReady){
   if(queued){const q=queued;queued=null;begin(q.kind,q.which)}else if(speaking){const t=speechTime===undefined?clock-speechStart:speechTime;while(eventIndex<events.length&&events[eventIndex].start<=t){const ev=events[eventIndex++];if(t-ev.start<.35){begin(ev.type,ev.side);record.push({event:'semantic',...ev,actualSpeechTime:t});break}}if(!speechPlan&&rate>0&&clock-speechStart>.8){const last=record.findLast(x=>x.event==='start');begin(last?.clip.includes('_beat_')?'open_palm':'beat',side);record.push({event:'fallback-no-transcript',clock})}}
  }
 }
 function rest(){idlePhase=0;holdGain=null;mixer.stopAllAction();previewing=false;current=null;returning=null;queued=null;speaking=false;events=[];idle.reset().setEffectiveWeight(1).play();mixer.update(0)}
 function preview(name='hands_idle_v2',t=0){if(name==='hands_idle')name='hands_idle_v2';rest();previewing=true;idle.stop();const c=byName.get(name);if(!c)throw Error(name);const a=mixer.clipAction(c).reset().setEffectiveWeight(1).play();a.time=clamp(t,0,c.duration);a.paused=true;mixer.update(0)}
 function seek(t){mixer.stopAllAction();previewing=true;idle.reset().setEffectiveWeight(1).play();let frozen=0;for(const e of events){const m=meta.get(e.clip);frozen+=Math.max(0,Math.min(t-e.start,m.retractStart)-m.strokeEnd)}idle.time=Math.max(0,t-frozen)%5.5;idle.paused=true;const ev=events.find(e=>t>=e.start&&t<=e.end);if(ev){const c=byName.get(ev.clip),a=mixer.clipAction(c).reset().play(),local=t-ev.start,fade=ease(local/.18)*(1-ease((local-c.duration+.18)/.18)),gain=clamp(intensity*(1+.2*audio))*fade;a.time=local;a.paused=true;a.setEffectiveWeight(gain);idle.setEffectiveWeight(1-gain)}mixer.update(0)}
 return{update,trigger:begin,setSpeaking,setSpeechPlan,rest,preview,seek,mixer,setAudioLevel:x=>audio=clamp(Number(x)||0),setParameters(o={}){if(o.gestureIntensity!==undefined)intensity=clamp(Number(o.gestureIntensity));if(o.gestureRate!==undefined)rate=clamp(Number(o.gestureRate),0,2)},getLog:()=>record,schedule:()=>events,status:()=>({speaking,action:current?.getClip().name||'hands_idle_v2',elapsed,side:current?.getClip().name.endsWith('_L')?'L':'R',returning:Boolean(returning),waitingForReturn:stopAt!==null||Boolean(returning),gestureIntensity:intensity,gestureRate:rate,semanticEvents:events.length,clock})};
}
