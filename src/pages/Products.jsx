import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import toast from 'react-hot-toast';
import { Search, SlidersHorizontal, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../utils/api';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const { addToCart } = useCart();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data.products || []);
        } catch (fetchError) {
            setError('Failed to load products');
            console.error('Error:', fetchError);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['All', ...new Set(products.map((p) => p.category))];

    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleAddToCart = (product) => {
        if (product.stock <= 0) {
            toast.error(`${product.name} is out of stock.`);
            return;
        }
        const added = addToCart(product);
        if (added) {
            toast.success(`${product.name} added to cart.`);
        }
    };

    if (loading) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <Skeleton height={50} className="mb-6" />
                <Skeleton height={120} className="mb-8" />
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, idx) => (
                        <Skeleton key={idx} height={320} borderRadius={16} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900">Explore Products</h1>
                    <p className="mt-2 text-slate-600">Discover top picks across your favorite categories.</p>
                </div>

                <div className="mb-8 grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Search</label>
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by name or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 py-3 pl-9 pr-4 text-sm outline-none ring-emerald-500 transition focus:ring-2"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Category</label>
                        <div className="relative">
                            <SlidersHorizontal className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full appearance-none rounded-xl border border-slate-200 py-3 pl-9 pr-4 text-sm outline-none ring-emerald-500 transition focus:ring-2"
                            >
                                {categories.map((category) => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                        {error}
                    </div>
                )}

                {filteredProducts.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                        <p className="text-lg text-slate-500">No products found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {filteredProducts.map((product, idx) => (
                            <motion.div
                                key={product._id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: idx * 0.03 }}
                                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                            >
                                <Link to={`/product/${product._id}`}>
                                    <div className="h-64 overflow-hidden bg-slate-100">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="h-full w-full object-cover transition duration-300 hover:scale-105"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                                            }}
                                        />
                                    </div>
                                </Link>

                                <div className="p-5">
                                    <Link to={`/product/${product._id}`}>
                                        <h3 className="text-lg font-semibold text-slate-900 hover:text-emerald-700">{product.name}</h3>
                                    </Link>
                                    <p className="mt-2 line-clamp-2 text-sm text-slate-600">{product.description}</p>
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="text-2xl font-bold text-emerald-600">Rs {product.price}</span>
                                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${product.stock > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                                            {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
                                        </span>
                                    </div>
                                    <p className="mt-3 text-xs text-slate-500">Added by {product.addedByName || 'Unknown'}</p>
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        disabled={product.stock <= 0}
                                        className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition ${product.stock > 0 ? 'bg-slate-900 text-white hover:bg-slate-700' : 'cursor-not-allowed bg-slate-200 text-slate-500'}`}
                                    >
                                        <ShoppingCart className="h-4 w-4" />
                                        {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;
