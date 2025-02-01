import { NextResponse } from "next/server";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { User } from "@/models/UserModel";
import UserCourseService from "@/services/UserCourseService";

const userCourseService = new UserCourseService();
async function handleUserCourseByIdRequest(
  request: Request,
  user: User | null,
  params: { id: string }
) {
  try {
    const { id: courseId } = params;
    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID not provided" },
        { status: 400 }
      );
    }
    const course = await userCourseService.getUserCourseById(
      courseId,
      user?._id
    );
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("Error fetching course by ID:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const GET = async (
  request: Request,
  context: { params: { id: string } }
) =>
  withAuthMiddleware(
    (req, user) => handleUserCourseByIdRequest(req, user, context.params),
    false
  )(request);
