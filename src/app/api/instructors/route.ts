import { NextResponse } from "next/server";
import dbConnect from "@/db";
import UserService from "@/services/UserService";
import SettingService from "@/services/SettingService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { User } from "@/models/UserModel";
import { SETTINGS_KEYS } from "@/config/settingKeys";

const userService = new UserService();
const settingService = new SettingService();

/**
 * Handler to fetch all instructors based on the configured instructor role.
 * @param request The incoming request object.
 * @param userId The ID of the authenticated user (if any).
 * @returns A JSON response containing the list of instructors or an error message.
 */
async function handleGetAllInstructorsRequest(
  request: Request,
  userId: string | null
): Promise<NextResponse> {
  try {
    // Fetch homepage settings to get instructor role
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

// Export the GET request handler with authentication middleware
export const GET = async (request: Request) =>
  withAuthMiddleware(
    (req, userId) => handleGetAllInstructorsRequest(req, userId),
    false
  )(request);
