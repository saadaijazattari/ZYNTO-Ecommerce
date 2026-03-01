import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '@mui/material/Button';
import { ImagePlus, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const AddProduct = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: 'General',
        image: null
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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

            setFormData({ ...formData, image: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setUploadProgress(0);

        try {
            const productData = new FormData();
            productData.append('name', formData.name);
            productData.append('description', formData.description);
            productData.append('price', formData.price);
            productData.append('stock', formData.stock);
            productData.append('category', formData.category);
            if (formData.image) {
                productData.append('image', formData.image);
            }

            const response = await api.post('/products', productData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });

            if (response.data.success) {
                toast.success('Product added successfully.');
                setFormData({
                    name: '',
                    description: '',
                    price: '',
                    stock: '',
                    category: 'General',
                    image: null
                });
                setPreviewImage(null);
                setUploadProgress(0);
                setTimeout(() => {
                    navigate('/vendor/my-products');
                }, 2000);
            }
        } catch (submitError) {
            const msg = submitError.response?.data?.message || 'Failed to add product';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-10">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5">
                        <h1 className="text-2xl font-bold text-white">Add New Product</h1>
                        <p className="mt-1 text-sm text-emerald-100">Vendor: {user?.name}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 p-6" encType="multipart/form-data">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">Product Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-300" placeholder="Enter product name" />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">Category</label>
                            <select name="category" value={formData.category} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-300">
                                <option value="General">General</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Clothing">Clothing</option>
                                <option value="Books">Books</option>
                                <option value="Home">Home & Kitchen</option>
                                <option value="Sports">Sports</option>
                                <option value="Toys">Toys</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">Price (Rs)</label>
                                <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" step="1" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-300" placeholder="999" />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">Stock Quantity</label>
                                <input type="number" name="stock" value={formData.stock} onChange={handleChange} required min="0" step="1" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-300" placeholder="10" />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">Product Image</label>
                            <label htmlFor="image-upload" className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center hover:border-slate-500">
                                {previewImage ? (
                                    <div>
                                        <img src={previewImage} alt="Preview" className="mx-auto h-32 w-32 rounded-lg object-cover" />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setFormData({ ...formData, image: null });
                                                setPreviewImage(null);
                                            }}
                                            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-rose-600"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <ImagePlus className="h-10 w-10 text-slate-400" />
                                        <p className="mt-2 text-sm font-medium text-slate-700">Upload product image</p>
                                        <p className="mt-1 text-xs text-slate-500">PNG, JPG, GIF, WEBP up to 5MB</p>
                                    </>
                                )}
                                <input id="image-upload" name="image" type="file" className="hidden" accept="image/*" onChange={handleImageChange} required={!previewImage} />
                            </label>
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

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-300" placeholder="Enter product description..." />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button type="submit" disabled={loading} variant="contained" sx={{ borderRadius: '12px', textTransform: 'none', py: 1.3, fontWeight: 700, backgroundColor: '#0f172a' }}>
                                {loading ? 'Adding Product...' : 'Add Product'}
                            </Button>
                            <Button type="button" onClick={() => navigate('/vendor/dashboard')} variant="outlined" sx={{ borderRadius: '12px', textTransform: 'none', py: 1.3, fontWeight: 700, borderColor: '#cbd5e1', color: '#334155' }}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
