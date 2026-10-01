import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { requireCmsAuth } from './middleware/auth.js'
import { bootstrapRouter } from './routes/bootstrap.js'
import { contentRouter } from './routes/content.js'
import { mediaRouter } from './routes/media.js'

const app=express(); const port=Number(process.env.PORT||8080)
app.use(helmet()); app.use(cors({origin:(process.env.CMS_ORIGIN||'http://localhost:5173').split(',').map(x=>x.trim()),credentials:true})); app.use(express.json({limit:'2mb'}))
app.get('/health',(_req,res)=>res.json({ok:true,service:'tepisclovernotes-api',time:new Date().toISOString()}))
app.use('/api',requireCmsAuth); app.use('/api/bootstrap',bootstrapRouter); app.use('/api/content',contentRouter); app.use('/api/media',mediaRouter)
app.use((err:any,_req:any,res:any,_next:any)=>{console.error(err);res.status(500).json({error:err?.message||'Unexpected server error.'})})
app.listen(port,()=>console.log(`Tepis Clover Notes API listening on ${port}`))
