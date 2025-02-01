import { Course } from "../models/CourseModel";
import { Types } from "mongoose";
import { EnrollmentStatus } from "../models/EnrollmentModel";

import {
  courseRepository,
  userRepository,
  enrollmentRepository,
  toObjectId,
} from "@/repositories/";
import {
  SubscriptionDurationType,
  SubscriptionType,
} from "@/models/Courses/SubscriptionType";
import { PointTransactionType } from "@/models/Users/PointTransaction";

class CourseService {
  async getAllCourses(): Promise<Course[]> {
    return courseRepository.findAll();
  }

  async getCourseById(courseId: string): Promise<Course | null> {
    const courseObjectId = toObjectId(courseId);
    return courseRepository.findById(courseObjectId);
  }

  async createCourse(courseData: Partial<Course>): Promise<Course> {
    return courseRepository.create(courseData);
  }

  async updateCourse(
    courseId: string,
    updateData: Partial<Course>
  ): Promise<Course | null> {
    const courseObjectId = toObjectId(courseId);
    return courseRepository.update(courseObjectId, updateData);
  }

  async deleteCourse(courseId: string): Promise<Course | null> {
    const courseObjectId = toObjectId(courseId);
    return courseRepository.delete(courseObjectId);
  }

  async purchaseCourse(
    userId: Types.ObjectId,
    courseId: string
  ): Promise<Course | null> {
    const courseObjectId = toObjectId(courseId);
    const course = await courseRepository.findById(courseObjectId);
    if (!course) throw new Error("Course not found");

    const user = await userRepository.manipulatePoints(
      userId,
      PointTransactionType.COURSE_PURCHASE,
      -course.price,
      { reason: "Buy Course", courseId: course._id }
    );

    if (!user) throw new Error("Failed to deduct points from the user");

    const expires_at = this.calculateExpiry(course.subscriptionType);

    const enrollment = await enrollmentRepository.create({
      user_id: userId,
      course_id: course._id,
      pointsSpent: course.price,
      expires_at,
      isPermanent:
        course.subscriptionType.recurrenceType ===
        SubscriptionDurationType.PERMANENT,
      status: EnrollmentStatus.ACTIVE,
    });

    if (!enrollment) throw new Error("Failed to create enrollment");

    return course;
  }

  async refundCourse(enrollmentId: string): Promise<Course | null> {
    const enrollmentObjectId = toObjectId(enrollmentId);
    const enrollment = await enrollmentRepository.findById(enrollmentObjectId);
    if (!enrollment) throw new Error("Enrollment not found for refund");

    const course = await courseRepository.findById(enrollment.course_id);
    if (!course) throw new Error("Course not found");

    const user = await userRepository.manipulatePoints(
      enrollment.user_id,
      PointTransactionType.COURSE_REFUND,
      course.price,
      { courseId: enrollment.course_id }
    );

    if (!user) throw new Error("Failed to refund points to the user");

    await enrollmentRepository.delete(enrollment._id);

    return course;
  }
  async completeCourse(
    userId: Types.ObjectId,
    courseId: string
  ): Promise<boolean> {
    const courseObjectId = toObjectId(courseId);
    const enrollment = await enrollmentRepository.isUserCurrentlyEnrolled(
      userId,
      courseObjectId
    );
    if (!enrollment) throw new Error("Enrollment not found");

    enrollment.status = EnrollmentStatus.COMPLETED;
    await enrollmentRepository.update(enrollment._id, enrollment);
    return true;
  }
  private calculateExpiry(subscription: SubscriptionType): Date | undefined {
    const { recurrenceType, startDate, endDate, recurrence } = subscription;

    switch (recurrenceType) {
      case SubscriptionDurationType.PERMANENT:
        return undefined;

      case SubscriptionDurationType.FIXED:
        if (!startDate || !endDate) {
          throw new Error(
            "Start date and end date are required for fixed subscriptions"
          );
        }
        if (endDate <= startDate) {
          throw new Error("End date must be after the start date");
        }
        return endDate;

      case SubscriptionDurationType.SCHOOL_YEAR:
        return this.getSchoolYearEndDate(new Date());

      default:
        const expires_at = new Date();
        const recurrenceCount = parseInt(recurrence || "1", 10);

        switch (recurrenceType) {
          case SubscriptionDurationType.DAY:
            expires_at.setDate(expires_at.getDate() + recurrenceCount);
            break;
          case SubscriptionDurationType.WEEK:
            expires_at.setDate(expires_at.getDate() + recurrenceCount * 7);
            break;
          case SubscriptionDurationType.MONTH:
            expires_at.setMonth(expires_at.getMonth() + recurrenceCount);
            break;
          case SubscriptionDurationType.YEAR:
            expires_at.setFullYear(expires_at.getFullYear() + recurrenceCount);
            break;
          default:
            throw new Error("Invalid subscription duration type");
        }

        return expires_at;
    }
  }

  private getSchoolYearEndDate(currentDate: Date): Date {
    const schoolYearEndMonth = 2;
    const schoolYearEndDay = 10;

    const endDate = new Date(
      currentDate.getFullYear(),
      schoolYearEndMonth,
      schoolYearEndDay
    );

    if (currentDate > new Date(currentDate.getFullYear(), 0, 1)) {
      endDate.setFullYear(currentDate.getFullYear() + 1);
    }

    return endDate;
  }
}

export default CourseService;
