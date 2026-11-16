import { React, createContext, useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalletMinimal } from "lucide-react";
import { LogOut } from "lucide-react";
import { Menu } from "lucide-react";
import Sidebar from "../Subpages/Sidebar";
import { navContext } from "../App";
import { Outlet } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

async function loguser() {
  const API_URL = import.meta.env.VITE_API_URL;
  const res = await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
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

function Content() {
  const [hovcolor, sethovcolor] = useState(false);

  const { navstate, setNavstate } = useContext(navContext);

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.clear();
  }, []);

  const navigate = useNavigate();

  const handleHoverStart = () => {
    sethovcolor((prev) => !prev);
  };

  const handleHoverEnd = () => {
    sethovcolor((prev) => !prev);
  };

  const changeNav = () => {
    setNavstate((prev) => !prev);
  };

  const { mutate, isPending, error } = useMutation({
    mutationFn: loguser,
    onSuccess: () => {
      queryClient.clear();
      localStorage.clear;
      navigate("/login");
    },
  });

  const logoutUser = () => {
    mutate();
    console.log("handleSubmit triggered successfully!");
  };

  const location = useLocation();

  return (
    <div className={`w-full overflow-x-hidden z-50`}>
      <nav
        className={`z-10 bg-white grid grid-cols-3 border-[0.5px] border-[#DCE3EC] py-4 px-6 max-[680px]:grid-cols-2 fixed w-full ${
          !navstate && "-z-10 isolate"
        }`}
      >
        <span
          className={`flex justify-start items-center w-full gap-1 transition-all duration-200 ease-in-out  `}
        >
          <WalletMinimal size={20} color="#1F4FD1" />
          <p className="font-medium">Expense Tracker</p>
        </span>
        <Tabs
          value={location.pathname}
          defaultValue="dashboard"
          className="flex justify-center items-center max-[680px]:hidden"
        >
          <TabsList variant="line">
            <TabsTrigger className="text-[15px] " value="/dashboard">
              <Link to="/dashboard">Dashboard</Link>
            </TabsTrigger>
            <TabsTrigger className="text-[15px]" value="/transactions">
              <Link to="/transactions">Transactions</Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <span
          className="flex justify-end items-center  gap-1 max-[680px]:hidden"
          onClick={logoutUser}
        >
          <LogOut
            size={20}
            className={`transition-colors duration-200 cursor-pointer ${
              hovcolor ? "text-[#1F4FD1]" : "text-[#0E1A2B]"
            }`}
          />
          <p
            className={`text-[15px] font-medium transition-colors duration-200 cursor-pointer ${
              hovcolor ? "text-[#1F4FD1]" : "text-[#0E1A2B]"
            }`}
            onMouseEnter={handleHoverStart}
            onMouseLeave={handleHoverEnd}
          >
            Log out
          </p>
        </span>
        <span
          className={`flex justify-end items-center min-[680px]:hidden ${
            !navstate && "hidden"
          }`}
        >
          <Menu className="cursor-pointer" onClick={changeNav} />
        </span>
      </nav>

      <Sidebar slidestate={navstate} />
      <div className={` ${!navstate && "relative -z-10 isolate"}`}>
        <Outlet />
      </div>
      {!navstate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-[7px] transition-all duration-300"></div>
      )}
    </div>
  );
}

export default Content;
