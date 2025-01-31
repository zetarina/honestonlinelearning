import mongoose from "mongoose";

const cacheSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { timestamps: true }
);

const CacheModel = mongoose.model("Cache", cacheSchema);

class CacheRepository {
  private defaultTTL: number = 3600 * 1000;

  async set(
    key: string,
    value: any,
    ttl: number = this.defaultTTL
  ): Promise<void> {
    const expiresAt = new Date(Date.now() + ttl);
    await CacheModel.findOneAndUpdate(
      { key },
      { value, expiresAt },
      { upsert: true, new: true }
    );
  }

  async get<T>(key: string): Promise<T | null> {
    const cacheItem = await CacheModel.findOne({ key });
    if (!cacheItem) return null;

    if (cacheItem.expiresAt < new Date()) {
      await this.delete(key);
      return null;
    }

    return cacheItem.value as T;
  }

  async delete(key: string): Promise<void> {
    await CacheModel.deleteOne({ key });
  }

  async clear(): Promise<void> {
    await CacheModel.deleteMany({});
  }
}

export default CacheRepository;
