import { NextResponse } from "next/server";
import SettingService from "@/services/SettingService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { UserRole } from "@/models/UserModel";

const settingService = new SettingService();

// Handle GET: Fetch setting by key
async function handleGetSettingByKey(
  request: Request,
  params: { key: string }
) {
  try {
    const setting = await settingService.getSettingByKey(params.key); // Fetch by key

    if (!setting) {
      return NextResponse.json({ error: "Setting not found" }, { status: 404 });
    }

    return NextResponse.json(setting);
  } catch (error) {
    console.error("Error fetching setting:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Handle PUT: Update setting by key
async function handleUpdateSettingByKey(
  request: Request,
  params: { key: string }
) {
  try {
    const body = await request.json();
    const updatedSetting = await settingService.setSettingByKey(
      params.key,
      body.value,
      body.environment,
      body.isPublic
    );

    if (!updatedSetting) {
      return NextResponse.json({ error: "Setting not found" }, { status: 404 });
    }

    return NextResponse.json(updatedSetting);
  } catch (error) {
    console.error("Error updating setting:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Handle DELETE: Delete setting by key
async function handleDeleteSettingByKey(
  request: Request,
  params: { key: string }
) {
  try {
    const deletedSetting = await settingService.getSettingByKey(params.key);
    if (!deletedSetting) {
      return NextResponse.json({ error: "Setting not found" }, { status: 404 });
    }

    await settingService.deleteSettingById(deletedSetting._id.toString());
    return NextResponse.json({ message: "Setting deleted successfully" });
  } catch (error) {
    console.error("Error deleting setting:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// GET: Fetch specific setting by key (admin only)
export const GET = async (
  request: Request,
  context: { params: { key: string } }
) =>
  withAuthMiddleware(
    (req, userId) => handleGetSettingByKey(req, context.params),
    true,
    [UserRole.ADMIN]
  )(request);

// PUT: Update specific setting by key (admin only)
export const PUT = async (
  request: Request,
  context: { params: { key: string } }
) =>
  withAuthMiddleware(
    (req, userId) => handleUpdateSettingByKey(req, context.params),
    true,
    [UserRole.ADMIN]
  )(request);

// DELETE: Delete specific setting by key (admin only)
export const DELETE = async (
  request: Request,
  context: { params: { key: string } }
) =>
  withAuthMiddleware(
    (req, userId) => handleDeleteSettingByKey(req, context.params),
    true,
    [UserRole.ADMIN]
  )(request);
