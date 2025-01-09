import { NextResponse } from "next/server";
import SettingService from "@/services/SettingService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { UserRole } from "@/models/UserModel";
import { PAYMENT_SETTINGS_TYPES } from "@/config/settings/PAYMENT_SETTINGS_KEYS";
import { Mail_SETTINGS_TYPES } from "@/config/settings/MAIL_SERVICE_KEYS";
import { MESSAGING_SERVICE_TYPES } from "@/config/settings/MESSAGING_SERVICE_KEYS";
import { SITE_SETTINGS_TYPES } from "@/config/settings/SITE_SETTINGS_KEYS";
import { SOCIAL_MEDIA_SETTINGS_TYPES } from "@/config/settings/SOCIAL_MEDIA_KEYS";
import { STORAGE_SETTINGS_TYPES } from "@/config/settings/STORAGE_SETTINGS_KEYS";

const settingService = new SettingService();

type ValidSettingKey =
  | keyof SITE_SETTINGS_TYPES
  | keyof Mail_SETTINGS_TYPES
  | keyof STORAGE_SETTINGS_TYPES
  | keyof PAYMENT_SETTINGS_TYPES
  | keyof SOCIAL_MEDIA_SETTINGS_TYPES
  | keyof MESSAGING_SERVICE_TYPES;

async function handleGetSettingByKey(
  request: Request,
  params: { key: ValidSettingKey }
) {
  try {
    const setting = await settingService.getSettingByKey(params.key);

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

export const GET = async (
  request: Request,
  context: { params: { key: ValidSettingKey } }
) =>
  withAuthMiddleware(
    (req, userId) => handleGetSettingByKey(req, context.params),
    true,
    [UserRole.ADMIN]
  )(request);
