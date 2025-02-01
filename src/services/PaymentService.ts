import { Payment, PaymentMethod, PaymentStatus } from "../models/PaymentModel";
import { Types } from "mongoose";
import { paymentRepository, toObjectId, userRepository } from "@/repositories/";
import { PointTransactionType } from "@/models/Users/PointTransaction";

class PaymentService {
  async getAllPayments(): Promise<Payment[]> {
    return paymentRepository.findAll();
  }

  async getPaymentById(paymentId: string): Promise<Payment | null> {
    const paymentObjectId = toObjectId(paymentId);
    return paymentRepository.findById(paymentObjectId);
  }

  async createPayment(paymentData: Partial<Payment>): Promise<Payment> {
    return paymentRepository.create(paymentData);
  }

  async updatePayment(
    paymentId: string,
    updateData: Partial<Payment>
  ): Promise<Payment | null> {
    const paymentObjectId = toObjectId(paymentId);
    return paymentRepository.update(paymentObjectId, updateData);
  }

  async deletePayment(paymentId: string): Promise<Payment | null> {
    const paymentObjectId = toObjectId(paymentId);
    return paymentRepository.delete(paymentObjectId);
  }

  async processPayment(
    userId: string,
    amount: number,
    method: PaymentMethod
  ): Promise<Payment> {
    const userObjectId = toObjectId(userId);
    const payment = await paymentRepository.create({
      user_id: userObjectId,
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
      userObjectId,
      PointTransactionType.PURCHASED_POINTS,
      amount
    );

    return completedPayment;
  }
  async processPaymentByTransactionId(
    transactionId: string,
    updateData: Partial<Payment>
  ): Promise<Payment | null> {
    const transactionObjectId = toObjectId(transactionId);
    const payment = await paymentRepository.findByTransactionId(
      transactionObjectId
    );
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
        updatedPayment.user_id,
        PointTransactionType.PURCHASED_POINTS,
        updatedPayment.amount
      );
    }

    return updatedPayment;
  }
}

export default PaymentService;
