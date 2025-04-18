import { Body, Controller, Inject, Post, UseGuards, HttpException, HttpStatus } from "@nestjs/common";
import { OrderDto } from "../domain/models/dto/order.create.dto";
import { OrderServiceInterface } from "../service/order.service.interface";
import { AuthGuard } from "src/shared/auth/auth.guard";
import { InsufficientStockError, OrderCreationError } from "../../module_product/domain/errors/product.errors";

@Controller('order')
export class OrderController {
    constructor(
        @Inject("OrderServiceInterface")
        private readonly orderService: OrderServiceInterface
    ) { }

    @Post()
    @UseGuards(AuthGuard)
    async createOrder(@Body() order: OrderDto) {
        try {
            const orderId = await this.orderService.createOrder(order);
            return {
                success: true,
                data: {
                    orderId
                }
            };
        } catch (error: any) {
            if (error instanceof InsufficientStockError) {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Insufficient Stock',
                    message: error.message,
                    type: 'INSUFFICIENT_STOCK_ERROR'
                }, HttpStatus.BAD_REQUEST);
            }

            if (error instanceof OrderCreationError) {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Order Creation Failed',
                    message: error.message,
                    type: 'ORDER_CREATION_ERROR'
                }, HttpStatus.BAD_REQUEST);
            }

            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Internal Server Error',
                message: 'An unexpected error occurred',
                type: 'INTERNAL_SERVER_ERROR'
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}