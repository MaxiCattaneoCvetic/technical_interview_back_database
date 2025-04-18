import { OrderDto } from "../domain/models/dto/order.create.dto";

export interface OrderServiceInterface {
    createOrder(order: OrderDto): Promise<string>;
}
    