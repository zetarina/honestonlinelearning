import { NextResponse } from "next/server";
import UserService from "@/services/UserService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { UserRole } from "@/models/UserModel";

const userService = new UserService();

async function handleGetAllUsersRequest(
  request: Request,
  userId: string | null
) {
  try {
    const users = await userService.getAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function handleCreateUserRequest(
  request: Request,
  userId: string | null
) {
  try {
    const data = await request.json();

    if (!data.email || !data.password || !data.username) {
      return NextResponse.json(
        { error: "Username, email, and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await userService.getUserByEmail(data.email);
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
      );
    }

    const newUser = await userService.createUser(data);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const GET = async (request: Request) =>
  withAuthMiddleware(
    (req, userId) => handleGetAllUsersRequest(req, userId),
    false
  )(request);

export const POST = async (request: Request) =>
  withAuthMiddleware(
    (req, userId) => handleCreateUserRequest(req, userId),
    true,
    [UserRole.ADMIN]
  )(request);
