import type { Metadata } from "next";
import { Roboto, Akshar, Roboto_Slab } from "next/font/google";
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

const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  subsets: ["latin"],
  weight: ["400"],
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
        className={`${roboto.variable} ${akshar.variable} ${robotoSlab.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
