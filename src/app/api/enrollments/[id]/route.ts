import { NextResponse } from "next/server";
import EnrollmentService from "@/services/EnrollmentService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { UserRole } from "@/models/UserModel";

const enrollmentService = new EnrollmentService();

async function handleGetEnrollmentRequest(
  request: Request,
  userId: string | null,
  params: { id: string }
) {
  try {
    const enrollment = await enrollmentService.getEnrollmentById(params.id);
    if (!enrollment) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(enrollment);
  } catch (error) {
    console.error("Error fetching enrollment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function handleDeleteEnrollmentRequest(
  request: Request,
  userId: string | null,
  params: { id: string }
) {
  try {
    const deletedEnrollment = await enrollmentService.deleteEnrollment(
      params.id
    );

    if (!deletedEnrollment) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Enrollment deleted successfully" });
  } catch (error) {
    console.error("Error deleting enrollment:", error);
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
    (req, userId) => handleGetEnrollmentRequest(req, userId, context.params),
    true,
    [UserRole.ADMIN, UserRole.INSTRUCTOR]
  )(request);

export const DELETE = async (
  request: Request,
  context: { params: { id: string } }
) =>
  withAuthMiddleware(
    (req, userId) => handleDeleteEnrollmentRequest(req, userId, context.params),
    true,
    [UserRole.ADMIN, UserRole.INSTRUCTOR]
  )(request);
