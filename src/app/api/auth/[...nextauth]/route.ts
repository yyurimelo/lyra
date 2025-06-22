import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { NextAuthOptions } from "next-auth";
import { http } from "@lyra/config/http-config/page";

const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        try {
          const response = await fetch(`${http}/shared/auth`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            return null;
          }

          const user = await response.json();

          if (user && user.id) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              description: user.description,
              userIdentifier: user.userIdentifier,
              appearancePrimaryColor: user.appearancePrimaryColor,
              appearanceTextPrimaryLight: user.appearanceTextPrimaryLight,
              appearanceTextPrimaryDark: user.appearanceTextPrimaryDark,
              token: user.token,
            };
          }

          return null;
        } catch (error) {
          console.error("Erro na autenticação:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const response = await fetch(`${http}/shared/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              authProvider: 1,
            }),
          });

          if (!response.ok) return false;

          const data = await response.json();

          user.id = data.id;
          user.name = data.name;
          user.email = data.email;
          user.description = data.description;
          user.userIdentifier = data.userIdentifier;
          user.appearancePrimaryColor = data.appearancePrimaryColor;
          user.appearanceTextPrimaryLight = data.appearanceTextPrimaryLight;
          user.appearanceTextPrimaryDark = data.appearanceTextPrimaryDark;

          return true;
        } catch (error) {
          console.error("Erro no login com Google:", error);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      session.user = token as any;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
