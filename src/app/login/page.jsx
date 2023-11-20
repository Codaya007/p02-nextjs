"use client"
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// import Image from "next/image";
import Link from "next/link";
import { API_BASEURL } from "@/constants";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const validationSchema = object().shape({
    identificador: string().matches(/^\d{10}$/, "Ingrese un identificador válido de 10 caracteres")
      .required("Ingrese un identificador"),
    clave: string()
      .required("Contraseña requerida"),
  });

  const formOptions = {
    resolver: yupResolver(validationSchema),
    // mode: "onBlur",
    mode: "onChange",
  };
  const { register, handleSubmit, formState } = useForm(formOptions)
  const { errors } = formState;

  const handleLogin = async (data) => {
    console.log({ data });

    const url = `${API_BASEURL}?funcion=materias`;

    const body = JSON.stringify({ ...data, "funcion": "sesion" })
    const loginResponse = await fetch(url, {
      method: "POST",
      body,
    }).then(res => res.json());
    const { jwt, code, msg } = loginResponse;

    if (code === 200) {
      // Si tuve una respuesta exitosa, almaceno la info obtenida
      localStorage.setItem("token", jwt);
      localStorage.setItem("user", JSON.stringify(loginResponse));

      router.push("/signatures");
    } else {
      alert(`Ha ocurrido un error al iniciar sesión: ${msg || "Error desconocido"}`);
    }

  }

  return (
    <div className="normal-form">
      {/* <section>
        <Image
          src={"/TempLogo.png"}
          width={120}
          height={70}
        />
      </section> */}
      <form onSubmit={handleSubmit(handleLogin)}>
        <h1 className="title-form">Iniciar sesión</h1>
        <div className="form-item">
          <label>Identificador</label>
          <input {...register("identificador")} type="text" key={"identificador"} />
          {errors.identificador && <span className="validation-error">{errors.identificador.message}</span>}
        </div>
        <div className="form-item">
          <label>Clave</label>
          <input {...register("clave")} type="password" key={"clave"} />
          {errors.clave && <span className="validation-error">{errors.clave.message}</span>}
        </div>
        <input className="button-primary" type="submit" value="Iniciar sesión" />
        <div><Link className="link-primary" href={"forgot-clave"}>¿Has olvidado tu contraseña?</Link></div>
      </form>
    </div>
  );
} 