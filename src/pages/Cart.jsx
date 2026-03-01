import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ShoppingCart, Trash2, Plus, Minus, CircleCheckBig, AlertTriangle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Cart = () => {
    const { cartItems, cartTotal, removeFromCart, updateQuantity, clearCart, getCartCount } = useCart();
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [shippingAddress, setShippingAddress] = useState({
        fullName: user?.name || '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        phone: user?.phone || ''
    });

    const handleQuantityChange = (productId, newQuantity) => {
        updateQuantity(productId, newQuantity);
    };

    const handleRemove = (productId, productName) => {
        toast.custom((t) => (
            <div className="w-[330px] rounded-2xl border border-rose-200 bg-white p-4 shadow-lg">
                <div className="flex items-start gap-3">
                    <span className="mt-0.5 rounded-lg bg-rose-100 p-1.5 text-rose-600">
                        <AlertTriangle className="h-4 w-4" />
                    </span>
                    <div>
                        <p className="text-sm font-semibold text-slate-900">Remove item?</p>
                        <p className="mt-1 text-xs text-slate-600">{productName} will be removed from your cart.</p>
                    </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                    <button className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700" onClick={() => toast.dismiss(t.id)}>
                        Cancel
                    </button>
                    <button
                        className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white"
                        onClick={() => {
                            removeFromCart(productId);
                            toast.dismiss(t.id);
                            toast.success(`${productName} removed.`);
                        }}
                    >
                        Remove
                    </button>
                </div>
            </div>
        ));
    };

    const handleClearCart = () => {
        toast.custom((t) => (
            <div className="w-[330px] rounded-2xl border border-rose-200 bg-white p-4 shadow-lg">
                <div className="flex items-start gap-3">
                    <span className="mt-0.5 rounded-lg bg-rose-100 p-1.5 text-rose-600">
                        <AlertTriangle className="h-4 w-4" />
                    </span>
                    <div>
                        <p className="text-sm font-semibold text-slate-900">Clear entire cart?</p>
                        <p className="mt-1 text-xs text-slate-600">All selected items will be removed.</p>
                    </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                    <button className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700" onClick={() => toast.dismiss(t.id)}>
                        Cancel
                    </button>
                    <button
                        className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white"
                        onClick={() => {
                            clearCart();
                            toast.dismiss(t.id);
                            toast.success('Cart cleared.');
                        }}
                    >
                        Clear
                    </button>
                </div>
            </div>
        ));
    };

    const handleCheckout = () => {
        if (!isAuthenticated) {
            toast.error('Please login to checkout.');
            navigate('/login');
            return;
        }
        setShowCheckoutModal(true);
    };

    const confirmOrder = async () => {
        if (!shippingAddress.fullName || !shippingAddress.address || !shippingAddress.city ||
            !shippingAddress.state || !shippingAddress.pincode || !shippingAddress.phone) {
            toast.error('Please fill all shipping address fields.');
            return;
        }

        setProcessing(true);

        try {
            const orderData = {
                items: cartItems.map((item) => ({
                    product: item._id,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: cartTotal,
                paymentMethod: 'COD',
                shippingAddress
            };

            const response = await api.post('/orders', orderData);
            if (response.data.success) {
                setProcessing(false);
                setShowCheckoutModal(false);
                setOrderPlaced(true);
                toast.success('Order placed successfully.');

                setTimeout(() => {
                    clearCart();
                    setOrderPlaced(false);
                    navigate('/products');
                }, 3000);
            }
        } catch (error) {
            console.error('Order error:', error);
            toast.error(error.response?.data?.message || 'Failed to place order. Please try again.');
            setProcessing(false);
        }
    };

    if (orderPlaced) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center px-4 py-10">
                <div className="w-full max-w-md rounded-2xl border border-emerald-200 bg-white p-8 text-center shadow-sm">
                    <CircleCheckBig className="mx-auto h-16 w-16 text-emerald-500" />
                    <h2 className="mt-4 text-2xl font-bold text-slate-900">Order Placed</h2>
                    <p className="mt-2 text-slate-600">Your order is confirmed. Redirecting to products.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-slate-900">Shopping Cart</h1>
                    {cartItems.length > 0 && (
                        <button onClick={handleClearCart} className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
                            <Trash2 className="h-4 w-4" />
                            Clear Cart
                        </button>
                    )}
                </div>

                {cartItems.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                        <ShoppingCart className="mx-auto h-14 w-14 text-slate-300" />
                        <h3 className="mt-4 text-xl font-semibold text-slate-900">Your cart is empty</h3>
                        <p className="mt-1 text-slate-500">Add products to start checkout.</p>
                        <Link to="/products" className="mt-6 inline-block rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        <div className="space-y-4 lg:col-span-2">
                            {cartItems.map((item, idx) => (
                                <motion.div
                                    key={item._id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25, delay: idx * 0.03 }}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                                >
                                    <div className="flex items-start gap-4">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-20 w-20 rounded-xl object-cover"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                                            }}
                                        />
                                        <div className="flex-1">
                                            <Link to={`/product/${item._id}`} className="font-semibold text-slate-900 hover:text-slate-700">
                                                {item.name}
                                            </Link>
                                            <p className="mt-1 text-xs text-slate-500">Stock: {item.stock} available</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-slate-900">Rs {item.price * item.quantity}</p>
                                            <p className="text-xs text-slate-500">Rs {item.price} each</p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex items-center gap-1 rounded-xl border border-slate-200 p-1">
                                            <button onClick={() => handleQuantityChange(item._id, item.quantity - 1)} className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100">
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                                            <button
                                                onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                                disabled={item.quantity >= item.stock}
                                                className={`rounded-lg p-1.5 ${item.quantity >= item.stock ? 'cursor-not-allowed text-slate-300' : 'text-slate-600 hover:bg-slate-100'}`}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <button onClick={() => handleRemove(item._id, item.name)} className="text-sm font-semibold text-rose-600 hover:text-rose-700">
                                            Remove
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="lg:col-span-1">
                            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h2 className="text-xl font-bold text-slate-900">Order Summary</h2>
                                <div className="mt-4 space-y-2">
                                    {cartItems.map((item) => (
                                        <div key={item._id} className="flex justify-between text-sm">
                                            <span className="text-slate-600">{item.name} x {item.quantity}</span>
                                            <span className="font-medium text-slate-900">Rs {item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 border-t border-slate-200 pt-4">
                                    <div className="flex justify-between text-lg font-bold text-slate-900">
                                        <span>Total</span>
                                        <span className="text-emerald-600">Rs {cartTotal}</span>
                                    </div>
                                    <p className="mt-1 text-xs text-slate-500">{getCartCount()} item(s) in cart</p>
                                </div>
                                <button onClick={handleCheckout} className="mt-5 w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-700">
                                    Proceed to Checkout
                                </button>
                                <Link to="/products" className="mt-3 block text-center text-sm font-medium text-slate-600 hover:text-slate-900">
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {showCheckoutModal && (
                    <div className="fixed inset-0 z-50 bg-slate-900/40 p-4 backdrop-blur-sm">
                        <div className="mx-auto mt-16 w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                            <h3 className="text-xl font-bold text-slate-900">Confirm Order</h3>
                            <p className="mt-1 text-sm text-slate-500">Provide shipping details before placing order.</p>

                            <div className="mt-5 grid grid-cols-2 gap-4">
                                <input type="text" placeholder="Full Name *" className="col-span-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-300" value={shippingAddress.fullName} onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })} />
                                <input type="text" placeholder="Address *" className="col-span-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-300" value={shippingAddress.address} onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })} />
                                <input type="text" placeholder="City *" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-300" value={shippingAddress.city} onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })} />
                                <input type="text" placeholder="State *" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-300" value={shippingAddress.state} onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })} />
                                <input type="text" placeholder="Pincode *" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-300" value={shippingAddress.pincode} onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })} />
                                <input type="text" placeholder="Phone *" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-300" value={shippingAddress.phone} onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })} />
                            </div>

                            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <h4 className="mb-2 text-sm font-semibold text-slate-900">Order Summary</h4>
                                {cartItems.map((item) => (
                                    <div key={item._id} className="mb-1 flex justify-between text-sm">
                                        <span>{item.name} x {item.quantity}</span>
                                        <span>Rs {item.price * item.quantity}</span>
                                    </div>
                                ))}
                                <div className="mt-2 flex justify-between border-t border-slate-200 pt-2 text-sm font-bold">
                                    <span>Total</span>
                                    <span className="text-emerald-600">Rs {cartTotal}</span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <button onClick={confirmOrder} disabled={processing} className={`rounded-xl py-2.5 text-sm font-semibold text-white ${processing ? 'cursor-not-allowed bg-slate-400' : 'bg-slate-900 hover:bg-slate-700'}`}>
                                    {processing ? 'Processing...' : 'Confirm Order'}
                                </button>
                                <button onClick={() => setShowCheckoutModal(false)} disabled={processing} className="rounded-xl border border-slate-300 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
