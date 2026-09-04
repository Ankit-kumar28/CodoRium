import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./global.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CodoRium — Departmental Competitive Coding Platform",
    template: "%s | CodoRium",
  },
  description:
    "Practice coding problems, participate in departmental contests, track your performance and improve your competitive programming skills.",
  keywords: [
    "coding",
    "competitive programming",
    "college",
    "contests",
    "leaderboard",
    "CodoRium",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: "'Inter', sans-serif",
            },
          }}
          richColors
          closeButton
        />
      </body>
    </html>
  );
}