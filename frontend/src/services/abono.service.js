import axios from "axios";

export async function PostAbonos(body) {
  try {
    console.log("entrando a postAbonos", body);

    const results = [];
    body.forEach(async (item) => {

      const response = await axios.post(`/api/abono`, item);
      results.push(response.data);



    });

    return results;
  } catch (error) {
    console.error("Error en la consulta sql de obtener abonos", error);
    throw new Error(`Error en la consulta sql de obtener abonos: ${error.message}`);
  }
}