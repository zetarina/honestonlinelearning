import { ImageObj } from "@/models/ImageModel";
import ImageRepository from "@/repositories/ImageRepository";

class ImageService {
  private imageRepository: ImageRepository;

  constructor() {
    this.imageRepository = new ImageRepository();
  }

  async getAllImages(
    searchQuery: string = "",
    page: number = 1,
    limit: number = 10
  ): Promise<{ images: ImageObj[]; hasMore: boolean }> {
    return this.imageRepository.findAll(searchQuery, page, limit);
  }

  async getImageById(id: string) {
    return this.imageRepository.findById(id);
  }

  async uploadImage(imageData: { url: string; name: string; service: string }) {
    return this.imageRepository.create(imageData);
  }

  async deleteImage(id: string) {
    return this.imageRepository.delete(id);
  }
  async findImageByUrl(url: string): Promise<ImageObj | null> {
    return this.imageRepository.findByUrl(url);
  }

  async syncLocalImages(localImages: Partial<ImageObj>[]): Promise<number> {
    let uploadedCount = 0;

    for (const image of localImages) {
      if (!image.url || !image.name || !image.service) {
        console.warn(`Skipping invalid image: ${JSON.stringify(image)}`);
        continue; // Skip if any required field is missing
      }

      const existingImage = await this.findImageByUrl(image.url);
      if (!existingImage) {
        await this.uploadImage({
          url: image.url,
          name: image.name,
          service: image.service,
        });
        uploadedCount++;
      }
    }

    return uploadedCount;
  }
}

export default ImageService;
