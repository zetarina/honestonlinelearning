import { NextResponse } from "next/server";
import SettingService from "@/services/SettingService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { UserRole } from "@/models/UserModel";
import { SettingsInterface } from "@/config/settingKeys";

const settingService = new SettingService();

async function handleGetAllSettingsRequest(request: Request) {
  try {
    const settings = await settingService.getAllSettings();

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Handle PUT: Bulk update settings
async function handleUpsertSettingsRequest(request: Request) {
  try {
    const { settings } = await request.json();

    // Check if settings is an object and not null or an array
    if (
      typeof settings !== "object" ||
      Array.isArray(settings) ||
      settings === null
    ) {
      return NextResponse.json(
        { error: "Invalid request payload" },
        { status: 400 }
      );
    }

    // Call the service to handle bulk updates
    const updatedSettings = await settingService.upsertSettings(
      settings as Partial<SettingsInterface>
    );

    return NextResponse.json({
      message: "Settings updated successfully",
      updatedSettings,
    });
  } catch (error) {
    console.error("Error updating settings in bulk:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const GET = async (request: Request) =>
  withAuthMiddleware((req, userId) => handleGetAllSettingsRequest(req), true, [
    UserRole.ADMIN,
  ])(request);

// PUT: Bulk update settings (admin only)
export const PUT = async (request: Request) =>
  withAuthMiddleware((req) => handleUpsertSettingsRequest(req), true, [
    UserRole.ADMIN,
  ])(request);
