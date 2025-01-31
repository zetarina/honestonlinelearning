import { NextResponse } from "next/server";
import UserService from "@/services/UserService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";

const userService = new UserService();

const ALLOWED_STUDENT_FIELDS = [
  "name",
  "username",
  "email",
  "password",
  "bio",
];

async function handleGetUserProfileRequest(
  request: Request,
  userId: string | null
) {
  try {
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await userService.getSafeUserById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function handleUpdateUserProfileRequest(
  request: Request,
  userId: string | null
) {
  try {
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await userService.getUserById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();

    let updateData = body;

    updateData = Object.keys(body)
      .filter((key) => ALLOWED_STUDENT_FIELDS.includes(key))
      .reduce((obj, key) => {
        obj[key] = body[key];
        return obj;
      }, {});

    const updatedUser = await userService.updateUser(userId, updateData);

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Failed to update user" },
        { status: 400 }
      );
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const GET = async (request: Request) =>
  withAuthMiddleware(
    (req, userId) => handleGetUserProfileRequest(req, userId),
    true
  )(request);

export const PUT = async (request: Request) =>
  withAuthMiddleware(
    (req, userId) => handleUpdateUserProfileRequest(req, userId),
    true
  )(request);
