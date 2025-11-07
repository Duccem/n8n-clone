import { redirect } from "next/navigation";
import { getSession } from "./get-session";

export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    return redirect("/sign-in");
  }

  return session;
}

export async function requireAnon() {
  const session = await getSession();

  if (session) {
    return redirect("/dashboard");
  }

  return null;
}

