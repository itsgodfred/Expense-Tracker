"use client";

import { Label, Pie, PieChart, Sector } from "recharts";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

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

async function fetchpiedata() {
  const API_URL = import.meta.env.VITE_API_URL;
  const res = await fetch(`${API_URL}/api/dashboard/category-breakdown`, {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    credentials: "include",
  });

  const data = await res.json();
  console.log("CAT" + data);
  console.log(data);

  if (!res.ok) {
    const errorMessage = data?.message;
    throw new Error(errorMessage || "Failed to fetch trend data");
  }
  return data;
}

const ACTIVE_INDEX = 0;

export default function ChartPieDonutActive() {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  const {
    data: piedata,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["piedata"],
    queryFn: fetchpiedata,
    enabled: isPageLoaded,
  });

  const processedPieData = React.useMemo(() => {
    if (!piedata || !Array.isArray(piedata)) return [];
    return piedata.map((item) => ({
      name: item.category_name,
      value: parseFloat(item.total) || 0,
      fill: item.category_color || "var(--chart-1)",
    }));
  }, [piedata]);

  const totalExpenses = React.useMemo(() => {
    return processedPieData.reduce((acc, curr) => acc + curr.value, 0);
  }, [processedPieData]);

  const chartConfig = React.useMemo(() => {
    const config = {
      value: {
        label: "Spent",
      },
    };
    if (piedata && Array.isArray(piedata)) {
      piedata.forEach((item) => {
        config[item.category_name] = {
          label: item.category_name,
          color: item.category_color,
        };
      });
    }
    return config;
  }, [piedata]);

  if (isLoading) {
    return (
      <Card className="flex h-[350px] items-center justify-center text-[#56657A]">
        Loading category breakdown...
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex h-[350px] items-center justify-center text-[#fb313c]">
        Error: {error.message}
      </Card>
    );
  }

  return (
    <Card className="flex flex-col ring-0">
      <CardHeader className="items-center pb-0">
        <CardTitle>Top Categories</CardTitle>
        <CardDescription>Spending this month</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        {processedPieData.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-10">
            <p className="text-[15px] font-medium text-[#56657A]">
              No data available
            </p>
            <p className="text-[12px] text-[#56657A]/70 mt-0.5">
              There are no recorded category expenses for this month.
            </p>
          </div>
        ) : (
          <>
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[220px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      hideLabel
                      formatter={(value, name, item) => (
                        <span className="flex items-center gap-1.5">
                          <span
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{ backgroundColor: item.payload.fill }}
                          />
                          <p className="text-[#56657A]">{name}:</p>$
                          {typeof value === "number"
                            ? value.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            : value}
                        </span>
                      )}
                    />
                  }
                />

                <Pie
                  data={processedPieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  strokeWidth={5}
                  shape={(props) => {
                    const { index, outerRadius = 0 } = props;
                    return index === ACTIVE_INDEX ? (
                      <Sector {...props} outerRadius={outerRadius + 10} />
                    ) : (
                      <Sector {...props} outerRadius={outerRadius} />
                    );
                  }}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="central"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-xl font-bold"
                            >
                              $
                              {totalExpenses.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground text-xs"
                            >
                              Total Spent
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>

            <div className="mt-6 flex flex-col gap-3 px-2">
              {processedPieData.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-[14px]"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="font-medium text-[#2d3748]">
                      {item.name}
                    </span>
                  </div>

                  <span className="font-semibold text-right text-foreground">
                    $
                    {item.value.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
