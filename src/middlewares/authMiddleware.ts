import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import UserService from "@/services/UserService";
import { AppPermissionType } from "@/config/permissions";
import { User } from "@/models/UserModel";

const userService = new UserService();

async function authMiddleware(
  request: Request,
  requiredPermissions?: AppPermissionType[]
): Promise<
  { user: User | null; highestRoleLevel: number | null } | NextResponse
> {
  let userId: string | null = null;
  const authorizationHeader = request.headers.get("authorization");

  if (authorizationHeader?.startsWith("Bearer ")) {
    const token = authorizationHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      if (typeof decoded === "object" && decoded.userId) {
        userId = decoded.userId;
      }
    } catch (error: any) {
      console.error("Invalid token:", error.message);
    }
  }

  if (!userId) {
    return { user: null, highestRoleLevel: null };
  }

  try {
    const user = await userService.getSafeUserById(userId);
    if (!user || !user.roles) {
      return { user: null, highestRoleLevel: null };
    }

    const highestRoleLevel = Math.min(...user.roles.map((role) => role.level));

    if (requiredPermissions?.length) {
      const userPermissions = new Set(
        user.roles.flatMap((role) => role.permissions)
      );

      const hasPermission = requiredPermissions.every((perm) =>
        userPermissions.has(perm)
      );

      if (!hasPermission) {
        return NextResponse.json(
          { error: "Forbidden: Insufficient permissions" },
          { status: 403 }
        );
      }
    }

    return { user, highestRoleLevel };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export function withAuthMiddleware<Protected extends boolean>(
  routeHandler: (
    request: Request,
    user: Protected extends true ? User : User | null,
    highestRoleLevel: number | null
  ) => Promise<NextResponse>,
  isProtected: Protected,
  requiredPermissions?: AppPermissionType[]
): (request: Request) => Promise<NextResponse> {
  return async (request: Request): Promise<NextResponse> => {
    const authResult = await authMiddleware(request, requiredPermissions);

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user, highestRoleLevel } = authResult;

    if (isProtected && !user) {
      return NextResponse.json(
        { error: "Unauthorized: User is required for this action" },
        { status: 401 }
      );
    }

    return routeHandler(
      request,
      user as Protected extends true ? User : User | null,
      highestRoleLevel
    );
  };
}
