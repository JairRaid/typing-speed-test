import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Typing speed test",
  description: "Practice typing and measure your speed and accuracy.",
  icons: {
    icon: "/images/logo-small.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${sora.className} bg-neutral-900`}>{children}</body>
    </html>
  );
}
