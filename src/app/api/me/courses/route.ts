import { NextResponse } from "next/server";
import UserCourseRepository from "@/repositories/UserCourseRepository";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";

const userCourseRepo = new UserCourseRepository();

async function handleUserCoursesRequest(
  request: Request,
  userId: string | null
) {
  try {
    const courses = await userCourseRepo.getAllUserCourses(userId);
    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const GET = withAuthMiddleware(handleUserCoursesRequest, false);
