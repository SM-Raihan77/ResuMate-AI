import { createAuthClient } from "better-auth/react";
import { customSessionClient } from "better-auth/client/plugins";

export const { signIn, signUp, signOut, useSession } = createAuthClient({
  plugins: [customSessionClient()],
});