import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import {
    ShoppingCart,
    LayoutDashboard,
    UserRound,
    LogOut,
    Store,
    Package
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const { getCartCount } = useCart();
    const navigate = useNavigate();
    const cartCount = getCartCount();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const dashboardPath = user?.role === 'admin' ? '/admin/dashboard' : user?.role === 'vendor' ? '/vendor/dashboard' : '/profile';
    const dashboardLabel = user?.role === 'admin' ? 'Admin Panel' : user?.role === 'vendor' ? 'Vendor Panel' : 'Profile';

    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
            <nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <Link to="/" className="flex items-center gap-2 text-slate-900">
                        <span className="rounded-xl bg-slate-900 p-2 text-white">
                            <Store className="h-4 w-4" />
                        </span>
                        <span className="text-lg font-semibold tracking-tight">Zyntho</span>
                    </Link>
                </motion.div>

                <div className="hidden items-center gap-1 md:flex">
                    <Link to="/" className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Home</Link>
                    <Link to="/products" className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Products</Link>
                    {isAuthenticated && (
                        <Link to={dashboardPath} className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">{dashboardLabel}</Link>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {isAuthenticated && user?.role === 'vendor' && (
                        <Link to="/vendor/add-product" className="hidden items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 sm:flex">
                            <Package className="h-4 w-4" />
                            Add Product
                        </Link>
                    )}

                    <Link to="/cart" className="rounded-xl p-2 text-slate-700 hover:bg-slate-100" aria-label="cart">
                        <Badge badgeContent={isAuthenticated ? cartCount : 0} color="error" overlap="circular">
                            <ShoppingCart className="h-5 w-5" />
                        </Badge>
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <Link to={dashboardPath} className="rounded-xl p-2 text-slate-700 hover:bg-slate-100 md:hidden">
                                <LayoutDashboard className="h-5 w-5" />
                            </Link>
                            <Link to="/profile" className="rounded-xl p-2 text-slate-700 hover:bg-slate-100 md:hidden">
                                <UserRound className="h-5 w-5" />
                            </Link>
                            <Link to="/profile" className="hidden items-center gap-2 rounded-xl px-2 py-1 hover:bg-slate-100 sm:flex">
                                <Avatar sx={{ width: 30, height: 30, fontSize: 14 }}>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</Avatar>
                                <span className="max-w-24 truncate text-sm font-medium text-slate-700">{user?.name}</span>
                            </Link>
                            <button onClick={handleLogout} className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700">
                                <span className="hidden sm:inline">Logout</span>
                                <LogOut className="h-4 w-4 sm:hidden" />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Login</Link>
                            <Link to="/register" className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700">Register</Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
