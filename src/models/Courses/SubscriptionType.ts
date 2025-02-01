import { Schema, Types } from "mongoose";

export enum SubscriptionDurationType {
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
  YEAR = "year",
  SCHOOL_YEAR = "school_year",
  PERMANENT = "permanent",
  FIXED = "fixed",
}

interface BaseSubscriptionType {
  recurrenceType: SubscriptionDurationType;
  startDate?: Date;
  endDate?: Date;
  recurrence?: string;
}

export interface SubscriptionType extends BaseSubscriptionType {
  _id: Types.ObjectId;
}

export interface SubscriptionTypeAPI extends BaseSubscriptionType {
  _id?: string;
}
export const subscriptionSchema = new Schema<SubscriptionType>({
  recurrenceType: {
    type: String,
    enum: Object.values(SubscriptionDurationType),
    required: true,
  },
  startDate: {
    type: Date,
    required: function () {
      return this.recurrenceType === SubscriptionDurationType.FIXED;
    },
  },
  endDate: {
    type: Date,
    required: function () {
      return this.recurrenceType === SubscriptionDurationType.FIXED;
    },
  },
  recurrence: { type: String, required: false },
});
