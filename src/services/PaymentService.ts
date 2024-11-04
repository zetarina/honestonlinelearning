import { Payment, PaymentMethod, PaymentStatus } from "../models/PaymentModel";
import { PointTransactionType } from "../models/UserModel";
import { Types } from "mongoose";

import { paymentRepository, userRepository } from "@/repositories/";

class PaymentService {
  async getAllPayments(): Promise<Payment[]> {
    return paymentRepository.findAll();
  }

  async getPaymentById(id: string): Promise<Payment | null> {
    return paymentRepository.findById(id);
  }

  async createPayment(paymentData: Partial<Payment>): Promise<Payment> {
    return paymentRepository.create(paymentData);
  }

  async updatePayment(
    id: string,
    updateData: Partial<Payment>
  ): Promise<Payment | null> {
    return paymentRepository.update(id, updateData);
  }

  async deletePayment(id: string): Promise<Payment | null> {
    return paymentRepository.delete(id);
  }

  async processPayment(
    userId: string,
    amount: number,
    method: PaymentMethod
  ): Promise<Payment> {
    const payment = await paymentRepository.create({
      user_id: new Types.ObjectId(userId),
      amount,
      method,
      status: PaymentStatus.PENDING,
    });

    const completedPayment = await paymentRepository.updateStatus(
      payment._id,
      PaymentStatus.COMPLETED
    );
    if (!completedPayment) throw new Error("Failed to update payment status");

    await userRepository.manipulatePoints(
      userId,
      PointTransactionType.PURCHASED_POINTS,
      amount
    );

    return completedPayment;
  }
  async processPaymentByTransactionId(
    transactionId: string,
    updateData: Partial<Payment>
  ): Promise<Payment | null> {
    const payment = await paymentRepository.findByTransactionId(transactionId);
    if (!payment) {
      console.error(`Payment with transaction ID ${transactionId} not found.`);
      return null;
    }

    const updatedPayment = await paymentRepository.update(
      payment._id,
      updateData
    );

    // Award points if payment is marked as completed
    if (updateData.status === PaymentStatus.COMPLETED && updatedPayment) {
      await userRepository.manipulatePoints(
        updatedPayment.user_id.toString(),
        PointTransactionType.PURCHASED_POINTS,
        updatedPayment.amount
      );
    }

    return updatedPayment;
  }
}

export default PaymentService;
