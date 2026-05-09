"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useMemo, type ReactNode } from "react";

const fallbackConvexUrl = "https://placeholder.convex.cloud";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const client = useMemo(
    () => new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || fallbackConvexUrl),
    []
  );

  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
