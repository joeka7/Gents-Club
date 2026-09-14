import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ServerResponse } from 'node:http'

const API_TARGET = 'http://localhost:3001'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward all /api/* requests to the Express server during development
      '/api': {
        target: API_TARGET,
        changeOrigin: true,
        // Without this the browser only sees ERR_CONNECTION_REFUSED, which looks
        // like a broken form rather than a missing server. Log the real cause in
        // the terminal and answer with JSON the client can display.
        configure: (proxy) => {
          proxy.on('error', (err, _req, res) => {
            const down = (err as NodeJS.ErrnoException).code === 'ECONNREFUSED'
            console.error(
              down
                ? `\n  ✗  API server not reachable at ${API_TARGET}.\n     Start both processes with: npm run dev\n`
                : `\n  ✗  API proxy error: ${err.message}\n`,
            )
            if (res instanceof ServerResponse && !res.headersSent) {
              res.writeHead(503, { 'Content-Type': 'application/json' })
              res.end(
                JSON.stringify({
                  success: false,
                  error: down
                    ? 'API server is not running. Start it with `npm run dev`.'
                    : 'API server request failed.',
                }),
              )
            }
          })
        },
      },
    },
  },
})
