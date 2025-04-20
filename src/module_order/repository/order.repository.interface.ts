import { OrderDto } from "../domain/models/dto/order.create.dto";
import { OrderUpdateDto } from "../domain/models/dto/order.update.dto";
import { Order } from "../domain/models/order.entity";

export interface OrderRepositoryInterface {
    createOrder(order: OrderDto): Promise<string>;
    updateOrder(order: OrderUpdateDto): Promise<OrderUpdateDto>;
    findOrderById(id: string): Promise<Order>;
}
