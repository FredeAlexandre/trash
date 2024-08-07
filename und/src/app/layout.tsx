import "~/styles/globals.css";

import { Inter as FontSans } from "next/font/google";

import { cn } from "~/lib/utils";
import { GlobalProviders } from "~/providers";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Underscore Valorant",
  description: "Underscore enchants your Valorant competitive experience.",
  icons: [
    { rel: "icon", url: "/favicon.ico", sizes: "any" },
    {
      rel: "icon",
      url: "/icons/favicon-16x16.png",
      sizes: "16x16",
    },
    {
      rel: "icon",
      url: "/icons/favicon-32x32.png",
      sizes: "32x32",
    },
    {
      rel: "apple-touch-icon",
      url: "/icons/apple-touch-icon.png",
      sizes: "180x180",
    },
    {
      rel: "manifest",
      url: "/icons/site.webmanifest",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <GlobalProviders>{children}</GlobalProviders>
      </body>
    </html>
  );
}
