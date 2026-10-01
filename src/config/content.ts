import { randomUUID } from 'node:crypto'

export const CONTENT_COLLECTIONS = [
  'site_settings',
  'ui_text',
  'theme',
  'fonts',
  'navigation',
  'socials',
  'message_links',
  'pages',
  'sections',
  'section_items',
  'media',
  'artists',
  'artist_timeline',
  'artist_achievements',
  'series',
  'series_cast',
  'episodes',
  'episode_cast',
  'galleries',
  'gallery_settings',
  'news',
  'events',
  'notifications',
  'home_features',
  'cms_users',
  'redirects',
  'lookups',
] as const

export const ID_FIELDS: Record<string, string> = {
  site_settings: 'key',
  ui_text: 'key',
  theme: 'token',
  fonts: 'font_id',
  navigation: 'nav_id',
  socials: 'social_id',
  message_links: 'link_id',
  pages: 'page_id',
  sections: 'section_id',
  section_items: 'item_id',
  media: 'media_id',
  artists: 'artist_id',
  artist_timeline: 'timeline_id',
  artist_achievements: 'achievement_id',
  series: 'series_id',
  series_cast: 'cast_id',
  episodes: 'episode_id',
  episode_cast: 'episode_cast_id',
  galleries: 'gallery_item_id',
  gallery_settings: 'gallery_setting_id',
  news: 'news_id',
  events: 'event_id',
  notifications: 'notification_id',
  home_features: 'feature_id',
  cms_users: 'user_id',
  redirects: 'redirect_id',
}

export function assertCollection(name: string): asserts name is (typeof CONTENT_COLLECTIONS)[number] {
  if (!(CONTENT_COLLECTIONS as readonly string[]).includes(name)) {
    throw new Error('Unknown CMS collection.')
  }
}

export function makeId(collection: string) {
  return `${collection.replace(/_/g, '-')}-${randomUUID().slice(0, 8)}`
}
