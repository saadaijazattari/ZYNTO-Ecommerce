import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import toast from 'react-hot-toast';
import { PlusCircle, PackageSearch, X } from 'lucide-react';
import api from '../utils/api';

const MyProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchMyProducts();
    }, []);

    const fetchMyProducts = async () => {
        try {
            const response = await api.get('/products/myproducts/all');
            setProducts(response.data.products || []);
        } catch (fetchError) {
            setError('Failed to load your products');
            console.error('Error:', fetchError);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (productId) => {
        try {
            await api.delete(`/products/${productId}`);
            setProducts(products.filter((p) => p._id !== productId));
            setDeleteConfirm(null);
            toast.success('Product deleted successfully.');
        } catch (deleteError) {
            toast.error('Failed to delete product.');
            console.error('Delete error:', deleteError);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setImagePreview(product.image);
        setSelectedImage(null);
        setShowEditModal(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB.');
                return;
            }
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file.');
                return;
            }

            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setUploadProgress(0);

        try {
            const formData = new FormData();
            formData.append('name', editingProduct.name);
            formData.append('description', editingProduct.description);
            formData.append('price', editingProduct.price);
            formData.append('stock', editingProduct.stock);
            formData.append('category', editingProduct.category || 'General');
            if (selectedImage) {
                formData.append('image', selectedImage);
            }

            const response = await api.put(`/products/${editingProduct._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });

            if (response.data.success) {
                setProducts(products.map((p) => (p._id === editingProduct._id ? response.data.product : p)));
                setShowEditModal(false);
                setEditingProduct(null);
                setSelectedImage(null);
                setImagePreview(null);
                toast.success('Product updated successfully.');
            }
        } catch (updateError) {
            toast.error(updateError.response?.data?.message || 'Failed to update product.');
            console.error('Update error:', updateError);
        } finally {
            setUpdating(false);
            setUploadProgress(0);
        }
    };

    if (loading) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <Skeleton height={52} className="mb-6" />
                <Skeleton height={380} borderRadius={16} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">My Products</h1>
                        <p className="mt-2 text-slate-600">Manage inventory, stock, and pricing from one place.</p>
                    </div>
                    <Link to="/vendor/add-product" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700">
                        <PlusCircle className="h-4 w-4" />
                        Add New Product
                    </Link>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                        {error}
                    </div>
                )}

                {products.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                        <PackageSearch className="mx-auto h-16 w-16 text-slate-300" />
                        <h3 className="mt-4 text-xl font-semibold text-slate-900">No products yet</h3>
                        <p className="mt-1 text-slate-500">Start by adding your first product.</p>
                        <Link to="/vendor/add-product" className="mt-6 inline-block rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700">
                            Add Product
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <table className="min-w-full">
                            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-5 py-3 text-left">Product</th>
                                    <th className="px-5 py-3 text-left">Category</th>
                                    <th className="px-5 py-3 text-left">Price</th>
                                    <th className="px-5 py-3 text-left">Stock</th>
                                    <th className="px-5 py-3 text-left">Status</th>
                                    <th className="px-5 py-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product, idx) => (
                                    <motion.tr
                                        key={product._id}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2, delay: idx * 0.02 }}
                                        className="border-t border-slate-100 text-sm"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    className="h-10 w-10 rounded-lg object-cover"
                                                    src={product.image}
                                                    alt={product.name}
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/40x40?text=NA';
                                                    }}
                                                />
                                                <div>
                                                    <p className="font-medium text-slate-900">{product.name}</p>
                                                    <p className="text-xs text-slate-500">Added: {new Date(product.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-slate-700">{product.category}</td>
                                        <td className="px-5 py-4 font-semibold text-emerald-600">Rs {product.price}</td>
                                        <td className="px-5 py-4 text-slate-700">{product.stock}</td>
                                        <td className="px-5 py-4">
                                            <span className={`rounded-full px-2 py-1 text-xs font-semibold ${product.stock > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-sm font-semibold">
                                            <button onClick={() => handleEdit(product)} className="mr-4 text-sky-600 hover:text-sky-700">Edit</button>
                                            {deleteConfirm === product._id ? (
                                                <>
                                                    <button onClick={() => handleDelete(product._id)} className="mr-3 text-rose-600 hover:text-rose-700">Confirm</button>
                                                    <button onClick={() => setDeleteConfirm(null)} className="text-slate-600 hover:text-slate-700">Cancel</button>
                                                </>
                                            ) : (
                                                <button onClick={() => setDeleteConfirm(product._id)} className="text-rose-600 hover:text-rose-700">Delete</button>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {showEditModal && editingProduct && (
                    <div className="fixed inset-0 z-50 bg-slate-900/40 p-4 backdrop-blur-sm">
                        <div className="mx-auto mt-14 w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-xl font-bold text-slate-900">Edit Product</h3>
                                <button
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setSelectedImage(null);
                                        setImagePreview(null);
                                    }}
                                    className="rounded-lg p-1 text-slate-500 hover:bg-slate-100"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <form onSubmit={handleUpdate} encType="multipart/form-data" className="space-y-4">
                                <input type="text" value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-300" required />
                                <select value={editingProduct.category || 'General'} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-300">
                                    <option value="General">General</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Clothing">Clothing</option>
                                    <option value="Books">Books</option>
                                    <option value="Home">Home & Kitchen</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Toys">Toys</option>
                                </select>
                                <div className="grid grid-cols-2 gap-3">
                                    <input type="number" min="0" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-300" required />
                                    <input type="number" min="0" value={editingProduct.stock} onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-300" required />
                                </div>
                                <div className="flex items-center gap-3">
                                    <img
                                        src={imagePreview || editingProduct.image}
                                        alt={editingProduct.name}
                                        className="h-20 w-20 rounded-lg border border-slate-200 object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/80x80?text=NA';
                                        }}
                                    />
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-slate-700 hover:file:bg-slate-200" />
                                </div>
                                {uploadProgress > 0 && uploadProgress < 100 && (
                                    <div>
                                        <div className="mb-1 flex justify-between text-xs text-slate-600">
                                            <span>Uploading...</span>
                                            <span>{uploadProgress}%</span>
                                        </div>
                                        <div className="h-2.5 w-full rounded-full bg-slate-200">
                                            <div className="h-2.5 rounded-full bg-slate-900 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                                        </div>
                                    </div>
                                )}
                                <textarea value={editingProduct.description} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} rows="3" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-300" required />
                                <div className="grid grid-cols-2 gap-3 pt-1">
                                    <button type="submit" disabled={updating} className={`rounded-xl py-2.5 text-sm font-semibold text-white ${updating ? 'cursor-not-allowed bg-slate-400' : 'bg-slate-900 hover:bg-slate-700'}`}>
                                        {updating ? 'Updating...' : 'Update Product'}
                                    </button>
                                    <button type="button" onClick={() => { setShowEditModal(false); setSelectedImage(null); setImagePreview(null); }} className="rounded-xl border border-slate-300 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyProducts;
