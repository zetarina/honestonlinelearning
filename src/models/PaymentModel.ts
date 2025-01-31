import mongoose, { Document, Schema, Types } from "mongoose";
import { paymentsModelName, usersModelName } from ".";

export enum PaymentMethod {
  STRIPE = "stripe",
  OFFLINE = "offline",
}

export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
}

export interface Payment extends Document {
  _id: Types.ObjectId | string;
  user_id: Types.ObjectId | string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transaction_id?: string;
}
const paymentSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: usersModelName,
      required: true,
    },
    amount: { type: Number, required: true },
    method: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    transaction_id: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

const Payment =
  mongoose.models?.[paymentsModelName] ||
  mongoose.model(paymentsModelName, paymentSchema);

export default Payment;
