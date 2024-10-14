import { NextResponse } from "next/server";
import UserService from "@/services/UserService";

const userService = new UserService();

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.email || !data.password || !data.username) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
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
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
