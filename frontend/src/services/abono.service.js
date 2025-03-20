import axios from "axios";

export async function PostAbonos(body) {
  try {
    console.log("entrando a postAbonos", body);


      const response = await axios.post(`/api/abono`, body);
 

    return results;
  } catch (error) {
    console.log("Error en postAbonos", error.response.data.message);
    console.error("Error en la consulta sql de obtener abonoss", error.response);
    throw new Error(`${error.response.data.message}`);
  }
}