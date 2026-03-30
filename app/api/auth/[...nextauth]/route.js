/**
 * NextAuth.js configuration — handles Google OAuth login.
 *
 * How it works:
 * 1. User clicks "Sign in with Google"
 * 2. Google asks them to confirm their identity
 * 3. Google sends back a token with their email
 * 4. We check if their email is in the ALLOWED_EMAILS list
 * 5. If yes → they see the dashboard. If no → access denied.
 */

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Allowed emails — only these people can access the dashboard.
// This reads from the ALLOWED_EMAILS environment variable in Vercel.
const allowedEmails = (process.env.ALLOWED_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    /**
     * signIn callback — runs when someone tries to log in.
     * Returns true (allow) or false (deny).
     */
    async signIn({ user }) {
      const email = (user.email || "").toLowerCase();

      // If no allowed emails are configured, allow everyone (fail-open for development)
      if (allowedEmails.length === 0) {
        console.warn("WARNING: ALLOWED_EMAILS is empty — allowing all users");
        return true;
      }

      if (allowedEmails.includes(email)) {
        return true;
      }

      console.log(`Access denied for: ${email}`);
      return false;
    },

    /**
     * session callback — adds the user's email to the session object
     * so we can display it on the page.
     */
    async session({ session }) {
      return session;
    },
  },

  pages: {
    signIn: "/login",       // Custom login page (not the default NextAuth page)
    error: "/login",        // Redirect auth errors to login page too
  },
});

export { handler as GET, handler as POST };
