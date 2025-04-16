import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../models/order.entity';

@Injectable()
export class OrderRepository {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>
    ) {}

    async create(orderData: Partial<Order>): Promise<Order> {
        const order = this.orderRepository.create(orderData);
        return await this.orderRepository.save(order);
    }

    async findById(id: string): Promise<Order> {
        const order = await this.orderRepository.findOne({ where: { id } });
        if (!order) {
            throw new NotFoundException(`Order with ID ${id} not found`);
        }
        return order;
    }

    async findAll(): Promise<Order[]> {
        return await this.orderRepository.find();
    }

    async updateStatus(id: string, status: string): Promise<Order> {
        const order = await this.findById(id);
        await this.orderRepository.update(id, { status });
        return await this.findById(id);
    }
} 