import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MOCK_VENDORS, MOCK_PRODUCTS } from '../../data/mockData'
import { useCart } from '../../context/CartContext'
import { ArrowLeft, Star, Clock, MapPin, Plus, Minus, ShoppingCart } from 'lucide-react'

export default function VendorMenu() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { addToCart, cartItems } = useCart()
    const [vendor, setVendor] = useState(null)
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            // Simulate Fetch
            await new Promise(resolve => setTimeout(resolve, 500))

            const foundVendor = MOCK_VENDORS.find(v => v.id === id)
            if (foundVendor) {
                setVendor(foundVendor)
                // Filter products for this vendor (or shared ones for demo)
                const vendorProducts = MOCK_PRODUCTS.filter(p => p.vendor_id === id || p.vendor_id === 'vendor-1')
                setProducts(vendorProducts)
            }
            setLoading(false)
        }

        if (id) fetchData()
    }, [id, navigate])

    if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>
    if (!vendor) return <div className="h-screen flex items-center justify-center">Vendor not found</div>

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Vendor Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-4 py-8">
                    <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-blue-600 mb-6 transition-colors font-medium">
                        <ArrowLeft className="w-5 h-5 mr-2" /> Back
                    </button>

                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-slate-900 mb-2">{vendor.shop_name}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-1 text-slate-400" />
                                    {vendor.address || "Address not provided"}
                                </div>
                                <div className="flex items-center">
                                    <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
                                    <span className="font-bold text-slate-700">{vendor.rating || "New"}</span>
                                </div>
                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1 text-slate-400" />
                                    15-30 min delivery
                                </div>
                            </div>
                        </div>

                        <div className={`mt-4 md:mt-0 inline-flex items-center px-4 py-2 rounded-full font-bold ${vendor.is_open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {vendor.is_open ? 'Open Now' : 'Closed'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu */}
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Menu</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                        <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-all flex flex-col">
                            <div className="h-48 overflow-hidden">
                                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-4 flex-grow flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-slate-800 text-lg">{product.name}</h3>
                                        <span className="font-bold text-slate-900">₹{product.price}</span>
                                    </div>
                                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                                </div>

                                <button
                                    onClick={() => addToCart(product)}
                                    className="w-full bg-blue-50 text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center"
                                >
                                    <Plus className="w-5 h-5 mr-2" /> Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
