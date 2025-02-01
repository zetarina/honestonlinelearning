import { NextResponse } from "next/server";
import EnrollmentService from "@/services/EnrollmentService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { APP_PERMISSIONS } from "@/config/permissions";

const enrollmentService = new EnrollmentService();

async function handleGetAllEnrollmentsRequest(request: Request) {
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

async function handleCreateEnrollmentRequest(request: Request) {
  try {
    const body = await request.json();
    const { userId: targetUserId, courseId, isPermanent, expiresAt } = body;

    if (!targetUserId || !courseId) {
      return NextResponse.json(
        { error: "User ID and Course ID are required" },
        { status: 400 }
      );
    }

    const existingEnrollment = await enrollmentService.isUserEnrolled(
      targetUserId,
      courseId
    );

    if (existingEnrollment) {
      return NextResponse.json(
        { error: "User is already enrolled in this course" },
        { status: 400 }
      );
    }

    const newEnrollment = await enrollmentService.createEnrollment(
      targetUserId,
      courseId,
      isPermanent,
      expiresAt ? new Date(expiresAt) : undefined
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
  withAuthMiddleware((req) => handleGetAllEnrollmentsRequest(req), true, [
    APP_PERMISSIONS.MANAGE_ENROLLMENTS,
  ])(request);

export const POST = async (request: Request) =>
  withAuthMiddleware((req) => handleCreateEnrollmentRequest(req), true, [
    APP_PERMISSIONS.MANAGE_ENROLLMENTS,
  ])(request);
