import { useState, useEffect } from 'react'
import { X, Loader2, Upload, Image as ImageIcon, Tag, IndianRupee } from 'lucide-react'
import { createProduct, updateProduct } from '../../services/productService'

import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'

const PRODUCT_TEMPLATES = [
    {
        id: '20l_can',
        name: '20L Water Can',
        description: 'Premium RO purified drinking water in a sanitized 20L jar. Perfect for home and office use.',
        image_url: 'https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&q=80&w=1000'
    },
    {
        id: '1l_box',
        name: '1L Water Bottles (Box of 12)',
        description: 'Case of 12 x 1L mineral water bottles. Ideal for periodic consumption and events.',
        image_url: 'https://images.unsplash.com/photo-1625723044792-446754e5c2bd?auto=format&fit=crop&q=80&w=1000'
    },
    {
        id: '500ml_box',
        name: '500ml Water Bottles (Box of 24)',
        description: 'Case of 24 x 500ml handy water bottles. Great for parties and gatherings.',
        image_url: 'https://images.unsplash.com/photo-1625723044792-446754e5c2bd?auto=format&fit=crop&q=80&w=1000'
    },
    {
        id: 'chilled_20l',
        name: 'Chilled 20L Water Can',
        description: 'Cold RO purified water in a 20L jar. Delivered chilled.',
        image_url: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=1000'
    },
    {
        id: 'dispenser_manual',
        name: 'Water Dispenser (Manual Pump)',
        description: 'Manual hand pump for 20L water cans. Easy to use and durable.',
        image_url: 'https://m.media-amazon.com/images/I/41-w+2+2+pL._SX300_SY300_QL70_FMwebp_.jpg'
    },
    {
        id: 'custom',
        name: 'Custom Product',
        description: '',
        image_url: ''
    }
]

const QUALITY_TAGS = [
    "Chilled", "BPA Free", "Copper Enriched", "Alkaline", "ISI Mark", "Bisleri Verified", "Subscription Ready"
]

