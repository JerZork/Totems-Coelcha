import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: 'coelcha.cl', // Esto asegura que el servidor escuche en este dominio
    https: {
      key: fs.readFileSync('../licencia/wildcard_coelcha_cl.key', 'utf8'),
      cert: fs.readFileSync('../licencia/wildcard_coelcha_cl.crt', 'utf8'),
      ca: [
        fs.readFileSync('../licencia/DigiCertCA.crt', 'utf8'),
        fs.readFileSync('../licencia/TrustedRoot.crt', 'utf8')
      ],
    },
    proxy: {
      '/api': 'https://coelcha.cl:3000'
    },
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})
