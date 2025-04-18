import { Body, Controller, Inject, Post, UseGuards } from "@nestjs/common";
import { OrderDto } from "../models/dto/order.create.dto";
import { OrderServiceInterface } from "../service/order.service.interface";
import { AuthGuard } from "src/shared/auth/auth.guard";

@Controller('order')
export class OrderController {
    constructor(
        @Inject("OrderServiceInterface")
        private readonly orderService: OrderServiceInterface
    ) { }


    @Post()
    @UseGuards(AuthGuard)
    async createOrder(@Body() order: OrderDto): Promise<string> {
        console.log(order);
        return this.orderService.createOrder(order);
    }


}