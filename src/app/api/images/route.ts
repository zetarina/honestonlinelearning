import { NextResponse } from "next/server";
import ImageService from "@/services/ImageService";
import fs from "fs";
import path from "path";
import dbConnect from "@/utils/db";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { UserRole } from "@/models/UserModel";

const imageService = new ImageService();
async function handleGetImagesRequest(request: Request) {
  try {
    const url = new URL(request.url);
    const searchQuery = url.searchParams.get("search")?.toLowerCase() || "";
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);

    // Fetch paginated and filtered images from the database.
    const { images, hasMore } = await imageService.getAllImages(
      searchQuery,
      page,
      limit
    );

    return NextResponse.json({ images, hasMore }, { status: 200 });
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function handleSaveImageMetadataRequest(
  request: Request,
  userId: string | null
) {
  try {
    const body = await request.json();
    const { fileName, service, imageUrl } = body;

    if (
      typeof fileName !== "string" ||
      typeof service !== "string" ||
      typeof imageUrl !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid input data." },
        { status: 400 }
      );
    }

    const newImage = await imageService.uploadImage({
      url: imageUrl,
      name: fileName,
      service,
    });

    return NextResponse.json(
      { message: "Image metadata saved successfully", newImage },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving image metadata:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const GET = async (request: Request) =>
  withAuthMiddleware((req) => handleGetImagesRequest(req), true, [
    UserRole.ADMIN,
    UserRole.INSTRUCTOR,
  ])(request);

export const POST = async (request: Request) =>
  withAuthMiddleware(
    (req, userId) => handleSaveImageMetadataRequest(req, userId),
    true,
    [UserRole.ADMIN, UserRole.INSTRUCTOR]
  )(request);
