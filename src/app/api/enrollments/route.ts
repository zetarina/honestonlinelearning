import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import EnrollmentService from "@/services/EnrollmentService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { UserRole } from "@/models/UserModel";

const enrollmentService = new EnrollmentService();

async function handleGetAllEnrollmentsRequest(
  request: Request,
  userId: string | null
) {
  try {
    const enrollments = await enrollmentService.getAllEnrollments();
    return NextResponse.json(enrollments);
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function handleCreateEnrollmentRequest(
  request: Request,
  userId: string | null
) {
  try {
    const body = await request.json();
    const {
      userId: frontendUserId,
      courseId,
      isPermanent,
      durationType,
      durationCount,
      expiresAt,
    } = body;

    if (!frontendUserId || !courseId) {
      return NextResponse.json(
        { error: "User ID and Course ID are required" },
        { status: 400 }
      );
    }

    const existingEnrollment = await enrollmentService.isUserEnrolled(
      frontendUserId,
      courseId
    );
    if (existingEnrollment) {
      return NextResponse.json(
        { error: "User is already enrolled in this course" },
        { status: 400 }
      );
    }

    if (!isPermanent && !expiresAt && (!durationType || !durationCount)) {
      return NextResponse.json(
        {
          error:
            "Either isPermanent must be true, or a valid combination of durationType and durationCount, or an expiresAt date must be provided.",
        },
        { status: 400 }
      );
    }

    const newEnrollment = await enrollmentService.createEnrollment(
      frontendUserId,
      courseId,
      isPermanent,
      durationType,
      durationCount,
      expiresAt
    );

    return NextResponse.json(newEnrollment, { status: 201 });
  } catch (error) {
    console.error("Error creating enrollment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const GET = async (request: Request) =>
  withAuthMiddleware(
    (req, userId) => handleGetAllEnrollmentsRequest(req, userId),
    true,
    [UserRole.INSTRUCTOR, UserRole.ADMIN]
  )(request);

export const POST = async (request: Request) =>
  withAuthMiddleware(
    (req, userId) => handleCreateEnrollmentRequest(req, userId),
    true,
    [UserRole.INSTRUCTOR, UserRole.ADMIN]
  )(request);
