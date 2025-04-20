export class OrderDto {
    items: {
        code: string;
        quantity: number;
    }[];
}
