import { Types, Schema } from "mongoose";
import { Resource, ResourceAPI, resourceSchema } from "./Resource";
import { Video, VideoAPI, videoSchema } from "./Video";

interface BaseChapter {
  title: string;
}

export interface Chapter extends BaseChapter {
  _id: Types.ObjectId;
  videos?: Video[];
  resources?: Resource[];
}

export interface ChapterAPI extends BaseChapter {
  _id?: string;
  videos: VideoAPI[];
  resources?: ResourceAPI[];
}
export const chapterSchema = new Schema<Chapter>({
  title: { type: String, required: true },
  videos: [videoSchema],
  resources: [resourceSchema],
});
