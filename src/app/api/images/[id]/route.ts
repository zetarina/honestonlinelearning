import { NextResponse } from "next/server";
import ImageService from "@/services/ImageService";
import dbConnect from "@/db";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { UserRole } from "@/models/UserModel";

const imageService = new ImageService();

async function handleGetImageByIdRequest(
  request: Request,
  params: { id: string }
) {
  try {

    const image = await imageService.getImageById(params.id);
    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }
    return NextResponse.json(image, { status: 200 });
  } catch (error) {
    console.error("Error fetching image:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function handleDeleteImageRequest(
  request: Request,
  userId: string | null,
  params: { id: string }
) {
  try {
  
    const deletedImage = await imageService.deleteImage(params.id);
    if (!deletedImage) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const GET = async (
  request: Request,
  context: { params: { id: string } }
) =>
  withAuthMiddleware(
    (req, userId) => handleGetImageByIdRequest(req, context.params),
    false
  )(request);

export const DELETE = async (
  request: Request,
  context: { params: { id: string } }
) =>
  withAuthMiddleware(
    (req, userId) => handleDeleteImageRequest(req, userId, context.params),
    true,
    [UserRole.ADMIN]
  )(request);
