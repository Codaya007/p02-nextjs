"use client";
import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function NavBar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verifica si hay algo en el localStorage al cargar el componente
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const jsonUser = JSON.parse(storedUser)
      console.log({ jsonUser });
      setUser(jsonUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null)
  }

  return (
    <header className="app-header">
      <Link href={"/"} className="logo">
        <Image
          src="/Next.svg"
          width={130}
          height={70}
          alt="Logo"
        />
      </Link>
      <ul className="list-routes">
        <li>
          <Link href={"/documents"}>CRUD documentos</Link>
        </li>
        <li>
          <Link href={"/signatures"}>Materias</Link>
        </li>
      </ul>
      {user ?
        <div className="user-header">
          <h2 className="header-username">{user.usuario}</h2>
          <img src={"https://avatars.githubusercontent.com/u/68254166?v=4"} alt="User photo" />
          <button onClick={handleLogout} className="button-primary logout-button">Salir</button>
        </div>
        :
        <div className="user-header">
          <Link className="button-primary" href={"/login"}>Acceder</Link>
        </div>
      }
    </header>
  );
}