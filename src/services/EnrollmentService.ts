import { Enrollment, EnrollmentStatus } from "../models/EnrollmentModel";
import { Types } from "mongoose";
import { enrollmentRepository, toObjectId } from "@/repositories/";

class EnrollmentService {
  async getAllEnrollments(): Promise<Enrollment[]> {
    return enrollmentRepository.findAll();
  }

  async getEnrollmentById(enrollmentId: string): Promise<Enrollment | null> {
    const enrollmentObjectId = toObjectId(enrollmentId);
    return enrollmentRepository.findById(enrollmentObjectId);
  }
  async createEnrollment(
    userId: string,
    courseId: string,
    isPermanent: boolean,
    expiresAt?: Date
  ): Promise<Enrollment> {
    const userObjectId = toObjectId(userId);
    const courseObjectId = toObjectId(courseId);
    const existingEnrollment =
      await enrollmentRepository.isUserCurrentlyEnrolled(
        userObjectId,
        courseObjectId
      );

    if (existingEnrollment) {
      if (existingEnrollment.isPermanent) {
        throw new Error("User is already permanently enrolled in this course");
      }

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

      const newExpiresAt = expiresAt || new Date();
      const updatedEnrollment = await enrollmentRepository.extendEnrollment(
        existingEnrollment._id,
        newExpiresAt,
        {
          action: "EXTEND",
          timestamp: new Date(),
          expires_at: newExpiresAt,
        }
      );

      if (!updatedEnrollment) {
        throw new Error("Failed to extend enrollment");
      }
    }

    const enrollment = await enrollmentRepository.create({
      user_id: userObjectId,
      course_id: courseObjectId,
      pointsSpent: 0,
      expires_at: isPermanent ? undefined : expiresAt || undefined,
      isPermanent,
      status: EnrollmentStatus.ACTIVE,
      enrollmentHistory: [
        {
          action: "ENROLL",
          timestamp: new Date(),
          expires_at: isPermanent ? undefined : expiresAt || undefined,
        },
      ],
    });

    if (!enrollment) {
      throw new Error("Failed to create enrollment");
    }

    return enrollment;
  }

  async updateEnrollment(
    enrollmentId: string,
    updateData: Partial<Enrollment>
  ): Promise<Enrollment | null> {
    const enrollmentObjectId = toObjectId(enrollmentId);
    return enrollmentRepository.update(enrollmentObjectId, updateData);
  }

  async deleteEnrollment(enrollmentId: string): Promise<Enrollment | null> {
    const enrollmentObjectId = toObjectId(enrollmentId);
    return enrollmentRepository.delete(enrollmentObjectId);
  }

  async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    return enrollmentRepository.findByUserId(userId);
  }

  async isUserEnrolled(userId: string, courseId: string): Promise<boolean> {
    const userObjectId = toObjectId(userId);
    const courseObjectId = toObjectId(courseId);
    const enrollment = await enrollmentRepository.isUserCurrentlyEnrolled(
      userObjectId,
      courseObjectId
    );
    return !!enrollment;
  }
}

export default EnrollmentService;
