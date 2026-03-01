import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { PackageSearch, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../utils/api';

const SellerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchSellerOrders();
        const interval = setInterval(fetchSellerOrders, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchSellerOrders = async () => {
        try {
            const response = await api.get('/orders/seller/orders');
            setOrders(response.data.orders || []);
        } catch (fetchError) {
            setError('Failed to load orders');
            console.error('Error:', fetchError);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            Pending: 'bg-amber-100 text-amber-700',
            Confirmed: 'bg-sky-100 text-sky-700',
            Shipped: 'bg-violet-100 text-violet-700',
            Delivered: 'bg-emerald-100 text-emerald-700',
            Cancelled: 'bg-rose-100 text-rose-700'
        };
        return colors[status] || 'bg-slate-100 text-slate-700';
    };

    const filteredOrders = orders.filter((order) => {
        if (statusFilter === 'all') return true;
        return order.orderStatus?.toLowerCase() === statusFilter.toLowerCase();
    });

    const statusOptions = ['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

    if (loading) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <Skeleton height={48} className="mb-6" />
                <Skeleton height={70} className="mb-6" />
                {Array.from({ length: 3 }).map((_, idx) => (
                    <Skeleton key={idx} height={220} className="mb-4" borderRadius={16} />
                ))}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Sales Orders</h1>
                    <p className="mt-2 text-slate-600">Track incoming orders and shipping details.</p>
                </div>

                <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm font-medium text-slate-700">Filter by status</span>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                        >
                            {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                    {status === 'all' ? 'All Orders' : status.charAt(0).toUpperCase() + status.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                        {error}
                    </div>
                )}

                {filteredOrders.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                        <PackageSearch className="mx-auto h-16 w-16 text-slate-300" />
                        <h3 className="mt-4 text-xl font-semibold text-slate-900">No orders found</h3>
                        <p className="mt-1 text-slate-500">Orders will appear here when customers purchase your products.</p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {filteredOrders.map((order, idx) => (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25, delay: idx * 0.03 }}
                                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 px-5 py-4">
                                    <div className="flex flex-wrap items-center gap-3 text-sm">
                                        <span className="font-semibold text-slate-900">Order #{order._id?.slice(-8)}</span>
                                        <span className="text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(order.orderStatus)}`}>
                                            {order.orderStatus || 'Pending'}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-emerald-600">Rs {order.totalAmount}</p>
                                        <p className="text-xs text-slate-500">{order.paymentMethod || 'COD'}</p>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 px-5 py-4">
                                    <h4 className="mb-2 text-sm font-semibold text-slate-900">Customer Details</h4>
                                    <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-3">
                                        <div>
                                            <p className="text-slate-500">Name</p>
                                            <p className="font-medium text-slate-900">{order.customer?.name || order.user?.name || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500">Email</p>
                                            <p className="font-medium text-slate-900">{order.customer?.email || order.user?.email || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500">Phone</p>
                                            <p className="font-medium text-slate-900">{order.customer?.phone || order.user?.phone || 'Not provided'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 px-5 py-4">
                                    <h4 className="mb-3 text-sm font-semibold text-slate-900">Products Purchased</h4>
                                    <div className="space-y-3">
                                        {order.items?.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={item.productImage || 'https://via.placeholder.com/48'}
                                                        alt={item.productName}
                                                        className="h-12 w-12 rounded-lg object-cover"
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/48x48?text=NA';
                                                        }}
                                                    />
                                                    <div>
                                                        <p className="font-medium text-slate-900">{item.productName}</p>
                                                        <p className="text-xs text-slate-500">Quantity: {item.quantity}</p>
                                                    </div>
                                                </div>
                                                <p className="text-sm font-semibold text-emerald-600">Rs {item.price * item.quantity}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 bg-slate-50 px-5 py-3">
                                    <button
                                        onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                                        className="inline-flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-slate-900"
                                    >
                                        {selectedOrder === order._id ? (
                                            <>
                                                Hide Shipping Details
                                                <ChevronUp className="h-4 w-4" />
                                            </>
                                        ) : (
                                            <>
                                                View Shipping Details
                                                <ChevronDown className="h-4 w-4" />
                                            </>
                                        )}
                                    </button>
                                </div>

                                {selectedOrder === order._id && (
                                    <div className="border-t border-slate-100 px-5 py-4">
                                        <h4 className="mb-2 text-sm font-semibold text-slate-900">Shipping Address</h4>
                                        <div className="text-sm text-slate-600">
                                            <p><span className="font-medium text-slate-900">Name:</span> {order.shippingAddress?.fullName || 'N/A'}</p>
                                            <p><span className="font-medium text-slate-900">Address:</span> {order.shippingAddress?.address || 'N/A'}</p>
                                            <p><span className="font-medium text-slate-900">City:</span> {order.shippingAddress?.city || 'N/A'}</p>
                                            <p><span className="font-medium text-slate-900">Pincode:</span> {order.shippingAddress?.pincode || 'N/A'}</p>
                                            <p><span className="font-medium text-slate-900">Phone:</span> {order.shippingAddress?.phone || 'N/A'}</p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerOrders;
