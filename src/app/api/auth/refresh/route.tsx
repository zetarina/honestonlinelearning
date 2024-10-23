// src/app/api/auth/refresh/route.ts

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
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

    const user = await userService.findRefreshToken(refreshToken);
    if (!user) {
      return NextResponse.json(
        { message: "Invalid refresh token." },
        { status: 403 }
      );
    }

    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as jwt.JwtPayload;

    // Generate a new access token
    const newAccessToken = userService.generateAccessToken(
      payload.userId as string
    );

    return NextResponse.json({ accessToken: newAccessToken }, { status: 200 });
  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json(
      { message: "Invalid or expired refresh token." },
      { status: 403 }
    );
  }
}
