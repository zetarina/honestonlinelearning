import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import UserService from "@/services/UserService";

const userService = new UserService();

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

    let payload: jwt.JwtPayload;
    try {
      payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!
      ) as jwt.JwtPayload;
    } catch (err) {
      return NextResponse.json(
        { message: "Failed to verify refresh token." },
        { status: 403 }
      );
    }

    if (!payload.exp) {
      return NextResponse.json(
        { message: "Refresh token is missing expiry information." },
        { status: 403 }
      );
    }

    const refreshTokenExpiryTime = payload.exp * 1000;
    const currentTime = Date.now();
    const timeRemaining = refreshTokenExpiryTime - currentTime;

    let newRefreshToken = refreshToken;
    let newRefreshTokenExpiry = refreshTokenExpiryTime;

    if (timeRemaining < 7 * 24 * 60 * 60 * 1000) {
      const { token: newRefresh, expirationTime: newRefreshExpiry } =
        await userService.generateRefreshToken(payload.userId as string);
      newRefreshToken = newRefresh;
      newRefreshTokenExpiry = newRefreshExpiry;
    }

    const { token: newAccessToken, expirationTime: newAccessTokenExpiry } =
      await userService.generateAccessToken(payload.userId as string);

    return NextResponse.json(
      {
        accessToken: newAccessToken,
        accessTokenExpiry: newAccessTokenExpiry,
        refreshToken: newRefreshToken,
        refreshTokenExpiry: newRefreshTokenExpiry,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during token refresh:", error);
    return NextResponse.json(
      { message: "Invalid or expired refresh token." },
      { status: 403 }
    );
  }
}
