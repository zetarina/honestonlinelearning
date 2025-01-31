import FileRepository from "@/repositories/FileRepository";
import { FileData, STORAGE_SERVICES, StorageServiceType } from "@/models/FileModel";
import FirebaseService from "@/repositories/FirebaseService";
import fs from "fs";
import path from "path";
import { FIREBASE_SETTINGS_KEYS } from "@/config/settings/STORAGE_SETTINGS_KEYS";

class FileService {
  private fileRepository: FileRepository;
  private firebaseService: FirebaseService;

  constructor() {
    this.fileRepository = new FileRepository();
    this.firebaseService = FirebaseService.getInstance();
  }

  async getAllFiles(
    searchQuery: string,
    fileType: string,
    page: number,
    limit: number
  ) {
    return this.fileRepository.findAll(searchQuery, fileType, page, limit);
  }
  async listLocalFiles(
    directory: string = path.join(process.cwd(), "public")
  ): Promise<Partial<FileData>[]> {
    let files: Partial<FileData>[] = [];

    if (!fs.existsSync(directory)) return files;

    const entries = fs.readdirSync(directory);

    for (const entry of entries) {
      const entryPath = path.join(directory, entry);
      const stat = fs.statSync(entryPath);

      if (stat.isDirectory()) {
        // ✅ Recursively get all files from subdirectories
        files = files.concat(await this.listLocalFiles(entryPath));
      } else {
        // ✅ Exclude `site.webmanifest`
        if (entry.toLowerCase() === "site.webmanifest") continue;

        const relativePath = path.relative(
          path.join(process.cwd(), "public"),
          entryPath
        );

        files.push({
          filePath: `/${relativePath.replace(/\\/g, "/")}`,
          name: entry,
          service: "local",
          size: stat.size,
          createdAt: stat.ctime,
          isPublic: true,
        });
      }
    }

    return files;
  }

  async listFirebaseFiles(): Promise<Partial<FileData>[]> {
    if (!(await this.firebaseService.isFirebaseAvailable())) {
      console.warn("⚠️ Firebase is not configured. Skipping Firebase files.");
      return []; // ✅ No errors, just skip
    }

    try {
      await this.firebaseService.initFirebase();
      const bucket = this.firebaseService.getBucket();

      const [files] = await bucket.getFiles();
      return files.map((file) => ({
        filePath: file.name,
        name: file.metadata.name,
        service: "firebase",
        size: Number(file.metadata.size),
        createdAt: new Date(file.metadata.timeCreated),
        publicUrl: `https://firebasestorage.googleapis.com/v0/b/${
          bucket.name
        }/o/${encodeURIComponent(file.name)}?alt=media`,
        isPublic: true,
      }));
    } catch {
      return []; // ✅ Silently skip on error
    }
  }

  async syncFiles(files: Partial<FileData>[]) {
    let count = 0;

    for (const file of files) {
      // ✅ Now "local" is correctly accepted by TypeScript
      const service: StorageServiceType =
        file.service === FIREBASE_SETTINGS_KEYS.FIREBASE
          ? STORAGE_SERVICES.FIREBASE
          : STORAGE_SERVICES.LOCAL;

      // ✅ Ensure `publicUrl` exists (use filePath for local files)
      const publicUrl =
        file.service === FIREBASE_SETTINGS_KEYS.FIREBASE
          ? file.publicUrl
          : file.filePath; // Keep relative path for local

      // ✅ Ensure `type` exists
      const fileType = this.detectFileType(file.name || "");

      const formattedFile: Partial<FileData> = {
        ...file,
        service, // ✅ Now using dynamic `STORAGE_SETTINGS_KEYS` + "local"
        publicUrl, // ✅ Fix URL issue for local files
        type: fileType, // ✅ Ensure type exists
      };

      const existingFile = await this.fileRepository.findByPathAndService(
        formattedFile.filePath!,
        formattedFile.service!
      );

      if (!existingFile) {
        await this.fileRepository.create(formattedFile);
        count++;
      }
    }

    return count;
  }

  private detectFileType(fileName: string): "image" | "video" | "document" {
    const extension = fileName.split(".").pop()?.toLowerCase();

    if (!extension) return "document"; // Default if no extension

    const imageExtensions = ["png", "jpg", "jpeg", "webp", "svg", "ico", "gif"];
    const videoExtensions = ["mp4", "mov", "avi", "mkv", "webm", "flv", "wmv"];

    if (imageExtensions.includes(extension)) return "image";
    if (videoExtensions.includes(extension)) return "video";

    return "document"; // Default to document for all other file types
  }

  async getFileById(fileId: string): Promise<FileData | null> {
    return this.fileRepository.findById(fileId);
  }

  async getFileByPath(filePath: string): Promise<FileData | null> {
    return this.fileRepository.findByPath(filePath);
  }

  async saveFileMetadata(fileData: Partial<FileData>) {
    const existingFile = await this.fileRepository.findByPath(
      fileData.filePath!
    );
    if (existingFile)
      throw new Error("File with the same path already exists.");

    const cdnUrl = fileData.publicUrl.replace(
      "https://firebasestorage.googleapis.com",
      "https://cdn.example.com"
    );

    return this.fileRepository.create({
      ...fileData,
      publicUrl: cdnUrl,
    });
  }

  async deleteFile(fileId: string) {
    await this.firebaseService.initFirebase();

    const file = await this.fileRepository.findById(fileId);
    if (!file) throw new Error("File not found.");

    const bucket = this.firebaseService.getBucket();
    await bucket.file(file.filePath).delete();

    return this.fileRepository.deleteById(fileId);
  }
}

export default FileService;
