import { NextResponse } from "next/server";
import ImageService from "@/services/ImageService";
import dbConnect from "@/utils/db";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { UserRole } from "@/models/UserModel";


const imageService = new ImageService();

async function handleSaveImageMetadataRequest(request: Request, userId: string | null) {
  try {
      const body = await request.json();
      const fileName = body.fileName;
      const service = body.service;
      const imageUrl = body.imageUrl;

      if (typeof fileName !== "string" || typeof service !== "string" || typeof imageUrl !== "string") {
          return NextResponse.json(
              { error: "Invalid input data." },
              { status: 400 }
          );
      }

      // Save image metadata in the database
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


// GET: Fetch all images
async function handleGetImagesRequest(request: Request) {
  try {

    const images = await imageService.getAllImages();
    return NextResponse.json(images, { status: 200 });
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Handle GET requests
export const GET = async (request: Request) =>
  withAuthMiddleware((req, userId) => handleGetImagesRequest(req), true, [
    UserRole.ADMIN,
    UserRole.INSTRUCTOR,
  ])(request);

// Handle POST requests
export const POST = async (request: Request) =>
  withAuthMiddleware(
    (req, userId) => handleSaveImageMetadataRequest(req, userId),
    true,
    [UserRole.ADMIN, UserRole.INSTRUCTOR]
  )(request);
