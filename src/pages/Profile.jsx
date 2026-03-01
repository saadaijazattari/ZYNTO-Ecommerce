import React from 'react';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { UserRound, Mail, ShieldCheck, CalendarDays } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
                <Skeleton height={40} width={200} className="mb-3" />
                <Skeleton height={20} className="mb-7" />
                <Skeleton height={220} borderRadius={20} />
            </div>
        );
    }

    const accountType = user?.role === 'admin' ? 'Administrator' : user?.role === 'vendor' ? 'Vendor' : 'Customer';

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-4 py-10 sm:px-6 lg:py-14">
            <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
            >
                <div className="border-b border-slate-200 bg-[linear-gradient(115deg,_#0f172a_0%,_#1e293b_45%,_#334155_100%)] px-6 py-7 text-white sm:px-8">
                    <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
                    <p className="mt-1 text-sm text-slate-200">Manage your account information and access role details.</p>
                </div>

                <div className="space-y-4 p-6 sm:p-8">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Account Snapshot</p>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-xl border border-slate-200 bg-white p-4">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <UserRound className="h-4 w-4" />
                                    <span className="text-xs font-semibold uppercase tracking-wide">Full Name</span>
                                </div>
                                <p className="mt-2 text-base font-semibold text-slate-900">{user?.name || 'N/A'}</p>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white p-4">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Mail className="h-4 w-4" />
                                    <span className="text-xs font-semibold uppercase tracking-wide">Email Address</span>
                                </div>
                                <p className="mt-2 text-base font-semibold text-slate-900">{user?.email || 'N/A'}</p>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white p-4">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <ShieldCheck className="h-4 w-4" />
                                    <span className="text-xs font-semibold uppercase tracking-wide">Role</span>
                                </div>
                                <p className="mt-2 text-base font-semibold text-slate-900">{accountType}</p>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white p-4">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <CalendarDays className="h-4 w-4" />
                                    <span className="text-xs font-semibold uppercase tracking-wide">Status</span>
                                </div>
                                <p className="mt-2 text-base font-semibold text-emerald-600">Active Account</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;
