export class InsufficientStockError extends Error {
    constructor(productCode: string, requested: number, available: number) {
        super(`Insufficient stock for product ${productCode}. Requested: ${requested}, Available: ${available}`);
        this.name = 'InsufficientStockError';
    }
}

export class OrderCreationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'OrderCreationError';
    }
} 