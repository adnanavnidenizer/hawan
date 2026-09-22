const encoder = new TextEncoder();
const base64 = text => btoa(String.fromCharCode(...encoder.encode(text)));
const foldedBase64 = text => base64(text).match(/.{1,76}/g).join('\r\n');
export function makeMessage(data, mailbox) {
  const subject = Array.from('[HAWAN] '+data.subject);
  const words=[];
  while(subject.length) words.push('=?UTF-8?B?'+base64(subject.splice(0,12).join(''))+'?=');
  return [
    'From: HAWAN Website <'+mailbox+'>', 'To: <'+mailbox+'>',
    'Reply-To: <'+data.email+'>', 'Subject: '+words.join('\r\n '),
    'Date: '+new Date().toUTCString(), 'Message-ID: <'+crypto.randomUUID()+'@hawan.co>',
    'MIME-Version: 1.0', 'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64', '',
    foldedBase64('HAWAN website inquiry\n\nName: '+data.name+'\nEmail: '+data.email+'\n\n'+data.message)
  ].join('\r\n');
}
// A narrow SMTP client: fixed Gmail TLS endpoint, fixed sender/recipient, no attachments or relaying.
export async function sendGmail(connect, data, password) {
  const mailbox='adnanavni@hawan.co';
  const socket=connect({hostname:'smtp.gmail.com',port:465},{secureTransport:'on'});
  socket.closed.catch(()=>{});
  const reader=socket.readable.getReader(), writer=socket.writable.getWriter();
  const decoder=new TextDecoder(); let buffer='', timer;
  async function response(expected) {
    let bytes=0, lines=0, firstCode;
    for(;;){
      let end=buffer.indexOf('\r\n');
      if(end<0){const part=await reader.read();if(part.done)throw Error('SMTP connection closed');bytes+=part.value.length;if(bytes>32768)throw Error('SMTP response too long');buffer+=decoder.decode(part.value,{stream:true});continue;}
      const line=buffer.slice(0,end);buffer=buffer.slice(end+2);
      const match=/^(\d{3})([ -])/.exec(line);
      if(!match||++lines>100)throw Error('Invalid SMTP response');
      if(firstCode&&firstCode!==match[1])throw Error('Invalid multiline response');
      firstCode=match[1];
      if(match[2]===' '){if(Number(match[1])!==expected)throw Error('SMTP step rejected');return;}
    }
  }
  async function command(text,code){await writer.write(encoder.encode(text+'\r\n'));await response(code);}
  try {
    await Promise.race([(async()=>{
      await socket.opened;await response(220);
      await command('EHLO hawan.co',250);
      await command('AUTH PLAIN '+base64('\0'+mailbox+'\0'+password.replace(/\s/g,'')),235);
      await command('MAIL FROM:<'+mailbox+'>',250);
      await command('RCPT TO:<'+mailbox+'>',250);
      await command('DATA',354);
      await command(makeMessage(data,mailbox)+'\r\n.',250);
      // Success is recorded only after Gmail accepts DATA. Do not retry on QUIT/close failure.
    })(),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('SMTP timeout')),20000);})]);
  } finally {
    clearTimeout(timer);
    await socket.close().catch(()=>{});
  }
}
