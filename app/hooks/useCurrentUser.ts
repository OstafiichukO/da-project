import { auth } from "app/auth";

export async function useCurrentUser() {
  const session = await auth();
  const user = session?.user;
  return { user };
} 