import axios from "axios";

export async function PostAbonos(body) {
  try {


    const response = await axios.post(`/api/abono`, body);
    console.log("response");
    console.log(response.data.message);
  

    return response.data.message;
  } catch (error) {
    console.log("Error en postAbonos", error.response.data.message);
    console.error("Error en la consulta sql de obtener abonoss", error.response);
    throw new Error(`${error.response.data.message}`);
  }
}
