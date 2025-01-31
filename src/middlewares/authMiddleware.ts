import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import UserService from "@/services/UserService";
import { APP_PERMISSIONS, AppPermissionType } from "@/config/permissions";

const userService = new UserService();

async function authMiddleware(
  request: Request,
  showError: boolean = false,
  requiredPermissions?: AppPermissionType[]
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

  if (userId && requiredPermissions?.length) {
    try {
      const user = await userService.getUserById(userId);
      if (!user || !user.roles) {
        return NextResponse.json(
          { error: "Forbidden: User roles not found" },
          { status: 403 }
        );
      }

      const userPermissions = new Set(
        user.roles.flatMap((role) => role.permissions)
      );
      console.log(userPermissions);
      const hasPermission = requiredPermissions.some((perm) =>
        userPermissions.has(perm)
      );

      if (!hasPermission) {
        return NextResponse.json(
          { error: "Forbidden: Insufficient permissions" },
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
  requiredPermissions?: AppPermissionType[]
) {
  return async (request: Request): Promise<NextResponse> => {
    const authResult = await authMiddleware(
      request,
      isProtected,
      requiredPermissions
    );

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { userId } = authResult;
    return routeHandler(request, userId);
  };
}
