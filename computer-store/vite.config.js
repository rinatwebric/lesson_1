import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Serves /api/* in dev with the same handler Vercel runs in production.
function devApi(env) {
  const mount = (server) => {
    server.middlewares.use('/api', (req, res) => {
      const reply = (status, json) => {
        res.statusCode = status
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(json))
      }
      const route = { '/order': 'handleOrder', '/lead': 'handleLead' }[req.url.split('?')[0]]
      if (!route) return reply(404, { ok: false, error: 'not_found' })
      if (req.method !== 'POST') return reply(405, { ok: false, error: 'method_not_allowed' })
      let raw = ''
      req.on('data', (c) => { raw += c; if (raw.length > 100_000) req.destroy() })
      req.on('end', async () => {
        let body
        try { body = JSON.parse(raw) } catch { return reply(400, { ok: false, error: 'bad_json' }) }
        const mod = await import('./server/order.js')
        const { status, json } = await mod[route](body, env)
        reply(status, json)
      })
    })
  }
  return { name: 'dev-api', configureServer: mount, configurePreviewServer: mount }
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), devApi(loadEnv(mode, process.cwd(), ''))],
  server: { port: 3000 },
}))
