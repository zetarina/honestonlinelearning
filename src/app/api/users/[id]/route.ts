import { NextResponse } from "next/server";
import UserService from "@/services/UserService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { APP_PERMISSIONS } from "@/config/permissions";

const userService = new UserService();

async function handleGetUserRequest(
  request: Request,
  userId: string | null,
  params: { id: string }
) {
  try {
    const user = await userService.getUserById(params.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function handleUpdateUserRequest(
  request: Request,
  userId: string | null,
  params: { id: string }
) {
  try {
    const data = await request.json();
    const updatedUser = await userService.updateUser(params.id, data);

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function handleDeleteUserRequest(
  request: Request,
  userId: string | null,
  params: { id: string }
) {
  try {
    const deletedUser = await userService.deleteUser(params.id);

    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const GET = async (
  request: Request,
  context: { params: { id: string } }
) =>
  withAuthMiddleware(
    (req, userId) => handleGetUserRequest(req, userId, context.params),
    true,
    [APP_PERMISSIONS.MANAGE_USERS]
  )(request);

export const PUT = async (
  request: Request,
  context: { params: { id: string } }
) =>
  withAuthMiddleware(
    (req, userId) => handleUpdateUserRequest(req, userId, context.params),
    true,
    [APP_PERMISSIONS.MANAGE_USERS]
  )(request);

export const DELETE = async (
  request: Request,
  context: { params: { id: string } }
) =>
  withAuthMiddleware(
    (req, userId) => handleDeleteUserRequest(req, userId, context.params),
    true,
    [APP_PERMISSIONS.MANAGE_USERS]
  )(request);
