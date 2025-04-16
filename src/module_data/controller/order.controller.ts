import { Controller, Post, Get, Body, Param, Put, Inject } from '@nestjs/common';
import { OrderServiceInterface } from '../service/order.service.interface';
import { Order } from '../models/order.entity';

@Controller('orders')
export class OrderController {
    constructor(
        @Inject('OrderServiceInterface')
        private readonly orderService: OrderServiceInterface
    ) {}

    @Post()
    async createOrder(@Body() orderData: Partial<Order>): Promise<Order> {
        return await this.orderService.createOrder(orderData);
    }

    @Get(':id')
    async getOrder(@Param('id') id: string): Promise<Order> {
        return await this.orderService.getOrderById(id);
    }

    @Get()
    async getAllOrders(): Promise<Order[]> {
        return await this.orderService.getAllOrders();
    }

    @Put(':id/status')
    async updateOrderStatus(
        @Param('id') id: string,
        @Body('status') status: string
    ): Promise<Order> {
        return await this.orderService.updateOrderStatus(id, status);
    }
} 