import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import UserService from "@/services/UserService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { UserRole, User } from "@/models/UserModel";

const userService = new UserService();

/**
 * Handler to fetch all instructors.
 * @param request The incoming request object.
 * @param userId The ID of the authenticated user (if any).
 * @returns A JSON response containing the list of instructors or an error message.
 */
async function handleGetAllInstructorsRequest(
  request: Request,
  userId: string | null
): Promise<NextResponse> {
  try {
    const instructors = await userService.getUsersByRole(
      UserRole.INSTRUCTOR,
      true
    );

    return NextResponse.json(instructors, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching instructors:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const GET = async (request: Request) =>
  withAuthMiddleware(
    (req, userId) => handleGetAllInstructorsRequest(req, userId),
    false
  )(request);
