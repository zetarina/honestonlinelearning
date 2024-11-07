import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import UserService from "@/services/UserService";
import { UserRole } from "@/models/UserModel";

const userService = new UserService();

async function authMiddleware(
  request: Request,
  showError: boolean = false,
  requiredRoles?: UserRole[]
): Promise<{ userId: string | null } | NextResponse> {
  let userId: string | null = null;

  const authorizationHeader = request.headers.get("authorization");

  if (authorizationHeader?.startsWith("Bearer ")) {
    const token = authorizationHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      if (typeof decoded === "object" && decoded.userId) {
        userId = decoded.userId;
      }
    } catch (error) {
      console.error("Invalid token:", error.message);
      if (showError) {
        return NextResponse.json(
          { error: "Unauthorized: Invalid token" },
          { status: 401 }
        );
      }
    }
  } else if (showError) {
    console.error("Missing or invalid Authorization header");
    return NextResponse.json(
      { error: "Unauthorized: Missing or invalid Authorization header" },
      { status: 401 }
    );
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
  isProtected: boolean = false,
  requiredRoles?: UserRole[]
) {
  return async (request: Request): Promise<NextResponse> => {
    const authResult = await authMiddleware(
      request,
      isProtected,
      requiredRoles
    );

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { userId } = authResult;

    return routeHandler(request, userId);
  };
}
