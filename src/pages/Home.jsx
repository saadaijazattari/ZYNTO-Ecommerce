import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Truck, Sparkles, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { isAuthenticated, user } = useAuth();

    const stats = [
        { label: 'Active Products', value: '10k+' },
        { label: 'Happy Customers', value: '25k+' },
        { label: 'Fast Delivery Cities', value: '120+' }
    ];

    const highlights = [
        {
            title: 'Verified Sellers',
            desc: 'Carefully moderated vendor listings with quality checks on every category.',
            icon: <ShieldCheck className="h-5 w-5" />
        },
        {
            title: 'Lightning Delivery',
            desc: 'Real-time order flow with smooth checkout and optimized shipping updates.',
            icon: <Truck className="h-5 w-5" />
        },
        {
            title: 'Premium Picks',
            desc: 'Handpicked trending products refreshed daily for better discovery.',
            icon: <Sparkles className="h-5 w-5" />
        }
    ];

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#e2e8f0_0%,_#f8fafc_42%,_#ffffff_100%)] pb-14">
            <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-8 pt-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pt-20">
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
                        <Store className="h-3.5 w-3.5" />
                        Smart Ecommerce Experience
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                        Sell Faster.
                        <br />
                        Shop Smarter.
                    </h1>
                    <p className="mt-5 max-w-xl text-base text-slate-600 sm:text-lg">
                        {isAuthenticated
                            ? `Welcome back ${user?.name}. Your personalized store dashboard is ready to explore.`
                            : 'A modern multi-vendor marketplace built for clean shopping flows and conversion-ready storefronts.'}
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        <Link to="/products" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
                            Explore Products
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        {!isAuthenticated && (
                            <Link to="/register" className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                                Create Account
                            </Link>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35, delay: 0.08 }}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
                        {stats.map((item, idx) => (
                            <div key={item.label} className={`rounded-2xl border p-5 ${idx === 0 ? 'border-emerald-200 bg-emerald-50/60' : idx === 1 ? 'border-sky-200 bg-sky-50/70' : 'border-amber-200 bg-amber-50/80'}`}>
                                <p className="text-2xl font-bold text-slate-900">{item.value}</p>
                                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">{item.label}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </section>

            <section className="mx-auto mt-4 max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-5 md:grid-cols-3">
                    {highlights.map((item, idx) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.28, delay: idx * 0.05 }}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                        >
                            <span className="inline-flex rounded-xl bg-slate-900 p-2 text-white">{item.icon}</span>
                            <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
