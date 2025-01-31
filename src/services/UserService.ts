import { PointTransactionType, User } from "../models/UserModel";
import { userRepository, roleRepository, cacheRepository } from "@/repositories";
import { Role, RoleType } from "@/models/RoleModel";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { APP_PERMISSIONS, GUEST_APP_PERMISSIONS } from "@/config/permissions";

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

  async getUsersByRole(roleId: string): Promise<User[]> {
    return userRepository.findByRole(roleId);
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
  async setupDefaultRolesAndSystemUser(userData: Partial<User>): Promise<void> {
    // Find System Role
    let systemRole = await roleRepository.findByRoleType(RoleType.SYSTEM);

    // Create System Role if it doesn't exist
    if (!systemRole) {
      systemRole = await roleRepository.create({
        name: "System Admin",
        type: RoleType.SYSTEM,
        permissions: Object.values(APP_PERMISSIONS),
        color: "red",
        nonPermissionsEditable: true,
        level: 100,
      });
    }

    // Find Guest Role
    let guestRole = await roleRepository.findByRoleType(RoleType.GUEST);

    // Create Guest Role if it doesn't exist
    if (!guestRole) {
      guestRole = await roleRepository.create({
        name: "Guest",
        type: RoleType.GUEST,
        permissions: GUEST_APP_PERMISSIONS,
        color: "gray",
        nonPermissionsEditable: true,
        level: 1,
      });
    }

    // Ensure only one system user exists
    const existingSystemUser = await userRepository.findByRoleTypeOrEmail(
      RoleType.SYSTEM,
      userData.email!
    );

    if (!existingSystemUser) {
      const { hashedPassword, salt } = this.hashPassword(userData.password!);
      userData.hashedPassword = hashedPassword;
      userData.salt = salt;
      delete userData.password;

      userData.role_ids = [systemRole._id as Types.ObjectId];

      await userRepository.create(userData);
    }
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const { hashedPassword, salt } = this.hashPassword(userData.password!);
    userData.hashedPassword = hashedPassword;
    userData.salt = salt;
    delete userData.password;

    return userRepository.create(userData);
  }

  async signup(userData: Partial<User>): Promise<User> {
    const { hashedPassword, salt } = this.hashPassword(userData.password!);
    userData.hashedPassword = hashedPassword;
    userData.salt = salt;
    delete userData.password;

    const guestRole = await roleRepository
      .findAll()
      .then((roles) => roles.find((role) => role.type === RoleType.GUEST));

    if (!guestRole) {
      throw new Error("Guest role is missing. Please set up default roles.");
    }

    userData.role_ids = [guestRole._id as Types.ObjectId];

    return userRepository.create(userData);
  }
  async syncRolePermissions(): Promise<void> {
    const lastSyncTime = await cacheRepository.get<number>("lastRoleSyncTime");

    const ONE_HOUR = 60 * 60 * 1000; // 1 hour
    if (lastSyncTime && Date.now() - lastSyncTime < ONE_HOUR) {
      console.log("Skipping role sync, recently updated.");
      return;
    }

    const systemRole = await roleRepository.findByRoleType(RoleType.SYSTEM);
    const guestRole = await roleRepository.findByRoleType(RoleType.GUEST);

    const updates: Promise<Role>[] = [];

    if (systemRole) {
      updates.push(
        roleRepository.updatePermissions(
          systemRole._id,
          Object.values(APP_PERMISSIONS)
        )
      );
    }

    if (guestRole) {
      updates.push(
        roleRepository.updatePermissions(guestRole._id, GUEST_APP_PERMISSIONS)
      );
    }

    await Promise.all(updates);
    await cacheRepository.set("lastRoleSyncTime", Date.now(), ONE_HOUR);
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
    details?: { courseId?: string; reason?: string }
  ): Promise<User | null> {
    return userRepository.manipulatePoints(userId, type, points, details);
  }

  async saveDeviceToken(
    userId: string,
    deviceName: string,
    refreshToken: string
  ): Promise<void> {
    return userRepository.saveDeviceToken(userId, deviceName, refreshToken);
  }

  async findDeviceToken(
    userId: string,
    refreshToken: string
  ): Promise<boolean> {
    return userRepository.findDeviceToken(userId, refreshToken);
  }

  async deleteDeviceToken(userId: string, refreshToken: string): Promise<void> {
    return userRepository.deleteDeviceToken(userId, refreshToken);
  }

  async getAllUserDevices(userId: string): Promise<User["devices"]> {
    return userRepository.getAllDevices(userId);
  }
  async findRefreshToken(refreshToken: string): Promise<User | null> {
    return userRepository.findRefreshToken(refreshToken);
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

  generateAccessToken(userId: string) {
    return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "1h" });
  }

  generateRefreshToken(userId: string) {
    return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: "30d",
    });
  }
}

export default UserService;
