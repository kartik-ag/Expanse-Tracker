import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Personal Finance Tracker",
  description: "Track your personal finances with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-background flex flex-col">
          <Navbar />
          <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
            {children}
          </main>
          <footer className="border-t py-4 bg-muted/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
              Personal Finance Tracker &copy; {new Date().getFullYear()}
            </div>
          </footer>
        </div>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
