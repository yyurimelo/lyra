import "next-auth";

declare module "next-auth" {
  interface User {
    email: string;
    name: string;
    description?: string;
    appearancePrimaryColor?: string;
    appearanceTextPrimaryLight?: string;
    appearanceTextPrimaryDark?: string;
    userIdentifier: string;
    token: string;
  }

  interface Session extends DefaultSession {
    user: User;
    expires_in: string;
    error: string;
  }
}
