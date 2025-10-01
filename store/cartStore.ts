import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProductModel } from '@/models/product';

// Cart item interface
export interface CartItem {
    product: ProductModel;
    quantity: number;
}

// Cart store interface
interface CartStore {
    items: CartItem[];
    
    // Actions
    addItem: (product: ProductModel) => void;
    removeItem: (productId: bigint) => void;
    updateQuantity: (productId: bigint, quantity: number) => void;
    clearCart: () => void;
    
    // Getters
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],

            // Add product to cart or increase quantity if exists
            addItem: (product: ProductModel) => {
                set((state) => {
                    const existingItem = state.items.find(item => item.product.id === product.id);
                    
                    if (existingItem) {
                        // Product exists, increase quantity
                        return {
                            items: state.items.map(item =>
                                item.product.id === product.id
                                    ? { ...item, quantity: item.quantity + 1 }
                                    : item
                            )
                        };
                    } else {
                        // New product, add to cart
                        return {
                            items: [...state.items, { product, quantity: 1 }]
                        };
                    }
                });
            },

    // Remove product from cart
    removeItem: (productId: bigint) => {
        set((state) => ({
            items: state.items.filter(item => item.product.id !== productId)
        }));
    },

    // Update product quantity
    updateQuantity: (productId: bigint, quantity: number) => {
        if (quantity <= 0) {
            get().removeItem(productId);
            return;
        }

        set((state) => ({
            items: state.items.map(item =>
                item.product.id === productId
                    ? { ...item, quantity }
                    : item
            )
        }));
    },

    // Clear all items
    clearCart: () => {
        set({ items: [] });
    },

    // Get total number of items
    getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
    },

    // Get total price
    getTotalPrice: () => {
        return get().items.reduce((total, item) => {
            return total + (item.product.price || 0) * item.quantity;
        }, 0);
    }
        }),
        {
            name: 'cart-storage', // localStorage key
            // Transform data when storing to handle BigInt
            partialize: (state) => ({
                items: state.items.map(item => ({
                    ...item,
                    product: item.product.toJSON() // Use ProductModel's toJSON method
                }))
            }),
            // Transform data when loading from localStorage
            onRehydrateStorage: () => (state) => {
                if (state) {
                    // Convert products back to ProductModel instances
                    state.items = state.items.map((item: any) => ({
                        ...item,
                        product: ProductModel.fromApiResponse(item.product)
                    }));
                }
            }
        }
    )
);

// Custom hook for easier usage
export const useCart = () => {
    const store = useCartStore();
    
    return {
        items: store.items,
        addItem: store.addItem,
        removeItem: store.removeItem,
        updateQuantity: store.updateQuantity,
        clearCart: store.clearCart,
        totalItems: store.getTotalItems(),
        totalPrice: store.getTotalPrice(),
        formattedTotalPrice: `$${store.getTotalPrice().toFixed(2)}`,
        isEmpty: store.items.length === 0
    };
};
