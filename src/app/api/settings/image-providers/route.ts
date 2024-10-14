import { NextResponse } from "next/server";
import SettingService from "@/services/SettingService";
import { SETTINGS_KEYS } from "@/config/settingKeys";

const settingService = new SettingService();

export const GET = async (request: Request) => {
  try {
    const settings = await settingService.getAllSettings();

    // Filter and map the image provider settings based on SETTINGS_KEYS
    const result = {
      [SETTINGS_KEYS.IMGBB_API_KEY]:
        settings.find((s) => s.key === SETTINGS_KEYS.IMGBB_API_KEY)?.value ||
        "",
      [SETTINGS_KEYS.CLOUDINARY_CLOUD_NAME]:
        settings.find((s) => s.key === SETTINGS_KEYS.CLOUDINARY_CLOUD_NAME)
          ?.value || "",
      [SETTINGS_KEYS.CLOUDINARY_UPLOAD_PRESET]:
        settings.find((s) => s.key === SETTINGS_KEYS.CLOUDINARY_UPLOAD_PRESET)
          ?.value || "",
      [SETTINGS_KEYS.AWS_BUCKET]:
        settings.find((s) => s.key === SETTINGS_KEYS.AWS_BUCKET)?.value || "",
      [SETTINGS_KEYS.AWS_REGION]:
        settings.find((s) => s.key === SETTINGS_KEYS.AWS_REGION)?.value || "",
      [SETTINGS_KEYS.AWS_ACCESS_KEY_ID]:
        settings.find((s) => s.key === SETTINGS_KEYS.AWS_ACCESS_KEY_ID)
          ?.value || "",
      [SETTINGS_KEYS.AWS_SECRET_ACCESS_KEY]:
        settings.find((s) => s.key === SETTINGS_KEYS.AWS_SECRET_ACCESS_KEY)
          ?.value || "",
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching image provider settings:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
