import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "src/module_product/domain/models/product.entity";
import { Repository, DataSource } from "typeorm";
import { ProductServiceInterface } from "./product.service.interface";
import { OrderDto } from "../domain/models/dto/order.dto";
import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import isProductTableExist from "./utils/isOderTableExist";
import { InsufficientStockError, OrderCreationError } from "../domain/errors/product.errors";

@Injectable()
export class ProductService implements ProductServiceInterface {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        private dataSource: DataSource
    ) { }

    async udpateProductDatabase(order: OrderDto): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const tableExists = await isProductTableExist(this.dataSource);

            if (!tableExists) {
                throw new Error('Products table does not exist');
            }

            for (const item of order.items) {
                const product = await this.productRepository.findOne({
                    where: { id: item.productId }
                });

                if (!product) {
                    throw new NotFoundException(`Product with ID ${item.productId} not found`);
                }

                if (product.availableQuantity < item.quantity) {
                    throw new InsufficientStockError(
                        product.code,
                        item.quantity,
                        product.availableQuantity
                    );
                }

                if (item.quantity <= 0) {
                    throw new OrderCreationError(
                        `Invalid quantity for product ${product.code}. ` +
                        `Quantity must be greater than 0`
                    );
                }

                product.availableQuantity -= item.quantity;

                if (product.availableQuantity < 0) {
                    throw new BadRequestException(
                        `Stock cannot be negative for product ${product.code}`
                    );
                }

                await this.productRepository.save(product);
            }

            await queryRunner.commitTransaction();

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}

