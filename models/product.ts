export interface Product {
    id: bigint;
    created_at: Date;
    name: string | null;
    description: string | null;
    quantity: bigint;
    price: number | null;
    category: string | null;
    imageUrl: string | null;
    inStock: boolean | null;
}

export class ProductModel implements Product {
    id: bigint;
    created_at: Date;
    name: string | null;
    description: string | null;
    quantity: bigint;
    price: number | null;
    category: string | null;
    imageUrl: string | null;
    inStock: boolean | null;

    constructor(data: Partial<Product> = {}) {
        this.id = data.id ?? BigInt(0);
        this.created_at = data.created_at ?? new Date();
        this.name = data.name ?? null;
        this.description = data.description ?? null;
        this.quantity = data.quantity ?? BigInt(0);
        this.price = data.price ?? null;
        this.category = data.category ?? null;
        this.imageUrl = data.imageUrl ?? null;
        this.inStock = data.inStock ?? null;
    }

    isAvailable(): boolean {
        return this.inStock === true && this.quantity > 0;
    }

    getFormattedPrice(): string {
        if (this.price === null) return 'Price not available';
        return `$${this.price.toFixed(2)}`;
    }

    toJSON() {
        return {
            ...this,
            id: this.id.toString(),
            quantity: this.quantity.toString(),
        };
    }

    static fromApiResponse(data: any): ProductModel {
        return new ProductModel({
            ...data,
            id: typeof data.id === 'string' ? BigInt(data.id) : data.id,
            quantity: typeof data.quantity === 'string' ? BigInt(data.quantity) : data.quantity,
            created_at: new Date(data.created_at),
        });
    }
}