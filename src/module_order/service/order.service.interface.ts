import { OrderDto } from "../models/dto/order.create.dto";

export interface OrderServiceInterface {
    createOrder(order: OrderDto): Promise<string>;
}
    