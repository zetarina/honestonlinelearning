import dbConnect from "@/utils/db";
import ImageModel, { Image } from "@/models/ImageModel";
import { Model, Types } from "mongoose";

class ImageRepository {
  private imageModel: Model<Image>;

  constructor() {
    this.imageModel = ImageModel;
  }

  async findAll(): Promise<Image[]> {
    await dbConnect();
    return this.imageModel.find().sort({ createdAt: -1 }).exec();
  }

  async findById(id: string | Types.ObjectId): Promise<Image | null> {
    await dbConnect();
    return this.imageModel.findById(id).exec();
  }

  async create(imageData: Partial<Image>): Promise<Image> {
    await dbConnect();
    const image = new this.imageModel(imageData);
    return image.save();
  }

  async update(
    id: string | Types.ObjectId,
    updateData: Partial<Image>
  ): Promise<Image | null> {
    await dbConnect();
    return this.imageModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async delete(id: string | Types.ObjectId): Promise<Image | null> {
    await dbConnect();
    return this.imageModel.findByIdAndDelete(id).exec();
  }
}

export default ImageRepository;
