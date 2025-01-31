import { Role, RoleType } from "@/models/RoleModel";
import { roleRepository } from "@/repositories";
import { Types } from "mongoose";

class RoleService {
  async getAllRoles(): Promise<Role[]> {
    return roleRepository.findAll();
  }

  async getRoleById(roleId: string | Types.ObjectId): Promise<Role | null> {
    return roleRepository.findById(roleId);
  }

  async getRolesAboveLevel(level: number): Promise<Role[]> {
    return roleRepository.findRolesAboveLevel(level);
  }

  async getRolesUpToLevel(level: number): Promise<Role[]> {
    return roleRepository.findRolesUpToLevel(level);
  }

  async createRole(roleData: Partial<Role>): Promise<Role> {
    if (roleData.type === RoleType.SYSTEM) {
      throw new Error("Cannot create new system roles.");
    }
    return roleRepository.create(roleData);
  }

  async updateRole(
    roleId: string,
    updateData: Partial<Role>
  ): Promise<Role | null> {
    const role = await roleRepository.findById(roleId);
    if (!role) throw new Error("Role not found");

    if (role.type === RoleType.SYSTEM) {
      throw new Error("System roles cannot be modified.");
    }

    if (role.type === RoleType.GUEST && updateData.permissions) {
      throw new Error("Guest role permissions cannot be changed.");
    }

    return roleRepository.update(roleId, updateData);
  }

  async deleteRole(roleId: string): Promise<Role | null> {
    const role = await roleRepository.findById(roleId);
    if (!role) throw new Error("Role not found");

    if (role.type == RoleType.SYSTEM || role.type == RoleType.GUEST) {
      throw new Error("This role cannot be deleted.");
    }

    return roleRepository.delete(roleId);
  }

  async updatePermissions(
    roleId: string,
    permissions: string[]
  ): Promise<Role | null> {
    const role = await roleRepository.findById(roleId);
    if (!role) throw new Error("Role not found");

    if (role.nonPermissionsEditable) {
      throw new Error("Permissions for this role cannot be modified.");
    }

    return roleRepository.updatePermissions(roleId, permissions);
  }
}

export default RoleService;
