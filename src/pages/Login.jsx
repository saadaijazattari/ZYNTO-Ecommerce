import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import toast from 'react-hot-toast';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const { login, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await login(formData);

        if (result.success) {
            toast.success('Logged in successfully.');
            if (result.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (result.role === 'vendor') {
                navigate('/vendor/dashboard');
            } else {
                navigate('/profile');
            }
        } else {
            toast.error(result.error || 'Login failed.');
        }

        setLoading(false);
    };

    if (authLoading) {
        return (
            <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
                <Skeleton height={42} width={180} className="mb-3" />
                <Skeleton height={20} className="mb-7" />
                <Skeleton height={48} className="mb-3" borderRadius={12} />
                <Skeleton height={48} className="mb-6" borderRadius={12} />
                <Skeleton height={44} borderRadius={12} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#dbeafe_0%,_#eff6ff_22%,_#f8fafc_52%,_#ffffff_100%)] px-4 py-12 sm:px-6 lg:py-16">
            <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8"
            >
                <div className="mb-7">
                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                        <LogIn className="h-3.5 w-3.5" />
                        Secure Access
                    </span>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">Sign in to your account</h2>
                    <p className="mt-2 text-sm text-slate-600">
                        New here?{' '}
                        <Link to="/register" className="font-semibold text-slate-900 underline underline-offset-2">
                            Create account
                        </Link>
                    </p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">Email address</label>
                        <div className="relative">
                            <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-300"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">Password</label>
                        <div className="relative">
                            <Lock className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-300"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`inline-flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white ${
                            loading ? 'cursor-not-allowed bg-slate-400' : 'bg-slate-900 hover:bg-slate-700'
                        }`}
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                        {!loading && <ArrowRight className="h-4 w-4" />}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
