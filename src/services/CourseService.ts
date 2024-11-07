import {
  Course,
  Subscription,
  SubscriptionDurationType,
} from "../models/CourseModel";
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
    return courseRepository.findById(new Types.ObjectId(id));
  }

  async createCourse(courseData: Partial<Course>): Promise<Course> {
    return courseRepository.create(courseData);
  }

  async updateCourse(
    id: string,
    updateData: Partial<Course>
  ): Promise<Course | null> {
    return courseRepository.update(new Types.ObjectId(id), updateData);
  }

  async deleteCourse(id: string): Promise<Course | null> {
    return courseRepository.delete(new Types.ObjectId(id));
  }

  async purchaseCourse(
    userId: string,
    courseId: string
  ): Promise<Course | null> {
    const course = await courseRepository.findById(
      new Types.ObjectId(courseId)
    );
    if (!course) throw new Error("Course not found");

    const user = await userRepository.manipulatePoints(
      userId,
      PointTransactionType.COURSE_PURCHASE,
      -course.price,
      { courseId }
    );

    if (!user) throw new Error("Failed to deduct points from the user");

    const expires_at = this.calculateExpiry(course.subscription);

    const enrollment = await enrollmentRepository.create({
      user_id: new Types.ObjectId(userId),
      course_id: new Types.ObjectId(courseId),
      pointsSpent: course.price,
      expires_at,
      isPermanent:
        course.subscription.recurrenceType ===
        SubscriptionDurationType.PERMANENT,
      status: EnrollmentStatus.ACTIVE,
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
    const enrollment = await enrollmentRepository.isUserCurrentlyEnrolled(
      userId,
      courseId
    );
    if (!enrollment) throw new Error("Enrollment not found");

    enrollment.status = EnrollmentStatus.COMPLETED;
    await enrollmentRepository.update(enrollment._id, enrollment);
    return true;
  }

  /**
   * Calculate the expiry date for a subscription.
   */
  private calculateExpiry(subscription: Subscription): Date | null {
    const { recurrenceType, startDate, endDate, recurrence } = subscription;

    switch (recurrenceType) {
      case SubscriptionDurationType.PERMANENT:
        return null; // No expiration for permanent subscriptions

      case SubscriptionDurationType.FIXED:
        if (!startDate || !endDate) {
          throw new Error(
            "Start date and end date are required for fixed subscriptions"
          );
        }
        if (endDate <= startDate) {
          throw new Error("End date must be after the start date");
        }
        return endDate; // Use the fixed end date for expiry

      case SubscriptionDurationType.SCHOOL_YEAR:
        return this.getSchoolYearEndDate(new Date());

      default:
        // Handle recurring subscriptions
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
    const schoolYearEndMonth = 2; // March (0-indexed)
    const schoolYearEndDay = 10;

    const endDate = new Date(
      currentDate.getFullYear(),
      schoolYearEndMonth,
      schoolYearEndDay
    );

    // If the current date is past January, extend to next year's March 10
    if (currentDate > new Date(currentDate.getFullYear(), 0, 1)) {
      endDate.setFullYear(currentDate.getFullYear() + 1);
    }

    return endDate;
  }
}

export default CourseService;
