export class OrderDto {
    customerName: string;
    customerPhone: string;
    items: {
        productId: string;
        quantity: number;
        price: number;
    }[];
    totalAmount: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}