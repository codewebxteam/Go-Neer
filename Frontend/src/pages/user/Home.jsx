import { Link, useNavigate } from 'react-router-dom'
import { Search, ArrowRight, Loader2, Droplets, Truck, ShieldCheck, Clock, Phone, MapPin, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
// import { getDocuments, addDocument } from '../../services/firestoreService'
import VendorCard from '../../components/user/VendorCard'
import { getVendors } from '../../services/vendorService'
import { MOCK_PRODUCTS } from '../../data/mockData'
import { motion } from 'framer-motion'
// import { MOCK_VENDORS } from '../../data/mockData'

export default function Home() {
    const navigate = useNavigate()
    const [vendors, setVendors] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredVendors, setFilteredVendors] = useState([])
    const [userLocation, setUserLocation] = useState(null)

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                setLoading(true)
                setError(null)
                const data = await getVendors()
                console.log("Fetched vendors:", data)
                setVendors(data || [])
                setFilteredVendors(data || [])
            } catch (error) {
                console.error("Failed to fetch vendors:", error)
                setError(error.message || "Failed to load vendors")
                setVendors([])
                setFilteredVendors([])
            } finally {
                setLoading(false)
            }
        }

        fetchVendors()
    }, [])

    // Get user's current location
    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords
                    setUserLocation({ latitude, longitude })
                    handleLocationSearch(latitude, longitude)
                },
                (error) => {
                    console.log('Location access denied or unavailable')
                }
            )
        }
    }

    // Calculate distance between two coordinates
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371 // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180
        const dLon = (lon2 - lon1) * Math.PI / 180
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        return (R * c).toFixed(1)
    }

    // Handle location-based search
    const handleLocationSearch = (latitude, longitude) => {
        const nearby = vendors
            .map(vendor => ({
                ...vendor,
                distance: calculateDistance(latitude, longitude, vendor.latitude, vendor.longitude)
            }))
            .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
        
        setFilteredVendors(nearby)
    }

    // Handle search - navigate to product results page
    const handleSearch = (e) => {
        e.preventDefault()
        const query = searchQuery.trim()
        if (query) {
            navigate(`/search?q=${encodeURIComponent(query)}`)
        }
    }

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value)
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    }

    return (
        <div className="flex flex-col min-h-[calc(100vh-64px)] pb-20 bg-slate-50">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-700 to-cyan-600">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 5, -5, 0],
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-1/2 -left-1/2 w-[1000px] h-[1000px] bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-30"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.5, 1],
                            x: [0, 100, 0],
                        }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="absolute -bottom-1/2 -right-1/2 w-[800px] h-[800px] bg-cyan-400 rounded-full mix-blend-screen filter blur-[80px] opacity-20"
                    />
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-white drop-shadow-sm">
                            Pure Water. <br className="md:hidden" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-200">
                                Instant Delivery.
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-light text-blue-100">
                            Connect with verified local vendors and get premium quality water delivered to your doorstep in minutes.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-full shadow-2xl max-w-xl mx-auto flex items-center"
                    >
                        <Search className="ml-4 text-cyan-300 w-6 h-6" />
                        <input
                            type="text"
                            placeholder="Search by product name or location..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                            className="flex-grow p-4 bg-transparent outline-none text-white placeholder-blue-200/70 font-medium"
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSearch}
                            className="bg-white text-blue-700 px-8 py-4 rounded-full font-bold shadow-lg flex items-center hover:bg-blue-50 transition-colors"
                        >
                            Find Water <ArrowRight className="ml-2 w-4 h-4" />
                        </motion.button>
                    </motion.div>
                </div>
            </section>



            {/* Why Choose Us */}
            <section className="py-20 container mx-auto px-4">
                <div className="text-center mb-16">
                    <span className="text-blue-600 font-bold tracking-wider uppercase text-sm bg-blue-50 px-3 py-1 rounded-full">Why Go-Neer?</span>
                    <h2 className="text-4xl font-bold text-slate-900 mt-4">Hydration made simple.</h2>
                    <p className="text-slate-500 mt-4 max-w-2xl mx-auto">We don't just deliver water; we deliver peace of mind. Here is why thousands trust us every day.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: Droplets, title: "100% Pure & Verified", desc: "Every vendor is vetted for quality compliance. We ensure you get only the safest mineral water." },
                        { icon: Clock, title: "Lighting Fast Delivery", desc: "Our local network ensures delivery within 30 minutes. No more waiting for your water." },
                        { icon: ShieldCheck, title: "Secure Payments", desc: "Pay via UPI, Cards, or Cash on Delivery. Your transactions are safe and transparent." }
                    ].map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                                <feature.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                            <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Impact Statistics Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Impact By Numbers</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        {[
                            { number: '50K+', label: 'Happy Customers' },
                            { number: '500+', label: 'Verified Vendors' },
                            { number: '15min', label: 'Avg Delivery Time' },
                            { number: '99.8%', label: 'Satisfaction Rate' },
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="text-center"
                            >
                                <motion.div
                                    className="text-4xl md:text-5xl font-bold mb-2"
                                    whileHover={{ scale: 1.1 }}
                                >
                                    {stat.number}
                                </motion.div>
                                <p className="text-blue-100 text-sm md:text-base">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Customer Ratings Section */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 text-center">What Our Customers Say</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: 'Sarah Johnson',
                                rating: 5,
                                text: '"The water quality is exceptional! I\'ve never tasted such pure water. Delivery is always on time."'
                            },
                            {
                                name: 'Mike Chen',
                                rating: 5,
                                text: '"Super fast delivery! Ordered at 9 AM and had water by 10 AM. Go-Neer is a lifesaver."'
                            },
                            {
                                name: 'Priya Patel',
                                rating: 5,
                                text: '"Reliable service with top-notch water quality. The delivery speed is impressive every time."'
                            },
                        ].map((review, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center"
                            >
                                <div className="flex justify-center mb-4">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <p className="text-slate-600 mb-4 italic">
                                    {review.text}
                                </p>
                                <p className="font-bold text-slate-800">- {review.name}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section id="products-grid" className="py-20 bg-slate-100/50">
                <div className="container mx-auto px-4">
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">All Available Products</h2>
                        <p className="text-slate-500">Browse our complete selection of premium water products</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                        </div>
                    ) : MOCK_PRODUCTS.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {MOCK_PRODUCTS.map(product => (
                                <Link key={product.id} to={`/product/${product.id}`} className="block">
                                    <motion.div
                                        variants={itemVariants}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true }}
                                        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-all h-full flex flex-col"
                                    >
                                        <div className="h-48 overflow-hidden bg-gradient-to-r from-blue-400 to-cyan-300">
                                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                                        </div>
                                        <div className="p-5 flex-grow flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 mb-2">{product.name}</h3>
                                                <p className="text-slate-500 text-sm mb-3 line-clamp-2">{product.description}</p>
                                            </div>
                                            <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-3">
                                                <span className="text-lg font-bold text-blue-600">₹{product.price}</span>
                                                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-semibold">View Details</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-300 shadow-sm">
                            <Droplets className="w-16 h-16 text-slate-400 mx-auto mb-6" />
                            <h3 className="text-2xl text-slate-700 font-bold mb-3">No Products Available Yet</h3>
                            <p className="text-slate-500 mb-6">Products will appear here soon. Check back later!</p>
                        </div>
                    )}
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 container mx-auto px-4">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-12 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to quench your thirst?</h2>
                        <p className="text-blue-100 mb-8 max-w-xl mx-auto text-lg">Join thousands of happy customers and experience the easiest way to order water today.</p>
                        <div className="flex flex-col md:flex-row justify-center gap-4">
                            <Link to="/signup" className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all">
                                Get Started
                            </Link>
                            <button className="bg-blue-700/50 border border-blue-400 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center">
                                <Phone className="w-4 h-4 mr-2" /> Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
