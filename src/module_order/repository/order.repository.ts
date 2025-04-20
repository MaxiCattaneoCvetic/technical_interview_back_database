import { Repository } from "typeorm";
import { Order } from "../domain/models/order.entity";
import { OrderRepositoryInterface } from "./order.repository.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderUpdateDto } from "../domain/models/dto/order.update.dto";
import { OrderDto } from "../domain/models/dto/order.create.dto";

export class OrderRepository implements OrderRepositoryInterface {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>
    ) { }

    async createOrder(order: OrderDto): Promise<string> {
        try {
            const newOrder = this.orderRepository.create(order);
            const orderSaved = await this.orderRepository.save(newOrder);
            console.log('Order saved:', orderSaved);
            return orderSaved.id;
        } catch (error) {
            throw error;
        }
    }

    async updateOrder(order: OrderUpdateDto): Promise<Order> {
        try {
            const orderToUpdate = await this.orderRepository.findOne({ where: { id: order.id } });
            if (!orderToUpdate) {
                throw new Error(`Order with id ${order.id} not found`);
            }


            const updatedOrder = {
                ...orderToUpdate,
                ...order,
                updatedAt: new Date()
            };


            const savedOrder = await this.orderRepository.save(updatedOrder);
            return savedOrder;
        } catch (error) {
            console.error('Error updating order:', error);
            throw error;
        }
    }
    async findOrderById(id: string): Promise<Order> {
        try {
            const order = await this.orderRepository.findOne({ where: { id } });
            if (!order) {
                throw new Error(`Order with id ${id} not found`);
            }
            return order;
        } catch (error) {
            throw error;
        }
    }



}   