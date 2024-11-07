import dbConnect from "@/db";
import ImageModel, { ImageObj } from "@/models/ImageModel";
import { Model, Types } from "mongoose";

class ImageRepository {
  private imageModel: Model<ImageObj>;

  constructor() {
    this.imageModel = ImageModel;
  }

  async findAll(
    searchQuery: string = "",
    page: number = 1,
    limit: number = 10
  ): Promise<{ images: ImageObj[]; hasMore: boolean }> {
    await dbConnect();

    const query = searchQuery
      ? { name: { $regex: searchQuery, $options: "i" } }
      : {};

    const images = await this.imageModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const totalImages = await this.imageModel.countDocuments(query);
    const hasMore = page * limit < totalImages;

    return { images, hasMore };
  }

  async findById(id: string | Types.ObjectId): Promise<ImageObj | null> {
    await dbConnect();
    return this.imageModel.findById(id).exec();
  }

  async create(imageData: Partial<ImageObj>): Promise<ImageObj> {
    await dbConnect();
    const image = new this.imageModel(imageData);
    return image.save();
  }

  async update(
    id: string | Types.ObjectId,
    updateData: Partial<ImageObj>
  ): Promise<ImageObj | null> {
    await dbConnect();
    return this.imageModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async delete(id: string | Types.ObjectId): Promise<ImageObj | null> {
    await dbConnect();
    return this.imageModel.findByIdAndDelete(id).exec();
  }
  async findByUrl(url: string): Promise<ImageObj | null> {
    await dbConnect();
    return this.imageModel.findOne({ url }).exec();
  }
}

export default ImageRepository;
