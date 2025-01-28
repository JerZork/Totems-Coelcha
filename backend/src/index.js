import express from 'express';
import indexRoutes from './routes/index.routes.js';
import fs from 'fs';
import https from 'https';
import cors from 'cors';
import { json } from 'express';
import bodyParser from 'body-parser';
import { conectarDB } from './config/configBD.js';


const app = express();
const PORT = process.env.PORT || 3001;

// Configura CORS para permitir solicitudes desde cualquier origen
app.use(cors({
  origin: 'http://192.168.1.157:5173'
}));

// Leer los certificados SSL
const privateKey = fs.readFileSync('/home/jpalma/Proyecto_Coelcha/wildcard_coelcha_cl.key', 'utf8');
const certificate = fs.readFileSync('/home/jpalma/Proyecto_Coelcha/wildcard_coelcha_cl.crt', 'utf8');
const ca = [
  fs.readFileSync('/home/jpalma/Proyecto_Coelcha/DigiCertCA.crt', 'utf8'),
  fs.readFileSync('/home/jpalma/Proyecto_Coelcha/TrustedRoot.crt', 'utf8')
];

const credentials = { key: privateKey, cert: certificate, ca: ca };
const agent = new https.Agent({
  key: privateKey,
  cert: certificate,
  ca: ca,
  rejectUnauthorized: true
});

app.use(json());
app.use('/api', indexRoutes);


app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});


// const httpsServer = https.createServer( app);

// httpsServer.listen(PORT, () => {
//   console.log(`Servidor ejecutándose en https://coelcha.cl:${PORT}`);
// });

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

await conectarDB();