import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import toast from 'react-hot-toast';
import Button from '@mui/material/Button';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../utils/api';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { addToCart } = useCart();

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await api.get(`/products/${id}`);
            setProduct(response.data.product);
        } catch (fetchError) {
            setError('Failed to load product details');
            console.error('Error:', fetchError);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
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
                <Skeleton height={36} width={160} className="mb-8" />
                <Skeleton height={520} borderRadius={16} />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <div className="text-center">
                    <p className="mb-3 text-xl text-red-600">{error || 'Product not found'}</p>
                    <Link to="/products" className="font-medium text-slate-700 underline">
                        Back to products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Link to="/products" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Products
                </Link>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        <div className="h-full bg-slate-100">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="h-full min-h-[400px] w-full object-cover"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/600x600?text=No+Image';
                                }}
                            />
                        </div>
                        <div className="p-6 md:p-8">
                            <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                {product.category}
                            </span>
                            <h1 className="mt-4 text-3xl font-bold text-slate-900">{product.name}</h1>
                            <p className="mt-4 text-slate-600">{product.description}</p>

                            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-3xl font-bold text-emerald-600">Rs {product.price}</span>
                                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${product.stock > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                    </span>
                                </div>
                                <p className="mt-3 text-xs text-slate-500">Added by {product.addedByName || 'Unknown'}</p>
                            </div>

                            <div className="mt-6">
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleAddToCart}
                                    disabled={product.stock <= 0}
                                    startIcon={<ShoppingCart className="h-4 w-4" />}
                                    sx={{
                                        py: 1.3,
                                        borderRadius: '12px',
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        backgroundColor: '#0f172a'
                                    }}
                                >
                                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProductDetail;
