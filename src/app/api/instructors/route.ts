import { NextResponse } from "next/server";
import dbConnect from "@/db";
import UserService from "@/services/UserService";
import SettingService from "@/services/SettingService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { User } from "@/models/UserModel";
import { SETTINGS_KEYS } from "@/config/settingKeys";

const userService = new UserService();
const settingService = new SettingService();

async function handleGetAllInstructorsRequest(
  request: Request
): Promise<NextResponse> {
  try {
    const settings = await settingService.getAllSettings();
    const homepageSettings = settings[SETTINGS_KEYS.HOMEPAGE];
    if (homepageSettings && homepageSettings.instructorsSection) {
      const instructorRole =
        homepageSettings.instructorsSection?.instructorRole;
      if (instructorRole) {
        return NextResponse.json(
          await userService.getUsersByRole(instructorRole),
          { status: 200 }
        );
      } else {
        return NextResponse.json([], { status: 200 });
      }
    } else {
      return NextResponse.json([], { status: 200 });
    }
  } catch (error: any) {
    console.error("Error fetching instructors:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const GET = async (request: Request) =>
  withAuthMiddleware(
    (req) => handleGetAllInstructorsRequest(req),
    false
  )(request);
