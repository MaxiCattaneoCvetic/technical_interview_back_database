import { OrderServiceInterface } from "./order.service.interface";
import { Repository, DataSource } from "typeorm";
import { OrderDto } from "../models/dto/order.create.dto";
import { Order } from "../models/order.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import isOderTableExist from "./utils/isOderTableExist";

@Injectable()
export class OrderService implements OrderServiceInterface {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        private dataSource: DataSource
    ) { }

    async createOrder(order: OrderDto): Promise<string> {
        try {
            await this.verifyTableExist();

            const newOrder = this.orderRepository.create(order);
            const orderSaved = await this.orderRepository.save(newOrder);
            console.log('Order saved:', orderSaved);
            return orderSaved.id;
        } catch (error) {
            console.error('Error in createOrder:', error);
            throw new Error(`Failed to create order: ${error.message}`);
        }
    }

    private async verifyTableExist() {
        const tableExists = await isOderTableExist(this.dataSource);
        if (!tableExists) {
            await this.dataSource.synchronize();
            console.log('Table "orders" created successfully');
        }
    }
}