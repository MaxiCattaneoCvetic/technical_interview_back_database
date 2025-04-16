import { Injectable, Inject } from '@nestjs/common';
import { OrderServiceInterface } from './order.service.interface';
import { OrderRepository } from '../repository/order.repository';
import { Order } from '../models/order.entity';

@Injectable()
export class OrderService implements OrderServiceInterface {
    constructor(
        @Inject('OrderRepository')
        private readonly orderRepository: OrderRepository
    ) {}

    async createOrder(orderData: Partial<Order>): Promise<Order> {
        // Calculate total amount based on items
        if (orderData.items) {
            orderData.totalAmount = orderData.items.reduce((total, item) => {
                return total + (item.price * item.quantity);
            }, 0);
        }

        return await this.orderRepository.create(orderData);
    }

    async getOrderById(id: string): Promise<Order> {
        return await this.orderRepository.findById(id);
    }

    async getAllOrders(): Promise<Order[]> {
        return await this.orderRepository.findAll();
    }

    async updateOrderStatus(id: string, status: string): Promise<Order> {
        return await this.orderRepository.updateStatus(id, status);
    }
} 