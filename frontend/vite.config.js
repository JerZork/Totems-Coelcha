import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // server: {
  //   host: 'kiosko.coelcha.cl',
  //   https: {
  //     key: fs.readFileSync('/home/jpalma/Proyecto_Coelcha/wildcard_coelcha_cl.key', 'utf8'),
  //     cert: fs.readFileSync('/home/jpalma/Proyecto_Coelcha/wildcard_coelcha_cl.crt', 'utf8'),
  //     ca: [
  //       fs.readFileSync('/home/jpalma/Proyecto_Coelcha/DigiCertCA.crt', 'utf8'),
  //       fs.readFileSync('/home/jpalma/Proyecto_Coelcha/TrustedRoot.crt', 'utf8'),
  //     ],
  //   },
  // },
})
