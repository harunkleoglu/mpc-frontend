"use client"
import { useCart } from "@/store/cartStore";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";

export default function CartPage() {
    const { 
        items, 
        updateQuantity, 
        removeItem, 
        clearCart, 
        totalItems, 
        totalPrice,
        isEmpty 
    } = useCart();

    if (isEmpty) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="text-center">
                    <ShoppingBag className="mx-auto h-24 w-24 text-gray-300 mb-6" />
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
                    <p className="text-gray-600 mb-8">
                        Looks like you haven&apos;t added anything to your cart yet.
                    </p>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    const handleQuantityChange = (productId: bigint, newQuantity: number) => {
        if (newQuantity < 1) return;
        updateQuantity(productId, newQuantity);
    };

    const handleRemoveItem = (productId: bigint) => {
        removeItem(productId);
    };

    const handleClearCart = () => {
        if (confirm('Are you sure you want to clear your cart?')) {
            clearCart();
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Shopping Cart</h1>
                    <p className="text-gray-600">
                        {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
                    </p>
                </div>
                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Continue Shopping
                    </Link>
                    <button
                        onClick={handleClearCart}
                        className="text-red-600 hover:text-red-800 font-medium"
                    >
                        Clear Cart
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        {items.map((item, index) => (
                            <div key={item.product.id.toString()} className={`p-6 ${index !== items.length - 1 ? 'border-b border-gray-200' : ''}`}>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-shrink-0">
                                        {item.product.imageUrl ? (
                                            <Image
                                                src={item.product.imageUrl}
                                                alt={item.product.name || 'Product'}
                                                width={120}
                                                height={120}
                                                className="w-30 h-30 object-cover rounded-lg"
                                                onError={(e) => {
                                                    console.log('Image failed to load:', item.product.imageUrl);
                                                    e.currentTarget.style.display = 'none';
                                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                                }}
                                            />
                                        ) : (
                                            <div className="w-30 h-30 bg-gray-200 rounded-lg flex items-center justify-center">
                                                <ShoppingBag className="h-8 w-8 text-gray-400" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-grow">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                                    {item.product.name || 'Unnamed Product'}
                                                </h3>
                                                <p className="text-gray-600 text-sm mb-2">
                                                    {item.product.description || 'No description available'}
                                                </p>
                                                {item.product.category && (
                                                    <span className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                                                        {item.product.category}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="text-right">
                                                <div className="text-xl font-bold text-indigo-600 mb-1">
                                                    {item.product.getFormattedPrice()}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Total: ${((item.product.price || 0) * item.quantity).toFixed(2)}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm text-gray-600">Quantity:</span>
                                                <div className="flex items-center border border-gray-300 rounded-lg">
                                                    <button
                                                        onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                        className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </button>
                                                    <span className="px-4 py-2 font-medium min-w-[50px] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                                                        className="p-2 hover:bg-gray-100"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleRemoveItem(item.product.id)}
                                                className="flex items-center gap-2 text-red-600 hover:text-red-800 text-sm font-medium"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
                        
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal ({totalItems} items)</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span className="text-green-600">Free</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Tax</span>
                                <span>${(totalPrice * 0.1).toFixed(2)}</span>
                            </div>
                            <hr className="border-gray-200" />
                            <div className="flex justify-between text-lg font-semibold text-gray-800">
                                <span>Total</span>
                                <span>${(totalPrice * 1.1).toFixed(2)}</span>
                            </div>
                        </div>

                        <button className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 active:bg-indigo-800 transition-colors mb-3">
                            Proceed to Checkout
                        </button>
                        
                        <div className="text-center">
                            <Link
                                href="/products"
                                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                            >
                                Continue Shopping
                            </Link>
                        </div>

                        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>🔒</span>
                                <span>Secure checkout guaranteed</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
