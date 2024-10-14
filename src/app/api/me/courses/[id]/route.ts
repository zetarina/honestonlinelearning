import { NextResponse } from "next/server";
import UserCourseRepository from "@/repositories/UserCourseRepository";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";

const userCourseRepo = new UserCourseRepository();

async function handleUserCourseByIdRequest(
  request: Request,
  userId: string | null,
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

    const course = await userCourseRepo.getUserCourseById(courseId, userId);

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
    (req, userId) => handleUserCourseByIdRequest(req, userId, context.params),
    false
  )(request);
