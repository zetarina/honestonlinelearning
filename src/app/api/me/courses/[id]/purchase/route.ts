import { NextResponse } from "next/server";
import UserService from "@/services/UserService";
import CourseService from "@/services/CourseService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { APP_PERMISSIONS } from "@/config/permissions";
import { User } from "@/models/UserModel";

const courseService = new CourseService();
const userService = new UserService();

async function handleCoursePurchaseRequest(
  request: Request,
  user: User,
  params: { id: string }
) {
  try {
    const courseId = params.id;
    const course = await courseService.getCourseById(courseId);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    if (!user || user.pointsBalance < course.price) {
      return NextResponse.json(
        { error: "Insufficient points", redirectUrl: "/top-up" },
        { status: 400 }
      );
    }
    await courseService.purchaseCourse(user._id, courseId);

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
    (req, user) => handleCoursePurchaseRequest(req, user, context.params),
    true,
    [APP_PERMISSIONS.ENROLL_IN_COURSES]
  )(request);
