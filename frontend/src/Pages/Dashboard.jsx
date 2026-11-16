import React, { useEffect, useState, useContext } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Wallet } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Barchart from "../Charts/ChartBarMultiple";
import PieChart from "../Charts/Piechart";
import Dashskeleton from "../Subpages/Skeleton";
import Expenselist from "../Subpages/Expenselist";
import Incomelist from "../Subpages/Incomelist";
import { navContext } from "../App";
import { toast, Toaster } from "react-hot-toast";

async function fetchdata() {
  const token = localStorage.getItem("accesstoken");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  const API_URL = import.meta.env.VITE_API_URL;
  const [res, utente] = await Promise.all([
    fetch(`${API_URL}/api/dashboard/summary`, {
      headers,
      credentials: "include",
    }),
    fetch(`${API_URL}/api/auth/me`, { headers, credentials: "include" }),
  ]);

  if (!res.ok) {
    throw new Error(res?.message || "Failed to load financial summary");
  }
  if (!utente.ok) {
    throw new Error(utente?.message || "Authentication session failed");
  }

  const summaryData = await res.json();
  const userData = await utente.json();

  return {
    summary: summaryData,
    user: userData,
  };
}

function Dashboard() {
  const queryClient = useQueryClient();
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const { utente, setUtente } = useContext(navContext);
  const { login, setLogin } = useContext(navContext);

  useEffect(() => {
    queryClient.clear();
    setIsPageLoaded(true);
  }, []);
  const {
    data: dashdata,
    isLoading,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ["dashdata"],
    queryFn: fetchdata,
    enabled: isPageLoaded,
  });

  useEffect(() => {
    if (isSuccess && dashdata) {
      setUtente(dashdata.user);
    }
  }, [isSuccess, dashdata]);

  useEffect(() => {
    if (login) {
      setLogin(false);
      toast.success("Successfully registered", { id: "registration-success" });
    }
  }, [dashdata]);

  if (isLoading || !dashdata) {
    return (
      <div className="flex flex-1 w-full">
        <Toaster />
        <Dashskeleton />
      </div>
    );
  }

  const { summary, user } = dashdata;

  return (
    <div className="grid grid-row gap-8 py-10 px-6 pt-27">
      <Toaster />
      <div className="flex flex-col gap-1.5">
        <div className="flex items-end justify-between">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-[12.5px] text-[#56657A] font-normal">
            {new Intl.DateTimeFormat("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            }).format(new Date())}
          </p>
        </div>

        <div className="">
          <p className="text-[13px] text-[#56657A] flex items-center gap-1.5">
            Hello,{" "}
            <span className="font-semibold text-[14px] text-[#0E1A2B]">
              {" "}
              {user.name}
            </span>
          </p>
          <p className="text-[13px] text-[#56657A]">
            Here is a monthly overview of your finances
          </p>
        </div>
      </div>
      {dashdata && (
        <div className="grid grid-cols-3 gap-9 max-[920px]:grid-cols-1 max-[920px]:gap-5">
          <div className="flex flex-row bg-white items-center gap-4 p-5 rounded-2xl ">
            <div className=" bg-[#1F4FD1] p-3.5 rounded-2xl shadow-xl">
              <Wallet color="#ffffff" size={28} />
            </div>
            <span>
              <p className="text-[13px] text-[#56657A]">Balance</p>
              <span className="flex items-center gap-4">
                <p className="text-[22px] font-semibold">${summary.balance}</p>
              </span>
            </span>
          </div>
          <div className="flex flex-row bg-white items-center gap-4 p-5 rounded-2xl">
            <div className=" bg-[#ffa215] p-3.5 rounded-2xl shadow-xl">
              <TrendingUp color="#ffffff" size={28} />
            </div>
            <span>
              <p className="text-[13px] text-[#56657A]">Income</p>
              <span className="flex items-center gap-4">
                <p className="text-[22px] font-semibold">
                  ${summary.incomeThisMonth}
                </p>
                <div className="flex h-full justify-end items-end gap-1">
                  {summary.incomeDelta >= 0 ? (
                    <TrendingUp color="#29f068" size={17} />
                  ) : (
                    <TrendingDown color="#fb313c" size={17} />
                  )}
                  <p
                    className={`text-[10px] font-semibold ${
                      summary.incomeDelta >= 0
                        ? "text-[#19d454]"
                        : "text-[#fb313c]"
                    }`}
                  >
                    {Math.round(Math.abs(summary.incomeDelta))}%
                  </p>
                </div>
              </span>
            </span>
          </div>
          <div className="flex flex-row bg-white items-center gap-4 p-5 rounded-2xl">
            <div className=" bg-[#fb313c] p-3.5 rounded-2xl shadow-xl">
              <TrendingDown color="#ffffff" size={28} />
            </div>
            <span>
              <p className="text-[13px] text-[#56657A]">Expenses</p>
              <span className="flex items-center gap-4">
                <p className="text-[22px] font-semibold">
                  ${summary.expenseThisMonth}
                </p>
                <div className="flex h-full justify-end items-end gap-1">
                  {summary.expenseDelta >= 0 ? (
                    <TrendingUp color="#29f068" size={17} />
                  ) : (
                    <TrendingDown color="#fb313c" size={17} />
                  )}
                  <p
                    className={`text-[10px] font-semibold ${
                      summary.expenseDelta >= 0
                        ? "text-[#19d454]"
                        : "text-[#fb313c]"
                    }`}
                  >
                    {Math.round(Math.abs(summary.expenseDelta))}%
                  </p>
                </div>
              </span>
            </span>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-5 max-[920px]:grid-cols-1">
        <Barchart />
        <PieChart />
      </div>
      <div className="grid grid-cols-2 gap-5 max-[920px]:grid-cols-1">
        <Expenselist />
        <Incomelist />
      </div>
    </div>
  );
}

export default Dashboard;
