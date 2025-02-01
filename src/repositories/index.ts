import CourseRepository from "./CourseRepository";
import UserRepository from "./UserRepository";
import EnrollmentRepository from "./EnrollmentRepository";
import PaymentRepository from "./PaymentRepository";
import SettingRepository from "./SettingRepository";
import ImageRepository from "./FileRepository";
import RoleRepository from "./RoleRepository";
import CacheRepository from "./CacheRepository";
import UserCourseRepository from "./UserCourseRepository";
import { Types } from "mongoose";

export const courseRepository = new CourseRepository();
export const userRepository = new UserRepository();
export const enrollmentRepository = new EnrollmentRepository();
export const paymentRepository = new PaymentRepository();
export const settingRepository = new SettingRepository();
export const imageRepository = new ImageRepository();
export const roleRepository = new RoleRepository();
export const cacheRepository = new CacheRepository();
export const userCourseRepository = new UserCourseRepository();
export const toObjectId = (id: string | null): Types.ObjectId => {
  try {
    if (id === null) {
      throw new Error("ID is null");
    }

    if (Types.ObjectId.isValid(id) && id.length === 24) {
      return new Types.ObjectId(id);
    }

    throw new Error("Invalid ID format");
  } catch (error: any) {
    console.error("Error in toObjectId:", error.message);
    throw error;
  }
};
