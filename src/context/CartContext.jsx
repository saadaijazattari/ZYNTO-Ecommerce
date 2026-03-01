import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const { isAuthenticated, user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
        calculateTotal();
    }, [cartItems]);

    const calculateTotal = () => {
        const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setCartTotal(total);
    };

    const addToCart = (product) => {
        if (product.stock <= 0) {
            toast.error(`${product.name} is out of stock.`);
            return false;
        }

        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item._id === product._id);

            if (existingItem) {
                if (existingItem.quantity >= product.stock) {
                    toast.error(`Only ${product.stock} items available in stock.`);
                    return prevItems;
                }

                return prevItems.map((item) =>
                    item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }

            return [...prevItems, { ...product, quantity: 1 }];
        });

        return true;
    };

    const removeFromCart = (productId) => {
        setCartItems((prevItems) => prevItems.filter((item) => item._id !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
        const product = cartItems.find((item) => item._id === productId);
        if (newQuantity > product.stock) {
            toast.error(`Only ${product.stock} items available.`);
            return;
        }
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }

        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item._id === productId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const value = {
        cartItems,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartCount
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
