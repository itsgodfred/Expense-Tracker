"use client";

import React, { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, Legend } from "recharts";
import { useQuery } from "@tanstack/react-query";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

async function fetchbardata() {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("accesstoken");
  const res = await fetch(`${API_URL}/api/dashboard/monthly-trend`, {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    const errorMessage = data?.message;
    throw new Error(errorMessage || "Failed to fetch trend data");
  }
  return data;
}

const chartConfig = {
  income: {
    label: "Income",
    color: "#1F4FD1",
  },
  expense: {
    label: "Expense",
    color: "#ffa215",
  },
};

const formatMonthName = (dateStr) => {
  if (!dateStr) return "";
  const [year, month] = dateStr.split("-");
  const date = new Date(year, parseInt(month, 10) - 1, 1);
  return date.toLocaleString("default", { month: "short" });
};

export default function ChartBarMultiple() {
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  const {
    data: bardata,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bardata"],
    queryFn: fetchbardata,
    enabled: isPageLoaded,
  });

  const processedChartData = React.useMemo(() => {
    if (!bardata || !Array.isArray(bardata)) return [];

    return bardata.map((item) => ({
      month: formatMonthName(item.month),
      income: parseFloat(item.income) || 0,
      expense: parseFloat(item.expense) || 0,
    }));
  }, [bardata]);

  if (isLoading) {
    return (
      <Card className="flex h-[350px] items-center justify-center text-[#56657A]">
        Loading trend analytics...
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex h-[350px] items-center justify-center text-[#fb313c]">
        Error loading chart data: {error.message}
      </Card>
    );
  }

  return (
    <Card className="ring-0">
      <CardHeader>
        <CardTitle>Monthly Trend</CardTitle>
        <CardDescription>Income vs expenses last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        {processedChartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-10">
            <p className="text-[15px] font-medium text-[#56657A]">
              No data available
            </p>
            <p className="text-[12px] text-[#56657A]/70 mt-0.5">
              There is no financial history recorded for this period.
            </p>
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={processedChartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />

              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={10}
                formatter={(value) => {
                  const label = chartConfig[value]?.label || value;
                  return (
                    <span className="text-[13px] text-[#56657A] ml-1 font-medium">
                      {label}
                    </span>
                  );
                }}
              />
              <Bar
                dataKey="income"
                fill={chartConfig.income.color}
                radius={4}
              />
              <Bar
                dataKey="expense"
                fill={chartConfig.expense.color}
                radius={4}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
