// src/app/api/auth/logout/route.ts

import { NextRequest, NextResponse } from "next/server";
import UserService from "@/services/UserService";

const userService = new UserService();

// Named export for the POST method
export async function POST(req: NextRequest) {
  try {
    const { refreshToken, deviceName } = await req.json();

    if (!refreshToken || !deviceName) {
      return NextResponse.json(
        { message: "Refresh token and device name are required." },
        { status: 400 }
      );
    }

    // Remove refresh token associated with the given device
    const user = await userService.findRefreshToken(refreshToken);
    if (!user) {
      return NextResponse.json(
        { message: "Invalid refresh token." },
        { status: 403 }
      );
    }

    await userService.deleteDeviceToken(user._id as string, refreshToken);

    // Clear the refresh token cookie
    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );

    response.headers.set(
      "Set-Cookie",
      `refreshToken=; HttpOnly; Path=/; Max-Age=0`
    );

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
