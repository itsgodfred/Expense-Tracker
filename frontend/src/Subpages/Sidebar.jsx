import React, { useState, useContext, useEffect } from "react";
import { Menu } from "lucide-react";
import { WalletMinimal } from "lucide-react";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { navContext } from "../App";
import { LayoutDashboard } from "lucide-react";
import { LogOut } from "lucide-react";
import { ArrowRightLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

async function loguser() {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("accesstoken");
  const res = await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    credentials: "include",
  });

  const data = await res.json();
  console.log(data);

  if (!res.ok) {
    const errorMessage = data?.message;
    throw new Error(errorMessage);
  }
  return data;
}

function Sidebar(prop) {
  const { navstate, setNavstate } = useContext(navContext);
  const { utente, setUtente } = useContext(navContext);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 680px)");

    const handleScreenChange = (e) => {
      if (e.matches) {
        setNavstate(true);
      }
    };

    if (mediaQuery.matches) {
      setNavstate(true);
    }

    mediaQuery.addEventListener("change", handleScreenChange);

    return () => mediaQuery.removeEventListener("change", handleScreenChange);
  }, [screenWidth]);

  const changeNav = () => {
    setNavstate((prev) => !prev);
  };

  useEffect(() => {
    if (utente.email) localStorage.setItem("email", utente.email);
  }, [utente]);

  const { mutate, isPending, error } = useMutation({
    mutationFn: loguser,
    onSuccess: () => {
      navigate("/login");
      setNavstate(true);
    },
  });
  const logoutUser = () => {
    mutate();
    console.log("handleSubmit triggered successfully!");
  };

  const location = useLocation();

  const handlePage = (urlpage) => {
    setNavstate((prev) => !prev);
    navigate(urlpage);
  };

  return (
    <div
      className={`z-90 grid grid-rows-3 h-screen w-[75%] bg-[#1F4FD1] py-4 px-6 top-0 -right-[100%] fixed z-50 rounded-l-[10px] 
    transition-all duration-300 ease-in-out
    ${navstate ? "translate-x-full " : "right-0 "}`}
    >
      <span className="flex justify-between items-start">
        <span className="flex justify-start items-center w-full gap-1">
          <WalletMinimal size={20} color="#FFFFFF" />
          <p className="font-medium text-white">Expense Tracker</p>
        </span>
        <Menu color="#FFFFFF" className="cursor-pointer" onClick={changeNav} />
      </span>
      <div className="flex items-center">
        <ol className="flex flex-col justify-around my-5 h-full text-white w-[100%]">
          <li
            onClick={() => handlePage("/dashboard")}
            className="flex items-center gap-2 cursor-pointer hover:px-3 hover:py-2 hover:rounded-[3px] hover:bg-[#0B2A5B] transition-all duration-200 ease-in-out"
          >
            <LayoutDashboard size={20} />
            <p>Dashboard</p>
          </li>
          <li
            onClick={() => handlePage("/transactions")}
            className="flex items-center gap-2 cursor-pointer hover:px-3 hover:py-2 hover:rounded-[3px] hover:bg-[#0B2A5B] transition-all duration-200 ease-in-out"
          >
            <ArrowRightLeft size={20} />
            <p>Transactions</p>
          </li>
        </ol>
      </div>
      <div className="flex justify-between items-end py-4 text-white mb-4">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
              <AvatarBadge className="bg-green-600 dark:bg-green-800" />
            </Avatar>
            <p className="text-[13px]">{localStorage.getItem("email")}</p>
          </div>
          <LogOut className="cursor-pointer" onClick={logoutUser} />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
