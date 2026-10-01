import { Router } from 'express'
import { db } from '../firebase/admin.js'

export const publicRouter = Router()

const COLLECTIONS = {
  fonts: 'fonts',
  navigation: 'navigation',
  socials: 'socials',
  messageLinks: 'message_links',
  pages: 'pages',
  sections: 'sections',
  sectionItems: 'section_items',
  media: 'media',
  artists: 'artists',
  artistTimeline: 'artist_timeline',
  artistAchievements: 'artist_achievements',
  series: 'series',
  seriesCast: 'series_cast',
  episodes: 'episodes',
  episodeCast: 'episode_cast',
  galleries: 'galleries',
  gallerySettings: 'gallery_settings',
  news: 'news',
  events: 'events',
  notifications: 'notifications',
  homeFeatures: 'home_features',
} as const

const PUBLIC_STATUSES = new Set([
  'published',
  'airing',
  'active',
  'released',
  'completed',
  'ready',
  'external_seed',
  'scheduled',
])

function enabled(value: unknown) {
  return value !== false && String(value ?? '').toLowerCase() !== 'false'
}

function isPublicRow(row: Record<string, unknown>) {
  if (!enabled(row.enabled)) return false
  if (row.status) return PUBLIC_STATUSES.has(String(row.status))
  return true
}

async function rows(collection: string) {
  const snap = await db.collection(collection).get()
  return snap.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter(isPublicRow)
}

async function valueMap(collection: string, keyField: string, valueField: string) {
  const snap = await db.collection(collection).get()
  const out: Record<string, string> = {}

  snap.docs.forEach((doc) => {
    const row = doc.data()
    if (Object.prototype.hasOwnProperty.call(row, 'enabled') && !enabled(row.enabled)) return
    const key = row[keyField]
    if (key !== undefined && key !== null && String(key) !== '') {
      out[String(key)] = String(row[valueField] ?? '')
    }
  })

  return out
}

publicRouter.get('/bootstrap', async (_req, res, next) => {
  try {
    const [site, ui, theme] = await Promise.all([
      valueMap('site_settings', 'key', 'value'),
      valueMap('ui_text', 'key', 'value'),
      valueMap('theme', 'token', 'value'),
    ])

    const collectionEntries = await Promise.all(
      Object.entries(COLLECTIONS).map(async ([key, collection]) => {
        return [key, await rows(collection)] as const
      }),
    )

    res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=300')
    res.json({
      ok: true,
      generatedAt: new Date().toISOString(),
      site,
      ui,
      theme,
      ...Object.fromEntries(collectionEntries),
    })
  } catch (error) {
    next(error)
  }
})
