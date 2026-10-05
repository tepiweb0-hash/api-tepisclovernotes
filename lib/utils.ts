export function safeHref(value?: string, fallback = '#') {
  if (!value) return fallback
  if (value.startsWith('/')) return value
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol) ? value : fallback
  } catch { return fallback }
}

export function formatDate(value?: string, withYear = true) {
  if (!value) return ''
  const date = new Date(value.includes('T') ? value : `${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', ...(withYear ? { year: 'numeric' } : {}) }).format(date)
}

export function formatLongDate(value?: string) {
  if (!value) return ''
  const date = new Date(value.includes('T') ? value : `${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en', { weekday:'long', month:'long', day:'numeric', year:'numeric' }).format(date)
}

export function formatTime12(value?: string) {
  if (!value) return ''
  const match = String(value).match(/^(\d{1,2}):(\d{2})/)
  if (!match) return value
  const hour = Number(match[1])
  const minute = match[2]
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const h = hour % 12 || 12
  return `${h}:${minute} ${suffix}`
}

export function timezoneLabel(value?: string) {
  const tz = String(value || 'Asia/Bangkok')
  if (/Asia\/(Bangkok|Phnom_Penh|Vientiane)/i.test(tz) || /ICT|GMT\+7|UTC\+7/i.test(tz)) return 'ICT (UTC+7 / Bangkok Time)'
  if (/Asia\/Manila/i.test(tz)) return 'PHT (UTC+8 / Manila Time)'
  return tz.replace(/_/g,' ')
}

export function releaseLabel(date?: string, time?: string, timezone?: string) {
  const parts = [formatDate(date), formatTime12(time)]
  if (time) parts.push(timezoneLabel(timezone))
  return parts.filter(Boolean).join(' • ')
}

export function pickNews(rows: any[], mode = '2_newest_1_hot') {
  const published = rows.filter((r) => r.status === 'published')
  const newest = [...published].sort((a,b) => String(b.publish_date).localeCompare(String(a.publish_date)))
  const hot = [...published].filter((r) => r.hot === true || String(r.hot).toLowerCase() === 'true')
    .sort((a,b) => Number(b.hot_score || 0) - Number(a.hot_score || 0))
  const unique = (items: any[]) => Array.from(new Map(items.map(i => [i.news_id, i])).values())
  if (mode === '3_newest') return newest.slice(0,3)
  if (mode === '1_newest_2_hot') return unique([...newest.slice(0,1), ...hot.slice(0,2), ...newest]).slice(0,3)
  return unique([...newest.slice(0,2), ...hot.slice(0,1), ...newest]).slice(0,3)
}

export function relatedNews(rows: any[], seriesId?: string, artistId?: string, limit = 3) {
  return rows.filter(n => n.status === 'published').filter(n => {
    const seriesMatch = seriesId && (String(n.related_series_id || '') === seriesId || String(n.tags || '').includes(seriesId))
    const artistMatch = artistId && (String(n.related_artist_id || '') === artistId || String(n.related_artist_ids || '').split(',').map((x:string)=>x.trim()).includes(artistId))
    return seriesMatch || artistMatch
  }).sort((a,b)=>String(b.publish_date).localeCompare(String(a.publish_date))).slice(0,limit)
}
