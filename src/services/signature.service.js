import { API_BASEURL } from "@/constants";

export const getAllSignatures = async () => {
  const url = `${API_BASEURL}?funcion=materias`;

  const signaturesResponse = await fetch(url, {
    method: "GET",
  }).then((res) => res.json());

  const { code, datos, mensaje, msg } = signaturesResponse;

  if (code === 200) {
    // setSignatures(datos)
    return datos;
  } else {
    throw new Error(
      `Ha ocurrido un error: ${mensaje || msg || "Error desconocido"}`
    );
  }
};
