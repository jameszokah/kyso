import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";

import "@/app/global.css";
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

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  return (
    <html lang={locale} data-scroll-behavior="smooth" suppressHydrationWarning>
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
