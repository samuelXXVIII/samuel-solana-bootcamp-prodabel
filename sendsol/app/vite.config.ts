import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  define: {
    "global": {},
  },
  resolve: {
    alias: {
      buffer: "buffer/",
    },
  },
  optimizeDeps: {
    include: ["buffer"],
  },
  server: {
    headers: {
      "Content-Security-Policy": "script-src 'self' 'unsafe-eval' 'unsafe-inline' https: blob:; worker-src 'self' blob:; object-src 'none';"
    }
  }
})
