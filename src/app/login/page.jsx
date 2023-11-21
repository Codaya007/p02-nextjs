"use client"
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth.service";
import { useAuth } from "@/context/AuthContext";

const validationSchema = object().shape({
  identificador: string().matches(/^\d{10}$/, "Ingrese un identificador válido de 10 caracteres")
    .required("Ingrese un identificador"),
  clave: string()
    .required("Contraseña requerida"),
});

export default function Login() {
  const { user, token, loginUser, logoutUser } = useAuth();

  const router = useRouter();
  const formOptions = {
    resolver: yupResolver(validationSchema),
    // mode: "onBlur",
    mode: "onChange",
  };
  const { register, handleSubmit, formState } = useForm(formOptions)
  const { errors } = formState;

  const handleLogin = async (data) => {
    try {
      const loginResponse = await login(data);

      // Si tuve una respuesta exitosa, almaceno la info obtenida
      localStorage.setItem("token", loginResponse.jwt);
      localStorage.setItem("user", JSON.stringify(loginResponse));
      loginUser(loginResponse, loginResponse.jwt);

      router.push("/signatures");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="normal-form">
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