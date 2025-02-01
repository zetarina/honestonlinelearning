import { NextRequest, NextResponse } from "next/server";
import UserService from "@/services/UserService";

const userService = new UserService();

export async function POST(req: NextRequest) {
  try {
    const { refreshToken, deviceName } = await req.json();
    console.log(refreshToken,deviceName)
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

    await userService.deleteDeviceToken(user.id, refreshToken);

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
