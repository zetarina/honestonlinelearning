import { NextResponse } from "next/server";
import RoleService from "@/services/RoleService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { APP_PERMISSIONS } from "@/config/permissions";

const roleService = new RoleService();

export const GET = async (request: Request) =>
  withAuthMiddleware(
    async (req, userId) => {
      try {
        const roles = await roleService.getAllRoles();
        return NextResponse.json(roles);
      } catch (error) {
        console.error("Error fetching roles:", error);
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 }
        );
      }
    },
    true,
    [APP_PERMISSIONS.ADMIN]
  )(request);

export const POST = async (request: Request) =>
  withAuthMiddleware(
    async (req, userId) => {
      try {
        const data = await req.json();

        if (!data.name || !data.type || !data.permissions) {
          return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 }
          );
        }

        const newRole = await roleService.createRole(data);
        return NextResponse.json(newRole, { status: 201 });
      } catch (error) {
        console.error("Error creating role:", error);
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 }
        );
      }
    },
    true,
    [APP_PERMISSIONS.MANAGE_ROLES]
  )(request);
