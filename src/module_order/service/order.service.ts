import { OrderServiceInterface } from "./order.service.interface";
import { Repository, DataSource } from "typeorm";
import { OrderDto } from "../domain/models/dto/order.create.dto";
import { Order } from "../domain/models/order.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Inject, Injectable } from "@nestjs/common";
import isOderTableExist from "./utils/isOderTableExist";
import { ProductServiceInterface } from "src/module_product/service/product.service.interface";
import { InsufficientStockError, OrderCreationError } from "../../module_product/domain/errors/product.errors";


interface productItems {
    items: {
        productId: string;
        quantity: number;
    }[];
}


@Injectable()
export class OrderService implements OrderServiceInterface {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        private dataSource: DataSource,

        @Inject('ProductServiceInterface')
        private productService: ProductServiceInterface
    ) { }

    async createOrder(order: OrderDto): Promise<string> {
        try {
            await this.verifyTableExist();
            await this.updateProductDatabase(order);
            
            const newOrder = this.orderRepository.create(order);
            const orderSaved = await this.orderRepository.save(newOrder);

            console.log('Order saved:', orderSaved);
            return orderSaved.id;
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

    private async updateProductDatabase(order: OrderDto) {
        try {
            await this.productService.udpateProductDatabase({
                items: order.items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity
                }))
            });
        } catch (error) {

            throw error;
        }
    }
}