import { getServerAuthSession } from "~/server/auth";
import { TRPCReactProvider } from "~/trpc/react";

import { AuthProvider } from "./auth-provider";
import { ThemeProvider } from "./theme-provider";

export async function GlobalProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  return (
    <AuthProvider session={session}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        forcedTheme="dark"
        disableTransitionOnChange
      >
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
