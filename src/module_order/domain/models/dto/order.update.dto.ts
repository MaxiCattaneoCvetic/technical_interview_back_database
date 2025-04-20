export class OrderUpdateDto {
    id: string;
    items: {
        code: string;
        quantity: number;
        price: number;
    }[];
    totalAmount: number;
    updatedAt: Date;
}