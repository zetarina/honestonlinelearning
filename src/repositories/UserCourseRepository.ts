import { Model, Types } from "mongoose";
import { ApplicationLevelCourse, Course } from "../models/CourseModel";
import { enrollmentsModelName } from "../models/EnrollmentModel";
import dbConnect from "@/utils/db";
import CourseModel from "../models/CourseModel";

const SERVER_URL = process.env.SERVER_URL || "https://your-server.com";

class UserCourseRepository {
  private courseModel: Model<Course>;

  constructor() {
    this.courseModel = CourseModel;
  }

  private appendServerUrl(url: string | undefined): string | null {
    if (!url) return null;
    return url.startsWith("/") ? `${SERVER_URL}${url}` : url;
  }

  async getAllUserCourses(userId?: string | null): Promise<ApplicationLevelCourse[]> {
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
            { $unwind: { path: "$userEnrollment", preserveNullAndEmptyArrays: true } },
          ]
        : []),

      {
        $addFields: {
          isEnrolled: { $gt: ["$userEnrollment", null] },
          enrollmentExpired: {
            $and: [
              { $ne: ["$userEnrollment.expires_at", null] },
              { $lt: ["$userEnrollment.expires_at", new Date()] },
            ],
          },
          expires_at: { $ifNull: ["$userEnrollment.expires_at", null] },
          thumbnailUrl: {
            $cond: {
              if: { $regexMatch: { input: "$thumbnailUrl", regex: /^\/.*/ } },
              then: { $concat: [SERVER_URL, "$thumbnailUrl"] },
              else: "$thumbnailUrl",
            },
          },
          chapters: {
            $map: {
              input: "$chapters",
              as: "chapter",
              in: {
                title: "$$chapter.title",
                resources: {
                  $cond: [
                    { $and: [{ $eq: ["$isEnrolled", true] }, { $eq: ["$enrollmentExpired", false] }] },
                    "$$chapter.resources",
                    [],
                  ],
                },
                videos: {
                  $map: {
                    input: "$$chapter.videos",
                    as: "video",
                    in: {
                      title: "$$video.title",
                      duration: "$$video.duration",
                      url: this.appendServerUrl("$$video.url"),
                      type: "$$video.type",
                    },
                  },
                },
              },
            },
          },
        },
      },
      { $project: { userEnrollment: 0 } },
    ]);

    return result as ApplicationLevelCourse[];
  }

  async getUserCourseById(courseId: string, userId?: string | null): Promise<ApplicationLevelCourse | null> {
    await dbConnect();

    const courseIdObj = new Types.ObjectId(courseId);
    const userIdObj = userId ? new Types.ObjectId(userId) : null;

    const result = await this.courseModel.aggregate([
      { $match: { _id: courseIdObj } },

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
            { $unwind: { path: "$userEnrollment", preserveNullAndEmptyArrays: true } },
          ]
        : []),

      {
        $addFields: {
          isEnrolled: { $gt: ["$userEnrollment", null] },
          enrollmentExpired: {
            $and: [
              { $ne: ["$userEnrollment.expires_at", null] },
              { $lt: ["$userEnrollment.expires_at", new Date()] },
            ],
          },
          expires_at: { $ifNull: ["$userEnrollment.expires_at", null] },
          chapters: {
            $map: {
              input: "$chapters",
              as: "chapter",
              in: {
                title: "$$chapter.title",
                resources: {
                  $cond: [
                    { $and: [{ $eq: ["$isEnrolled", true] }, { $eq: ["$enrollmentExpired", false] }] },
                    "$$chapter.resources",
                    [],
                  ],
                },
                videos: {
                  $map: {
                    input: "$$chapter.videos",
                    as: "video",
                    in: {
                      title: "$$video.title",
                      duration: "$$video.duration",
                      url: this.appendServerUrl("$$video.url"),
                      type: "$$video.type",
                    },
                  },
                },
              },
            },
          },
        },
      },
      { $project: { userEnrollment: 0 } },
    ]);

    return result.length > 0 ? (result[0] as ApplicationLevelCourse) : null;
  }
}

export default UserCourseRepository;
