import React, { useEffect, useState } from "react";
import { ArrowRightIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { iconMap } from "./Categoryicons";
import Skeleton from "./Skeleton";

async function incomedata() {
  const API_URL = import.meta.env.VITE_API_URL;
  const res = await fetch(`${API_URL}/api/transactions?type=income&limit=5`, {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    credentials: "include",
  });
  const data = await res.json();
  console.log(data);

  if (!res.ok) {
    throw new Error(res?.message || "Failed to load financial summary");
  }

  return data;
}

function Incomelist() {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setIsPageLoaded(true);
  }, []);
  const {
    data: incomelist,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["incomelist"],
    queryFn: incomedata,
    enabled: isPageLoaded,
  });
  if (isLoading) {
    return (
      <Card className="flex h-[350px] items-center justify-center text-[#56657A]">
        <Skeleton />
      </Card>
    );
  }
  const handlePage = (urlpage) => {
    navigate(urlpage);
  };
  return (
    <div>
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Recent Income</CardTitle>
          <div
            onClick={() => {
              handlePage("/transactions");
            }}
            className="flex items-center gap-1 text-[#1F4FD1] cursor-pointer"
          >
            <p className="text-[#1F4FD1] font-medium">View all</p>
            <ArrowRightIcon size={15} />
          </div>
        </CardHeader>
        <CardContent>
          {incomelist && incomelist.length > 0 ? (
            incomelist.map((list) => {
              const rawString = String(list.category_icon).trim();
              const formattedKey =
                rawString.charAt(0).toUpperCase() +
                rawString.slice(1).toLowerCase();
              const IconComponent = iconMap[formattedKey];
              const colour = String(list.category_color).trim();
              const transactionDate = new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }).format(new Date(list.transaction_date));
              return (
                <div
                  key={list.id}
                  className="flex items-center justify-between p-4"
                >
                  <div className="flex gap-3">
                    <div
                      className="p-2.5 rounded-xl flex items-center justify-center w-fit shadow-md"
                      style={{
                        backgroundColor: `${colour}26`,
                      }}
                    >
                      <IconComponent size={16} color={colour} />
                    </div>
                    <div className="flex flex-col ">
                      <p className="font-medium">{list.description}</p>
                      <p className=" text-[11px] text-[#56657A]">
                        {list.category_name} - {transactionDate}{" "}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-[#00b132]">
                      +${list.amount}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex justify-center text-[#56657A] py-4">
              No data yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Incomelist;
