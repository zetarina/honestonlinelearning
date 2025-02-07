import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import UserService from "@/services/UserService";

const userService = new UserService();

export async function POST(req: NextRequest) {
  try {
    // Check if Content-Type is JSON
    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json(
        { message: "Invalid request format. Expected JSON." },
        { status: 400 }
      );
    }

    let requestBody;
    try {
      requestBody = await req.json();
    } catch (error) {
      console.error("Failed to parse JSON body:", error);
      return NextResponse.json(
        { message: "Invalid JSON body or empty request." },
        { status: 400 }
      );
    }

    const { refreshToken, deviceName } = requestBody;

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
      console.error("JWT verification failed:", err);
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

    // Refresh token should be renewed if it's expiring in less than 7 days
    if (timeRemaining < 7 * 24 * 60 * 60 * 1000) {
      const { token: newRefresh, expirationTime: newRefreshExpiry } =
        await userService.generateRefreshToken(payload.userId as string);
      newRefreshToken = newRefresh;
      newRefreshTokenExpiry = newRefreshExpiry;
    }

    // Generate new access token
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
      { message: "An unexpected error occurred during token refresh." },
      { status: 500 }
    );
  }
}
