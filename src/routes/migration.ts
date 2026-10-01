import { Router } from 'express'
import { db } from '../firebase/admin.js'
import { requireOwner } from '../middleware/auth.js'
import { audit } from '../services/audit.js'

export const migrationRouter = Router()

type MigrationDef = {
  collection: string
  idField?: string
  composite?: (record: Record<string, unknown>) => string
}

const MIGRATION_DEFS: Record<string, MigrationDef> = {
  SITE_SETTINGS: { collection: 'site_settings', idField: 'key' },
  UI_TEXT: { collection: 'ui_text', idField: 'key' },
  THEME: { collection: 'theme', idField: 'token' },
  FONTS: { collection: 'fonts', idField: 'font_id' },
  NAVIGATION: { collection: 'navigation', idField: 'nav_id' },
  SOCIALS: { collection: 'socials', idField: 'social_id' },
  MESSAGE_LINKS: { collection: 'message_links', idField: 'link_id' },
  PAGES: { collection: 'pages', idField: 'page_id' },
  SECTIONS: { collection: 'sections', idField: 'section_id' },
  SECTION_ITEMS: { collection: 'section_items', idField: 'item_id' },
  MEDIA: { collection: 'media', idField: 'media_id' },
  ARTISTS: { collection: 'artists', idField: 'artist_id' },
  ARTIST_TIMELINE: { collection: 'artist_timeline', idField: 'timeline_id' },
  ARTIST_ACHIEVEMENTS: { collection: 'artist_achievements', idField: 'achievement_id' },
  SERIES: { collection: 'series', idField: 'series_id' },
  SERIES_CAST: { collection: 'series_cast', idField: 'cast_id' },
  EPISODES: { collection: 'episodes', idField: 'episode_id' },
  EPISODE_CAST: { collection: 'episode_cast', idField: 'episode_cast_id' },
  GALLERIES: { collection: 'galleries', idField: 'gallery_item_id' },
  GALLERY_SETTINGS: { collection: 'gallery_settings', idField: 'gallery_setting_id' },
  NEWS: { collection: 'news', idField: 'news_id' },
  EVENTS: { collection: 'events', idField: 'event_id' },
  NOTIFICATIONS: { collection: 'notifications', idField: 'notification_id' },
  HOME_FEATURES: { collection: 'home_features', idField: 'feature_id' },
  REDIRECTS: { collection: 'redirects', idField: 'redirect_id' },
  LOOKUPS: {
    collection: 'lookups',
    composite: (record) => `${String(record.group || '')}__${String(record.value || '')}`,
  },
}

function safeDocId(value: unknown) {
  return String(value ?? '').trim().replace(/\//g, '_')
}

function normalizeValue(value: unknown): unknown {
  if (value === undefined) return null
  if (typeof value === 'number' && !Number.isFinite(value)) return null
  if (Array.isArray(value)) return value.map(normalizeValue)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([key]) => !key.startsWith('__'))
        .map(([key, item]) => [key, normalizeValue(item)]),
    )
  }
  return value
}

function normalizeRecord(record: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(record)
      .filter(([key]) => key && !key.startsWith('__'))
      .map(([key, value]) => [key, normalizeValue(value)]),
  )
}

migrationRouter.post('/import', requireOwner, async (req, res, next) => {
  try {
    const sourceSheet = String(req.body?.sheet || '').trim().toUpperCase()
    const definition = MIGRATION_DEFS[sourceSheet]
    if (!definition) {
      return res.status(400).json({ error: `Sheet ${sourceSheet || '(blank)'} is not approved for migration.` })
    }

    const rawRecords = Array.isArray(req.body?.records) ? req.body.records : []
    if (rawRecords.length > 450) {
      return res.status(400).json({ error: 'Send at most 450 records per migration request.' })
    }

    const rows = rawRecords
      .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object' && !Array.isArray(item))
      .map(normalizeRecord)

    const prepared: Array<{ id: string; data: Record<string, unknown> }> = []
    const skipped: Array<{ index: number; reason: string }> = []
    const seen = new Set<string>()

    rows.forEach((record, index) => {
      const rawId = definition.composite ? definition.composite(record) : record[definition.idField || 'id']
      const id = safeDocId(rawId)
      if (!id || id === '__') {
        skipped.push({ index, reason: 'Missing record ID.' })
        return
      }
      if (seen.has(id)) {
        skipped.push({ index, reason: `Duplicate record ID: ${id}` })
        return
      }
      seen.add(id)
      prepared.push({ id, data: record })
    })

    let imported = 0
    for (let start = 0; start < prepared.length; start += 400) {
      const batch = db.batch()
      const chunk = prepared.slice(start, start + 400)
      chunk.forEach(({ id, data }) => {
        const ref = db.collection(definition.collection).doc(id)
        batch.set(ref, data, { merge: true })
      })
      await batch.commit()
      imported += chunk.length
    }

    await audit(
      req.cmsUser!.uid,
      'migration',
      definition.collection,
      sourceSheet,
      `Migrated ${imported} records from ${sourceSheet}`,
      null,
      { sheet: sourceSheet, collection: definition.collection, imported, skipped: skipped.length },
    )

    res.json({
      ok: true,
      sheet: sourceSheet,
      collection: definition.collection,
      imported,
      skipped,
    })
  } catch (error) {
    next(error)
  }
})

migrationRouter.get('/definitions', requireOwner, (_req, res) => {
  res.json({
    ok: true,
    sheets: Object.entries(MIGRATION_DEFS).map(([sheet, def]) => ({
      sheet,
      collection: def.collection,
      idField: def.idField || null,
      composite: Boolean(def.composite),
    })),
    skippedSheets: ['README', 'APPS_SCRIPT_SETUP', 'CMS_USERS', 'CHANGE_LOG'],
  })
})
