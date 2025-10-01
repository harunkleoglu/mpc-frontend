'use client'
import React from 'react'
import { ShoppingCart, House, Package } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/store/cartStore'

const pages = [
    { name: 'Home', href: '/', icon: <House height={20}/> },
    { name: 'Products', href: '/products', icon: <Package height={20}/> },
]

function Navbar() {
    const pathname = usePathname()
    const { totalItems } = useCart()
    
    return (
        <div className='flex items-center justify-between px-5 w-full h-15 bg-gray-100 shadow-sm'>
            <span className='font-bold text-2xl text-indigo-600'>Shoppie</span>
            {/* Nav items */}
            <div className='flex items-center space-x-4'>
                {pages.map((page) => {
                    const isActive = pathname === page.href
                    return (
                        <a 
                            key={page.name} 
                            href={page.href} 
                            className={`flex gap-1 items-center font-semibold transition-colors ${
                                isActive 
                                    ? 'text-indigo-900 bg-indigo-100 px-3 py-2 rounded-lg' 
                                    : 'text-indigo-500 hover:text-indigo-900'
                            }`}
                        >
                            {page.icon} {page.name}
                        </a>
                    )
                })}
            </div>
            <Link 
                href="/cart"
                className='flex gap-2 items-center select-none bg-indigo-500 text-white p-2 rounded-xl text-sm hover:bg-indigo-600 active:bg-indigo-700 transition-colors cursor-pointer relative'
            > 
                <ShoppingCart height={20} /> 
                <span>Go to Cart</span>
                {totalItems > 0 && (
                    <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold'>
                        {totalItems}
                    </span>
                )}
            </Link>
        </div>
    )
}

export default Navbar