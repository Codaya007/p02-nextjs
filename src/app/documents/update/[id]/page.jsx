"use client";
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { API_BASEURL } from "@/constants";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchSignatures } from "@/app/signatures/page";
import { fetchDocument } from "../../view/[id]/page";

// export const IVA_PERCENTAJE = 0.12;
const PRICE_REGEX = /^\d{1,}[.,]\d{1,2}$/;
const PAGE_REGEX = /^\d{1,}$/;

const validationSchema = object().shape({
  titulo: string().required("El título es requerido"),
  autor: string().required("El autor es requerido"),
  subtotal: string().matches(PRICE_REGEX, "Ingrese un precio válido como 10.00").required("El subtotal es requerido"),
  iva: string().matches(PRICE_REGEX, "Ingrese un precio válido como 10.00").required("El IVA es requerido"),
  descuento: string().matches(PRICE_REGEX, "Ingrese un precio válido como 10.00").required("El descuento es requerido"),
  total: string().matches(PRICE_REGEX, "Ingrese un precio válido como 10.00").required("El total es requerido"),
  isbn: string().required("El ISBN es requerido"),
  paginas: string().matches(PAGE_REGEX, "Ingrese un número de páginas válido").required("El número de páginas es requerido"),
  foto: string().url("Ingrese una URL válida para la foto").required("La URL de la foto es requerida"),
  materia: string(),
});

export default function DocumentForm({ initialValues }) {
  const router = useRouter();
  const { id: external } = useParams();
  const formOptions = {
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: initialValues || {},
  };
  const [signatures, setSignatures] = useState([]);
  const { register, handleSubmit, formState, reset } = useForm(formOptions);
  const { errors } = formState;
  let token = null;
  let user = null;

  if (window !== undefined) {
    token = window.localStorage.getItem("token");
    user = window.localStorage.user ? JSON.parse(localStorage.getItem("user")) : null;
  }

  const onSubmit = async (data) => {
    console.log({ data });

    // Ejemplo de URL para la creación de un nuevo documento
    const url = `${API_BASEURL}`;

    const body = {
      ...data,
      "user": user?.external,
      external,
      "funcion": "modificarDocumento",
    }

    console.log({ url, body });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "TOKEN-KEY": token,
      },
      body: JSON.stringify(body),
    }).then((res) => res.json());

    const { code, mensaje } = response;

    console.log(response);

    // Redireccionar o mostrar un mensaje de éxito/error según sea necesario
    if (code === 200)
      router.push("/documents");
  };

  useEffect(() => {
    const getSignatures = async () => {
      const sigs = await fetchSignatures();

      setSignatures(sigs)
    }

    getSignatures();
  }, []);

  useEffect(() => {
    const getDocument = async () => {
      const document = await fetchDocument(external, token);

      reset({ ...document, materia: null })
    }

    getDocument();
  }, []);

  return (
    <div className="normal-form document-form-container">
      <h1 className="title-form">Actualizar Documento</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-body">
          <section>
            <div className="form-item">
              <label>Título</label>
              <input {...register("titulo")} type="text" />
              {errors.titulo && <span className="validation-error">{errors.titulo.message}</span>}
            </div>
            <div className="form-item">
              <label>Autor</label>
              <input {...register("autor")} type="text" />
              {errors.autor && <span className="validation-error">{errors.autor.message}</span>}
            </div>
            <div className="form-item">
              <label>ISBN</label>
              <input {...register("isbn")} type="text" />
              {errors.isbn && <span className="validation-error">{errors.isbn.message}</span>}
            </div>
            <div className="form-item">
              <label>Número de Páginas</label>
              <input {...register("paginas")} type="number" />
              {errors.paginas && <span className="validation-error">{errors.paginas.message}</span>}
            </div>
            <div className="form-item">
              <label>Foto (URL)</label>
              <input {...register("foto")} type="text" />
              {errors.foto && <span className="validation-error">{errors.foto.message}</span>}
            </div>
          </section>
          <section>
            <div className="form-item">
              <label>Materia</label>
              <select  {...register("materia")} >
                {signatures.map(signature => <option value={signature.external_id} key={signature.external_id}>{signature.nombre}</option>)}
              </select>
            </div>
            <div className="form-item">
              <label>Subtotal</label>
              <input {...register("subtotal")} type="number" step="0.01" />
              {errors.subtotal && <span className="validation-error">{errors.subtotal.message}</span>}
            </div>
            <div className="form-item">
              <label>IVA</label>
              <input {...register("iva")} type="number" step="0.01" />
              {errors.iva && <span className="validation-error">{errors.iva.message}</span>}
            </div>
            <div className="form-item">
              <label>Descuento</label>
              <input {...register("descuento")} type="number" step="0.01" />
              {errors.descuento && <span className="validation-error">{errors.descuento.message}</span>}
            </div>
            <div className="form-item">
              <label>Total</label>
              <input {...register("total")} type="number" step="0.01" />
              {errors.total && <span className="validation-error">{errors.total.message}</span>}
            </div>
          </section>
        </div>

        <input className="button-primary" type="submit" value="Guardar" />
        <div>
          <Link className="link-primary" href={"/"}>Volver al inicio</Link>
        </div>
      </form>
    </div>
  );
}
