"use client";
import { useAuth } from "@/context/AuthContext";
import { getDocumentById } from "@/services/document.service";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function DocumentForm({ }) {
  const router = useRouter();
  const params = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const external = params?.id;
  const { token } = useAuth();

  const fetchDocument = async () => {
    setLoading(true);
    try {
      const doc = await getDocumentById(external, token);

      setDocument(doc);
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token)
      fetchDocument();
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
                  <input readOnly={true} contentEditable={false} value={document?.titulo} type="text" />
                </div>
                <div className="form-item">
                  <label>Autor</label>
                  <input readOnly={true} contentEditable={false} type="text" value={document?.autor} />
                </div>
                <div className="form-item">
                  <label>ISBN</label>
                  <input readOnly={true} value={document?.isbn} contentEditable={false} type="text" />
                </div>
                <div className="form-item">
                  <label>Número de Páginas</label>
                  <input readOnly={true} value={document?.paginas} contentEditable={false} type="text" />
                </div>
                <div className="form-item">
                  <label>Foto (URL)</label>
                  <input readOnly={true} value={document?.foto} contentEditable={false} type="text" />
                </div>
              </section>
              <section>
                <div className="form-item">
                  <label>Subtotal</label>
                  <input readOnly={true} value={document?.subtotal} contentEditable={false} type="text" step="0.01" />
                </div>
                <div className="form-item">
                  <label>IVA</label>
                  <input readOnly={true} value={document?.iva} contentEditable={false} type="text" step="0.01" />
                </div>
                <div className="form-item">
                  <label>Descuento</label>
                  <input readOnly={true} value={document?.descuento} contentEditable={false} type="text" step="0.01" />
                </div>
                <div className="form-item">
                  <label>Total</label>
                  <input readOnly={true} value={document?.total} contentEditable={false} type="text" />
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
