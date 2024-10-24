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
      await enrollmentRepository.findByUserIdAndCourseId(userId, courseId);

    if (existingEnrollment) {
      throw new Error("User is already enrolled in this course");
    }

    const enrollment = await enrollmentRepository.create({
      user_id: new Types.ObjectId(userId),
      course_id: new Types.ObjectId(courseId),
      pointsSpent: 0, // Default to zero for manual enrollments
      expires_at: isPermanent ? null : expiresAt || null,
      isPermanent,
      status: EnrollmentStatus.ACTIVE,
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
    const enrollment = await enrollmentRepository.findByUserIdAndCourseId(
      userId,
      courseId
    );
    return !!enrollment;
  }
}

export default EnrollmentService;
