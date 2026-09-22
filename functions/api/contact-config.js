import { configured, origins, reply } from '../../server/contact.mjs';
export function onRequestGet({request,env}) {
  if(!configured(env)||!origins(env).includes(new URL(request.url).origin))return reply(503,{enabled:false});
  return reply(200,{enabled:true,siteKey:env.TURNSTILE_SITE_KEY});
}
