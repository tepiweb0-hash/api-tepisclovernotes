import { Router } from 'express'
import { db } from '../firebase/admin.js'
import { audit } from '../services/audit.js'
import { requireEditor } from '../middleware/auth.js'
export const mediaRouter=Router()
mediaRouter.post('/register', requireEditor, async(req,res,next)=>{try{const mediaId=String(req.body?.media_id||`media-${crypto.randomUUID().slice(0,8)}`);const record={...req.body,media_id:mediaId,uploaded_at:req.body?.uploaded_at||new Date().toISOString(),updated_at:new Date().toISOString()};await db.collection('media').doc(mediaId).set(record,{merge:true});await audit(req.cmsUser!.uid,'upload','media',mediaId,'Uploaded optimized WebP',null,record);res.status(201).json({id:mediaId,...record})}catch(e){next(e)}})
