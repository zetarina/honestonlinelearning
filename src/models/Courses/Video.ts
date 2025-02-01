import { Schema, Types } from "mongoose";

export enum VideoType {
  YOUTUBE = "youtube",
  AWS = "aws",
}

interface BaseVideo {
  title: string;
  key: string;
  type: VideoType;
}

export interface Video extends BaseVideo {
  _id: Types.ObjectId;
}

export interface VideoAPI extends BaseVideo {
  _id?: string;
}
export const videoSchema = new Schema<Video>({
  title: { type: String, required: true },
  key: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => /^[a-zA-Z0-9\-_/]+$/.test(v),
      message: (props) => `${props.value} is not a valid key!`,
    },
  },
  type: { type: String, enum: Object.values(VideoType), required: true },
});
