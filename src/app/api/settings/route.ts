import { NextResponse } from "next/server";
import dbConnect from "@/db";
import SettingService from "@/services/SettingService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { UserRole } from "@/models/UserModel";

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

async function handleCreateOrUpdateSettingRequest(request: Request) {
  try {
    const body = await request.json();
    const { key, value, environment = "production", isPublic } = body;

    const updatedSetting = await settingService.setSettingByKey(
      key,
      value,
      environment,
      isPublic
    );

    return NextResponse.json(updatedSetting, { status: 201 });
  } catch (error) {
    console.error("Error creating or updating setting:", error);
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

export const POST = async (request: Request) =>
  withAuthMiddleware(
    (req, userId) => handleCreateOrUpdateSettingRequest(req),
    true,
    [UserRole.ADMIN]
  )(request);
