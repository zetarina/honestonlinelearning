import CredentialsProvider from "next-auth/providers/credentials";
import { hashPassword } from "@/utils/auth";
import UserService from "@/services/UserService";
import { AuthOptions } from "next-auth";
import { User } from "next-auth";

const userService = new UserService();

export const authOptions: AuthOptions = {
  debug: true,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email and password are required");
        }

        const user = await userService.getUserByEmail(credentials.email);
        if (!user) {
          throw new Error("Invalid email or password");
        }

        const { hashedPassword } = hashPassword(
          credentials.password,
          user.salt
        );
        if (hashedPassword !== user.hashedPassword) {
          throw new Error("Invalid email or password");
        }

        const safeUser: User = {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
          pointsBalance: user.pointsBalance,
          pointTransactions: user.pointTransactions,
        };

        return safeUser;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token?.id) {
        const user = await userService.getSafeUserById(token.id.toString());
        if (user) {
          session.user = {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            role: user.role,
            pointsBalance: user.pointsBalance,
            pointTransactions: user.pointTransactions,
          };
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
};
