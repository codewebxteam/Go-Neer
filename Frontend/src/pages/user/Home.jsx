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
  TrendingUp,
  Award,
  Zap,
  User,
  Send,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getAllProducts } from "../../services/productService";
import { getReviews, addReview } from "../../services/reviewService";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({
    userName: "",
    rating: 5,
    comment: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Stats data for bottom section
  const stats = [
    { icon: Package, value: "10K+", label: "Orders Delivered" },
    { icon: Award, value: "500+", label: "Verified Vendors" },
    { icon: Star, value: "4.9", label: "Average Rating" },
    { icon: TrendingUp, value: "98%", label: "Happy Customers" },
  ];

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

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const data = await getReviews();
        setReviews(data || []);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!reviewForm.userName.trim() || !reviewForm.comment.trim()) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setSubmitting(true);
      const newReview = await addReview(reviewForm);
      setReviews([newReview, ...reviews]);
      setReviewForm({ userName: "", rating: 5, comment: "" });
      alert("Thank you for your review!");
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRatingChange = (rating) => {
    setReviewForm({ ...reviewForm, rating });
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

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
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
        <div className="relative z-10 container mx-auto px-4 py-12 md:py-16 lg:py-20">
          <div className="max-w-5xl mx-auto text-center">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-4 md:mb-6"
            >
              <Droplets className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-cyan-300 mx-auto drop-shadow-2xl" />
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3 md:mb-4 text-white">
                Pure Water.{" "}
                <span className="block mt-1 md:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-200">
                  Instant Delivery.
                </span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100/90 max-w-3xl mx-auto mb-6 md:mb-8 px-4">
                Connect with verified local vendors and get premium quality water delivered to your doorstep in minutes.
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6 md:mb-8"
            >
              <form onSubmit={handleSearch} className="max-w-3xl mx-auto px-4">
                <div className="bg-white/10 backdrop-blur-xl border-2 border-white/30 rounded-xl md:rounded-2xl p-2 shadow-2xl">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex items-center flex-1 bg-white/5 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3">
                      <Search className="w-4 h-4 md:w-5 md:h-5 text-cyan-300 mr-2 md:mr-3 flex-shrink-0" />
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
                      className="bg-white text-blue-700 px-5 md:px-8 py-2 md:py-3 rounded-lg md:rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center justify-center gap-2 text-sm md:text-base min-h-[44px]"
                    >
                      Find Water <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>
                </div>
              </form>
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
      <section className="py-10 md:py-16 lg:py-20 container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <span className="text-blue-600 font-bold text-xs md:text-sm bg-blue-100 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-blue-200">
            WHY GO-NEER?
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 mt-4 md:mt-6 mb-3 md:mb-4 px-4">
            Hydration made <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">simple</span>.
          </h2>
          <p className="text-slate-600 text-sm md:text-base lg:text-lg max-w-2xl mx-auto px-4">
            We don't just deliver water; we deliver peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
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
              className="bg-white p-5 md:p-6 lg:p-8 rounded-xl md:rounded-2xl shadow-lg border border-slate-100 hover:shadow-2xl transition-all"
            >
              <div className={`w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-br ${feature.gradient} text-white rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-5`}>
                <feature.icon className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
              </div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-800 mb-2 md:mb-3">{feature.title}</h3>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section className="py-10 md:py-16 lg:py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          {loading ? (
            /* SKELETON LOADING STATE */
            <div className="space-y-8 animate-pulse">
              <div className="h-8 bg-slate-200 rounded-lg w-1/3 mb-12" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-72 bg-slate-200 rounded-2xl" />
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 mb-2 px-4">
                  Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Products</span>
                </h2>
                <p className="text-slate-600 text-sm md:text-base lg:text-lg px-4">
                  Showing 4 featured products
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl md:rounded-2xl p-4 md:p-6 mb-6 md:mb-8 text-red-700">
                  <p className="font-semibold text-sm md:text-base">⚠️ Error: {error}</p>
                </div>
              )}

              {products.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                    {products.slice(0, 4).map((product) => (
                      <Link key={product.id} to={`/product/${product.id}`}>
                        <motion.div
                          variants={itemVariants}
                          className="bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group h-full flex flex-col"
                        >
                          <div className="relative h-40 md:h-48 overflow-hidden bg-slate-100">
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <span className="absolute top-2 md:top-3 right-2 md:right-3 bg-blue-600 text-white px-2.5 md:px-3 py-1 md:py-1.5 rounded-full text-xs font-bold">
                              ₹{product.price}
                            </span>
                          </div>
                          <div className="p-4 md:p-5 flex-grow flex flex-col">
                            <h3 className="font-bold text-base md:text-lg text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                              {product.name}
                            </h3>
                            <p className="text-xs md:text-sm text-slate-600 mb-3 line-clamp-2 flex-grow">
                              {product.description}
                            </p>
                            <div className="mt-auto">
                              <div className="flex items-center gap-2 mb-2">
                                <Package className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600" />
                                <span className="text-xs md:text-sm text-slate-600">{product.quantity || 'Standard'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-400 fill-current" />
                                  ))}
                                </div>
                                <span className="text-xs md:text-sm font-semibold text-slate-800">4.8</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </div>

                  {products.length > 4 && (
                    <div className="text-center">
                      <Link
                        to="/search"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl text-sm md:text-base min-h-[44px]"
                      >
                        View All Products <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 md:py-20 bg-white rounded-2xl md:rounded-3xl border-2 border-dashed border-slate-300">
                  <Package className="w-16 h-16 md:w-20 md:h-20 text-blue-400 mx-auto mb-4 md:mb-6" />
                  <h3 className="text-2xl md:text-3xl font-black mb-2 md:mb-3 px-4">No Products Available Yet</h3>
                  <p className="text-slate-600 mb-6 md:mb-8 text-sm md:text-base px-4">Products will appear here once vendors add them. Check back soon!</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-10 md:py-16 lg:py-20 container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <span className="text-blue-600 font-bold text-xs md:text-sm bg-blue-100 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-blue-200">
            CUSTOMER REVIEWS
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 mt-4 md:mt-6 mb-3 md:mb-4 px-4">
            What our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">customers say</span>
          </h2>
          <p className="text-slate-600 text-sm md:text-base lg:text-lg max-w-2xl mx-auto px-4">
            Share your experience with Go-Neer
          </p>
        </div>

        {/* Review Form */}
        <div className="max-w-2xl mx-auto mb-10 md:mb-16">
          <form onSubmit={handleReviewSubmit} className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-slate-200 p-5 md:p-6 lg:p-8">
            <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-4 md:mb-6">Write a Review</h3>

            <div className="mb-4 md:mb-5">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Your Name</label>
              <div className="flex items-center bg-slate-50 rounded-lg px-3 md:px-4 py-2.5 md:py-3 border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                <User className="w-4 h-4 md:w-5 md:h-5 text-slate-400 mr-2 md:mr-3" />
                <input
                  type="text"
                  value={reviewForm.userName}
                  onChange={(e) => setReviewForm({ ...reviewForm, userName: e.target.value })}
                  placeholder="Enter your name"
                  className="flex-1 bg-transparent outline-none text-slate-900 text-sm md:text-base"
                  required
                />
              </div>
            </div>

            <div className="mb-4 md:mb-5">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Rating</label>
              <div className="flex gap-1.5 md:gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleRatingChange(rating)}
                    className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <Star
                      className={`w-7 h-7 md:w-8 md:h-8 transition-colors ${rating <= reviewForm.rating
                          ? "text-yellow-400 fill-current"
                          : "text-slate-300"
                        }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5 md:mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Your Review</label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                placeholder="Share your experience with Go-Neer..."
                rows="4"
                className="w-full bg-slate-50 rounded-lg px-3 md:px-4 py-2.5 md:py-3 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 text-sm md:text-base resize-none"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white px-5 md:px-6 py-3 md:py-4 rounded-lg md:rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base min-h-[44px]"
            >
              {submitting ? "Submitting..." : (
                <>
                  <Send className="w-4 h-4 md:w-5 md:h-5" />
                  Submit Review
                </>
              )}
            </button>
          </form>
        </div>

        {/* Reviews Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {reviewsLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl md:rounded-2xl p-5 md:p-6 shadow-lg border border-slate-100 animate-pulse">
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                <div className="h-20 bg-slate-200 rounded"></div>
              </div>
            ))
          ) : reviews.length > 0 ? (
            reviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl md:rounded-2xl p-5 md:p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all"
              >
                <div className="flex items-center gap-3 mb-3 md:mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base">
                    {review.userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-sm md:text-base truncate">{review.userName}</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 md:w-4 md:h-4 ${i < review.rating
                                ? "text-yellow-400 fill-current"
                                : "text-slate-300"
                              }`}
                          />
                        ))}
                      </div>
                      {review.createdAt && (
                        <span className="text-xs text-slate-500">{formatDate(review.createdAt)}</span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">{review.comment}</p>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-2xl border-2 border-dashed border-slate-300">
              <Star className="w-12 h-12 md:w-16 md:h-16 text-slate-300 mx-auto mb-3 md:mb-4" />
              <p className="text-slate-600 text-sm md:text-base px-4">No reviews yet. Be the first to share your experience!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 md:py-16 lg:py-20 container mx-auto px-4">
        <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl md:rounded-3xl p-8 md:p-12 lg:p-16 text-white text-center overflow-hidden">
          <div className="relative z-10">
            <Droplets className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 text-cyan-200" />
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black mb-4 md:mb-6 px-4">Ready to quench your thirst?</h2>
            <p className="text-blue-100 text-sm md:text-base lg:text-lg mb-6 md:mb-10 max-w-2xl mx-auto px-4">
              Join thousands of happy customers today!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
              <Link to="/signup" className="bg-white text-blue-600 px-6 md:px-8 py-3 md:py-4 rounded-lg md:rounded-xl font-bold hover:bg-blue-50 inline-flex items-center justify-center gap-2 text-sm md:text-base min-h-[44px]">
                Get Started <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </Link>
              <button className="bg-blue-700/50 border-2 border-white/30 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg md:rounded-xl font-bold hover:bg-blue-700 inline-flex items-center justify-center gap-2 text-sm md:text-base min-h-[44px]">
                <Phone className="w-4 h-4 md:w-5 md:h-5" /> Contact Support
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Moved to Bottom */}
      <section className="py-10 md:py-16 lg:py-20 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-3 md:mb-4 px-4">
              Trusted by Thousands
            </h2>
            <p className="text-blue-100 text-sm md:text-base lg:text-lg px-4">
              Join our growing community of satisfied customers
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6 max-w-5xl mx-auto"
          >
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl md:rounded-2xl p-5 md:p-6 lg:p-8 text-center hover:bg-white/15 transition-all"
              >
                <stat.icon className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-cyan-300 mx-auto mb-3 md:mb-4" />
                <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1 md:mb-2">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm lg:text-base text-blue-200">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
