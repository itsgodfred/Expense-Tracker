import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { iconMap } from "./Categoryicons";
import { Search, HelpCircle } from "lucide-react";
import Skeleton from "../Subpages/Skeleton";

async function fetchlist() {
  const token = localStorage.getItem("accesstoken");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  const API_URL = import.meta.env.VITE_API_URL;
  const res = await fetch(`${API_URL}/api/transactions?limit=100`, {
    headers,
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(res?.message || "Transactions failed");
  }
  const data = await res.json();
  console.log(data);

  return data;
}

const columns = [
  {
    name: "Category",
    selector: (row) => row.category_name,
    sortable: true,
    minWidth: "170px",
    cell: (row) => {
      const rawString = String(row.category_icon).trim();
      const colour = String(row.category_color).trim();

      const formattedKey =
        rawString.charAt(0).toUpperCase() + rawString.slice(1).toLowerCase();

      const IconComponent = iconMap[formattedKey] || HelpCircle;

      return (
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-[12px] flex items-center justify-center w-fit shadow-md"
            style={{
              backgroundColor: `${colour}26`,
            }}
          >
            <IconComponent size={14} color={colour} />
          </div>

          <span className="font-medium">{row.category_name}</span>
        </div>
      );
    },
  },
  {
    name: "Description",
    selector: (row) => row.description,
    sortable: true,
    style: {
      color: "#64748b",
    },
  },
  {
    name: "Date",
    selector: (row) => row.transaction_date,
    sortable: true,
    style: {
      color: "#64748b",
    },
    cell: (row) =>
      new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(row.transaction_date)),
  },
  {
    name: "Type",
    selector: (row) => row.type,
    sortable: true,
    cell: (row) => {
      if (row.type === "expense") {
        return (
          <div className="py-1 px-1.5 text-[#e1222b] bg-[#e1222b0e] font-medium rounded-4xl">
            {row.type.charAt(0).toUpperCase() + row.type.slice(1)}
          </div>
        );
      } else {
        return (
          <div className="py-1 px-1.5 text-[#14b04d] bg-[#14b04d0e] font-medium rounded-4xl">
            {row.type.charAt(0).toUpperCase() + row.type.slice(1)}
          </div>
        );
      }
    },
  },
  {
    name: "Amount",
    selector: (row) => row.amount,
    sortable: true,
    cell: (row) => {
      if (row.type === "expense")
        return (
          <div className="text-[#f62e38] font-semibold">{`-$${row.amount}`}</div>
        );
      else
        return (
          <div className="text-[#1fb857] font-semibold">{`+$${row.amount}`}</div>
        );
    },
  },
];

const data = [
  { id: 1, title: "Wireless Mouse", category: "Electronics", price: 29.99 },
  {
    id: 2,
    title: "Mechanical Keyboard",
    category: "Electronics",
    price: 89.99,
  },
  { id: 3, title: "Running Shoes", category: "Apparel", price: 120.0 },
  { id: 4, title: "Coffee Mug", category: "Kitchen", price: 14.95 },
];

export default function MyProductTable() {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    console.log(isPageLoaded);
    localStorage.setItem("offset", 0);
    setIsPageLoaded(true);
  }, []);

  const {
    data: transactionlist,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["listdata"],
    queryFn: fetchlist,
    enabled: isPageLoaded,
    refetchInterval: 300,
    select: (response) => {
      if (Array.isArray(response)) return response;
      return response?.transactions || [];
    },
  });

  const tableCustomStyles = {
    headCells: {
      style: {
        color: "#56657A",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      },
    },
  };
  if (isLoading || !transactionlist) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium">
        <Skeleton />
      </div>
    );
  }

  const searchFilter = transactionlist.filter((list) => {
    const word1 = (list.description || "").toLowerCase();
    const word2 = search.toLowerCase().trim();

    if (!search) return true;

    return word1.includes(word2);
  });

  return (
    <Card>
      <CardContent>
        <div className="grid grid-cols-2 py-5">
          <h1 className="text-[20px]">Transactions</h1>
          <div className="flex  items-center border-[1px] px-2.5 py-1 rounded-2xl">
            <Search size={13} color="#8d8d8d" className="mr-2" />
            <input
              value={search}
              placeholder="Search description..."
              className="focus:outline-none text-[#56657A]"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <DataTable
          columns={columns}
          data={searchFilter}
          pagination
          paginationPerPage={15}
          persistTableHead
          responsive
          customStyles={tableCustomStyles}
        />
      </CardContent>
    </Card>
  );
}
