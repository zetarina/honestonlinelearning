import dbConnect from "@/db";
import FileModel, { FileData } from "@/models/FileModel";
import { Model, Types } from "mongoose";

class FileRepository {
  private fileModel: Model<FileData>;

  constructor() {
    this.fileModel = FileModel;
  }
  async findAll(
    searchQuery: string = "",
    fileType: string = "",
    page: number = 1,
    limit: number = 10
  ): Promise<{ files: FileData[]; hasMore: boolean }> {
    await dbConnect();

    const query: any = {};

    if (searchQuery) {
      query.name = { $regex: searchQuery, $options: "i" };
    }

    if (fileType && ["image", "video", "document"].includes(fileType)) {
      query.type = fileType;
    }

    const files = await this.fileModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const totalFiles = await this.fileModel.countDocuments(query);
    return { files, hasMore: page * limit < totalFiles };
  }

  async findById(fileId: Types.ObjectId): Promise<FileData | null> {
    await dbConnect();
    return this.fileModel.findById(fileId).exec();
  }

  async findByPath(filePath: string): Promise<FileData | null> {
    await dbConnect();
    return this.fileModel.findOne({ filePath }).exec();
  }
  async findByPathAndService(
    filePath: string,
    service: string
  ): Promise<FileData | null> {
    await dbConnect();
    return this.fileModel.findOne({ filePath, service }).exec();
  }

  async create(fileData: Partial<FileData>): Promise<FileData> {
    await dbConnect();

    const existingFile = await this.fileModel.findOne({
      filePath: fileData.filePath,
    });
    if (existingFile) {
      throw new Error("File with the same path already exists.");
    }

    return new this.fileModel(fileData).save();
  }

  async deleteById(fileId: Types.ObjectId): Promise<FileData | null> {
    await dbConnect();

    const file = await this.fileModel.findById(fileId).exec();
    if (!file) return null;

    return this.fileModel.findByIdAndDelete(fileId).exec();
  }
}

export default FileRepository;
