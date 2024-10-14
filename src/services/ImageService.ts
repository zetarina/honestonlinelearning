import ImageRepository from "@/repositories/ImageRepository";

class ImageService {
  private imageRepository: ImageRepository;

  constructor() {
    this.imageRepository = new ImageRepository();
  }

  async getAllImages() {
    return this.imageRepository.findAll();
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
}

export default ImageService;
