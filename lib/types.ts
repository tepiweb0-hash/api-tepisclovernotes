export type AnyRow = Record<string, any>

export type Bootstrap = {
  ok: boolean
  generatedAt?: string
  site: Record<string, string>
  ui: Record<string, string>
  theme: Record<string, string>
  fonts: AnyRow[]
  navigation: AnyRow[]
  socials: AnyRow[]
  messageLinks: AnyRow[]
  pages: AnyRow[]
  sections: AnyRow[]
  sectionItems: AnyRow[]
  media: AnyRow[]
  artists: AnyRow[]
  artistTimeline: AnyRow[]
  artistAchievements: AnyRow[]
  series: AnyRow[]
  seriesCast: AnyRow[]
  episodes: AnyRow[]
  episodeCast: AnyRow[]
  galleries: AnyRow[]
  gallerySettings: AnyRow[]
  news: AnyRow[]
  events: AnyRow[]
  notifications: AnyRow[]
  homeFeatures: AnyRow[]
  error?: string
}
