import { OrderServiceInterface } from "./order.service.interface";
import { DataSource } from "typeorm";
import { OrderDto } from "../domain/models/dto/order.create.dto";
import { HttpStatus, Inject, Injectable, NotFoundException } from "@nestjs/common";



import isOderTableExist from "./utils/isOderTableExist";
import { ProductServiceInterface } from "src/module_product/service/product.service.interface";
import { OrderUpdateDto } from "../domain/models/dto/order.update.dto";
import { OrderUpdateResponse } from "../domain/models/dto/responses/order.update.response";
import { OrderRepositoryInterface } from "../repository/order.repository.interface";





@Injectable()
export class OrderService implements OrderServiceInterface {
    constructor(

        private dataSource: DataSource,

        @Inject('ProductServiceInterface')
        private productService: ProductServiceInterface,

        @Inject('OrderRepositoryInterface')
        private orderRepository: OrderRepositoryInterface
    ) { }
    async updateOrderById(orderUpdate: OrderUpdateDto): Promise<OrderUpdateResponse> {
        try {
            const existingOrder = await this.orderRepository.findOrderById(orderUpdate.id);
            if (!existingOrder) {
                return {
                    success: false,
                    message: 'Order not found',
                    status: HttpStatus.NOT_FOUND,
                    data: null
                }
            }
            const isAbleToBeUpdated = await this.verifyIfOrderIsAbleToBeUpdated(orderUpdate);
            if (!isAbleToBeUpdated) {
                return {
                    success: false,
                    message: 'Order not updated, the order limit time has expired',
                    status: HttpStatus.BAD_REQUEST,
                    data: null
                }
            }

            const orderUpdated = await this.orderRepository.updateOrder(orderUpdate);

            return {
                success: true,
                message: 'order updated successfully',
                status: HttpStatus.OK,
                data: orderUpdated
            }



        } catch (error) {
            console.error('Error updating order:', error);
            return {
                success: false,
                message: 'Error updating order',
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                data: null
            }
        }
    }


    async createOrder(order: OrderDto): Promise<string> {
        try {
            await this.verifyTableExist();
            await this.updateProductDatabase(order);
            const createAt = new Date();
            order.createdAt = createAt;
            return await this.orderRepository.createOrder(order);
        } catch (error) {
            throw error;
        }
    }

    async getOrderById(id: string): Promise<OrderDto> {
        const order = await this.orderRepository.findOrderById(id);
        if (!order) {
            throw new NotFoundException('Order not found');
        }
        return order;
    }

    private async updateProductDatabase(order: OrderDto) {
        try {
            await this.productService.udpateProductDatabase({
                items: order.items.map(item => ({
                    code: item.code,
                    quantity: item.quantity
                }))
            });
        } catch (error) {
            throw error;
        }
    }

    private async verifyTableExist() {
        const tableExists = await isOderTableExist(this.dataSource);
        if (!tableExists) {
            await this.dataSource.synchronize();
            console.log('Table "orders" created successfully');
        }
    }

    private async verifyIfOrderIsAbleToBeUpdated(order: OrderUpdateDto) {
        const orderToUpdate = await this.orderRepository.findOrderById(order.id);
        const now = new Date();

        if (!orderToUpdate) {
            console.log('Order not found');
            return false;
        }

        const orderCreationDate = new Date(orderToUpdate.createdAt);
        const fiveMinutesInMs = 5 * 60 * 1000;
        const orderAge = now.getTime() - orderCreationDate.getTime();
        const minutesPassed = Math.floor(orderAge / (60 * 1000));

        console.log(`Order created at (UTC): ${orderCreationDate.toUTCString()}`);
        console.log(`Current time (UTC): ${now.toUTCString()}`);
        console.log(`Time passed: ${minutesPassed} minutes`);
        console.log(`Time limit: 5 minutes`);
        console.log(`Can be updated: ${orderAge <= fiveMinutesInMs}`);

        if (orderAge > fiveMinutesInMs) {
            console.log(`Order cannot be updated: ${minutesPassed} minutes have passed (limit is 5 minutes)`);
            return false;
        }

        return true;
    }

}