import { NextResponse } from "next/server";
import UserService from "@/services/UserService";
import { userRepository } from "@/repositories";
import { PointTransactionType, UserRole } from "@/models/UserModel";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";

const userService = new UserService();

async function handleAddPointsRequest(request: Request, userId: string | null) {
  try {
    const { userId: targetUserId, points, reason } = await request.json();

    if (!targetUserId || !points || isNaN(points) || points <= 0) {
      return NextResponse.json(
        { error: "Invalid user ID or points value" },
        { status: 400 }
      );
    }

    const updatedUser = await userService.manipulateUserPoints(
      targetUserId,
      points,
      PointTransactionType.ADDED_BY_SYSTEM,
      { reason }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Failed to add points to user" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: `Successfully added ${points} points to user ${updatedUser.username}`,
    });
  } catch (error) {
    console.error("Error adding points:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const POST = async (request: Request) =>
  withAuthMiddleware(
    (req, userId) => handleAddPointsRequest(req, userId),
    true,
    [UserRole.ADMIN]
  )(request);
