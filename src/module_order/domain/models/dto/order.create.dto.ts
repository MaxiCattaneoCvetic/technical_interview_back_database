export class OrderDto {
    id?: string;
    customerName: string;
    items: {
        code: string;
        quantity: number;
        price: number;
    }[];
    totalAmount: number;
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
}