import { Order } from '../models/order.entity';

export interface OrderServiceInterface {
    createOrder(orderData: Partial<Order>): Promise<Order>;
    getOrderById(id: string): Promise<Order>;
    getAllOrders(): Promise<Order[]>;
    updateOrderStatus(id: string, status: string): Promise<Order>;
} 