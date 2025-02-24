import { NextResponse } from "next/server";
import dbConnect from "@/db";
import CourseService from "@/services/CourseService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { APP_PERMISSIONS } from "@/config/permissions";

const courseService = new CourseService();

async function handleGetCourseRequest(
  request: Request,
  params: { id: string }
) {
  try {
    const course = await courseService.getCourseById(params.id);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    return NextResponse.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function handleUpdateCourseRequest(
  request: Request,
  params: { id: string }
) {
  try {
    const body = await request.json();
    const updatedCourse = await courseService.updateCourse(params.id, body);

    if (!updatedCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function handleDeleteCourseRequest(
  request: Request,
  params: { id: string }
) {
  try {
    const deletedCourse = await courseService.deleteCourse(params.id);

    if (!deletedCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
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
    (req) => handleGetCourseRequest(req, context.params),
    true,
    [APP_PERMISSIONS.MANAGE_COURSES]
  )(request);

export const PUT = async (
  request: Request,
  context: { params: { id: string } }
) =>
  withAuthMiddleware(
    (req) => handleUpdateCourseRequest(req, context.params),
    true,
    [APP_PERMISSIONS.MANAGE_COURSES]
  )(request);

export const DELETE = async (
  request: Request,
  context: { params: { id: string } }
) =>
  withAuthMiddleware(
    (req) => handleDeleteCourseRequest(req, context.params),
    true,
    [APP_PERMISSIONS.MANAGE_COURSES]
  )(request);
