import { OrderUpdateDto } from "../order.update.dto";

export class OrderUpdateResponse {
    success: boolean;
    message: string;
    data: OrderUpdateDto | null;
    status: number;
}
