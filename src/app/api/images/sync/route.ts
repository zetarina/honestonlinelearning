import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import ImageService from "@/services/ImageService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { UserRole } from "@/models/UserModel";

const imageService = new ImageService();

// Helper function to recursively gather images from subdirectories
const getLocalImages = (directory: string = path.join(process.cwd(), "public", "images")): Array<{ url: string; name: string; service: string; createdAt: Date }> => {
  let images: Array<{ url: string; name: string; service: string; createdAt: Date }> = [];

  const files = fs.readdirSync(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Recursively gather images from subdirectories
      images = images.concat(getLocalImages(filePath));
    } else if (/\.(png|jpg|jpeg|webp|svg|ico)$/i.test(file)) {
      const relativePath = path.relative(process.cwd() + "/public", filePath);
      images.push({
        url: `/${relativePath.replace(/\\/g, "/")}`, // Normalize for all OS paths
        name: file,
        service: "Local",
        createdAt: new Date(),
      });
    }
  }

  return images;
};

async function syncImagesHandler() {
  const localImages = getLocalImages();
  const uploadedCount = await imageService.syncLocalImages(localImages);
  return uploadedCount;
}

export const POST = async (request: Request) =>
  withAuthMiddleware(async () => {
    try {
      const uploadedCount = await syncImagesHandler();
      return NextResponse.json(
        { message: `${uploadedCount} new images synced.` },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error syncing images:", error);
      return NextResponse.json(
        { error: "Failed to sync images" },
        { status: 500 }
      );
    }
  }, true, [UserRole.ADMIN])(request);
