import { Schema, Types } from "mongoose";

interface BaseZoomSlot {
  startTimeUTC: string;
  endTimeUTC: string;
  zoomLink: string;
}

export interface ZoomSlot extends BaseZoomSlot {
  _id: Types.ObjectId;
}

export interface ZoomSlotAPI extends BaseZoomSlot {
  _id?: string;
}
export const zoomSlotSchema = new Schema<ZoomSlot>({
  startTimeUTC: { type: String, required: true },
  endTimeUTC: { type: String, required: true },
  zoomLink: { type: String, required: true },
});
