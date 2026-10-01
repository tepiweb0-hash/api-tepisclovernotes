import type { NextFunction, Request, Response } from 'express'
import { adminAuth, db } from '../firebase/admin.js'

declare global { namespace Express { interface Request { cmsUser?: { uid:string; email?:string; role:string } } } }

export async function requireCmsAuth(req:Request,res:Response,next:NextFunction){
  try{
    const header=req.headers.authorization || ''
    if(!header.startsWith('Bearer ')) return res.status(401).json({error:'Authentication required.'})
    const decoded=await adminAuth.verifyIdToken(header.slice(7))
    const profile=await db.collection('cms_users').doc(decoded.uid).get()
    const role=String(decoded.role || profile.data()?.role || '')
    const enabled=profile.exists ? profile.data()?.enabled !== false : Boolean(decoded.role)
    if(!enabled || !['owner','admin','editor','viewer'].includes(role)) return res.status(403).json({error:'CMS access is not enabled for this account.'})
    req.cmsUser={uid:decoded.uid,email:decoded.email,role}; next()
  }catch(error){ res.status(401).json({error:error instanceof Error?error.message:'Invalid session.'}) }
}

export function requireEditor(req:Request,res:Response,next:NextFunction){ if(!req.cmsUser || !['owner','admin','editor'].includes(req.cmsUser.role)) return res.status(403).json({error:'Editor access required.'}); next() }
