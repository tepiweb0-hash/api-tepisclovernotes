import { Router } from 'express'
import { adminAuth, db } from '../firebase/admin.js'
import { requireOwner } from '../middleware/auth.js'
import { audit } from '../services/audit.js'

export const usersRouter = Router()
usersRouter.use(requireOwner)

const ROLES = new Set(['owner','admin','editor','viewer'])

function cleanString(value: unknown) {
  return String(value ?? '').trim()
}

usersRouter.post('/', async (req, res, next) => {
  try {
    const email = cleanString(req.body?.email).toLowerCase()
    const password = cleanString(req.body?.password)
    const displayName = cleanString(req.body?.display_name)
    const role = cleanString(req.body?.role || 'viewer')
    const enabled = req.body?.enabled !== false
    const notes = cleanString(req.body?.notes)

    if (!email) return res.status(400).json({ error: 'Email is required.' })
    if (!displayName) return res.status(400).json({ error: 'Display name is required.' })
    if (password.length < 8) return res.status(400).json({ error: 'Temporary password must be at least 8 characters.' })
    if (!ROLES.has(role)) return res.status(400).json({ error: 'Invalid CMS role.' })

    const user = await adminAuth.createUser({
      email,
      password,
      displayName,
      disabled: !enabled,
      emailVerified: false,
    })

    const now = new Date().toISOString()
    const profile = {
      user_id: user.uid,
      display_name: displayName,
      email,
      role,
      enabled,
      notes,
      created_at: now,
      updated_at: now,
    }

    try {
      await db.collection('cms_users').doc(user.uid).set(profile)
    } catch (error) {
      await adminAuth.deleteUser(user.uid).catch(() => undefined)
      throw error
    }

    await audit(req.cmsUser!.uid, 'create', 'cms_users', user.uid, 'Created CMS user', null, profile)
    res.status(201).json({ id: user.uid, ...profile })
  } catch (error) {
    const code = String((error as { code?: string })?.code || '')
    if (code.includes('email-already-exists')) return res.status(409).json({ error: 'That email already has a Firebase account.' })
    if (code.includes('invalid-email')) return res.status(400).json({ error: 'Enter a valid email address.' })
    next(error)
  }
})

usersRouter.patch('/:uid', async (req, res, next) => {
  try {
    const uid = String(req.params.uid || '')
    if (!uid) return res.status(400).json({ error: 'User ID is required.' })

    const ref = db.collection('cms_users').doc(uid)
    const snap = await ref.get()
    if (!snap.exists) return res.status(404).json({ error: 'CMS user not found.' })
    const before = snap.data() || {}

    const displayName = cleanString(req.body?.display_name ?? before.display_name)
    const email = cleanString(req.body?.email ?? before.email).toLowerCase()
    const role = cleanString(req.body?.role ?? before.role)
    const enabled = req.body?.enabled === undefined ? before.enabled !== false : req.body.enabled !== false
    const notes = cleanString(req.body?.notes ?? before.notes)

    if (!displayName) return res.status(400).json({ error: 'Display name is required.' })
    if (!email) return res.status(400).json({ error: 'Email is required.' })
    if (!ROLES.has(role)) return res.status(400).json({ error: 'Invalid CMS role.' })
    if (uid === req.cmsUser!.uid && (!enabled || role !== 'owner')) {
      return res.status(400).json({ error: 'You cannot disable or demote your own owner account.' })
    }

    await adminAuth.updateUser(uid, { email, displayName, disabled: !enabled })
    const update = { display_name: displayName, email, role, enabled, notes, updated_at: new Date().toISOString() }
    await ref.set(update, { merge: true })
    const after = { id: uid, ...(await ref.get()).data() }
    await audit(req.cmsUser!.uid, 'update', 'cms_users', uid, 'Updated CMS user', before, after)
    res.json(after)
  } catch (error) {
    const code = String((error as { code?: string })?.code || '')
    if (code.includes('email-already-exists')) return res.status(409).json({ error: 'That email is already used by another Firebase account.' })
    if (code.includes('invalid-email')) return res.status(400).json({ error: 'Enter a valid email address.' })
    next(error)
  }
})

usersRouter.post('/:uid/disable', async (req, res, next) => {
  try {
    const uid = String(req.params.uid || '')
    if (!uid) return res.status(400).json({ error: 'User ID is required.' })
    if (uid === req.cmsUser!.uid) return res.status(400).json({ error: 'You cannot disable your own owner account.' })
    const ref = db.collection('cms_users').doc(uid)
    const snap = await ref.get()
    if (!snap.exists) return res.status(404).json({ error: 'CMS user not found.' })
    const before = snap.data() || {}
    await adminAuth.updateUser(uid, { disabled: true })
    await ref.set({ enabled: false, updated_at: new Date().toISOString() }, { merge: true })
    const after = { id: uid, ...(await ref.get()).data() }
    await audit(req.cmsUser!.uid, 'disable', 'cms_users', uid, 'Disabled CMS user', before, after)
    res.json(after)
  } catch (error) {
    next(error)
  }
})
