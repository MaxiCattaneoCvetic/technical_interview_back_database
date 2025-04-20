import { OrderDto } from "../domain/models/dto/order.create.dto";
import { OrderUpdateDto } from "../domain/models/dto/order.update.dto";
import { OrderUpdateResponse } from "../domain/models/dto/responses/order.update.response";

export interface OrderServiceInterface {
    createOrder(order: OrderDto): Promise<string>;
    getOrderById(id: string): Promise<OrderDto>;
    updateOrderById(order: OrderUpdateDto): Promise<OrderUpdateResponse>;
}
