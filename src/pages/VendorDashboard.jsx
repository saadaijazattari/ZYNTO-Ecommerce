import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, Boxes, ReceiptText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const VendorDashboard = () => {
    const { user } = useAuth();

    const cards = [
        {
            title: 'Add Products',
            desc: 'Create new listings for your store inventory.',
            link: '/vendor/add-product',
            cta: 'Add Product',
            icon: <PlusCircle className="h-6 w-6" />
        },
        {
            title: 'My Products',
            desc: 'Edit pricing, stock, and product information.',
            link: '/vendor/my-products',
            cta: 'View Products',
            icon: <Boxes className="h-6 w-6" />
        },
        {
            title: 'Sales Orders',
            desc: 'Track customer purchases and shipping details.',
            link: '/vendor/orders',
            cta: 'View Orders',
            icon: <ReceiptText className="h-6 w-6" />
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white shadow-sm">
                    <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
                    <p className="mt-2 text-emerald-100">Welcome back {user?.name}. Manage your business faster from here.</p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {cards.map((card, idx) => (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, delay: idx * 0.04 }}
                            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                        >
                            <div className="inline-flex rounded-xl bg-emerald-100 p-2 text-emerald-700">
                                {card.icon}
                            </div>
                            <h2 className="mt-4 text-xl font-semibold text-slate-900">{card.title}</h2>
                            <p className="mt-2 text-sm text-slate-600">{card.desc}</p>
                            <Link to={card.link} className="mt-5 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">
                                {card.cta}
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VendorDashboard;
