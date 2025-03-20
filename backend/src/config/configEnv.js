import dotenv from "dotenv"
dotenv.config()



export const baseDeDatos = process.env.BASE_DE_DATOS
export const usuario = process.env.USUARIOBD
export const contrasena = process.env.CONTRASENABD

//getnet
export const urlGetnet= process.env.URL_GETNET
export const clientId= process.env.CLIENT_ID
export const clientSecret= process.env.CLIENT_SECRET
export const sucursal= process.env.ID_SUCURSAL
export const bearerToken= process.env.BEARER_TOKEN
export const webhook= process.env.WEBHOOK_URL