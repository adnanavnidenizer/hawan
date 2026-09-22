const form=document.querySelector('[data-contact-compose]');
if(form){
 const tr=document.documentElement.lang==='tr',button=form.querySelector('button[type="submit"]'),status=form.querySelector('.compose-status'),note=document.querySelector('#compose-note');
 const words=tr?{send:'Mesajı Gönder',sending:'Gönderiliyor…',sent:'Mesajınız gönderildi. Teşekkür ederiz.',error:'Gönderim doğrulanamadı. Mesajınız burada korunuyor. E-posta taslağını kullanabilir veya daha sonra tekrar deneyebilirsiniz.',verify:'Lütfen güvenlik doğrulamasını tamamlayın.',note:'Mesajınız doğrudan HAWAN’a iletilir.',fallback:'E-posta uygulamasıyla gönder'}:{send:'Send Message',sending:'Sending…',sent:'Your message has been sent. Thank you.',error:'We could not confirm sending. Your message is preserved here. Use an email draft or try again later.',verify:'Please complete the security verification.',note:'Your message is sent directly to HAWAN.',fallback:'Send using your email app'};
 let ready=false,token='',widget=null,busy=false;
 const say=text=>{status.hidden=false;status.textContent=text;};
 function emailDraft(){const data=new FormData(form);const body=String(data.get('message')).trim()+'\n\nName: '+String(data.get('name')).trim()+'\nEmail: '+String(data.get('email')).trim();location.href='mailto:adnanavni@hawan.co?subject='+encodeURIComponent(String(data.get('subject')).trim())+'&body='+encodeURIComponent(body);}
 const fallback=document.createElement('button');fallback.type='button';fallback.className='contact-fallback';fallback.textContent=words.fallback;fallback.hidden=true;status.after(fallback);fallback.addEventListener('click',()=>{if(form.reportValidity())emailDraft();});
 async function setup(){
  try{
   const response=await fetch('/api/contact-config',{cache:'no-store'});if(!response.ok)return;const config=await response.json();if(!config.enabled||!config.siteKey)return;
   const slot=document.createElement('div');slot.className='contact-verification';form.querySelector('.compose-bottom').before(slot);
   const script=document.createElement('script');script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';script.async=true;
   await new Promise((resolve,reject)=>{script.onload=resolve;script.onerror=reject;document.head.append(script);});
   widget=window.turnstile.render(slot,{sitekey:config.siteKey,action:'contact',theme:'light',size:'flexible',callback:value=>{token=value;},'expired-callback':()=>{token='';},'error-callback':()=>{token='';say(words.verify);}});
   ready=true;button.textContent=words.send;note.textContent=words.note;fallback.hidden=false;
  }catch{/* Keep the explicit email-app fallback if the endpoint is not configured. */}
 }
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(busy||!form.reportValidity())return;
  if(!ready){emailDraft();say(tr?'E-posta uygulamanızda gönderimi tamamlayın.':'Complete sending in your email app.');return;}
  if(!token){say(words.verify);return;}
  busy=true;button.disabled=true;button.textContent=words.sending;form.setAttribute('aria-busy','true');
  const data=Object.fromEntries(new FormData(form));data.token=token;
  try{const response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(35000)});const result=await response.json();if(!response.ok||result.ok!==true)throw Error('not accepted');form.reset();say(words.sent);}
  catch{say(words.error);}
  finally{busy=false;button.disabled=false;button.textContent=words.send;form.removeAttribute('aria-busy');token='';window.turnstile.reset(widget);}
 });
 setup();
}
