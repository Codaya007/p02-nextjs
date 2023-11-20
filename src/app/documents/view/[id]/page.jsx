"use client";
import Link from "next/link";
import { API_BASEURL } from "@/constants";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
// import { useRouter } from 'next/router';

export const fetchDocument = async (external, token) => {
  try {
    // Ejemplo de URL para la creación de un nuevo documento
    const url = `${API_BASEURL}?funcion=obtener_documento&external=${external}`;
    const response = await fetch(url, {
      method: "GET", // Cambiar a "PUT" para edición
      headers: {
        "Content-Type": "application/json",
        "TOKEN-KEY": token,
      },
    }).then((res) => res.json());

    console.log({ response });

    const { code, mensaje, datos = [] } = response;

    if (code === 200) {
      const document = datos[0];

      return document;
    } else {
      throw new Error(mensaje);
    }
  } catch (error) {
    throw new Error(error.message || "Algo salió mal");
  }
};

export default function DocumentForm({ initialValues }) {
  const router = useRouter();
  const params = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const external = params?.id;
  let token = null;

  if (window !== undefined) {
    token = window.localStorage.getItem("token");
  }

  const getDocument = async () => {
    setLoading(true);
    try {
      const doc = await fetchDocument(external, token);

      setDocument(doc);
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token)
      getDocument();
  }, [token]);

  return (
    <div className="normal-form document-form-container">
      <h1 className="title-form">DETALLE DOCUMENTO</h1>
      {
        loading ?
          <div>Cargando...</div> :
          <form>
            <div className="form-body">
              <section>
                <div className="form-item">
                  <label>Título</label>
                  <input contentEditable={false} value={document?.titulo} type="text" />
                </div>
                <div className="form-item">
                  <label>Autor</label>
                  <input contentEditable={false} type="text" value={document?.autor} />
                </div>
                <div className="form-item">
                  <label>ISBN</label>
                  <input value={document?.isbn} contentEditable={false} type="text" />
                </div>
                <div className="form-item">
                  <label>Número de Páginas</label>
                  <input value={document?.paginas} contentEditable={false} type="text" />
                </div>
                <div className="form-item">
                  <label>Foto (URL)</label>
                  <input value={document?.foto} contentEditable={false} type="text" />
                </div>
              </section>
              <section>
                <div className="form-item">
                  <label>Subtotal</label>
                  <input value={document?.subtotal} contentEditable={false} type="text" step="0.01" />
                </div>
                <div className="form-item">
                  <label>IVA</label>
                  <input value={document?.iva} contentEditable={false} type="text" step="0.01" />
                </div>
                <div className="form-item">
                  <label>Descuento</label>
                  <input value={document?.descuento} contentEditable={false} type="text" step="0.01" />
                </div>
                <div className="form-item">
                  <label>Total</label>
                  <input value={document?.total} contentEditable={false} type="text" />
                </div>
              </section>
            </div>

            <input className="button-primary" type="submit" value="Ir a editar" onClick={() => router.push(`/documents/update/${external}`)} />
            <div>
              <Link className="link-primary" href={"/"}>Volver al inicio</Link>
            </div>
          </form>}
    </div>
  );
}
