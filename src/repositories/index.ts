// repositories/index.ts
import CourseRepository from "./CourseRepository";
import UserRepository from "./UserRepository";
import EnrollmentRepository from "./EnrollmentRepository";
import PaymentRepository from "./PaymentRepository";
import SettingRepository from "./SettingRepository";
import ImageRepository from "./FileRepository";
import RoleRepository from "./RoleRepository";

// Initialize repositories
export const courseRepository = new CourseRepository();
export const userRepository = new UserRepository();
export const enrollmentRepository = new EnrollmentRepository();
export const paymentRepository = new PaymentRepository();
export const settingRepository = new SettingRepository();
export const imageRepository = new ImageRepository();
export const roleRepository = new RoleRepository();
