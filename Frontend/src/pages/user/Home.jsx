import { Link } from 'react-router-dom'
import { MapPin, Search, ArrowRight, Loader2, Droplets, Truck, ShieldCheck, Clock, Phone } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getDocuments, addDocument } from '../../services/firestoreService'
import VendorCard from '../../components/user/VendorCard'
import VendorMap from '../../components/user/VendorMap'
import { motion } from 'framer-motion'
import { MOCK_VENDORS } from '../../data/mockData'

export default function Home() {
    const [vendors, setVendors] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchLocation, setSearchLocation] = useState('')
    const [filteredVendors, setFilteredVendors] = useState([])
    const [userLocation, setUserLocation] = useState(null)

    useEffect(() => {
        // Set vendors to mock data immediately, then try to fetch from Firestore
        const fetchVendors = async () => {
            try {
                setLoading(true)
                
                // Use mock data immediately while fetching
                setVendors(MOCK_VENDORS)
                setFilteredVendors(MOCK_VENDORS)
                console.log('Using mock vendors:', MOCK_VENDORS.length)
                
                // Try to fetch from Firestore in background
                try {
                    const vendorsData = await getDocuments('vendors')
                    console.log('Vendors fetched from Firestore:', vendorsData?.length || 0)
                    
                    if (vendorsData && vendorsData.length > 0) {
                        setVendors(vendorsData)
                        setFilteredVendors(vendorsData)
                        console.log('Updated to Firestore data')
                    }
                } catch (firestoreError) {
                    console.warn('Firestore read failed, using mock data:', firestoreError.message)
                }
            } catch (error) {
                console.error('Error in fetchVendors:', error)
                // Fallback to mock data
                setVendors(MOCK_VENDORS)
                setFilteredVendors(MOCK_VENDORS)
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

    // Handle search by location (city/area)
    const handleSearchChange = (e) => {
        const value = e.target.value.toLowerCase().trim()
        setSearchLocation(value)
        
        if (!value) {
            setFilteredVendors(vendors)
            console.log('Search cleared, showing all vendors:', vendors.length)
            return
        }

        // Filter ONLY by city or area - location-based search
        const filtered = vendors.filter(vendor => {
            const city = vendor.city?.toLowerCase() || ''
            const area = vendor.area?.toLowerCase() || ''
            
            // Match if the search term is found in city or area name
            const matches = city.includes(value) || area.includes(value)
            
            if (matches) {
                console.log('Match found:', vendor.shop_name, 'in', vendor.city)
            }
            
            return matches
        })
        
        console.log('Searching for location "' + value + '" found:', filtered.length, 'vendors')
        setFilteredVendors(filtered)
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
            <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
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
                        <MapPin className="ml-4 text-cyan-300 w-6 h-6 animate-bounce" />
                        <input
                            type="text"
                            placeholder="Enter your location to find vendors..."
                            value={searchLocation}
                            onChange={handleSearchChange}
                            className="flex-grow p-4 bg-transparent outline-none text-white placeholder-blue-200/70 font-medium"
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                getUserLocation()
                                document.getElementById('vendors-grid').scrollIntoView({ behavior: 'smooth' })
                            }}
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

            {/* Vendors Section */}
            <section id="vendors-grid" className="py-20 bg-slate-100/50">
                <div className="container mx-auto px-4">
                    {searchLocation ? (
                        <div className="mb-12">
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">Vendors in "{searchLocation}"</h2>
                            <p className="text-slate-500">Found {filteredVendors.length} vendors</p>
                        </div>
                    ) : (
                        <div className="mb-12">
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">All Available Vendors</h2>
                            <p className="text-slate-500">{filteredVendors.length} vendors ready to serve you</p>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                        </div>
                    ) : filteredVendors.length > 0 ? (
                        <>
                            {/* Image Gallery Section */}
                            <div className="mb-16">
                                <h3 className="text-2xl font-bold text-slate-900 mb-6">Vendor Images</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {filteredVendors.map((vendor) => (
                                        <motion.div
                                            key={vendor.id}
                                            variants={itemVariants}
                                            className="relative group cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-64"
                                        >
                                            <img
                                                src={vendor.image_url}
                                                alt={vendor.shop_name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                                                <h3 className="font-bold text-lg">{vendor.shop_name}</h3>
                                                <p className="text-sm text-gray-200">{vendor.address}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Map and Details Section */}
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-6">Nearby Vendors Map & Details</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Vendor List with Details */}
                                    <div className="lg:col-span-1">
                                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                            {filteredVendors.map((vendor) => (
                                                <motion.div 
                                                    key={vendor.id} 
                                                    variants={itemVariants}
                                                    className="bg-white p-4 rounded-xl shadow-md border border-slate-100 hover:shadow-lg transition-all"
                                                >
                                                    <div className="flex gap-3 mb-3">
                                                        <img 
                                                            src={vendor.image_url} 
                                                            alt={vendor.shop_name}
                                                            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                                                        />
                                                        <div className="flex-grow">
                                                            <h4 className="font-bold text-slate-900 text-sm">{vendor.shop_name}</h4>
                                                            <p className="text-xs text-slate-500">{vendor.city}</p>
                                                            <div className="flex items-center gap-1 mt-1">
                                                                <span className="text-yellow-500 text-xs">★</span>
                                                                <span className="font-bold text-xs text-slate-700">{vendor.rating}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2 text-xs text-slate-600">
                                                        <div className="flex items-start gap-2">
                                                            <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0 text-blue-600" />
                                                            <span>{vendor.address}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-3 h-3 flex-shrink-0 text-blue-600" />
                                                            <span>{vendor.delivery_time || '15-30 min'}</span>
                                                        </div>
                                                    </div>
                                                    <span className={`inline-block mt-3 px-2 py-1 rounded-full text-xs font-bold ${vendor.is_open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                        {vendor.is_open ? 'Open Now' : 'Closed'}
                                                    </span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Map Section */}
                                    <div className="lg:col-span-2 h-96">
                                        <VendorMap vendors={filteredVendors} userLocation={userLocation} />
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                            <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl text-slate-600 font-bold mb-2">No Vendors Found</h3>
                            <p className="text-slate-500">Try searching for a different location.</p>
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
