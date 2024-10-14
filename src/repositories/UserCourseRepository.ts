import { Model, Types } from "mongoose";
import { ApplicationLevelCourse, Course } from "../models/CourseModel";
import { Enrollment, enrollmentsModelName } from "../models/EnrollmentModel";
import dbConnect from "@/utils/db";
import CourseModel from "../models/CourseModel";

class UserCourseRepository {
  private courseModel: Model<Course>;

  constructor() {
    this.courseModel = CourseModel;
  }

  async getAllUserCourses(
    userId?: string | null
  ): Promise<ApplicationLevelCourse[]> {
    await dbConnect();

    const userIdObj = userId ? new Types.ObjectId(userId) : null;

    const result = await this.courseModel.aggregate([
      ...(userIdObj
        ? [
            {
              $lookup: {
                from: enrollmentsModelName,
                let: { courseId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$course_id", "$$courseId"] },
                          { $eq: ["$user_id", userIdObj] },
                        ],
                      },
                    },
                  },
                ],
                as: "userEnrollment",
              },
            },
            {
              $unwind: {
                path: "$userEnrollment",
                preserveNullAndEmptyArrays: true,
              },
            },
          ]
        : []),

      {
        $addFields: {
          isEnrolled: {
            $cond: [{ $gt: ["$userEnrollment", null] }, true, false],
          },
          enrollmentExpired: {
            $cond: [
              {
                $and: [
                  { $ne: ["$userEnrollment", null] },
                  { $ne: ["$userEnrollment.expires_at", null] },
                  { $lt: ["$userEnrollment.expires_at", new Date()] },
                ],
              },
              true,
              false,
            ],
          },
          expires_at: { $ifNull: ["$userEnrollment.expires_at", null] },
          chapters: {
            $cond: [
              {
                $and: [
                  { $eq: ["$isEnrolled", true] },
                  { $eq: ["$enrollmentExpired", false] },
                ],
              },
              "$chapters",
              {
                $map: {
                  input: "$chapters",
                  as: "chapter",
                  in: {
                    title: "$$chapter.title",
                    resources: [],
                    videos: [],
                  },
                },
              },
            ],
          },
        },
      },
      {
        $project: {
          userEnrollment: 0,
        },
      },
    ]);
    return result as ApplicationLevelCourse[];
  }
  async getUserCourseById(
    courseId: string,
    userId?: string | null
  ): Promise<ApplicationLevelCourse | null> {
    await dbConnect();

    const courseIdObj = new Types.ObjectId(courseId);
    const userIdObj = userId ? new Types.ObjectId(userId) : null;

    const result = await this.courseModel.aggregate([
      {
        $match: { _id: courseIdObj },
      },

      ...(userIdObj
        ? [
            {
              $lookup: {
                from: enrollmentsModelName,
                let: { courseId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$course_id", "$$courseId"] },
                          { $eq: ["$user_id", userIdObj] },
                        ],
                      },
                    },
                  },
                ],
                as: "userEnrollment",
              },
            },
            {
              $unwind: {
                path: "$userEnrollment",
                preserveNullAndEmptyArrays: true,
              },
            },
          ]
        : []),

      // Calculate isEnrolled and enrollmentExpired first
      {
        $addFields: {
          isEnrolled: {
            $cond: [{ $gt: ["$userEnrollment", null] }, true, false],
          },
          enrollmentExpired: {
            $cond: [
              {
                $and: [
                  { $ne: ["$userEnrollment", null] },
                  { $ne: ["$userEnrollment.expires_at", null] },
                  { $lt: ["$userEnrollment.expires_at", new Date()] },
                ],
              },
              true,
              false,
            ],
          },
          expires_at: { $ifNull: ["$userEnrollment.expires_at", null] },
        },
      },

      // Now that isEnrolled and enrollmentExpired are calculated, we use them in the $map step
      {
        $addFields: {
          chapters: {
            $map: {
              input: "$chapters",
              as: "chapter",
              in: {
                title: "$$chapter.title",
                resources: "$$chapter.resources",
                // Use pre-calculated fields for videos
                videos: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$isEnrolled", true] }, // Use pre-calculated isEnrolled
                        { $eq: ["$enrollmentExpired", false] }, // Use pre-calculated enrollmentExpired
                      ],
                    },
                    "$$chapter.videos", // Return actual videos if conditions are met
                    [], // Otherwise return an empty array
                  ],
                },
              },
            },
          },
        },
      },

      {
        $project: {
          userEnrollment: 0, // Exclude user enrollment from final output
        },
      },
    ]);


    return result.length > 0 ? (result[0] as ApplicationLevelCourse) : null;
  }
}

export default UserCourseRepository;
