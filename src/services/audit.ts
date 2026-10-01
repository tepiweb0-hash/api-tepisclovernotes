import { db } from '../firebase/admin.js'
export async function audit(actor:string, action:string, entityType:string, entityId:string, summary:string, before:unknown, after:unknown){ await db.collection('audit_logs').add({ timestamp:new Date().toISOString(), actor, action, entity_type:entityType, entity_id:entityId, summary, before, after }) }
