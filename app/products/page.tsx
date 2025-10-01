"use client"
import axios from "axios";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ProductModel } from "@/models/product";
import { useCart } from "@/store/cartStore";

const fetchProducts = async (category?: string): Promise<ProductModel[]> => {
    try {
        const url = category 
            ? `${process.env.NEXT_PUBLIC_API_URL}/products?category=${encodeURIComponent(category)}`
            : `${process.env.NEXT_PUBLIC_API_URL}/products`;
        
        const res = await axios.get(url);
        return res.data.map((item: unknown) => ProductModel.fromApiResponse(item));
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

const fetchCategories = async (): Promise<string[]> => {
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
        const products = res.data;
        
        const categories = [...new Set(
            products
                .map((product: unknown) => (product as { category?: string }).category)
                .filter((category: unknown): category is string => 
                    typeof category === 'string' && category.trim() !== ''
                )
        )] as string[];
        
        return categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

function ProductsPageContent() {
    const [products, setProducts] = useState<ProductModel[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [addedToCart, setAddedToCart] = useState<bigint | null>(null);
    
    const searchParams = useSearchParams();
    const router = useRouter();
    const selectedCategory = searchParams.get('category') || '';
    
    // Cart store hook
    const { addItem, totalItems } = useCart();
    
    // Add product to cart function
    const addToCart = (product: ProductModel) => {
        addItem(product);
        setAddedToCart(product.id);
        // Reset feedback after 2 seconds
        setTimeout(() => setAddedToCart(null), 2000);
    };

    const loadProducts = async (category?: string) => {
        setLoading(true);
        try {
            const data = await fetchProducts(category);
            setProducts(data);
            setError(null);
            console.log('Products loaded:', data.length, 'products');
            console.log('First product imageUrl:', data[0]?.imageUrl);
        } catch (err) {
            setError('Failed to load products');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories().then(setCategories);
        loadProducts(selectedCategory || undefined);
    }, [selectedCategory]);

    const handleCategoryChange = (category: string) => {
        const params = new URLSearchParams(searchParams);
        if (category) {
            params.set('category', category);
        } else {
            params.delete('category');
        }
        router.push(`/products?${params.toString()}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="text-lg text-gray-600">Loading products...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="text-lg text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                    <h1 className="text-3xl font-bold text-gray-800">Our Products</h1>
                    {totalItems > 0 && (
                        <div className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {totalItems} items in cart
                        </div>
                    )}
                </div>
                
                <div className="flex items-center space-x-4">
                    <label htmlFor="category" className="text-sm font-medium text-gray-700">
                        Filter by Category:
                    </label>
                    <select
                        id="category"
                        value={selectedCategory}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {selectedCategory && (
                <div className="mb-6">
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                        <p className="text-indigo-800">
                            Showing products in category: <span className="font-semibold">&quot;{selectedCategory}&quot;</span>
                            <button
                                onClick={() => handleCategoryChange('')}
                                className="ml-2 text-indigo-600 hover:text-indigo-800 underline text-sm"
                            >
                                Clear filter
                            </button>
                        </p>
                    </div>
                </div>
            )}
            
            {products.length === 0 ? (
                <div className="text-center text-gray-600">
                    <p>
                        {selectedCategory 
                            ? `No products found in "${selectedCategory}" category.` 
                            : 'No products available at the moment.'
                        }
                    </p>
                </div>
            ) : (
                <>
                    <div className="mb-4 text-sm text-gray-600">
                        Found {products.length} product{products.length !== 1 ? 's' : ''}
                        {selectedCategory && ` in "${selectedCategory}"`}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map(product => (
                        <div key={product.id.toString()} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            {product.imageUrl ? (
                                <Image
                                    src={product.imageUrl} 
                                    alt={product.name || 'Product'} 
                                    width={400}
                                    height={192}
                                    className="w-full h-48 object-cover"
                                    onError={(e) => {
                                        console.log('Image failed to load:', product.imageUrl);
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                    }}
                                />
                            ) : (
                                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-500">No Image</span>
                                </div>
                            )}
                            <div className="p-4">
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                    {product.name || 'Unnamed Product'}
                                </h2>
                                <p className="text-gray-600 text-sm mb-3">
                                    {product.description || 'No description available'}
                                </p>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-2xl font-bold text-indigo-600">
                                        {product.getFormattedPrice()}
                                    </span>
                                    {product.category && (
                                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                                            {product.category}
                                        </span>
                                    )}
                                </div>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-sm text-gray-500">
                                        Stock: {product.quantity.toString()}
                                    </span>
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                        product.isAvailable() 
                                            ? 'bg-green-100 text-green-600' 
                                            : 'bg-red-100 text-red-600'
                                    }`}>
                                        {product.isAvailable() ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </div>
                                <button 
                                    disabled={!product.isAvailable()}
                                    onClick={() => addToCart(product)}
                                    className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                                        addedToCart === product.id
                                            ? 'bg-green-600 text-white'
                                            : product.isAvailable()
                                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    {addedToCart === product.id 
                                        ? '✓ Added to Cart!' 
                                        : product.isAvailable() 
                                        ? 'Add to Cart' 
                                        : 'Out of Stock'
                                    }
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                </>
            )}
        </div>
    )
}

function LoadingFallback() {
    return (
        <div className="flex justify-center items-center min-h-64">
            <div className="text-lg text-gray-600">Loading products...</div>
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <ProductsPageContent />
        </Suspense>
    );
}