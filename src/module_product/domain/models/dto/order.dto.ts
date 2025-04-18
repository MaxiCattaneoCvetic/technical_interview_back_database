export class OrderDto {
    items: {
        productId: string;
        quantity: number;
    }[];
}
