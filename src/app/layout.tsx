import type { Metadata } from "next";
import "./globals.css";

// Using system fonts to avoid external font loading issues
const geistSans = {
  variable: "--font-geist-sans",
};

const geistMono = {
  variable: "--font-geist-mono",
};

export const metadata: Metadata = {
  title: "WhiteInputSyndrome | AI Project Manager",
  description: "Zero-cost AI launchpad. 68 Tools. One Plan.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen relative px-[36px]`}
      >
        <div className="bg-aurora" />
        {children}
      </body>
    </html>
  );
}
