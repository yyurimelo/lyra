import "next-auth";

declare module "next-auth" {
  interface User {
    email: string;
    name: string;
    description?: string;
    appearancePrimaryColor?: string;
    userIdentifier: string;
  }

  interface Session extends DefaultSession {
    user: User;
    expires_in: string;
    error: string;
  }
}
