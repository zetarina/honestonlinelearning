import { Enrollment, EnrollmentStatus } from "../models/EnrollmentModel";
import { Types } from "mongoose";
import { enrollmentRepository } from "@/repositories/";

class EnrollmentService {
  async getAllEnrollments(): Promise<Enrollment[]> {
    return enrollmentRepository.findAll();
  }

  async getEnrollmentById(id: string): Promise<Enrollment | null> {
    return enrollmentRepository.findById(new Types.ObjectId(id));
  }
  async createEnrollment(
    userId: string,
    courseId: string,
    isPermanent: boolean,
    expiresAt?: Date
  ): Promise<Enrollment> {
    const existingEnrollment =
      await enrollmentRepository.isUserCurrentlyEnrolled(userId, courseId);

    if (existingEnrollment) {
      // Check if the enrollment is permanent
      if (existingEnrollment.isPermanent) {
        throw new Error("User is already permanently enrolled in this course");
      }

      // Check if the current enrollment expires in less than a month
      if (existingEnrollment.expires_at) {
        const now = new Date();
        const oneMonthLater = new Date();
        oneMonthLater.setMonth(now.getMonth() + 1);

        if (
          existingEnrollment.expires_at > now &&
          existingEnrollment.expires_at <= oneMonthLater
        ) {
          throw new Error(
            "User is still enrolled and their enrollment expires in less than a month"
          );
        }
      }

      // Extend the existing enrollment if it’s not permanent and not expiring soon
      const newExpiresAt = expiresAt || new Date();
      return await enrollmentRepository.extendEnrollment(
        existingEnrollment._id,
        newExpiresAt,
        {
          action: "EXTEND",
          timestamp: new Date(),
          expires_at: newExpiresAt,
        }
      );
    }

    // Create a new enrollment if no active enrollment exists
    const enrollment = await enrollmentRepository.create({
      user_id: new Types.ObjectId(userId),
      course_id: new Types.ObjectId(courseId),
      pointsSpent: 0, // Default to zero for manual enrollments
      expires_at: isPermanent ? null : expiresAt || null,
      isPermanent,
      status: EnrollmentStatus.ACTIVE,
      enrollmentHistory: [
        {
          action: "ENROLL",
          timestamp: new Date(),
          expires_at: isPermanent ? null : expiresAt || null,
        },
      ],
    });

    if (!enrollment) {
      throw new Error("Failed to create enrollment");
    }

    return enrollment;
  }

  async updateEnrollment(
    id: string,
    updateData: Partial<Enrollment>
  ): Promise<Enrollment | null> {
    return enrollmentRepository.update(new Types.ObjectId(id), updateData);
  }

  async deleteEnrollment(id: string): Promise<Enrollment | null> {
    return enrollmentRepository.delete(new Types.ObjectId(id));
  }

  async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    return enrollmentRepository.findByUserId(userId);
  }

  async isUserEnrolled(userId: string, courseId: string): Promise<boolean> {
    const enrollment = await enrollmentRepository.isUserCurrentlyEnrolled(
      userId,
      courseId
    );
    return !!enrollment;
  }
}

export default EnrollmentService;
