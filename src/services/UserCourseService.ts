import { Types } from "mongoose";
import { ApplicationLevelCourse } from "@/models/CourseModel";
import { toObjectId, userCourseRepository } from "@/repositories";

class UserCourseService {
  async getAllUserCourses(
    userId?: Types.ObjectId
  ): Promise<ApplicationLevelCourse[]> {
    return userCourseRepository.getAllUserCourses(userId);
  }

  async getUserCourseById(
    courseId: string,
    userId?: Types.ObjectId
  ): Promise<ApplicationLevelCourse | null> {
    const courseObjectId = toObjectId(courseId);
    return userCourseRepository.getUserCourseById(courseObjectId, userId);
  }
}

export default UserCourseService;
