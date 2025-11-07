import { cache } from "react";
import { auth, type BetterSession } from "../auth";
import { headers } from "next/headers";

export const getSession = cache(async (): Promise<BetterSession | null> => {
  return await auth.api.getSession({
    headers: await headers(),
  });
});

