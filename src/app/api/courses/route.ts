import { NextResponse } from "next/server";
import dbConnect from "@/db";
import CourseService from "@/services/CourseService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { UserRole } from "@/models/UserModel";

const courseService = new CourseService();

async function handleGetAllCoursesRequest(
  request: Request,
  userId: string | null
) {
  try {
    const courses = await courseService.getAllCourses();
    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function handleCreateCourseRequest(
  request: Request,
  userId: string | null
) {
  try {
    const body = await request.json();
    console.log(body)
    const newCourse = await courseService.createCourse(body);
    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const GET = async (request: Request) =>
  withAuthMiddleware(
    (req, userId) => handleGetAllCoursesRequest(req, userId),
    true,
    [UserRole.INSTRUCTOR, UserRole.ADMIN]
  )(request);

export const POST = async (request: Request) =>
  withAuthMiddleware(
    (req, userId) => handleCreateCourseRequest(req, userId),
    true,
    [UserRole.INSTRUCTOR, UserRole.ADMIN]
  )(request);
