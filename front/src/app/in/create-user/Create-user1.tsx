"use client";
import React from "react";
import CreateUserForm from "@/components/CreateUserForm/CreateUserForm";
import { useAuth } from "@/context/AuthContext";
const CreateUser = () => {
  const { loading } = useAuth();
  return (
    <>
      {!loading ? (
        <>
          <div className="flex items-start">
            <CreateUserForm />
          </div>
        </>
      ) : (
        <>
          <div className="flex h-screen flex-col items-center justify-center mt-7">
            <span className="loader"></span>
          </div>
        </>
      )}
    </>
  );
};

export default CreateUser;
