import { NextResponse } from "next/server";
import dbConnect from "@/db";
import SettingService from "@/services/SettingService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { UserRole } from "@/models/UserModel";

const settingService = new SettingService();

// Handle GET: Fetch setting by key or ID
async function handleGetSettingByIdOrKey(
  request: Request,
  params: { id: string }
) {
  try {
    const setting = await settingService.getSettingById(params.id); // Fetch by ID

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

// Handle PUT: Update setting by ID
async function handleUpdateSettingById(
  request: Request,
  params: { id: string }
) {
  try {
    const body = await request.json();
    const updatedSetting = await settingService.updateSettingById(
      params.id,
      body.value,
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

// Handle DELETE: Delete setting by ID
async function handleDeleteSettingById(
  request: Request,
  params: { id: string }
) {
  try {
    const deletedSetting = await settingService.deleteSettingById(params.id);

    if (!deletedSetting) {
      return NextResponse.json({ error: "Setting not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Setting deleted successfully" });
  } catch (error) {
    console.error("Error deleting setting:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// GET: Fetch specific setting by ID (admin only)
export const GET = async (
  request: Request,
  context: { params: { id: string } }
) =>
  withAuthMiddleware(
    (req, userId) => handleGetSettingByIdOrKey(req, context.params),
    true,
    [UserRole.ADMIN]
  )(request);

// PUT: Update specific setting by ID (admin only)
export const PUT = async (
  request: Request,
  context: { params: { id: string } }
) =>
  withAuthMiddleware(
    (req, userId) => handleUpdateSettingById(req, context.params),
    true,
    [UserRole.ADMIN]
  )(request);

// DELETE: Delete specific setting by ID (admin only)
export const DELETE = async (
  request: Request,
  context: { params: { id: string } }
) =>
  withAuthMiddleware(
    (req, userId) => handleDeleteSettingById(req, context.params),
    true,
    [UserRole.ADMIN]
  )(request);
