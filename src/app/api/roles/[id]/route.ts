import { NextResponse } from "next/server";
import RoleService from "@/services/RoleService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { APP_PERMISSIONS } from "@/config/permissions";

const roleService = new RoleService();

export const GET = async (
  request: Request,
  { params }: { params: { id: string } }
) =>
  withAuthMiddleware(
    async (req, userId) => {
      try {
        const role = await roleService.getRoleById(params.id);
        if (!role) {
          return NextResponse.json(
            { error: "Role not found" },
            { status: 404 }
          );
        }
        return NextResponse.json(role);
      } catch (error) {
        console.error("Error fetching role:", error);
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 }
        );
      }
    },
    true,
    [APP_PERMISSIONS.MANAGE_USERS]
  )(request);

export const PUT = async (
  request: Request,
  { params }: { params: { id: string } }
) =>
  withAuthMiddleware(
    async (req, userId) => {
      try {
        const data = await req.json();
        const updatedRole = await roleService.updateRole(params.id, data);
        if (!updatedRole) {
          return NextResponse.json(
            { error: "Role not found" },
            { status: 404 }
          );
        }
        return NextResponse.json(updatedRole);
      } catch (error) {
        console.error("Error updating role:", error);
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 }
        );
      }
    },
    true,
    [APP_PERMISSIONS.MANAGE_ROLES]
  )(request);
export const DELETE = async (
  request: Request,
  { params }: { params: { id: string } }
) =>
  withAuthMiddleware(
    async (req, userId) => {
      try {
        const deletedRole = await roleService.deleteRole(params.id);
        return NextResponse.json({ message: "Role deleted successfully" });
      } catch (error: any) {
        // Custom error handling for non-deletable roles
        if (error.message === "This role cannot be deleted.") {
          return NextResponse.json(
            { error: "This role type cannot be deleted." },
            { status: 400 }
          );
        } else {
          console.error("Error deleting role:", error);
          return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
          );
        }
      }
    },
    true,
    [APP_PERMISSIONS.MANAGE_ROLES]
  )(request);
