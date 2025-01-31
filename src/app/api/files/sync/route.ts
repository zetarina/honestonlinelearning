import { NextResponse } from "next/server";
import FileService from "@/services/FileService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { FileData } from "@/models/FileModel";
import { APP_PERMISSIONS } from "@/config/permissions";

const fileService = new FileService();
async function syncFilesHandler(
  userId: string,
  service: "local" | "firebase" | "all" = "all"
) {
  let localFiles: Partial<FileData>[] = [];
  let firebaseFiles: Partial<FileData>[] = [];

  if (service === "local" || service === "all") {
    localFiles = await fileService.listLocalFiles();
  }

  if (service === "firebase" || service === "all") {
    firebaseFiles = await fileService.listFirebaseFiles();
  }

  const allFiles = [...localFiles, ...firebaseFiles].map((file) => ({
    ...file,
    uploadedBy: userId,
    isPublic: true,
  }));

  const uploadedCount = await fileService.syncFiles(allFiles);
  return uploadedCount;
}

export const POST = async (request: Request) =>
  withAuthMiddleware(
    async (req, userId) => {
      try {
        if (!userId) {
          return NextResponse.json(
            { error: "User authentication is required." },
            { status: 403 }
          );
        }

        const url = new URL(req.url);
        const serviceParam = url.searchParams.get("service") as
          | "local"
          | "firebase"
          | "all"
          | null;
        const service = serviceParam || "all";

        const uploadedCount = await syncFilesHandler(userId, service);

        return NextResponse.json(
          { message: `${uploadedCount} new files synced from ${service}.` },
          { status: 200 }
        );
      } catch (error) {
        console.error("Error syncing files:", error);
        return NextResponse.json(
          { error: "Failed to sync files" },
          { status: 500 }
        );
      }
    },
    true,
    [APP_PERMISSIONS.MANAGE_FILES]
  )(request);
