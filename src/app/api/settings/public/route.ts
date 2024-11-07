import { NextResponse } from "next/server";
import dbConnect from "@/db";
import SettingService from "@/services/SettingService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { UserRole } from "@/models/UserModel";

const settingService = new SettingService();

async function handleGetAllPublicSettingsRequest(request: Request) {
  try {
    const settings = await settingService.getPublicSettings();

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const GET = async (request: Request) =>
  withAuthMiddleware((req, userId) => handleGetAllPublicSettingsRequest(req), true, [
    UserRole.ADMIN,
  ])(request);
