// lib/session.ts
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { cache } from "react";

// This will only hit the database ONCE per page load, 
// no matter how many Server Components call it.
export const getCachedSession = cache(async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
});