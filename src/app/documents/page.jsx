"use client";
import { FORMAT_ESTADO_DOCUMENT } from "@/constants";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAllDocuments } from "@/services/document.service";
import { useAuth } from "@/context/AuthContext";

export const DOCUMENT_EXAMPLE = {
  "titulo": "El marino que perdió la gracia del mar",
  "autor": "Yukio Mishima",
  "subtotal": "50.0",
  "iva": "6.0",
  "descuento": "20.0",
  "total": "36.0",
  "isbn": "9788420669373",
  "paginas": 100,
  "foto": "https://pictures.abebooks.com/isbn/9788420665566-us.jpg",
  "user": "8c578b19-83e1-11ee-8e9c-5254008b9e28",
  "materia": "f4e195de-833d-11ee-a1d4-581122836c5f",
  "funcion": "guardarDocumento",
  "external": "8c578b19-83e1-11ee-8e9c-5254008b9e28"
}

export function CardDocument({
  titulo, autor, subtotal, iva, total, descuento, isbn, paginas, foto, user, materia, external, estado }) {
  const router = useRouter();

  return <article className="document-card" >
    <div className="document-card-body">
      <section>
        <img src={foto} alt={titulo} />
      </section>
      <section className="details-document">
        <h2 className="document-title">{titulo || "Sin nombre"}</h2>
        <h3 className="document-autor">{autor || "Autor desconocido"}</h3>
        <div className="card-body">
          <div>
            <p>ISBN: {isbn}</p>
            <p>{paginas} pag.</p>
            <p>{FORMAT_ESTADO_DOCUMENT[estado]}</p>
            {/* <h3>Materia: {materia}</h3>
        <h3>Usuario: {user}</h3> */}
          </div>
          <h3 className="document-subtitle">Detalle precio</h3>
          <div className="prices">
            <div>
              <h3>Subtotal</h3>
              <p>{subtotal}</p>
            </div>
            <div>
              <h3>IVA</h3>
              <p>{iva}</p>
            </div>
            <div>
              <h3>Descuento</h3>
              <p>{descuento}</p>
            </div>
            <div>
              <h3>Total</h3>
              <p>{total}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
    <div className="buttons-card">
      <button onClick={() => router.push(`/documents/view/${external}`)} className="button-primary">Ver</button>
      <button onClick={() => router.push(`/documents/update/${external}`)} className="button-primary">Editar</button>
      <button onClick={() => router.push(`/documents/update/status/${external}`)} className="button-primary">Cambiar estado</button>
    </div>
  </article>
}

export default function Documents() {
  // const [documents, setDocuments] = useState([DOCUMENT_EXAMPLE, DOCUMENT_EXAMPLE]);
  const [documents, setDocuments] = useState(null);
  const { user, token } = useAuth();

  const fetchDocuments = async () => {
    try {
      const docs = await getAllDocuments(user?.external, token);

      setDocuments(docs);
    } catch (error) {
      alert(error.message);
    }
  }

  useEffect(() => {
    if (user) {
      fetchDocuments();
    } else {
      setDocuments(null)
    }
  }, [user]);

  return (
    <div className="main-container">
      <h1>Documentos</h1>
      <div className="buttons">
        <Link href={"/documents/create"} className="button-primary"> + Crear nuevo</Link>
      </div>
      {!user && <div><Link href={"/login"}>INICIE SESIÓN</Link> PARA PODER CARGAR LOS DOCUMENTOS</div>}
      {documents ?
        <div className="items-container">
          {
            documents.map((doc, i) => <CardDocument {...doc} key={i} />)
          }
        </div>
        : <div>No hay documentos</div>
      }
    </div>
  );
}