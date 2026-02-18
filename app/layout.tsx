import type { Metadata } from "next";
import { Roboto, Akshar } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const akshar = Akshar({
  variable: "--font-akshar",
  subsets: ["latin"],
  weight: ["600"],
});

export const metadata: Metadata = {
  title: "GT | Hive",
  description: "Georgia Tech Student Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${akshar.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
