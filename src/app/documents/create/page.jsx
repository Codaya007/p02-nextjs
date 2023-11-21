"use client";
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createDocument } from "@/services/document.service";
import { getAllSignatures } from "@/services/signature.service";
import { useAuth } from "@/context/AuthContext";
import { calculateIva, calculateTotal, formatearNumero } from "@/utils";

// export const IVA_PERCENTAJE = 0.12;
const PRICE_REGEX = /^\d{1,}[.,]\d{1,2}$/;
const PAGE_REGEX = /^\d{1,}$/;

const validationSchema = object().shape({
  titulo: string().required("El título es requerido"),
  autor: string().required("El autor es requerido"),
  subtotal: string().matches(PRICE_REGEX, "Ingrese un precio válido como 10.00").required("El subtotal es requerido").default("0.00"),
  // iva: string().matches(PRICE_REGEX, "Ingrese un precio válido como 10.00").required("El IVA es requerido").default("0.00"),
  descuento: string().matches(PRICE_REGEX, "Ingrese un precio válido como 10.00").required("El descuento es requerido").default("0.00"),
  // total: string().matches(PRICE_REGEX, "Ingrese un precio válido como 10.00").required("El total es requerido").default("0.00"),
  isbn: string().required("El ISBN es requerido"),
  paginas: string().matches(PAGE_REGEX, "Ingrese un número de páginas válido").required("El número de páginas es requerido"),
  foto: string().url("Ingrese una URL válida para la foto").required("La URL de la foto es requerida"),
  materia: string().required("Materia requerida"),
});

export default function DocumentForm({ initialValues }) {
  const router = useRouter();
  const formOptions = {
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: initialValues || { total: "0.00", subtotal: "0.00", iva: "0.00", descuento: "0.00" },
  };
  const [signatures, setSignatures] = useState([]);
  const [total, setTotal] = useState("0.00");
  const [iva, setIva] = useState("0.00");
  const { register, handleSubmit, formState, watch } = useForm(formOptions);
  const { errors } = formState;
  const { user, token } = useAuth();

  const subtotal = watch("subtotal");
  const descuento = watch("descuento");

  const onSubmit = async (data) => {
    try {
      if (parseFloat(data.descuento) > parseFloat(data.subtotal)) {
        throw new Error("El descuento no puede ser mayor al subtotal")
      }

      await createDocument({ ...data, total, iva }, user?.external, token);

      router.push("/documents");
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    const fetchSignatures = async () => {
      const sigs = await getAllSignatures();

      setSignatures(sigs)
    }

    fetchSignatures();
  }, []);

  useEffect(() => {
    const onChangeSubtotalOrDiscount = () => {
      const newTotal = calculateTotal(subtotal, descuento);
      const newIva = calculateIva(subtotal, descuento);

      setTotal(formatearNumero(newTotal));
      setIva(formatearNumero(newIva));
    };

    onChangeSubtotalOrDiscount();
  }, [subtotal, descuento]);

  return (
    <div className="normal-form document-form-container">
      <h1 className="title-form">Crear Documento</h1>
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
              {errors.materia && <span className="validation-error">{errors.materia.message}</span>}
            </div>
            <div className="form-item">
              <label>Subtotal</label>
              <input {...register("subtotal")} type="number" step="0.01" />
              {errors.subtotal && <span className="validation-error">{errors.subtotal.message}</span>}
            </div>
            <div className="form-item">
              <label>IVA</label>
              <input readOnly={true} contentEditable={false} type="number" step="0.01" value={iva} />
              {/* {errors.iva && <span className="validation-error">{errors.iva.message}</span>} */}
            </div>
            <div className="form-item">
              <label>Descuento</label>
              <input {...register("descuento")} type="number" step="0.01" />
              {errors.descuento && <span className="validation-error">{errors.descuento.message}</span>}
            </div>
            <div className="form-item">
              <label>Total</label>
              <input readOnly={true} contentEditable={false} type="number" step="0.01" value={total} />
              {/* {errors.total && <span className="validation-error">{errors.total.message}</span>} */}
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
