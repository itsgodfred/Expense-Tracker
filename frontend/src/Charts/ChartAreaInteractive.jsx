"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import Dashskeleton from "../Subpages/Skeleton";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";

async function fetchincome() {
  const API_URL = import.meta.env.VITE_API_URL;
  const chart = await fetch(`${API_URL}/api/transactions`, {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    credentials: "include",
  });

  if (!chart.ok) {
    throw new Error("Transactions failed");
  }
  const data = await chart.json();
  return data;
}

export const description = "An interactive area chart";

const chartConfig = {
  income: {
    label: "Income",
    color: "#1F4FD1",
  },
  expenses: {
    label: "Expenses",
    color: "#ffa215",
  },
};

export default function ChartAreaInteractive() {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [timeRange, setTimeRange] = React.useState("90d");

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  const {
    data: chartdata,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["chartdata"],
    queryFn: fetchincome,
    refetchInterval: 5000,
    enabled: isPageLoaded,
  });

  if (isLoading || !chartdata) {
    return (
      <div className="flex flex-1 w-full">
        <Dashskeleton />
      </div>
    );
  }

  const transactionArray = Array.isArray(chartdata)
    ? chartdata
    : chartdata?.data || [];

  const groupedDataMap = {};

  transactionArray.forEach((item) => {
    const rawDate =
      item.transaction_date || item.created_at || new Date().toISOString();
    const dateKey = rawDate.split("T")[0];
    const value = parseFloat(item.amount) || 0;

    if (!groupedDataMap[dateKey]) {
      groupedDataMap[dateKey] = { date: dateKey, income: 0, expenses: 0 };
    }

    if (item.type === "income") {
      groupedDataMap[dateKey].income += value;
    } else if (item.type === "expense") {
      groupedDataMap[dateKey].expenses += value;
    }
  });

  const formattedChartData = Object.values(groupedDataMap).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const filteredData = formattedChartData.filter((item) => {
    const date = new Date(item.date);

    const referenceDate =
      formattedChartData.length > 0
        ? new Date(formattedChartData[formattedChartData.length - 1].date)
        : new Date();

    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }

    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Transaction Trend</CardTitle>
          <CardDescription>Income vs Expenses over time</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto flex"
            aria-label="Select date range"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {chartdata.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-10">
            <p className="text-[15px] font-medium text-[#56657A]">
              No data available
            </p>
            <p className="text-[12px] text-[#56657A]/70 mt-0.5">
              There is no financial history recorded for this period.
            </p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-income)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-income)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-expenses)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-expenses)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                    indicator="dot"
                    formatter={(value, name, item) => (
                      <div className="flex items-center gap-2 font-medium text-foreground">
                        {/* Native-style generic dot indicator */}
                        <div
                          className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                          style={{
                            backgroundColor:
                              item?.color || `var(--color-${name})`,
                          }}
                        />

                        <span className="capitalize">{name}:</span>
                        <span>
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(value)}
                        </span>
                      </div>
                    )}
                  />
                }
              />

              <Area
                dataKey="income"
                type="monotone"
                fill="url(#fillIncome)"
                stroke="var(--color-income)"
                stackId="a"
              />
              <Area
                dataKey="expenses"
                type="monotone"
                fill="url(#fillExpenses)"
                stroke="var(--color-expenses)"
                stackId="b"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
