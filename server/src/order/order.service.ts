import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaymentService } from 'src/payment/payment.service';
import { Order } from 'src/schema/order.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private paymentService: PaymentService,
  ) {}

  async createOrder(userId: string, items: any[], total: number) {
    const paymentIntent = await this.paymentService.createPaymentIntent(total * 100); // Convert to cents
    return this.orderModel.create({ userId, items, total, stripePaymentId: paymentIntent.id });
  }

  async getUserOrders(userId: string) {
    return this.orderModel.find({ userId }).lean();
  }

  async updateOrderStatus(orderId: string, status: string) {
    return this.orderModel.findByIdAndUpdate(orderId, { status });
  }
}