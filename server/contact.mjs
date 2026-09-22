const mailbox='adnanavni@hawan.co';
export const reply=(status,data)=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
export function origins(env){return (env.CONTACT_ALLOWED_ORIGINS||'').split(',').map(s=>s.trim()).filter(Boolean);}
export function configured(env){return env.CONTACT_ENABLED==='true'&&!!env.GMAIL_APP_PASSWORD&&!!env.TURNSTILE_SECRET_KEY&&!!env.TURNSTILE_SITE_KEY&&origins(env).length>0;}
export function validate(data){
  if(!data||typeof data!=='object'||Array.isArray(data))return null;
  const limits={name:120,email:254,subject:160,message:5000};const clean={};
  for(const [key,max] of Object.entries(limits)){if(typeof data[key]!=='string')return null;clean[key]=data[key].trim();if(!clean[key]||clean[key].length>max||/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(clean[key]))return null;}
  if(/[\r\n]/.test(clean.name+clean.subject)||! /^[A-Za-z0-9.!#$%&'*+\/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?\.[A-Za-z]{2,}$/.test(clean.email))return null;
  return clean;
}
async function limitedJSON(request){
  const reader=request.body?.getReader();if(!reader)throw Error('body');let bytes=0,parts=[];
  try{for(;;){const {done,value}=await reader.read();if(done)break;bytes+=value.length;if(bytes>32768)throw Error('size');parts.push(value);}}finally{await reader.cancel().catch(()=>{});}
  const all=new Uint8Array(bytes);let offset=0;for(const p of parts){all.set(p,offset);offset+=p.length;}return JSON.parse(new TextDecoder().decode(all));
}
export async function handleContact(request,env,{fetcher=fetch,send}={}){
  if(request.method!=='POST')return reply(405,{error:'method'});
  const origin=request.headers.get('Origin');
  if(!origin||origin!==new URL(request.url).origin||!origins(env).includes(origin))return reply(403,{error:'origin'});
  if(!configured(env))return reply(503,{error:'unavailable'});
  if(!request.headers.get('Content-Type')?.startsWith('application/json'))return reply(415,{error:'format'});
  let raw;try{raw=await limitedJSON(request);}catch{return reply(400,{error:'invalid'});}
  const data=validate(raw);if(!data||raw.website||typeof raw.token!=='string'||!raw.token||raw.token.length>2048)return reply(400,{error:'invalid'});
  try{
    const response=await fetcher('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret:env.TURNSTILE_SECRET_KEY,response:raw.token,...(request.headers.get('CF-Connecting-IP')?{remoteip:request.headers.get('CF-Connecting-IP')}:{})}),signal:AbortSignal.timeout(8000)});
    if(!response.ok)return reply(503,{error:'unavailable'});
    const result=await response.json();
    if(!result.success||result.action!=='contact'||result.hostname!==new URL(origin).hostname)return reply(403,{error:'verification'});
  }catch{return reply(503,{error:'unavailable'});}
  try{await send(data,env.GMAIL_APP_PASSWORD);return reply(200,{ok:true});}
  catch{return reply(502,{error:'delivery'});}
}
