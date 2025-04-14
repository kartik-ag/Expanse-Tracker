"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { toast } from "sonner";
import { AlertCircle, ChevronRight, Loader2, PieChart } from "lucide-react";

type BudgetCategory = {
  id: string;
  name: string;
  color: string;
  budget: number;
  actual: number;
  remaining: number;
  percentage: number;
  status: "within" | "exceeded";
};

type BudgetData = {
  categories: BudgetCategory[];
  total: {
    budget: number;
    actual: number;
    remaining: number;
    percentage: number;
  };
  month: number;
  year: number;
};

export default function BudgetPage() {
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().getMonth().toString()
  );
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );

  const months = [
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" },
  ];

  // Get a range of years from current year -2 to current year +1
  const currentYear = new Date().getFullYear();
  const years = [
    currentYear - 2,
    currentYear - 1,
    currentYear,
    currentYear + 1,
  ].map((year) => ({
    value: year.toString(),
    label: year.toString(),
  }));

  const fetchBudgetData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/budget?month=${selectedMonth}&year=${selectedYear}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch budget data");
      }
      const data = await response.json();
      setBudgetData(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching budget data:", err);
      setError("Failed to load budget data. Please try again.");
      toast.error("Failed to load budget data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgetData();
  }, [selectedMonth, selectedYear]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "bg-red-500";
    if (percentage >= 80) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getTextColor = (percentage: number) => {
    if (percentage >= 100) return "text-red-600";
    if (percentage >= 80) return "text-amber-600";
    return "text-emerald-600";
  };

  const renderBudgetSummaryChart = () => {
    if (!budgetData || budgetData.categories.length === 0) {
      return (
        <div className="flex items-center justify-center h-[300px] border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">No budget data available</p>
        </div>
      );
    }

    // Sort categories by percentage (highest to lowest)
    const sortedCategories = [...budgetData.categories].sort(
      (a, b) => b.percentage - a.percentage
    );

    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={sortedCategories}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 80,
          }}
          barGap={10}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 12 }}
          />
          <YAxis tickFormatter={(value) => `$${value}`} width={80} />
          <Tooltip
            formatter={(value) => formatCurrency(value as number)}
            labelFormatter={(label) => `Category: ${label}`}
          />
          <Legend />
          <Bar name="Budget" dataKey="budget" fill="#6B7280" radius={[4, 4, 0, 0]}>
            {sortedCategories.map((entry, index) => (
              <Cell key={`budget-${index}`} fill="#6B7280" />
            ))}
          </Bar>
          <Bar name="Actual" dataKey="actual" fill="#6366F1" radius={[4, 4, 0, 0]}>
            {sortedCategories.map((entry, index) => (
              <Cell
                key={`actual-${index}`}
                fill={entry.percentage >= 100 ? "#EF4444" : entry.percentage >= 80 ? "#F59E0B" : "#10B981"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Budget</h1>
        <Button asChild variant="outline">
          <Link href="/categories">
            <PieChart className="mr-2 h-4 w-4" />
            Manage Categories
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Month:</span>
          <Select
            value={selectedMonth}
            onValueChange={setSelectedMonth}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Year:</span>
          <Select
            value={selectedYear}
            onValueChange={setSelectedYear}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year.value} value={year.value}>
                  {year.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <p className="text-destructive">{error}</p>
          <Button onClick={fetchBudgetData}>Try Again</Button>
        </div>
      ) : budgetData ? (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Budget
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(budgetData.total.budget)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Actual Spending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(budgetData.total.actual)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Remaining
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${
                    budgetData.total.remaining < 0
                      ? "text-red-600"
                      : "text-emerald-600"
                  }`}
                >
                  {formatCurrency(budgetData.total.remaining)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {budgetData.total.percentage.toFixed(1)}% of budget used
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Budget vs. Actual</CardTitle>
              <CardDescription>
                Compare your budgeted amounts with actual spending
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderBudgetSummaryChart()}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Categories</h2>
            <div className="space-y-4">
              {budgetData.categories.map((category) => (
                <Card key={category.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span
                        className={`text-sm ${getTextColor(
                          category.percentage
                        )}`}
                      >
                        {category.percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full mb-2">
                      <div
                        className={`h-2 rounded-full ${getProgressColor(
                          category.percentage
                        )}`}
                        style={{
                          width: `${Math.min(100, category.percentage)}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>
                        {formatCurrency(category.actual)} of{" "}
                        {formatCurrency(category.budget)}
                      </span>
                      <span
                        className={
                          category.remaining < 0 ? "text-red-600" : "text-emerald-600"
                        }
                      >
                        {category.remaining < 0 ? "-" : "+"}
                        {formatCurrency(Math.abs(category.remaining))}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {budgetData.categories.length === 0 && (
            <div className="flex flex-col items-center justify-center p-8 border rounded-md bg-muted/20">
              <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">No Categories Found</h3>
              <p className="text-sm text-muted-foreground mb-4 text-center">
                You need to create categories with budget amounts to see your budget overview.
              </p>
              <Button asChild>
                <Link href="/categories">
                  <ChevronRight className="mr-1 h-4 w-4" />
                  Go to Categories
                </Link>
              </Button>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
} 