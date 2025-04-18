import { OrderDto } from "../domain/models/dto/order.dto";


export interface ProductServiceInterface {
    udpateProductDatabase(order: OrderDto): Promise<void>;
}

