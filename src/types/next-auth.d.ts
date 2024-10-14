// next-auth.d.ts
import NextAuth from "next-auth";
import { UserRole, PointTransaction } from "./models/UserModel";

declare module "next-auth" {
  interface Session {
    user: User;
  }

  interface User {
    id: string;
    username: string; // Add this line to include 'username'
    email: string;
    role: UserRole;
    pointTransactions: PointTransaction[]; // Include point transactions
    pointsBalance: number; // Include points balance
  }
}
