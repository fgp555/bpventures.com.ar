"use client";

import UsersListComponent from "@/components/Users/UsersListComponent";
import { useAuth } from "@/context/AuthContext";
// import { useRouter } from "next/router";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';

interface User {
  id: number;
  email: string;
  Names: string;
  LastName: string;
  Position: string;
  verifiedEmail: boolean;
}

interface IdParams {
  params: {
    id: string;
  };
}

const ListUsersByCompany: React.FC<IdParams> = ({ params }) => {
  const { allUsers, setAllUsers, loading } = useAuth();

  const [usersData, setUsersData] = useState<User[]>([]);
  const [companyName, setCompanyName] = useState<string>("");
  // const [loading, setLoading] = useState<boolean>(true);
  // const router = useRouter();
  const companyId = parseInt(params.id);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}`);
        if (response.ok) {
          const data = await response.json();
          setUsersData(data.users);
          setCompanyName(data.name);
          // setLoading(false);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al cargar los usuarios',
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#2b4168",
          });
        }
      } catch (error: any) {
        console.error("Error al obtener usuarios", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al cargar los usuarios',
          confirmButtonText: "Error",
          confirmButtonColor: "#2b4168",
        });
      }
    };

    fetchUsers();
  }, [companyId]);


  return (
    <>
      {/* <pre>{JSON.stringify(usersData, null, 2)}</pre> */}
      {/* <h1 className="text-4xl font-futura mb-6 text-secundary">Lista de Usuarios: {companyName}</h1> */}
      {/* <button
        onClick={() => router.back()} // Uso correcto de router.back()
        className="bg-[#2B4168] text-white py-2 px-4 rounded-full shadow-md hover:bg-[#4a9c80] transition duration-300 mb-4"
      >
        Volver
      </button> */}
      <div className="m-5 max-h-screen mt-5 rounded-lg font-futura">
        <button
          onClick={() => window.history.back()} // Alternativa usando window.history.back()
          className="bg-[#2B4168] text-white py-2 px-4 rounded-full shadow-md hover:bg-[#4a9c80] transition duration-300 mb-4"
        >
          Volver
        </button>
      </div>

      <UsersListComponent allUsers={usersData} setAllUsers={setAllUsers} loading={loading} isCompany={true} companyName={companyName} />
    </>
  );
};
export default ListUsersByCompany;
