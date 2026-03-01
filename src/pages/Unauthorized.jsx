import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Unauthorized = () => {
    const { user } = useAuth();

    const getDashboardLink = () => {
        if (user?.role === 'admin') return '/admin/dashboard';
        if (user?.role === 'vendor') return '/vendor/dashboard';
        return '/profile';
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-10">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <ShieldAlert className="mx-auto h-14 w-14 text-rose-500" />
                <h2 className="mt-4 text-2xl font-bold text-slate-900">Access Denied</h2>
                <p className="mt-2 text-sm text-slate-600">
                    You do not have permission to open this page.
                    {user && ` Current role: ${user.role}.`}
                </p>
                <div className="mt-6 space-y-3">
                    <Link to={getDashboardLink()} className="block rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700">
                        Go to Dashboard
                    </Link>
                    <Link to="/" className="block rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
