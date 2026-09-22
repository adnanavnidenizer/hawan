import { connect } from 'cloudflare:sockets';
import { sendGmail } from '../../server/gmail.mjs';
import { handleContact } from '../../server/contact.mjs';
export const onRequest = ({request,env}) => handleContact(request,env,{send:(data,password)=>sendGmail(connect,data,password)});
