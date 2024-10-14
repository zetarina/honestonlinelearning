import { Enrollment, EnrollmentStatus } from "../models/EnrollmentModel";
import { DurationType } from "../models/CourseModel";
import { Types } from "mongoose";

import { enrollmentRepository } from "@/repositories/";

class EnrollmentService {
  async getAllEnrollments(): Promise<Enrollment[]> {
    return enrollmentRepository.findAll();
  }

  async getEnrollmentById(id: string): Promise<Enrollment | null> {
    return enrollmentRepository.findById(id);
  }

  async createEnrollment(
    userId: string,
    courseId: string,
    isPermanent: boolean = false,
    durationType: DurationType = DurationType.DAY,
    durationCount: number = 1,
    expiresAt?: Date // Add an optional expiresAt parameter
  ): Promise<Enrollment> {
    const existingEnrollment =
      await enrollmentRepository.findByUserIdAndCourseId(userId, courseId);
    if (existingEnrollment)
      throw new Error("User is already enrolled in this course");

    let expires_at: Date | undefined = undefined;

    // If the expiration date is provided, use it directly
    if (expiresAt) {
      expires_at = new Date(expiresAt);
    } else if (!isPermanent) {
      // If no specific expiration date, use durationType and durationCount
      expires_at = new Date();
      switch (durationType) {
        case DurationType.DAY:
          expires_at.setDate(expires_at.getDate() + durationCount);
          break;
        case DurationType.WEEK:
          expires_at.setDate(expires_at.getDate() + durationCount * 7);
          break;
        case DurationType.MONTH:
          expires_at.setMonth(expires_at.getMonth() + durationCount);
          break;
        case DurationType.YEAR:
          expires_at.setFullYear(expires_at.getFullYear() + durationCount);
          break;
        default:
          throw new Error("Invalid duration type");
      }
    }

    const enrollment = await enrollmentRepository.create({
      user_id: new Types.ObjectId(userId),
      course_id: new Types.ObjectId(courseId),
      pointsSpent: 0,
      expires_at,
      status: EnrollmentStatus.ACTIVE,
    });

    if (!enrollment) throw new Error("Failed to create enrollment");

    return enrollment;
  }

  async updateEnrollment(
    id: string,
    updateData: Partial<Enrollment>
  ): Promise<Enrollment | null> {
    return enrollmentRepository.update(id, updateData);
  }

  async deleteEnrollment(id: string): Promise<Enrollment | null> {
    return enrollmentRepository.delete(id);
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

  async findEnrollmentsByUserId(userId: string): Promise<Enrollment[]> {
    return enrollmentRepository.findByUserId(userId);
  }

  async findEnrollmentByCourse(
    userId: string,
    courseId: string
  ): Promise<Enrollment | null> {
    return enrollmentRepository.findByUserIdAndCourseId(userId, courseId);
  }
}

export default EnrollmentService;
