import "./globals.css";
import type { Metadata } from "next";
import { Inter, Anton, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jetMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "XGenius — World Cup Prediction & Simulation",
  description:
    "AI-powered FIFA World Cup match prediction and Monte Carlo tournament simulation.",
  icons: {
    icon: "/x.png",
    apple: "/x.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${anton.variable} ${jetMono.variable}`}
    >
      <body className="min-h-screen font-sans antialiased">
        <Navbar />
        <main className="container-x py-10 sm:py-14">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
