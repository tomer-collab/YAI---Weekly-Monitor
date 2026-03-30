/**
 * Root layout — wraps every page with the session provider.
 * The SessionProvider lets all pages know if the user is logged in.
 */

import { SessionProvider } from "./session-provider";

export const metadata = {
  title: "YAI / VM Group — Weekly Operations Monitor",
  description: "Weekly portfolio dashboard for YAI/VM Group",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
