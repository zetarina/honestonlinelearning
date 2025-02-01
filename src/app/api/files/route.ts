import { NextResponse } from "next/server";
import FileService from "@/services/FileService";
import { withAuthMiddleware } from "@/middlewares/authMiddleware";
import { StorageServiceType } from "@/models/FileModel";
import { APP_PERMISSIONS } from "@/config/permissions";
import { User } from "@/models/UserModel";

const fileService = new FileService();
const getFileType = (contentType: string): "image" | "video" | "document" => {
  if (contentType.startsWith("image")) return "image";
  if (contentType.startsWith("video")) return "video";
  return "document";
};
async function handleGetFiles(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("search")?.toLowerCase() || "";
    const fileType = searchParams.get("type") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const { files, hasMore } = await fileService.getAllFiles(
      searchQuery,
      fileType,
      page,
      limit
    );

    return NextResponse.json({ files, hasMore }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching files:", error);
    return NextResponse.json(
      { error: "Failed to fetch files." },
      { status: 500 }
    );
  }
}

async function handleSaveMetadata(request: Request, user: User) {
  try {
    const { files } = await request.json();

    if (!Array.isArray(files) || files.length === 0) {
      return NextResponse.json(
        { error: "'files' must be a non-empty array." },
        { status: 400 }
      );
    }

    const invalidFile = files.find(
      (file) =>
        !file.filePath ||
        !file.name ||
        !file.service ||
        !file.size ||
        !file.contentType ||
        !file.publicUrl
    );

    if (invalidFile) {
      return NextResponse.json(
        { error: `Invalid file entry: ${JSON.stringify(invalidFile)}` },
        { status: 400 }
      );
    }

    const results = await Promise.allSettled(
      files.map(async (file) =>
        fileService.saveFileMetadata({
          filePath: file.filePath,
          name: file.name,
          type: getFileType(file.contentType),
          size: file.size,
          service: file.service as StorageServiceType,
          uploadedBy: user._id,
          isPublic: file.isPublic ?? true,
          publicUrl: file.publicUrl,
          description: file.description,
          tags: file.tags,
          folder: file.folder,
          contentType: file.contentType,
        })
      )
    );

    const savedFiles = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => (result as PromiseFulfilledResult<any>).value);
    const failedFiles = results
      .filter((result) => result.status === "rejected")
      .map((result) => (result as PromiseRejectedResult).reason);

    return NextResponse.json(
      {
        message: "File metadata saved successfully.",
        savedFiles,
        failedFiles,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error saving metadata:", error);
    return NextResponse.json(
      { error: "Failed to save file metadata." },
      { status: 500 }
    );
  }
}

export const GET = async (request: Request) =>
  withAuthMiddleware(handleGetFiles, true, [APP_PERMISSIONS.ADMIN])(request);

export const POST = async (request: Request) =>
  withAuthMiddleware((req, user) => handleSaveMetadata(req, user), true, [
    APP_PERMISSIONS.MANAGE_FILES,
  ])(request);
