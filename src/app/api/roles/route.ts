import { NextResponse } from "next/server";
import RoleService from "@/services/RoleService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { APP_PERMISSIONS } from "@/config/permissions";

const roleService = new RoleService();

async function handleGetAllRolesRequest() {
  try {
    const roles = await roleService.getAllRoles();
    return NextResponse.json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

async function handleCreateRoleRequest(request: Request) {
  try {
    const body = await request.json();
    const { name, type, permissions } = body;

    if (!name || !type || !permissions) {
      return NextResponse.json(
        { error: "Missing required fields (name, type, permissions)" },
        { status: 400 }
      );
    }

    const newRole = await roleService.createRole(body);
    return NextResponse.json(newRole, { status: 201 });
  } catch (error) {
    console.error("Error creating role:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export const GET = async (request: Request) =>
  withAuthMiddleware(() => handleGetAllRolesRequest(), true, [
    APP_PERMISSIONS.ADMIN,
  ])(request);

export const POST = async (request: Request) =>
  withAuthMiddleware((req) => handleCreateRoleRequest(req), true, [
    APP_PERMISSIONS.MANAGE_ROLES,
  ])(request);
