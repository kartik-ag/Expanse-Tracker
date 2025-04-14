"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ArrowUpRight, ListChecks, PieChart as PieChartIcon, ChevronRight, Loader2, Plus } from "lucide-react";

type Transaction = {
  _id: string;
  amount: number;
  description: string;
  date: string;
  category: {
    _id: string;
    name: string;
    color: string;
  };
};

type CategoryBreakdown = {
  id: string;
  name: string;
  color: string;
  total: number;
  budget: number;
  percentage: number;
};

type DashboardData = {
  recentTransactions: Transaction[];
  totalExpense: number;
  categoryBreakdown: CategoryBreakdown[];
  monthlyData: {
    name: string;
    year: number;
    month: number;
    total: number;
  }[];
};

export default function Home() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<string>("month");

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/dashboard?period=${period}`);
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }
      const data = await response.json();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [period]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-destructive">{error}</p>
        <Button onClick={fetchDashboardData}>Try Again</Button>
      </div>
    );
  }

  const renderMonthlyChart = () => {
    if (!dashboardData || dashboardData.monthlyData.length === 0) {
      return (
        <div className="flex items-center justify-center h-[300px] border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">No data available</p>
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={dashboardData.monthlyData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis
            tickFormatter={(value) => `$${value}`}
            width={80}
          />
          <Tooltip
            formatter={(value) => formatCurrency(value as number)}
            labelFormatter={(label) => `Month: ${label}`}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#6366F1"
            fill="#6366F1"
            fillOpacity={0.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  const renderCategoryPieChart = () => {
    if (!dashboardData || dashboardData.categoryBreakdown.length === 0) {
      return (
        <div className="flex items-center justify-center h-[300px] border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">No category data available</p>
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={dashboardData.categoryBreakdown}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="total"
            nameKey="name"
            label={({ name, percent }) => 
              `${name}: ${(percent * 100).toFixed(1)}%`
            }
            labelLine={false}
          >
            {dashboardData.categoryBreakdown.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend />
          <Tooltip formatter={(value) => formatCurrency(value as number)} />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={period === "week" ? "default" : "outline"}
            onClick={() => setPeriod("week")}
          >
            Week
          </Button>
          <Button
            size="sm"
            variant={period === "month" ? "default" : "outline"}
            onClick={() => setPeriod("month")}
          >
            Month
          </Button>
          <Button
            size="sm"
            variant={period === "quarter" ? "default" : "outline"}
            onClick={() => setPeriod("quarter")}
          >
            Quarter
          </Button>
          <Button
            size="sm"
            variant={period === "year" ? "default" : "outline"}
            onClick={() => setPeriod("year")}
          >
            Year
          </Button>
        </div>
      </div>

      {dashboardData && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Expenses
                </CardTitle>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(dashboardData.totalExpense)}
                </div>
                <p className="text-xs text-muted-foreground">
                  For the last {period}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Expenses</CardTitle>
                <CardDescription>
                  Your spending over the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>{renderMonthlyChart()}</CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
                <CardDescription>
                  Spending by category for the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>{renderCategoryPieChart()}</CardContent>
              <CardFooter>
                <Button variant="outline" asChild>
                  <Link href="/categories">
                    View all categories
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="grid gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>
                    Your latest financial activities
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/transactions">
                    <ListChecks className="mr-1 h-4 w-4" />
                    View All
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {dashboardData.recentTransactions.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.recentTransactions.map((transaction) => (
                      <div
                        key={transaction._id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="h-9 w-9 rounded-full flex items-center justify-center"
                            style={{
                              backgroundColor: `${transaction.category?.color}20`,
                              color: transaction.category?.color,
                            }}
                          >
                            <PieChartIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-sm text-muted-foreground">
                              {transaction.category?.name || "Uncategorized"} · {" "}
                              {format(new Date(transaction.date), "MMM dd, yyyy")}
                            </p>
                          </div>
                        </div>
                        <p className="font-medium">
                          {formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No recent transactions</p>
                    <Button className="mt-2" asChild>
                      <Link href="/transactions/new">
                        <Plus className="mr-1 h-4 w-4" />
                        Add Transaction
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