export default function AddProductModal({ isOpen, onClose, onProductAdded, productToEdit = null }) {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [selectedTemplate, setSelectedTemplate] = useState('')
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        mrp: '',
        stock: '',
        image_url: '',
        tags: []
    })

    // Reset or Populate when modal opens
    useEffect(() => {
        if (isOpen) {
            if (productToEdit) {
                // Edit Mode
                setSelectedTemplate('custom') // Default to custom so all fields are editable
                setFormData({
                    name: productToEdit.name || '',
                    description: productToEdit.description || '',
                    price: productToEdit.price || '',
                    mrp: productToEdit.mrp || '',
                    stock: productToEdit.stock || '',
                    image_url: productToEdit.image_url || '',
                    tags: productToEdit.tags || []
                })
            } else {
                // Add Mode
                setSelectedTemplate('')
                setFormData({
                    name: '',
                    description: '',
                    price: '',
                    mrp: '',
                    stock: '',
                    image_url: '',
                    tags: []
                })
            }
        }
    }, [isOpen, productToEdit])

    if (!isOpen) return null

    const handleTemplateChange = (e) => {
        const templateId = e.target.value
        setSelectedTemplate(templateId)

        if (templateId === 'custom') {
            setFormData(prev => ({ ...prev, name: '', description: '', image_url: '' }))
        } else {
            const template = PRODUCT_TEMPLATES.find(t => t.id === templateId)
            if (template) {
                setFormData(prev => ({
                    ...prev,
                    name: template.name,
                    description: template.description,
                    image_url: template.image_url
                }))
            }
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const toggleTag = (tag) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...prev.tags, tag]
        }))
    }

    const calculateDiscount = () => {
        const price = parseFloat(formData.price)
        const mrp = parseFloat(formData.mrp)
        if (price && mrp && mrp > price) {
            return Math.round(((mrp - price) / mrp) * 100)
        }
        return 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const productData = {
                vendor_id: user.uid,
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                mrp: formData.mrp ? parseFloat(formData.mrp) : null,
                stock: parseInt(formData.stock),
                image_url: formData.image_url || 'https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&q=80&w=1000',
                tags: formData.tags,
                is_available: true,
            }

            if (productToEdit) {
                await updateProduct(productToEdit.id, productData)
                toast.success('Product updated successfully')
                onProductAdded({ ...productToEdit, ...productData })
            } else {
                const newProduct = await createProduct(productData)
                toast.success('Product added successfully')
                onProductAdded(newProduct)
            }

            onClose()
        } catch (error) {
            console.error("Error saving product:", error)
            toast.error("Failed to save product")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 flex-shrink-0">
                    <h3 className="text-lg font-bold text-slate-800">Add New Product</h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <div className="overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200">
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* 1. Product Type Selection */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Select Product Type</label>
                            <div className="relative">
                                <select
                                    value={selectedTemplate}
                                    onChange={handleTemplateChange}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all appearance-none bg-white font-medium text-slate-700"
                                    required
                                >
                                    <option value="" disabled>-- Choose a Product --</option>
                                    {PRODUCT_TEMPLATES.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                    ▼
                                </div>
                            </div>
                        </div>

                        {/* Show fields only after selection */}
                        {selectedTemplate && (
                            <>
                                {/* Custom Name Field - Only if Custom is selected */}
                                {selectedTemplate === 'custom' && (
                                    <div className="animate-in slide-in-from-top-2 duration-300">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="e.g. Special Alkaline Water"
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        required
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Product details..."
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none text-slate-600"
                                        rows="3"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Selling Price (₹)</label>
                                        <input
                                            type="number"
                                            name="price"
                                            required
                                            min="0"
                                            value={formData.price}
                                            onChange={handleChange}
                                            placeholder="40"
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-bold text-slate-800"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">MRP (₹) <span className="text-xs font-normal text-slate-400">(Optional)</span></label>
                                        <input
                                            type="number"
                                            name="mrp"
                                            min="0"
                                            value={formData.mrp}
                                            onChange={handleChange}
                                            placeholder="60"
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                        />
                                        {calculateDiscount() > 0 && (
                                            <p className="text-xs text-green-600 font-bold mt-1">
                                                {calculateDiscount()}% Discount Applied!
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Stock</label>
                                        <input
                                            type="number"
                                            name="stock"
                                            required
                                            min="0"
                                            value={formData.stock}
                                            onChange={handleChange}
                                            placeholder="100"
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Tags Section */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Product Tags</label>
                                    <div className="flex flex-wrap gap-2">
                                        {QUALITY_TAGS.map(tag => (
                                            <button
                                                key={tag}
                                                type="button"
                                                onClick={() => toggleTag(tag)}
                                                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${formData.tags.includes(tag)
                                                    ? 'bg-blue-100 border-blue-200 text-blue-700'
                                                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                                                    }`}
                                            >
                                                {tag} {formData.tags.includes(tag) && '✓'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="url"
                                            name="image_url"
                                            required
                                            value={formData.image_url}
                                            onChange={handleChange}
                                            placeholder="https://..."
                                            className="flex-grow px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-xs text-slate-600"
                                        />
                                    </div>

                                    {/* Image Preview */}
                                    {formData.image_url && (
                                        <div className="mt-3 relative h-32 w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
                                            <img
                                                src={formData.image_url}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none'
                                                    // You could show a fallback icon here
                                                }}
                                                onLoad={(e) => e.target.style.display = 'block'}
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-400" style={{ zIndex: -1 }}>
                                                <ImageIcon className="w-8 h-8 opacity-50" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        <div className="pt-4 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || (!selectedTemplate && !productToEdit)}
                                className="px-6 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 hover:shadow-lg transition-all flex items-center disabled:opacity-70 disabled:grayscale"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <PlusIcon className="w-4 h-4 mr-2" />}
                                {productToEdit ? 'Update Product' : 'Add Product'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

function PlusIcon({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
    )
}
