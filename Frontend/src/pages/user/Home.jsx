import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ArrowRight,
  Droplets,
  ShieldCheck,
  Clock,
  Phone,
  Package,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getAllProducts } from "../../services/productService";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllProducts();
        setProducts(data || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setError(error.message || "Failed to load products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);



  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };


  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-800 to-cyan-700">
        {/* Animated Blobs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -left-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-blue-500 rounded-full mix-blend-screen filter blur-[120px] opacity-30"
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -right-1/4 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-cyan-400 rounded-full mix-blend-screen filter blur-[100px] opacity-20"
        />

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 md:w-2 md:h-2 bg-cyan-300 rounded-full opacity-40"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.2, 0.6, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Sparkles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            >
              <div className="w-1 h-1 bg-white rounded-full" />
            </motion.div>
          ))}
        </div>

        {/* Floating Water Droplets */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut",
              }}
              className="absolute"
            >
              <Droplets className="w-3 h-3 md:w-4 md:h-4 text-cyan-400 opacity-20" />
            </motion.div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 pt-12 pb-20 md:pt-16 md:pb-32">
          <div className="max-w-5xl mx-auto text-center">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6 md:mb-8"
            >
              <Droplets className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-cyan-300 mx-auto drop-shadow-2xl" />
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 md:mb-6 text-white">
                Pure Water.{" "}
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-200">
                  Instant Delivery.
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100/90 max-w-3xl mx-auto mb-8 md:mb-10">
                Connect with verified local vendors and get premium quality water delivered to your doorstep in minutes.
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8 md:mb-12"
            >
              <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
                <div className="bg-white/10 backdrop-blur-xl border-2 border-white/30 rounded-2xl p-2 shadow-2xl">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex items-center flex-1 bg-white/5 rounded-xl px-4 py-3">
                      <Search className="w-5 h-5 md:w-6 md:h-6 text-cyan-300 mr-3 flex-shrink-0" />
                      <input
                        type="text"
                        placeholder="Search by product or location..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="flex-1 bg-transparent outline-none text-white placeholder-blue-200/70 text-sm md:text-base"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-white text-blue-700 px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
                    >
                      Find Water <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6 max-w-4xl mx-auto"
            >
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl md:rounded-2xl p-4 md:p-5 lg:p-6 text-center hover:bg-white/15 transition-all"
                >
                  <stat.icon className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-cyan-300 mx-auto mb-2" />
                  <div className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-blue-200">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Wave */}
        <div className="relative">
          <svg viewBox="0 0 1440 120" className="w-full" preserveAspectRatio="none">
            <path
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L0,120Z"
              fill="rgb(248, 250, 252)"
            />
          </svg>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 md:py-20 container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <span className="text-blue-600 font-bold text-xs md:text-sm bg-blue-100 px-4 py-2 rounded-full border border-blue-200">
            WHY GO-NEER?
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mt-6 mb-4">
            Hydration made <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">simple</span>.
          </h2>
          <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto">
            We don't just deliver water; we deliver peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              icon: Droplets,
              title: "100% Pure & Verified",
              desc: "Every vendor is vetted for quality compliance. We ensure you get only the safest mineral water.",
              gradient: "from-blue-500 to-cyan-500",
            },
            {
              icon: Zap,
              title: "Lightning Fast Delivery",
              desc: "Our local network ensures delivery within 30 minutes. No more waiting for your water.",
              gradient: "from-yellow-500 to-orange-500",
            },
            {
              icon: ShieldCheck,
              title: "Secure Payments",
              desc: "Pay via UPI, Cards, or Cash on Delivery. Your transactions are safe and transparent.",
              gradient: "from-green-500 to-emerald-500",
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              whileHover={{ y: -10 }}
              className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-2xl transition-all"
            >
              <div className={`w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br ${feature.gradient} text-white rounded-2xl flex items-center justify-center mb-5 md:mb-6`}>
                <feature.icon className="w-7 h-7 md:w-8 md:h-8" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-3">{feature.title}</h3>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 md:py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          {loading ? (
            /* SKELETON LOADING STATE */
            <div className="space-y-8 animate-pulse">
              <div className="h-8 bg-slate-200 rounded-lg w-1/3 mb-12" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i} className="h-72 bg-slate-200 rounded-2xl" />
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
                  Available <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Products</span>
                </h2>
                <p className="text-slate-600 text-base md:text-lg">
                  {products.length} premium water products available
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8 text-red-700">
                  <p className="font-semibold">⚠️ Error: {error}</p>
                </div>
              )}

              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {products.map((product) => (
                    <Link key={product.id} to={`/product/${product.id}`}>
                      <motion.div
                        variants={itemVariants}
                        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group h-full flex flex-col"
                      >
                        <div className="relative h-48 overflow-hidden bg-slate-100">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <span className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-bold">
                            ₹{product.price}
                          </span>
                        </div>
                        <div className="p-5 flex-grow flex flex-col">
                          <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-sm text-slate-600 mb-3 line-clamp-2 flex-grow">
                            {product.description}
                          </p>
                          <div className="mt-auto">
                            <div className="flex items-center gap-2 mb-2">
                              <Package className="w-4 h-4 text-blue-600" />
                              <span className="text-sm text-slate-600">{product.quantity || 'Standard'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                ))}
                              </div>
                              <span className="text-sm font-semibold text-slate-800">4.8</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-300">
                  <Package className="w-20 h-20 text-blue-400 mx-auto mb-6" />
                  <h3 className="text-3xl font-black mb-3">No Products Available Yet</h3>
                  <p className="text-slate-600 mb-8">Products will appear here once vendors add them. Check back soon!</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 container mx-auto px-4">
        <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-12 md:p-16 text-white text-center overflow-hidden">
          <div className="relative z-10">
            <Droplets className="w -16 h-16 mx-auto mb-6 text-cyan-200" />
            <h2 className="text-3xl md:text-5xl font-black mb-6">Ready to quench your thirst?</h2>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
              Join thousands of happy customers today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 inline-flex items-center justify-center gap-2">
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="bg-blue-700/50 border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 inline-flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" /> Contact Support
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
