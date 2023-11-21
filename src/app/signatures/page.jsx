"use client";
import { getAllSignatures } from "@/services/signature.service";
import { useEffect, useState } from "react";

export function CardSignature({ external_id, estado, nombre, i }) {
  return <div className="card" key={external_id}>
    <h2 className="title">{nombre || "Sin nombre"}</h2>
    <div>
      <h3>Estado</h3>
      <p>{estado}</p>
    </div>
  </div>
}

export default function Signatures() {
  const [signatures, setSignatures] = useState(null);

  const loadSignatures = async () => {
    const signatures = await getAllSignatures();

    setSignatures(signatures)
  }

  useEffect(() => {
    loadSignatures();
  }, []);

  return (
    <div className="main-container">
      <h1>Materias</h1>
      {signatures ?
        <div className="items-container">
          {
            signatures.map((signature, i) => <CardSignature {...signature} key={i} />)
          }
        </div> :
        <div>No hay materias</div>
      }    </div>
  );
}