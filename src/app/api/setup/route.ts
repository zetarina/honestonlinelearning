import { NextResponse } from "next/server";
import UserService from "@/services/UserService";
import SettingService from "@/services/SettingService";
import { SETTINGS_KEYS } from "@/config/settingKeys";
import { UserRole } from "@/models/UserModel";

const userService = new UserService();
const settingService = new SettingService();

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (
      !data.user ||
      !data.user.email ||
      !data.user.password ||
      !data.user.username
    ) {
      return NextResponse.json(
        { error: "Username, email, and password are required" },
        { status: 400 }
      );
    }

    if (
      !data.settings ||
      !data.settings[SETTINGS_KEYS.SITE_NAME] ||
      !data.settings[SETTINGS_KEYS.SITE_URL] ||
      !data.settings[SETTINGS_KEYS.CURRENCY]
    ) {
      return NextResponse.json(
        { error: "Site name, URL, and currency are required" },
        { status: 400 }
      );
    }

    const existingUser = await userService.getUserByEmail(data.user.email);
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
      );
    }

    const newUser = await userService.createUser(data.user, UserRole.ADMIN);

    // Use upsertSettings to handle settings update in one call
    const settingsUpdates = {
      [SETTINGS_KEYS.SITE_NAME]: data.settings[SETTINGS_KEYS.SITE_NAME],
      [SETTINGS_KEYS.SITE_URL]: data.settings[SETTINGS_KEYS.SITE_URL],
      [SETTINGS_KEYS.CURRENCY]: data.settings[SETTINGS_KEYS.CURRENCY],
    };

    await settingService.upsertSettings(settingsUpdates, "production");

    return NextResponse.json(
      {
        message: "User created and settings saved successfully!",
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user and saving settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
