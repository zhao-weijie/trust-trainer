import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppShell } from "@/components/AppShell";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import "./style.css";

export const metadata: Metadata = {
  title: "Trust Trainer",
  description: "Human-reviewed safety drills for suspicious digital content."
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ConvexClientProvider>
          <AppShell>{children}</AppShell>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
