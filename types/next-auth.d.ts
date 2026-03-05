import "next-auth";

declare module "next-auth" {
  interface User {
    groups: string[];
    isAdmin: boolean;
  }
}
