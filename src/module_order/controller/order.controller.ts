import { Body, Controller, Inject, Post, UseGuards, HttpException, HttpStatus, Get, Param, Put } from "@nestjs/common";

import { OrderDto } from "../domain/models/dto/order.create.dto";
import { OrderServiceInterface } from "../service/order.service.interface";
import { AuthGuard } from "src/shared/auth/auth.guard";
import { InsufficientStockError, OrderCreationError } from "../../module_product/domain/errors/product.errors";
import { OrderUpdateResponse } from "../domain/models/dto/responses/order.update.response";
import { OrderUpdateDto } from "../domain/models/dto/order.update.dto";


@Controller('order')
export class OrderController {
    constructor(
        @Inject("OrderServiceInterface")
        private readonly orderService: OrderServiceInterface
    ) { }

    @Post()
    @UseGuards(AuthGuard)
    async createOrder(@Body() order: OrderDto): Promise<string> {
        try {
            console.log('Creating order:', order);
            const orderId = await this.orderService.createOrder(order);

            return orderId
        } catch (error: any) {
            if (error instanceof InsufficientStockError) {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Stock Insuficiente',
                    message: 'Lo sentimos, no tenemos suficiente stock para completar tu pedido.',
                    type: 'INSUFFICIENT_STOCK_ERROR'
                }, HttpStatus.BAD_REQUEST);
            }

            if (error instanceof OrderCreationError) {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Error al crear el pedido',
                    message: 'Hubo un problema al procesar tu pedido. Por favor, intenta nuevamente.',
                    type: 'ORDER_CREATION_ERROR'
                }, HttpStatus.BAD_REQUEST);
            }

            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error del Servidor',
                message: 'Lo sentimos, ha ocurrido un error inesperado. Por favor, intenta más tarde.',
                type: 'INTERNAL_SERVER_ERROR'
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id')
    async getOrder(@Param('id') id: string): Promise<string> {
        try {
            const order = await this.orderService.getOrderById(id);
            if (!order?.id) {
                throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    error: 'Pedido no encontrado',
                    message: 'No se encontró el pedido solicitado.',
                }, HttpStatus.NOT_FOUND);
            }
            return order.id;
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error del Servidor',
                message: 'Lo sentimos, ha ocurrido un error inesperado. Por favor, intenta más tarde.',
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put()
    async updateOrder(@Body() order: OrderUpdateDto): Promise<OrderUpdateResponse> {
        try {
            const response: OrderUpdateResponse = await this.orderService.updateOrderById(order);
            return response;
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Error del Servidor',
                message: 'Lo sentimos, ha ocurrido un error inesperado. Por favor, intenta más tarde.',
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}