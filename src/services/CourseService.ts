import { Course, DurationType } from "../models/CourseModel";
import { PointTransactionType } from "../models/UserModel";
import { Types } from "mongoose";
import { EnrollmentStatus } from "../models/EnrollmentModel";

import {
  courseRepository,
  userRepository,
  enrollmentRepository,
} from "@/repositories/";

class CourseService {
  async getAllCourses(): Promise<Course[]> {
    return courseRepository.findAll();
  }

  async getCourseById(id: string): Promise<Course | null> {
    return courseRepository.findById(id);
  }

  async createCourse(courseData: Partial<Course>): Promise<Course> {
    return courseRepository.create(courseData);
  }

  async updateCourse(
    id: string,
    updateData: Partial<Course>
  ): Promise<Course | null> {
    console.log(updateData)
    return courseRepository.update(id, updateData);
  }

  async deleteCourse(id: string): Promise<Course | null> {
    return courseRepository.delete(id);
  }

  async purchaseCourse(
    userId: string,
    courseId: string
  ): Promise<Course | null> {
    const course = await courseRepository.findById(
      new Types.ObjectId(courseId)
    );
    if (!course) throw new Error("Course not found");

    const { durationType, recurrence } = course;
    const durationCount = parseInt(recurrence || "1", 10);

    const user = await userRepository.manipulatePoints(
      userId,
      PointTransactionType.COURSE_PURCHASE,
      -course.price,
      { courseId }
    );

    if (!user) throw new Error("Failed to deduct points from the user");

    let expires_at: Date | undefined = undefined;

    if (durationType && durationType !== DurationType.PERMANENT) {
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
      pointsSpent: course.price,
      expires_at,
    });

    if (!enrollment) throw new Error("Failed to create enrollment");

    return course;
  }

  async refundCourse(enrollmentId: string): Promise<Course | null> {
    const enrollment = await enrollmentRepository.findById(
      new Types.ObjectId(enrollmentId)
    );
    if (!enrollment) throw new Error("Enrollment not found for refund");

    const course = await courseRepository.findById(enrollment.course_id);
    if (!course) throw new Error("Course not found");

    const user = await userRepository.manipulatePoints(
      enrollment.user_id.toString(),
      PointTransactionType.COURSE_REFUND,
      course.price,
      { courseId: enrollment.course_id.toString() }
    );

    if (!user) throw new Error("Failed to refund points to the user");

    await enrollmentRepository.delete(enrollment._id);

    return course;
  }

  async getUserCourses(userId: string): Promise<Course[]> {
    const enrollments = await enrollmentRepository.findByUserId(userId);
    const courseIds = enrollments.map(
      (enrollment) => new Types.ObjectId(enrollment.course_id)
    );
    return courseRepository.findCoursesByIds(courseIds);
  }

  async completeCourse(userId: string, courseId: string): Promise<boolean> {
    const enrollment = await enrollmentRepository.findByUserIdAndCourseId(
      userId,
      courseId
    );
    if (!enrollment) throw new Error("Enrollment not found");

    enrollment.status = EnrollmentStatus.COMPLETED;
    await enrollmentRepository.update(enrollment._id, enrollment);
    return true;
  }
}

export default CourseService;
