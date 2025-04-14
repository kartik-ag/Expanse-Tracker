"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, CalendarIcon, Loader2 } from "lucide-react";
import Link from "next/link";

type Category = {
  _id: string;
  name: string;
  color: string;
};

type Transaction = {
  _id: string;
  amount: number;
  description: string;
  date: string;
  category?: string;
};

// Form validation schema
const formSchema = z.object({
  amount: z.coerce
    .number()
    .positive("Amount must be a positive number")
    .min(0.01, "Amount must be at least 0.01"),
  description: z
    .string()
    .min(2, "Description must be at least 2 characters")
    .max(100, "Description must be less than 100 characters"),
  date: z.string().min(1, "Date is required"),
  category: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditTransactionPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchingCategories, setFetchingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      description: "",
      date: new Date().toISOString().split('T')[0],
      category: undefined,
    },
  });

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await fetch(`/api/transactions/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch transaction");
        }
        const data = await response.json();
        setTransaction(data);

        // Format the date to YYYY-MM-DD
        const formattedDate = new Date(data.date).toISOString().split('T')[0];
        
        // Set form values
        form.reset({
          amount: data.amount,
          description: data.description,
          date: formattedDate,
          category: data.category?._id,
        });
      } catch (err) {
        console.error("Error fetching transaction:", err);
        setError("Failed to load transaction. Please try again.");
        toast.error("Failed to load transaction");
      } finally {
        setIsFetching(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        toast.error("Failed to load categories");
      } finally {
        setFetchingCategories(false);
      }
    };

    fetchTransaction();
    fetchCategories();
  }, [id, form]);

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to update transaction");
      }

      toast.success("Transaction updated successfully");
      router.push("/transactions");
      router.refresh();
    } catch (err) {
      console.error("Error updating transaction:", err);
      toast.error("Failed to update transaction");
      setIsLoading(false);
    }
  };

  if (isFetching) {
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
        <Button asChild>
          <Link href="/transactions">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Transactions
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1"
          asChild
        >
          <Link href="/transactions">
            <ArrowLeft className="h-4 w-4" />
            Back to Transactions
          </Link>
        </Button>
      </div>

      <div className="flex items-center">
        <h1 className="text-3xl font-bold tracking-tight">Edit Transaction</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Grocery shopping" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="date"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                      disabled={fetchingCategories}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {fetchingCategories ? (
                          <div className="flex justify-center py-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        ) : (
                          categories.map((category) => (
                            <SelectItem
                              key={category._id}
                              value={category._id}
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className="h-3 w-3 rounded-full"
                                  style={{ backgroundColor: category.color }}
                                ></div>
                                {category.name}
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Update Transaction"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
} 