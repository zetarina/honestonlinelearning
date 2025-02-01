import { NextResponse } from "next/server";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { User } from "@/models/UserModel";
import UserCourseService from "@/services/UserCourseService";

const userCourseService = new UserCourseService();

async function handleUserCoursesRequest(request: Request, user: User | null) {
  try {
    const courses = await userCourseService.getAllUserCourses(user?._id);
    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const GET = async (request: Request) =>
  withAuthMiddleware(
    (req, user) => handleUserCoursesRequest(req, user),
    false
  )(request);
