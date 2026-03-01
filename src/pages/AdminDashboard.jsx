import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import toast from 'react-hot-toast';
import {
    Users,
    Package,
    ShoppingBag,
    Banknote,
    Trash2,
    LayoutDashboard,
    PackagePlus,
    ReceiptText,
    Boxes,
    AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalVendors: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [recentUsers, setRecentUsers] = useState([]);
    const [recentProducts, setRecentProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [usersRes, productsRes, ordersRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/admin/products'),
                api.get('/admin/orders')
            ]);

            const users = usersRes.data.users || [];
            const vendors = users.filter((u) => u.role === 'vendor');
            const orders = ordersRes.data.orders || [];
            const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
            const pendingOrders = orders.filter((o) => o.orderStatus === 'Pending').length;

            setStats({
                totalUsers: users.length,
                totalVendors: vendors.length,
                totalProducts: productsRes.data.count || 0,
                totalOrders: orders.length,
                totalRevenue,
                pendingOrders
            });

            setRecentOrders(orders.slice(0, 5));
            setRecentUsers(users.slice(0, 5));
            setRecentProducts((productsRes.data.products || []).slice(0, 5));
            setError('');
        } catch (fetchError) {
            console.error('Dashboard data error:', fetchError);
            setError('Failed to load dashboard data');
            toast.error('Failed to load dashboard data.');
        } finally {
            setLoading(false);
        }
    };

    const handleUserRoleChange = async (userId, newRole) => {
        try {
            await api.put(`/admin/users/${userId}/role`, { role: newRole });
            toast.success(`User role updated to ${newRole}.`);
            fetchDashboardData();
        } catch (updateError) {
            toast.error('Failed to update user role.');
            console.error('Role update error:', updateError);
        }
    };

    const deleteProduct = async (productId) => {
        try {
            await api.delete(`/admin/products/${productId}`);
            toast.success('Product deleted successfully.');
            fetchDashboardData();
        } catch (deleteError) {
            toast.error('Failed to delete product.');
            console.error('Product delete error:', deleteError);
        }
    };

    const handleProductDelete = (productId, productName) => {
        toast.custom((t) => (
            <div className="w-[340px] rounded-2xl border border-rose-200 bg-white p-4 shadow-lg">
                <div className="flex items-start gap-3">
                    <span className="mt-0.5 rounded-lg bg-rose-100 p-1.5 text-rose-600">
                        <AlertTriangle className="h-4 w-4" />
                    </span>
                    <div>
                        <p className="text-sm font-semibold text-slate-900">Delete Product?</p>
                        <p className="mt-1 text-xs text-slate-600">{productName} will be permanently removed.</p>
                    </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700"
                        onClick={() => toast.dismiss(t.id)}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white"
                        onClick={() => {
                            toast.dismiss(t.id);
                            deleteProduct(productId);
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        ));
    };

    const handleOrderStatusUpdate = async (orderId, status) => {
        try {
            await api.put(`/admin/orders/${orderId}/status`, { status });
            toast.success(`Order status updated to ${status}.`);
            fetchDashboardData();
        } catch (updateError) {
            toast.error('Failed to update order status.');
            console.error('Order status update error:', updateError);
        }
    };

    if (loading) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <Skeleton height={110} className="mb-6" />
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, idx) => (
                        <Skeleton key={idx} height={120} borderRadius={16} />
                    ))}
                </div>
                <Skeleton height={120} className="mb-8" />
                <Skeleton height={320} className="mb-6" />
                <Skeleton height={320} />
            </div>
        );
    }

    const statCards = [
        {
            label: 'Total Users',
            value: stats.totalUsers,
            sub: `${stats.totalVendors} vendors`,
            icon: <Users className="h-5 w-5" />,
            accent: 'bg-violet-100 text-violet-700'
        },
        {
            label: 'Total Products',
            value: stats.totalProducts,
            sub: 'active catalog',
            icon: <Package className="h-5 w-5" />,
            accent: 'bg-sky-100 text-sky-700'
        },
        {
            label: 'Total Orders',
            value: stats.totalOrders,
            sub: `${stats.pendingOrders} pending`,
            icon: <ShoppingBag className="h-5 w-5" />,
            accent: 'bg-emerald-100 text-emerald-700'
        },
        {
            label: 'Revenue',
            value: `Rs ${stats.totalRevenue}`,
            sub: 'gross sales',
            icon: <Banknote className="h-5 w-5" />,
            accent: 'bg-amber-100 text-amber-700'
        }
    ];

    const quickLinks = [
        {
            label: 'Admin Dashboard',
            icon: <LayoutDashboard className="h-4 w-4" />,
            link: '/admin/dashboard'
        },
        {
            label: 'Vendor Dashboard',
            icon: <LayoutDashboard className="h-4 w-4" />,
            link: '/vendor/dashboard'
        },
        {
            label: 'Add Product',
            icon: <PackagePlus className="h-4 w-4" />,
            link: '/vendor/add-product'
        },
        {
            label: 'Manage Products',
            icon: <Boxes className="h-4 w-4" />,
            link: '/vendor/my-products'
        },
        {
            label: 'Manage Orders',
            icon: <ReceiptText className="h-4 w-4" />,
            link: '/vendor/orders'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <span className="rounded-xl bg-slate-900 p-2 text-white">
                            <LayoutDashboard className="h-4 w-4" />
                        </span>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
                            <p className="text-sm text-slate-600">Welcome back {user?.name}, your control center is ready.</p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                        {error}
                    </div>
                )}

                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((card, idx) => (
                        <motion.div
                            key={card.label}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, delay: idx * 0.04 }}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">{card.label}</p>
                                    <p className="mt-1 text-2xl font-bold text-slate-900">{card.value}</p>
                                    <p className="mt-1 text-xs text-slate-500">{card.sub}</p>
                                </div>
                                <span className={`rounded-xl p-2.5 ${card.accent}`}>{card.icon}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold text-slate-900">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                        {quickLinks.map((item) => (
                            <Link
                                key={item.label}
                                to={item.link}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white"
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-5 py-4">
                        <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-slate-50">
                                <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                                    <th className="px-5 py-3">Order ID</th>
                                    <th className="px-5 py-3">Customer</th>
                                    <th className="px-5 py-3">Amount</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order._id} className="border-t border-slate-100 text-sm">
                                        <td className="px-5 py-3 font-medium text-slate-900">#{order._id?.slice(-8)}</td>
                                        <td className="px-5 py-3 text-slate-600">{order.user?.name || 'N/A'}</td>
                                        <td className="px-5 py-3 font-semibold text-emerald-600">Rs {order.totalAmount}</td>
                                        <td className="px-5 py-3">
                                            <select
                                                value={order.orderStatus || 'Pending'}
                                                onChange={(e) => handleOrderStatusUpdate(order._id, e.target.value)}
                                                className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-medium outline-none focus:ring-2 focus:ring-slate-300"
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Confirmed">Confirmed</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="px-5 py-3 text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-5 py-4">
                        <h2 className="text-lg font-semibold text-slate-900">Recent Users</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-slate-50">
                                <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                                    <th className="px-5 py-3">Name</th>
                                    <th className="px-5 py-3">Email</th>
                                    <th className="px-5 py-3">Role</th>
                                    <th className="px-5 py-3">Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentUsers.map((listedUser) => (
                                    <tr key={listedUser._id} className="border-t border-slate-100 text-sm">
                                        <td className="px-5 py-3 font-medium text-slate-900">{listedUser.name}</td>
                                        <td className="px-5 py-3 text-slate-600">{listedUser.email}</td>
                                        <td className="px-5 py-3">
                                            <select
                                                value={listedUser.role || 'user'}
                                                onChange={(e) => handleUserRoleChange(listedUser._id, e.target.value)}
                                                className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-medium outline-none focus:ring-2 focus:ring-slate-300"
                                            >
                                                <option value="user">User</option>
                                                <option value="vendor">Vendor</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td className="px-5 py-3 text-slate-600">{new Date(listedUser.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-5 py-4">
                        <h2 className="text-lg font-semibold text-slate-900">Recent Products</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-slate-50">
                                <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                                    <th className="px-5 py-3">Product</th>
                                    <th className="px-5 py-3">Vendor</th>
                                    <th className="px-5 py-3">Price</th>
                                    <th className="px-5 py-3">Stock</th>
                                    <th className="px-5 py-3">Added</th>
                                    <th className="px-5 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentProducts.map((product) => (
                                    <tr key={product._id} className="border-t border-slate-100 text-sm">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="h-10 w-10 rounded-lg object-cover"
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/40';
                                                    }}
                                                />
                                                <span className="font-medium text-slate-900">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-slate-600">{product.addedByName || 'N/A'}</td>
                                        <td className="px-5 py-3 font-semibold text-emerald-600">Rs {product.price}</td>
                                        <td className="px-5 py-3">
                                            <span className={`rounded-full px-2 py-1 text-xs font-semibold ${product.stock > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-slate-600">{new Date(product.createdAt).toLocaleDateString()}</td>
                                        <td className="px-5 py-3">
                                            <button
                                                onClick={() => handleProductDelete(product._id, product.name)}
                                                className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
