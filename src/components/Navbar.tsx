import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  CreditCard,
  Home,
  ListChecks,
  PieChart,
  Plus,
} from "lucide-react";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <CreditCard className="h-5 w-5" />
            <span>Finance Tracker</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/"
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
            >
              <Home className="mr-1 h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/transactions"
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
            >
              <ListChecks className="mr-1 h-4 w-4" />
              Transactions
            </Link>
            <Link
              href="/categories"
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
            >
              <PieChart className="mr-1 h-4 w-4" />
              Categories
            </Link>
            <Link
              href="/budget"
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
            >
              <BarChart3 className="mr-1 h-4 w-4" />
              Budget
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild size="sm">
            <Link href="/transactions/new">
              <Plus className="mr-1 h-4 w-4" />
              New Transaction
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar; 