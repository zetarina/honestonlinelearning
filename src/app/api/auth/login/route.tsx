// src/app/api/auth/login/route.ts

import { NextRequest, NextResponse } from "next/server";
import UserService from "@/services/UserService";

const userService = new UserService();

// Named export for the POST method
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const deviceName = "Mobile";
    if (!email || !password || !deviceName) {
      return NextResponse.json(
        { message: "Email, password, and device name are required." },
        { status: 400 }
      );
    }

    const user = await userService.getUserByEmail(email);
    if (!user || !(await userService.verifyPassword(password, user))) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const accessToken = userService.generateAccessToken(user._id as string);
    const refreshToken = userService.generateRefreshToken(user._id as string);

    // Save the refresh token along with the device name
    await userService.saveDeviceToken(
      user._id as string,
      deviceName,
      refreshToken
    );

    return NextResponse.json({ accessToken, refreshToken }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
