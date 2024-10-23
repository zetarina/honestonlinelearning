import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import jwt, { JwtPayload } from "jsonwebtoken";
import UserService from "@/services/UserService";
import { UserRole } from "@/models/UserModel";
import { authOptions } from "@/config/authOptions";

const userService = new UserService();

async function authMiddleware(
  request: Request,
  showError: boolean = false,
  requiredRoles?: UserRole[]
) {
  let userId: string | null = null;

  const authorizationHeader = request.headers.get("authorization");

  // Ensure authorizationHeader is not null and has the correct Bearer format
  if (authorizationHeader?.startsWith("Bearer ")) {
    const tokenParts = authorizationHeader.split(" ");
    console.log(tokenParts)
    
    // Check if the token is present after splitting
    if (tokenParts.length === 2) {
      const token = tokenParts[1];

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        if (typeof decoded === "object" && decoded.userId) {
          userId = decoded.userId as string;
        }
      } catch (error) {
        console.error("Invalid token");
        if (showError) {
          return NextResponse.json(
            { error: "Unauthorized: Invalid token" },
            { status: 401 }
          );
        }
      }
    } else {
      console.error("Invalid Bearer token format");
      if (showError) {
        return NextResponse.json(
          { error: "Unauthorized: Invalid token format" },
          { status: 401 }
        );
      }
    }
  }

  if (!userId) {
    const session = await getServerSession(authOptions);

    if (session && session.user?.id) {
      userId = session.user.id;
    } else if (showError) {
      return NextResponse.json(
        { error: "Unauthorized: No valid session or token" },
        { status: 401 }
      );
    }
  }

  if (userId && requiredRoles?.length) {
    try {
      const user = await userService.getUserById(userId);
      if (!user || !requiredRoles.includes(user.role)) {
        return NextResponse.json(
          { error: "Forbidden: Insufficient role" },
          { status: 403 }
        );
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }

  return { userId };
}

export function withAuthMiddleware(
  routeHandler: (
    request: Request,
    userId: string | null
  ) => Promise<NextResponse>,
  showError: boolean = false,
  requiredRoles?: UserRole[]
) {
  return async (request: Request) => {
    const authResult = await authMiddleware(request, showError, requiredRoles);

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { userId } = authResult;

    return routeHandler(request, userId);
  };
}
