import { Types, Schema } from "mongoose";
import { paymentsModelName, coursesModelName } from "..";

export enum PointTransactionType {
  ADDED_BY_SYSTEM = "Added by System",
  DEDUCTED_BY_SYSTEM = "Deducted by System",
  COURSE_PURCHASE = "Course Purchase",
  COURSE_REFUND = "Course Refund",
  BONUS_REWARD = "Bonus Reward",
  PURCHASED_POINTS = "Purchased Points",
}

interface BasePointTransaction {
  type: PointTransactionType;
  points: number;
  date: Date;
}
export interface PointTransaction extends BasePointTransaction {
  paymentId?: Types.ObjectId;
  courseId?: Types.ObjectId;
}
export interface PointTransactionAPI extends BasePointTransaction {
  paymentId?: string;
  courseId?: string;
}
export const pointTransactionSchema = new Schema({
  type: {
    type: String,
    enum: Object.values(PointTransactionType),
    required: true,
  },
  points: { type: Number, required: true },
  paymentId: {
    type: Schema.Types.ObjectId,
    ref: paymentsModelName,
    sparse: true,
  },
  date: { type: Date, default: Date.now },
  courseId: { type: Schema.Types.ObjectId, ref: coursesModelName },
});
