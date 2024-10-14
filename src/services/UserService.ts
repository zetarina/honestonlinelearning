import { PointTransactionType, User, UserRole } from "../models/UserModel";
import crypto from "crypto";

import { userRepository } from "@/repositories/";

class UserService {
  async getAllSafeUsers(): Promise<Partial<User>[]> {
    return userRepository.findAllSafe();
  }

  async getSafeUserById(id: string): Promise<Partial<User> | null> {
    return userRepository.findSafeById(id);
  }

  async getSafeUserByEmail(email: string): Promise<Partial<User> | null> {
    return userRepository.findSafeByEmail(email);
  }
  async getUsersByRole(
    role: UserRole,
    safe: boolean = false
  ): Promise<Partial<User>[] | User[]> {
    return userRepository.findByRole(role);
  }
  async getAllUsers(): Promise<User[]> {
    return userRepository.findAll();
  }

  async getUserById(id: string): Promise<User | null> {
    return userRepository.findById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return userRepository.findByEmail(email);
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const { hashedPassword, salt } = this.hashPassword(
      userData.password!.toString()
    );

    userData.hashedPassword = hashedPassword;
    userData.salt = salt;

    return userRepository.create(userData);
  }

  async updateUser(
    id: string,
    updateData: Partial<User>
  ): Promise<User | null> {
    if (updateData.password) {
      const { hashedPassword, salt } = this.hashPassword(updateData.password);
      updateData.hashedPassword = hashedPassword;
      updateData.salt = salt;

      delete updateData.password;
    }

    return userRepository.update(id, updateData);
  }

  async deleteUser(id: string): Promise<User | null> {
    return userRepository.delete(id);
  }

  async manipulateUserPoints(
    userId: string,
    points: number,
    type: PointTransactionType,
    details?: {
      courseId?: string;
      reason?: string;
    }
  ): Promise<User | null> {
    return userRepository.manipulatePoints(userId, type, points, details);
  }

  private hashPassword(password: string): {
    hashedPassword: string;
    salt: string;
  } {
    const salt = crypto.randomBytes(16).toString("hex");
    const hashedPassword = crypto
      .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
      .toString(`hex`);

    return { hashedPassword, salt };
  }

  verifyPassword(inputPassword: string, user: User): boolean {
    const hash = crypto
      .pbkdf2Sync(inputPassword, user.salt, 1000, 64, `sha512`)
      .toString(`hex`);

    return user.hashedPassword === hash;
  }
}

export default UserService;
