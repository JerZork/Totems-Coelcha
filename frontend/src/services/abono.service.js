import axios from "axios";

export async function PostAbonos(body) {
  try {
    console.log("entrando a postAbonos", body);

    const response = await axios.post(`/api/abono`, body);
    console.log("response");
    console.log(response.data.message);
    console.log("saliendo del service");

    return response.data.message;
  } catch (error) {
    console.log("Error en postAbonos", error.response.data.message);
    console.error("Error en la consulta sql de obtener abonoss", error.response);
    throw new Error(`${error.response.data.message}`);
  }
}
