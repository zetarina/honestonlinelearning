import { NextResponse } from "next/server";
import UserService from "@/services/UserService";

const userService = new UserService();

export async function POST(request: Request) {
  try {
    const { email, password, username, deviceName } = await request.json();

    if (!email || !password || !username || !deviceName) {
      return NextResponse.json(
        { error: "Username, email, password, and device name are required." },
        { status: 400 }
      );
    }

    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email." },
        { status: 400 }
      );
    }

    const newUser = await userService.signup({ email, password, username });

    const { token: accessToken, expirationTime: accessTokenExpiry } =
      userService.generateAccessToken(newUser.id);
    const { token: refreshToken, expirationTime: refreshTokenExpiry } =
      userService.generateRefreshToken(newUser.id);

    await userService.saveDeviceToken(newUser.id, deviceName, refreshToken);
    const safeUser = await userService.getSafeUserByEmail(email);
    return NextResponse.json(
      {
        user: safeUser,
        accessToken,
        accessTokenExpiry,
        refreshToken,
        refreshTokenExpiry,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
