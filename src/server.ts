import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { requireCmsAuth } from './middleware/auth.js'
import { bootstrapRouter } from './routes/bootstrap.js'
import { contentRouter } from './routes/content.js'
import { mediaRouter } from './routes/media.js'
import { migrationRouter } from './routes/migration.js'
import { publicRouter } from './routes/public.js'

const app = express()
const port = Number(process.env.PORT || 8080)

const allowedOrigins = (process.env.CMS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean)

app.disable('x-powered-by')
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Referrer-Policy', 'no-referrer')
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  next()
})
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }
      return callback(new Error('Origin is not allowed by CORS.'))
    },
    credentials: true,
  }),
)
app.use(express.json({ limit: '2mb' }))

app.get('/', (_req, res) => {
  res.json({
    ok: true,
    service: 'tepisclovernotes-api',
    message: 'Tepis Clover Notes API is running.',
  })
})

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'tepisclovernotes-api',
    time: new Date().toISOString(),
  })
})

// Public, read-only content bridge for the Next.js website.
// This intentionally stays outside CMS authentication.
app.use('/public', publicRouter)

app.use('/api', requireCmsAuth)
app.use('/api/bootstrap', bootstrapRouter)
app.use('/api/content', contentRouter)
app.use('/api/media', mediaRouter)
app.use('/api/migration', migrationRouter)

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found.' })
})

app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(err)
    res.status(500).json({
      error: err instanceof Error ? err.message : 'Unexpected server error.',
    })
  },
)

app.listen(port, () => {
  console.log(`Tepis Clover Notes API listening on ${port}`)
})
