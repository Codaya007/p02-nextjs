import { formatearNumero } from "@/utils";

const { API_BASEURL } = require("@/constants");

export const createDocument = async (data, userExternal, token) => {
  if (!token) {
    throw new Error("Inicie sesión para continuar");
  }
  // Ejemplo de URL para la creación de un nuevo documento
  const url = API_BASEURL;

  const body = {
    ...data,
    user: userExternal,
    funcion: "guardarDocumento",
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "TOKEN-KEY": token,
    },
    body: JSON.stringify(body),
  }).then((res) => res.json());

  const { code, mensaje, msg } = response;

  console.log(response);

  // Redireccionar o mostrar un mensaje de éxito/error según sea necesario
  if (code === 200) {
    // router.push("/documents");
    return mensaje;
  }

  throw new Error(
    `Ha ocurrido un error: ${mensaje || msg || "Error desconocido"}`
  );
};

export const getAllDocuments = async (userExternal, token) => {
  if (!token) {
    throw new Error("Inicie sesión para continuar");
  }

  const url = `${API_BASEURL}?funcion=listar_documento_user&external=${userExternal}`;

  const documentsResponse = await fetch(url, {
    method: "GET",
    headers: {
      "TOKEN-KEY": token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

  const { code, datos, mensaje, msg } = documentsResponse;

  if (code === 200) {
    return datos;
  }

  throw new Error(
    `Ha ocurrido un error: ${mensaje || msg || "Error desconocido"}`
  );
};

export const getDocumentById = async (external, token) => {
  if (!token) {
    throw new Error("Inicie sesión para continuar");
  }

  // Ejemplo de URL para la creación de un nuevo documento
  const url = `${API_BASEURL}?funcion=obtener_documento&external=${external}`;

  const response = await fetch(url, {
    method: "GET", // Cambiar a "PUT" para edición
    headers: {
      "Content-Type": "application/json",
      "TOKEN-KEY": token,
    },
  }).then((res) => res.json());

  const { code, mensaje, datos = [], msg } = response;

  if (code === 200) {
    const document = datos[0];

    document.descuento = formatearNumero(document.descuento);
    document.total = formatearNumero(document.total);
    document.iva = formatearNumero(document.iva);
    document.subtotal = formatearNumero(document.subtotal);

    return document;
  }

  throw new Error(
    `Ha ocurrido un error: ${mensaje || msg || "Error desconocido"}`
  );
};

export const updateDocumentById = async (data, userExternal, id, token) => {
  if (!token) {
    throw new Error("Inicie sesión para continuar");
  }

  // Ejemplo de URL para la creación de un nuevo documento
  const url = `${API_BASEURL}`;

  const body = {
    ...data,
    user: userExternal,
    external: id,
    funcion: "modificarDocumento",
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "TOKEN-KEY": token,
    },
    body: JSON.stringify(body),
  }).then((res) => res.json());

  const { code, mensaje, msg } = response;

  // Redireccionar o mostrar un mensaje de éxito/error según sea necesario
  if (code === 200) {
    return mensaje;
  }

  throw new Error(
    `Ha ocurrido un error: ${(mensaje, msg || "Error desconocido")}`
  );
};

export const updateStatusDocumentById = async (external, status, token) => {
  if (!token) {
    throw new Error("Inicie sesión para continuar");
  }

  // Ejemplo de URL para la creación de un nuevo documento
  const url = `${API_BASEURL}?funcion=cambiar_estado&external=${external}&estado=${
    status === "1"
  }`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      // "Content-Type": "application/json",
      "TOKEN-KEY": token,
    },
  }).then((res) => res.json());

  const { code, mensaje, msg } = response;

  // Redireccionar o mostrar un mensaje de éxito/error según sea necesario
  if (code === 200) {
    // router.push("/documents");
    return mensaje;
  }

  throw new Error(
    `Ha ocurrido un error: ${mensaje || msg || "Error desconocido"}`
  );
};
