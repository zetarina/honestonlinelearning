import { NextResponse } from "next/server";
import SettingService from "@/services/SettingService";
import { STORAGE_SETTINGS_KEYS } from "@/config/settings/STORAGE_SETTINGS_KEYS";

const settingService = new SettingService();

export const GET = async (request: Request) => {
  try {
    const settings = await settingService.getAllSettings();

    const result = {
      [STORAGE_SETTINGS_KEYS.IMGBB]: {
        apiKey: settings[STORAGE_SETTINGS_KEYS.IMGBB]?.apiKey || "",
      },
      [STORAGE_SETTINGS_KEYS.CLOUDINARY]: {
        cloudName: settings[STORAGE_SETTINGS_KEYS.CLOUDINARY]?.cloudName || "",
        uploadPreset:
          settings[STORAGE_SETTINGS_KEYS.CLOUDINARY]?.uploadPreset || "",
      },
      [STORAGE_SETTINGS_KEYS.AWS]: {
        bucket: settings[STORAGE_SETTINGS_KEYS.AWS]?.bucket || "",
        region: settings[STORAGE_SETTINGS_KEYS.AWS]?.region || "",
        accessKeyId: settings[STORAGE_SETTINGS_KEYS.AWS]?.accessKeyId || "",
        secretAccessKey:
          settings[STORAGE_SETTINGS_KEYS.AWS]?.secretAccessKey || "",
      },
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching storage settings:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
