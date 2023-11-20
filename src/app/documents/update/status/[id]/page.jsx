"use client";
import Link from "next/link";
import { API_BASEURL, FORMAT_ESTADO_DOCUMENT } from "@/constants";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchDocument } from "../../../view/[id]/page";

export default function DocumentForm({ initialValues }) {
  const router = useRouter();
  const { id: external } = useParams();
  let token = null;
  const [document, setDocument] = useState(null);
  const [status, setStatus] = useState(false);

  if (window !== undefined) {
    token = window.localStorage.getItem("token");
  }

  const handleChangeStatus = async (e) => {
    console.log({ e });
    e.preventDefault();

    // Ejemplo de URL para la creación de un nuevo documento
    const url = `${API_BASEURL}?funcion=cambiar_estado&external=${external}&estado=${status === "1"}`;

    console.log({ url });

    const response = await fetch(url, {
      method: "GET",
      headers: {
        // "Content-Type": "application/json",
        "TOKEN-KEY": token,
      },
    }).then((res) => res.json());

    console.log(response);

    const { code, mensaje } = response;

    // Redireccionar o mostrar un mensaje de éxito/error según sea necesario
    if (code === 200) {
      router.push("/documents");
    }
  };

  useEffect(() => {
    const getDocument = async () => {
      try {
        const document = await fetchDocument(external, token);

        setDocument({ ...document, materia: null })
        setStatus(document.estado);
      } catch (error) {
        alert(`Ha ocurrido un error: ${error.message || "Error desconocido"}`)
      }
    }

    getDocument();
  }, []);

  const onChange = e => {
    setStatus(e.target.value);
  }

  return (
    <div className="normal-form document-form-container">
      <h1 className="title-form">Actualizar estado documento</h1>
      <form onSubmit={handleChangeStatus}>
        <h2>{document?.titulo}</h2>
        <p>Estado actual: {FORMAT_ESTADO_DOCUMENT[document?.estado] || "-"}</p>
        <div className="form-item">
          <label>Estado</label>
          <select value={status} onChange={onChange}>
            <option value="1" key="1">Activo</option>
            <option value="0" key="0">Inactivo</option>
          </select>
        </div>

        <input className="button-primary" type="submit" value={"Guardar estado"} />
        <div>
          <Link className="link-primary" href={"/"}>Volver al inicio</Link>
        </div>
      </form>
    </div>
  );
}
