import { NextResponse } from "next/server";
import UserService from "@/services/UserService";
import CourseService from "@/services/CourseService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { APP_PERMISSIONS } from "@/config/permissions";

const courseService = new CourseService();
const userService = new UserService();

async function handleCoursePurchaseRequest(
  request: Request,
  userId: string | null,
  params: { id: string }
) {
  try {
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const courseId = params.id;

    const course = await courseService.getCourseById(courseId);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const user = await userService.getUserById(userId);
    if (!user || user.pointsBalance < course.price) {
      return NextResponse.json(
        { error: "Insufficient points", redirectUrl: "/top-up" },
        { status: 400 }
      );
    }

    await courseService.purchaseCourse(userId, courseId);

    return NextResponse.json(
      { message: "Course purchased successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error purchasing course:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const POST = async (
  request: Request,
  context: { params: { id: string } }
) =>
  withAuthMiddleware(
    (req, userId) => handleCoursePurchaseRequest(req, userId, context.params),
    true,
    [APP_PERMISSIONS.ENROLL_IN_COURSES]
  )(request);
