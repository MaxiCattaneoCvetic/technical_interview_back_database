export class OrderUpdateDto {
    id: string;
    items: {
        productId: string;
        quantity: number;
        price: number;
    }[];
    totalAmount: number;
    updatedAt: Date;
}