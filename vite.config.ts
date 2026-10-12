import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { defineConfig, type Connect, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

interface DevRequest {
  url?: string
  method?: string
}

interface DevResponse {
  statusCode: number
  setHeader(name: string, value: string): void
  end(chunk?: Uint8Array | string): void
}

type FunctionModule = { default: (request: Request) => Promise<Response> }

function concat(chunks: Uint8Array[]) {
  const out = new Uint8Array(chunks.reduce((total, chunk) => total + chunk.length, 0))
  let offset = 0
  for (const chunk of chunks) {
    out.set(chunk, offset)
    offset += chunk.length
  }
  return out
}

const ROUTES: { path: string; file: string }[] = [
  { path: '/api/github', file: 'github.mts' },
  { path: '/api/contact', file: 'contact.mts' },
]

function attach(app: Connect.Server, load: (file: string) => Promise<FunctionModule>) {
  app.use('/api/track', (_req: DevRequest, res: DevResponse) => {
    res.statusCode = 204
    res.end()
  })

  app.use((req: DevRequest, res: DevResponse, next: () => void) => {
    if (req.method === 'POST' && req.url === '/') {
      res.statusCode = 200
      res.end('ok')
      return
    }
    next()
  })

  for (const route of ROUTES) {
    app.use(route.path, async (req: DevRequest & NodeJS.ReadableStream, res: DevResponse) => {
      try {
        const mod = await load(route.file)
        const chunks: Uint8Array[] = []
        if (req.method === 'POST') {
          for await (const chunk of req) chunks.push(typeof chunk === 'string' ? new TextEncoder().encode(chunk) : chunk)
        }
        const response = await mod.default(
          new Request(`http://localhost${req.url ?? '/'}`, {
            method: req.method ?? 'GET',
            headers: { 'Content-Type': 'application/json' },
            body: chunks.length > 0 ? concat(chunks) : undefined,
          }),
        )
        res.statusCode = response.status
        response.headers.forEach((value, key) => res.setHeader(key, value))
        res.end(new Uint8Array(await response.arrayBuffer()))
      } catch (error) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: String(error) }))
      }
    })
  }
}

function netlifyFunctionsLocal(): Plugin {
  return {
    name: 'netlify-functions-local',
    configureServer(server) {
      attach(server.middlewares, (file) => server.ssrLoadModule(`/netlify/functions/${file}`) as Promise<FunctionModule>)
    },
    configurePreviewServer(server) {
      attach(server.middlewares, (file) => import(pathToFileURL(resolve('netlify/functions', file)).href) as Promise<FunctionModule>)
    },
  }
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), netlifyFunctionsLocal()],
  build: {
    outDir: 'dist',
    sourcemap: mode !== 'production',
    assetsInlineLimit: (file: string) => (/\.(woff2?|ttf|otf)$/.test(file) ? false : undefined),
  },
}))
