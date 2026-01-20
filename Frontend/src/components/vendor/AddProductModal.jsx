import { useState } from 'react'
import { X, Loader2, Plus } from 'lucide-react'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'
import { addDocument } from '../../services/firestoreService'

export default function AddProductModal({ isOpen, onClose, onProductAdded }) {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        image_url: 'https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&q=80&w=1000',
    })

    if (!isOpen) return null

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // Validation
        if (!formData.name.trim()) {
            toast.error('Product name is required')
            return
        }
        if (!formData.description.trim()) {
            toast.error('Description is required')
            return
        }
        if (!formData.price || parseFloat(formData.price) <= 0) {
            toast.error('Valid price is required')
            return
        }
        if (!formData.stock || parseInt(formData.stock) < 0) {
            toast.error('Valid stock quantity is required')
            return
        }

        setLoading(true)
        
        try {
            if (!user?.uid) {
                toast.error('User not authenticated')
                setLoading(false)
                return
            }

            const productData = {
                vendorId: user.uid,
                name: formData.name.trim(),
                description: formData.description.trim(),
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                image_url: formData.image_url.trim() || 'https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&q=80&w=1000',
                is_available: parseInt(formData.stock) > 0,
                status: 'active'
            }

            // Save to Firebase
            const productId = await addDocument('products', productData)
            
            const newProduct = {
                id: productId,
                ...productData
            }

            if (onProductAdded && typeof onProductAdded === 'function') {
                onProductAdded(newProduct)
            }
            
            toast.success('Product added successfully!')
            onClose()
            
            // Reset form
            setFormData({
                name: '',
                description: '',
                price: '',
                stock: '',
                image_url: 'https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&q=80&w=1000',
            })
        } catch (error) {
            console.error('Error adding product:', error)
            toast.error('Failed to add product. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-linear-to-r from-blue-50 to-indigo-50">
                    <h3 className="text-base sm:text-lg font-bold text-slate-800">Add New Product</h3>
                    <button 
                        onClick={onClose} 
                        className="p-1 hover:bg-slate-200 rounded-full transition-colors"
                        type="button"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Product Name *</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. 20L Water Can"
                            className="w-full px-4 py-2 text-sm sm:text-base rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
                        <textarea
                            name="description"
                            required
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Short description of your product..."
                            className="w-full px-4 py-2 text-sm sm:text-base rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                            rows="3"
                            disabled={loading}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Price (₹) *</label>
                            <input
                                type="number"
                                name="price"
                                required
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="40"
                                className="w-full px-4 py-2 text-sm sm:text-base rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Stock *</label>
                            <input
                                type="number"
                                name="stock"
                                required
                                min="0"
                                value={formData.stock}
                                onChange={handleChange}
                                placeholder="100"
                                className="w-full px-4 py-2 text-sm sm:text-base rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                        <input
                            type="url"
                            name="image_url"
                            value={formData.image_url}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                            className="w-full px-4 py-2 text-sm sm:text-base rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                            disabled={loading}
                        />
                        <p className="text-xs text-slate-400 mt-1">Leave empty to use default water product image</p>
                    </div>

                    <div className="pt-4 flex flex-col-reverse sm:flex-row justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 text-sm sm:text-base rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 text-sm sm:text-base rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4" />
                                    Add Product
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
