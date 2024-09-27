"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useAuth } from "@/context/AuthContext";
import { fetchUsers } from "@/helpers/auth.helper";
const BlockUser = () => {
  const { blocked, setBlocked, setAllUsers } = useAuth();
  const { id } = useParams();

  const token = Cookies.get("token");

  const handleBlock = async () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "El usuario será bloqueado",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2b4168",
      cancelButtonColor: "#5eba98",
      confirmButtonText: "Sí, bloquear",
      cancelButtonText: "Cancelar",
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/users/status/${id}/2`,
              {
                method: "PUT",
                headers: {
                  "content-type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!response.ok) {
              throw new Error("No se logró bloquear el usuario");
            }

            setBlocked(true);
            Swal.fire({
              title: "Bloqueado!",
              text: "El usuario ha sido bloqueado.",
              icon: "success",
              confirmButtonColor: "#2b4168",
            });
          } catch (error) {
            console.error("Hubo un problema con la petición", error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Hubo un problema al bloquear el usuario.",
              confirmButtonText: "Aceptar",
              confirmButtonColor: "#2b4168",
            });
          }
        }
      })
      .finally(async () => {
        const data = await fetchUsers();
        setAllUsers(data);
      });
  };

  const handleUnblock = async () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "El usuario será desbloqueado",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2b4168",
      cancelButtonColor: "#5eba98",
      confirmButtonText: "Sí, desbloquear",
      cancelButtonText: "Cancelar",
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/users/status/${id}/1`,
              {
                method: "PUT",
                headers: {
                  "content-type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!response.ok) {
              throw new Error("No se logró desbloquear el usuario");
            }
            setBlocked(false);
            Swal.fire({
              title: "Desbloqueado",
              text: "El usuario ha sido desbloqueado.",
              icon: "success",
              confirmButtonColor: "#2b4168",
            });
          } catch (error) {
            console.error("Hubo un problema con la petición", error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Hubo un problema al desbloquear el usuario.",
              confirmButtonText: "Aceptar",
              confirmButtonColor: "#2b4168",
            });
          }
        }
      })
      .finally(async () => {
        const data = await fetchUsers();
        setAllUsers(data);
      });
  };

  return (
    <div>
      {!blocked ? (
        <button
          onClick={handleBlock}
          className="flex space-x-2 bg-secundary hover:bg-acent transition duration-300 px-4 py-1 rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-5 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
            />
          </svg>
          <p className="font-futura text-white">Bloquear</p>
        </button>
      ) : (
        <button
          onClick={handleUnblock}
          className="flex space-x-2 bg-secundary px-4 py-1 rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-5 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
            />
          </svg>
          <p className="font-futura text-white">Desbloquear</p>
        </button>
      )}
    </div>
  );
};

export default BlockUser;
