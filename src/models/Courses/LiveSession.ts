import { Schema, Types } from "mongoose";
import { ZoomSlot, ZoomSlotAPI, zoomSlotSchema } from "./ZoomSlot";

interface BaseLiveSession {
  dayOfWeek: string;
}

export interface LiveSession extends BaseLiveSession {
  _id: Types.ObjectId;
  slots?: ZoomSlot[];
}

export interface LiveSessionAPI extends BaseLiveSession {
  _id?: string;
  slots?: ZoomSlotAPI[];
}
export const liveSessionSchema = new Schema<LiveSession>({
  dayOfWeek: {
    type: String,
    required: true,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  },
  slots: [zoomSlotSchema],
});
