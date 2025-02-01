import { Schema, Types } from "mongoose";

interface BaseResource {
  name: string;
  downloadUrl: string;
}

export interface Resource extends BaseResource {
  _id: Types.ObjectId;
}

export interface ResourceAPI extends BaseResource {
  _id?: string;
}
export const resourceSchema = new Schema<Resource>({
  name: { type: String, required: true },
  downloadUrl: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => /^(https?:\/\/)/.test(v),
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
});
