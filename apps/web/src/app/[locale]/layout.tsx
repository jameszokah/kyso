import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";

import "../../global.css";
import Header from "@/components/header";
import Providers from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "kyso",
  description: "kyso",
};

import { I18nProviderClient } from '@/locales/client';

// ...

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <I18nProviderClient locale={locale}>
          <Providers>
            <div className="grid grid-rows-[auto_1fr] h-svh">
              {/* <Header /> */}
              {children}
            </div>
          </Providers>
        </I18nProviderClient>
      </body>
    </html>
  );
}
