import { useSearchParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { getAllProducts } from '../../services/productService'

export default function ProductResults() {
    const [searchParams] = useSearchParams()
    const query = searchParams.get('q')?.toLowerCase().trim() || ''

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    // Fetch and filter products
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const productsData = await getAllProducts()

                let filtered = productsData || []

                if (query) {
                    filtered = filtered.filter(product => {
                        const name = product.name?.toLowerCase() || ''
                        const description = product.description?.toLowerCase() || ''
                        return name.includes(query) || description.includes(query)
                    })
                } else {
                    // Show all products if no query
                    filtered = productsData || []
                }

                setProducts(filtered)
            } catch (error) {
                console.error('Error fetching data:', error)
                setProducts([])
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [query])

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 }
        }
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 to-blue-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 mb-3">
                        Search Results
                    </h1>
                    {query && (
                        <p className="text-lg text-slate-600">
                            Results for "<span className="font-semibold text-blue-600">{query}</span>"
                        </p>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-300 shadow-sm">
                        <Search className="w-16 h-16 text-slate-400 mx-auto mb-6" />
                        <h3 className="text-2xl text-slate-700 font-bold mb-3">No Products Found</h3>
                        <p className="text-slate-500 mb-6">
                            {query
                                ? `No products matching "${query}" available at the moment.`
                                : 'Enter a search query to find products.'}
                        </p>
                        <Link
                            to="/"
                            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Back to Home
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <motion.div
                                key={product.id}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                className="bg-white rounded-xl overflow-hidden shadow-md border border-slate-100 hover:shadow-xl transition-all duration-300 flex flex-col"
                            >
                                {/* Product Image */}
                                <div className="h-48 overflow-hidden bg-slate-100">
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="p-4 flex-grow flex flex-col justify-between">
                                    {/* Name and Price */}
                                    <div className="mb-3">
                                        <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">
                                            {product.name}
                                        </h3>
                                        <p className="text-sm text-slate-600 line-clamp-1">
                                            {product.description}
                                        </p>
                                    </div>

                                    {/* Price */}
                                    <div className="mb-4">
                                        <p className="text-2xl font-bold text-blue-600">
                                            ₹{product.price}
                                        </p>
                                    </div>

                                    {/* View Details Button */}
                                    <Link
                                        to={`/product/${product.id}`}
                                        state={{ product, vendor: product.vendor }}
                                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
