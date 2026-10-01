import { Router } from 'express'
import { db } from '../firebase/admin.js'
import { CONTENT_COLLECTIONS } from '../config/content.js'
export const bootstrapRouter=Router()
bootstrapRouter.get('/', async (_req,res,next)=>{ try{ const entries=await Promise.all(CONTENT_COLLECTIONS.map(async(name)=>{ const snap=await db.collection(name).get(); return [name,snap.docs.map(doc=>({id:doc.id,...doc.data()}))] as const })); res.json({ok:true,generatedAt:new Date().toISOString(),collections:Object.fromEntries(entries)}) }catch(e){next(e)} })
