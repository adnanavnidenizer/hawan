import test from 'node:test';
import assert from 'node:assert/strict';
import {handleContact,validate} from '../server/contact.mjs';
import {makeMessage,sendGmail} from '../server/gmail.mjs';
const good={name:'Test Visitor',email:'visitor@example.com',subject:'Türkçe inquiry',message:'Merhaba\nA message.',token:'one-use-token'};
const env={CONTACT_ENABLED:'true',CONTACT_ALLOWED_ORIGINS:'https://hawan.pages.dev',GMAIL_APP_PASSWORD:'dummy',TURNSTILE_SECRET_KEY:'dummy',TURNSTILE_SITE_KEY:'dummy'};
const request=(data=good,origin='https://hawan.pages.dev')=>new Request('https://hawan.pages.dev/api/contact',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(data)});
const verified=async()=>Response.json({success:true,hostname:'hawan.pages.dev',action:'contact'});
test('reject header injection, invalid email and excessive input',()=>{for(const bad of [{...good,email:'x@example.com\r\nBcc: x@y.com'},{...good,subject:'a\nb'},{...good,name:'x'.repeat(121)},{...good,message:''}])assert.equal(validate(bad),null);assert.ok(validate(good));});
test('fail closed for origin, missing config, honeypot and bad token',async()=>{let sends=0;const deps={send:async()=>sends++,fetcher:verified};assert.equal((await handleContact(request(good,'https://evil.example'),env,deps)).status,403);assert.equal((await handleContact(request(),{},deps)).status,403);assert.equal((await handleContact(request(),{...env,GMAIL_APP_PASSWORD:''},deps)).status,503);assert.equal((await handleContact(request({...good,website:'spam'}),env,deps)).status,400);assert.equal((await handleContact(request(),env,{...deps,fetcher:async()=>Response.json({success:false})})).status,403);assert.equal(sends,0);});
test('verify hostname and action before SMTP',async()=>{for(const result of [{success:true,hostname:'evil.example',action:'contact'},{success:true,hostname:'hawan.pages.dev',action:'login'}])assert.equal((await handleContact(request(),env,{fetcher:async()=>Response.json(result),send:()=>assert.fail()})).status,403);});
test('success requires SMTP acceptance; never expose errors',async()=>{let sent;const response=await handleContact(request(),env,{fetcher:verified,send:async data=>{sent=data;}});assert.equal(response.status,200);assert.equal(sent.email,good.email);const failure=await handleContact(request(),env,{fetcher:verified,send:async()=>{throw Error('secret');}});assert.equal(failure.status,502);assert.ok(!(await failure.text()).includes('secret'));});
test('MIME recipient fixed and unicode message roundtrips',()=>{const mail=makeMessage(good,'adnanavni@hawan.co');assert.match(mail,/To: <adnanavni@hawan.co>/);assert.match(mail,/Reply-To: <visitor@example.com>/);assert.ok(Buffer.from(mail.split('\r\n\r\n')[1].replaceAll('\r\n',''),'base64').toString('utf8').includes(good.message));});
test('SMTP handles fragmented multiline responses and DATA rejection',async()=>{
 for(const accept of [true,false]){
 let controller,closed=false,stage=0;const commands=[];
 const feed=text=>{controller.enqueue(new TextEncoder().encode(text.slice(0,2)));controller.enqueue(new TextEncoder().encode(text.slice(2)));};
 const connect=(address,options)=>{assert.equal(address.hostname,'smtp.gmail.com');assert.equal(address.port,465);assert.equal(options.secureTransport,'on');return {opened:Promise.resolve(),closed:Promise.resolve(),readable:new ReadableStream({start(c){controller=c;feed('220 ready\r\n');}}),writable:new WritableStream({write(bytes){commands.push(new TextDecoder().decode(bytes));feed(['250-smtp\r\n250 AUTH PLAIN\r\n','235 authenticated\r\n','250 ok\r\n','250 ok\r\n','354 data\r\n',accept?'250 accepted\r\n':'550 rejected\r\n'][stage++]);}}),close:async()=>{closed=true;controller.close();}};};
 if(accept)await sendGmail(connect,good,'test password');else await assert.rejects(sendGmail(connect,good,'test password'));
 assert.equal(closed,true);assert.match(commands[3],/RCPT TO:<adnanavni@hawan.co>/);assert.ok(commands[5].endsWith('\r\n.\r\n'));
 }
});
