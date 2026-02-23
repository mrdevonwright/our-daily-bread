import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "sonner";
import { MannaChatBot } from "@/components/chat/MannaChatBot";

export const metadata: Metadata = {
  title: {
    default: "Our Daily Bread — A Movement to Fund Churches Through Sourdough",
    template: "%s | Our Daily Bread",
  },
  description:
    "Join a nationwide movement of Christian bakers selling sourdough bread at church to redirect America's bread dollars back to local congregations.",
  keywords: [
    "church fundraiser",
    "sourdough bread",
    "Christian charity",
    "church baking",
    "our daily bread movement",
  ],
  openGraph: {
    type: "website",
    siteName: "Our Daily Bread",
    title: "Our Daily Bread — A Movement to Fund Churches Through Sourdough",
    description:
      "Join a nationwide movement of Christian bakers selling sourdough bread at church.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster richColors position="top-right" />
        <MannaChatBot />
      </body>
    </html>
  );
}
