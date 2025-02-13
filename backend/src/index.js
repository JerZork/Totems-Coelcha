import express from 'express';
import indexRoutes from './routes/index.routes.js';
import fs from 'fs';
import https from 'https';
import cors from 'cors';
import pkg from 'body-parser';
import { conectarDB } from './config/configBD.js';
import bodyParser from 'body-parser';

const { json } = pkg;

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';


// Leer los certificados SSL
const privateKey = fs.readFileSync('../licencia/wildcard_coelcha_cl.key', 'utf8');
const certificate = fs.readFileSync('../licencia/wildcard_coelcha_cl.crt', 'utf8');
const ca = [
  fs.readFileSync('../licencia/DigiCertCA.crt', 'utf8'),
  fs.readFileSync('../licencia/TrustedRoot.crt', 'utf8')
];

const credentials = { key: privateKey, cert: certificate, ca: ca };

const agent = new https.Agent({
  key: privateKey,
  cert: certificate,
  ca: ca
});

// Configura CORS para permitir solicitudes desde cualquier origen
app.use(cors());
app.use(bodyParser.json());

app.use('/api', indexRoutes);

app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

// Iniciar el servidor HTTPS
https.createServer(credentials, app).listen(PORT, HOST, () => {
  console.log(`Servidor HTTPS corriendo en https://${HOST}:${PORT}`);
});

await conectarDB();