import dbConnect from "@/db";
import PaymentModel, { Payment, PaymentStatus } from "../models/PaymentModel";
import { Model, Types } from "mongoose";

class PaymentRepository {
  private paymentModel: Model<Payment>;

  constructor() {
    this.paymentModel = PaymentModel;
  }

  async findAll(): Promise<Payment[]> {
    await dbConnect();
    return this.paymentModel.find().populate("user_id").exec();
  }

  async findById(id: string | Types.ObjectId): Promise<Payment | null> {
    await dbConnect();
    return this.paymentModel.findById(id).populate("user_id").exec();
  }
  async findByTransactionId(
    transactionId: string | Types.ObjectId
  ): Promise<Payment | null> {
    await dbConnect();
    return this.paymentModel.findById(transactionId).populate("user_id").exec();
  }
  async create(paymentData: Partial<Payment>): Promise<Payment> {
    await dbConnect();
    const payment = new this.paymentModel(paymentData);
    return payment.save();
  }

  async update(
    id: string | Types.ObjectId,
    updateData: Partial<Payment>
  ): Promise<Payment | null> {
    await dbConnect();
    return this.paymentModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async updateStatus(
    id: string | Types.ObjectId,
    status: PaymentStatus
  ): Promise<Payment | null> {
    await dbConnect();
    const payment = await this.paymentModel.findById(id);
    if (!payment) return null;

    payment.status = status;
    return payment.save();
  }

  async delete(id: string | Types.ObjectId): Promise<Payment | null> {
    await dbConnect();
    return this.paymentModel.findByIdAndDelete(id).exec();
  }
}

export default PaymentRepository;
