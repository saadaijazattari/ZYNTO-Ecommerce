import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Eye, EyeOff, User, Mail, Lock, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user'
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (formData.name.length < 2) {
            toast.error('Name must be at least 2 characters long.');
            return false;
        }
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error('Please enter a valid email address.');
            return false;
        }
        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters long.');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match.');
            return false;
        }
        return true;
    };

    const getPasswordStrength = () => {
        const password = formData.password;
        if (!password) return 0;
        let strength = 0;
        if (password.length >= 6) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[@$!%*?&]/.test(password)) strength++;
        return strength;
    };

    const passwordStrength = getPasswordStrength();
    const strengthText = passwordStrength <= 2 ? 'Weak' : passwordStrength <= 3 ? 'Fair' : passwordStrength <= 4 ? 'Good' : 'Strong';
    const strengthColor = passwordStrength <= 2 ? 'bg-rose-500' : passwordStrength <= 3 ? 'bg-amber-500' : passwordStrength <= 4 ? 'bg-sky-500' : 'bg-emerald-500';

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const { confirmPassword, ...registerData } = formData;
            const result = await register(registerData);

            if (result.success) {
                toast.success('Registration successful! Redirecting...');
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    role: 'user'
                });
                setTimeout(() => {
                    if (result.role === 'admin') {
                        navigate('/admin/dashboard');
                    } else if (result.role === 'vendor') {
                        navigate('/vendor/dashboard');
                    } else {
                        navigate('/profile');
                    }
                }, 2000);
            } else {
                toast.error(result.error || 'Registration failed. Please try again.');
            }
        } catch (err) {
            toast.error('An unexpected error occurred. Please try again.');
            console.error('Registration error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-4 py-10">
            <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
            >
                <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">Create Account</h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-slate-900 underline">Sign in</Link>
                </p>

                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">Full Name</label>
                        <div className="relative">
                            <User className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} disabled={loading} className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-slate-300" placeholder="John Doe" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">Email Address</label>
                        <div className="relative">
                            <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} disabled={loading} className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-slate-300" placeholder="john@example.com" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="role" className="mb-1 block text-sm font-medium text-slate-700">Register as</label>
                        <div className="relative">
                            <Shield className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <select id="role" name="role" value={formData.role} onChange={handleChange} className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-slate-300">
                                <option value="user">User (Shop Products)</option>
                                <option value="vendor">Vendor (Sell Products)</option>
                                <option value="admin">Admin (Manage Store)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">Password</label>
                        <div className="relative">
                            <Lock className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <input id="password" name="password" type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={handleChange} disabled={loading} className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-10 text-sm outline-none focus:ring-2 focus:ring-slate-300" placeholder="********" />
                            <button type="button" className="absolute right-3 top-3 text-slate-400" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {formData.password && (
                            <div className="mt-2">
                                <div className="mb-1 flex items-center justify-between text-xs">
                                    <span className="text-slate-500">Password strength</span>
                                    <span className="font-semibold text-slate-700">{strengthText}</span>
                                </div>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                                    <div className={`h-full ${strengthColor}`} style={{ width: `${(passwordStrength / 5) * 100}%` }} />
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-slate-700">Confirm Password</label>
                        <div className="relative">
                            <Lock className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} required value={formData.confirmPassword} onChange={handleChange} disabled={loading} className={`w-full rounded-xl border py-2.5 pl-10 pr-10 text-sm outline-none focus:ring-2 focus:ring-slate-300 ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-rose-300 bg-rose-50' : 'border-slate-200'}`} placeholder="********" />
                            <button type="button" className="absolute right-3 top-3 text-slate-400" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                            <p className="mt-1 text-xs text-rose-600">Passwords do not match</p>
                        )}
                    </div>

                    <div className="flex items-center">
                        <input id="terms" name="terms" type="checkbox" required className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400" />
                        <label htmlFor="terms" className="ml-2 text-sm text-slate-700">
                            I agree to the <a href="#" className="font-semibold text-slate-900 underline">Terms</a> and <a href="#" className="font-semibold text-slate-900 underline">Privacy Policy</a>
                        </label>
                    </div>

                    <button type="submit" disabled={loading} className={`w-full rounded-xl py-2.5 text-sm font-semibold text-white ${loading ? 'cursor-not-allowed bg-slate-400' : 'bg-slate-900 hover:bg-slate-700'}`}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Register;
