import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { OrderService } from './order.service';
// import { AuthMiddleware } from '../auth.middleware';

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('purchase')
//   @UseGuards(AuthMiddleware)
  async purchase(@Req() req, @Body() body: { items: any[], total: number }) {
    return this.orderService.createOrder(req.user, body.items, body.total);
  }

  @Get('history')
//   @UseGuards(AuthMiddleware)
  async getHistory(@Req() req) {
    return this.orderService.getUserOrders(req.user);
  }
}