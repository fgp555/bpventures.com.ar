"use client";

import React from "react";
import Image from "next/image";
import ItemsSideBarTop from "./ItemsSideBarTop";
import ItemsSidebarBot from "./ItemsSidebarBot";
import ItemsAdminUser from "./ItemsAdminUser";
import Logout from "./Logout";
import { useAuth } from "@/context/AuthContext";

import Avatar from "./Avatar";

const Sidebar = () => {
  const { userData } = useAuth();

  return (
    <div className="flex-col w-1/5 md:w-2/6 lg:max-w-80 2xl:max-w-80 min-h-screen items-center  bg-slate-300 md:flex">
      <div className=" hidden md:flex">
        <Image
          src={"https://i.postimg.cc/htcz7S3y/bp-ventures-color.png"}
          alt="logo"
          width={220}
          height={10}
        />
      </div>

      <div className=" md:hidden mt-5 flex">
        <Image
          src={"https://i.postimg.cc/5tmmF73v/isologo-bp-ventures-a-color.png"}
          alt="logo"
          width={220}
          height={10}
        />
      </div>
      <div className="flex-grow">
        <ItemsSideBarTop />
        <ItemsSidebarBot />

        {userData?.isAdmin && <ItemsAdminUser />}

        <div className="mt-10">
          <Avatar />
          <Logout />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
