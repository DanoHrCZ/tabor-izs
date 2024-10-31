import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar"

export const metadata: Metadata = {
  title: "Tábor IZS",
  description: "Tábor IZS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body
      >
        <Navbar></Navbar>
        {children}
      </body>
    </html>
  );
}
