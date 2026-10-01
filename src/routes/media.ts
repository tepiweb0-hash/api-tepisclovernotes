import { randomUUID } from 'node:crypto'
import { Router } from 'express'
import { cloudinary } from '../cloudinary.js'
import { db } from '../firebase/admin.js'
import { requireEditor } from '../middleware/auth.js'
import { audit } from '../services/audit.js'

export const mediaRouter = Router()

mediaRouter.post('/signature', requireEditor, async (_req, res, next) => {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || 'tepis_cms_media'

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error('Cloudinary environment variables are missing.')
    }

    const timestamp = Math.floor(Date.now() / 1000)
    const paramsToSign = {
      timestamp,
      upload_preset: uploadPreset,
    }

    const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret)

    res.json({
      cloudName,
      apiKey,
      timestamp,
      uploadPreset,
      signature,
      uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    })
  } catch (error) {
    next(error)
  }
})

mediaRouter.post('/register', requireEditor, async (req, res, next) => {
  try {
    const mediaId = String(req.body?.media_id || `media-${randomUUID().slice(0, 8)}`)
    const now = new Date().toISOString()

    const record = {
      media_id: mediaId,
      title: String(req.body?.title || ''),
      url: String(req.body?.url || req.body?.secure_url || ''),
      secure_url: String(req.body?.secure_url || req.body?.url || ''),
      cloudinary_public_id: String(
        req.body?.cloudinary_public_id || req.body?.public_id || '',
      ),
      asset_id: String(req.body?.asset_id || ''),
      source_url: String(req.body?.source_url || ''),
      source_page_url: String(req.body?.source_page_url || ''),
      alt_text: String(req.body?.alt_text || req.body?.title || ''),
      caption: String(req.body?.caption || ''),
      credit: String(req.body?.credit || ''),
      mime_type: String(req.body?.mime_type || 'image/webp'),
      format: String(req.body?.format || 'webp'),
      width: Number(req.body?.width || 0),
      height: Number(req.body?.height || 0),
      bytes: Number(req.body?.bytes || 0),
      is_webp: req.body?.is_webp !== false,
      status: String(req.body?.status || 'ready'),
      sort_order: Number(req.body?.sort_order || 999),
      enabled: req.body?.enabled !== false,
      uploaded_at: String(req.body?.uploaded_at || now),
      updated_at: now,
    }

    if (!record.url) {
      return res.status(400).json({ error: 'Media URL is required.' })
    }

    await db.collection('media').doc(mediaId).set(record, { merge: true })

    await audit(
      req.cmsUser!.uid,
      'upload',
      'media',
      mediaId,
      'Uploaded media to Cloudinary',
      null,
      record,
    )

    res.status(201).json({
      ok: true,
      id: mediaId,
      ...record,
    })
  } catch (error) {
    next(error)
  }
})
