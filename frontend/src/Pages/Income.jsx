import React, { useState, useEffect } from "react";
import ChartAreaInteractive from "../Charts/ChartAreaInteractive";
import { useQuery } from "@tanstack/react-query";
import Dashskeleton from "../Subpages/Skeleton";
import DialogDemo from "../Subpages/DialogDemo";
import BasicTable from "../Subpages/Basictable";

async function fetchincome() {
  const offset = localStorage.getItem("offset");
  const token = localStorage.getItem("accesstoken");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  const API_URL = import.meta.env.VITE_API_URL;
  const [chart, income, utente] = await Promise.all([
    fetch(`${API_URL}/api/transactions`, {
      headers,
      credentials: "include",
    }),
    fetch(`${API_URL}/api/transactions?limit=20&offset=${offset}`, {
      headers,
      credentials: "include",
    }),
    fetch(`${API_URL}/api/auth/me`, { headers, credentials: "include" }),
  ]);

  if (!chart.ok) {
    throw new Error(res?.message || "Transactions failed");
  }
  if (!utente.ok) {
    throw new Error(utente?.message || "Authentication session failed");
  }
  console.log("DRRRRRRR");
  return {
    chartvalue: await chart.json(),
    transaction: await income.json(),
    user: await utente.json(),
  };
}

function Income() {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  useEffect(() => {
    console.log(isPageLoaded);
    localStorage.setItem("offset", 0);
    setIsPageLoaded(true);
  }, []);
  const {
    data: incomedata,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["incomedata"],
    queryFn: fetchincome,

    enabled: isPageLoaded,
  });
  if (isLoading || !incomedata) {
    return (
      <div className="flex flex-1 w-full">
        <Dashskeleton />
      </div>
    );
  }
  const { chartvalue, transaction, user } = incomedata;
  return (
    <div className="grid grid-row gap-8 py-10 px-6 pt-27">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-end justify-between">
          <h1 className="text-2xl font-semibold">Transactions</h1>

          <DialogDemo />
        </div>
        <div className="">
          <p className="text-[13px] text-[#56657A]">
            Here is an overview of your transactions
          </p>
        </div>
      </div>
      <div className="grid grid-row-2 gap-4">
        <ChartAreaInteractive />
        <BasicTable />
      </div>
    </div>
  );
}

export default Income;
