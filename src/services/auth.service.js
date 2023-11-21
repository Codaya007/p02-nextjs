const { API_BASEURL } = require("@/constants");

export const login = async (data) => {
  const url = `${API_BASEURL}?funcion=materias`;

  const body = JSON.stringify({ ...data, funcion: "sesion" });
  const loginResponse = await fetch(url, {
    method: "POST",
    body,
  }).then((res) => res.json());

  const { jwt, code, msg, mensaje } = loginResponse;

  if (code === 200 && jwt) {
    // Si tuve una respuesta exitosa, almaceno la info obtenida
    // localStorage.setItem("token", jwt);
    // localStorage.setItem("user", JSON.stringify(loginResponse));

    // router.push("/signatures");
    return loginResponse;
  }

  throw new Error(
    `Ha ocurrido un error: ${mensaje || msg || "Error desconocido"}`
  );
};
