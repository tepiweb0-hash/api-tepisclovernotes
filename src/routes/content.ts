import { Router } from 'express'
import { db } from '../firebase/admin.js'
import { assertCollection, ID_FIELDS, makeId } from '../config/content.js'
import { audit } from '../services/audit.js'
import { requireEditor } from '../middleware/auth.js'

export const contentRouter = Router()

contentRouter.get('/:collection', async (req, res, next) => {
  try {
    const collection = req.params.collection
    assertCollection(collection)
    const snap = await db.collection(collection).get()
    res.json(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
  } catch (error) {
    next(error)
  }
})

contentRouter.post('/:collection', requireEditor, async (req, res, next) => {
  try {
    const collection = req.params.collection
    assertCollection(collection)

    const idField = ID_FIELDS[collection] || 'id'
    const id = String(req.body?.[idField] || makeId(collection))
    const now = new Date().toISOString()
    const record = {
      ...req.body,
      [idField]: id,
      created_at: req.body?.created_at || now,
      updated_at: now,
    }

    await db.collection(collection).doc(id).set(record)
    await audit(
      req.cmsUser!.uid,
      'create',
      collection,
      id,
      `Created ${collection} record`,
      null,
      record,
    )

    res.status(201).json({ id, ...record })
  } catch (error) {
    next(error)
  }
})

contentRouter.patch('/:collection/:id', requireEditor, async (req, res, next) => {
  try {
    const collection = req.params.collection
    assertCollection(collection)

    const ref = db.collection(collection).doc(req.params.id)
    const current = await ref.get()
    if (!current.exists) {
      return res.status(404).json({ error: 'Record not found.' })
    }

    const before = current.data() || null
    const after = {
      ...req.body,
      updated_at: new Date().toISOString(),
    }

    await ref.set(after, { merge: true })
    const saved = { id: req.params.id, ...(await ref.get()).data() }

    await audit(
      req.cmsUser!.uid,
      'update',
      collection,
      req.params.id,
      `Updated ${collection} record`,
      before,
      saved,
    )

    res.json(saved)
  } catch (error) {
    next(error)
  }
})

contentRouter.post('/:collection/:id/archive', requireEditor, async (req, res, next) => {
  try {
    const collection = req.params.collection
    assertCollection(collection)

    const ref = db.collection(collection).doc(req.params.id)
    const snap = await ref.get()
    if (!snap.exists) {
      return res.status(404).json({ error: 'Record not found.' })
    }

    const before = snap.data()
    const update: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
      enabled: false,
    }

    if (before && Object.prototype.hasOwnProperty.call(before, 'status')) {
      update.status = 'archived'
    }

    await ref.set(update, { merge: true })
    const after = (await ref.get()).data()

    await audit(
      req.cmsUser!.uid,
      'archive',
      collection,
      req.params.id,
      `Archived ${collection} record`,
      before,
      after,
    )

    res.json({ ok: true, id: req.params.id })
  } catch (error) {
    next(error)
  }
})
