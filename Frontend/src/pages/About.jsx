import { motion } from 'framer-motion'
import { Droplets, Zap, Users, Target, Award, TrendingUp } from 'lucide-react'

export default function About() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut' },
        },
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative w-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white py-20 lg:py-32 px-4"
            >
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="max-w-full text-center relative z-10"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        className="inline-block mb-6"
                    >
                        <Droplets className="w-16 h-16 md:w-20 md:h-20" />
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">About Go-Neer</h1>
                    <p className="text-lg md:text-2xl text-blue-50 max-w-3xl mx-auto leading-relaxed">
                        Revolutionizing water delivery with speed, purity, and trust. Your hydration partner for a healthier tomorrow.
                    </p>
                </motion.div>
            </motion.div>

            {/* Main Content */}
            <div className="w-full px-2 sm:px-4 lg:px-8 py-12 lg:py-24">
                {/* Mission & Vision */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="max-w-7xl mx-auto mb-16 lg:mb-24"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
                        <motion.div
                            variants={itemVariants}
                            className="bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-blue-100 hover:shadow-2xl transition-shadow duration-300"
                        >
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="inline-block mb-4"
                            >
                                <Target className="w-12 h-12 text-blue-600" />
                            </motion.div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Mission</h2>
                            <p className="text-slate-700 leading-relaxed text-lg">
                                To provide every household with access to pure, safe drinking water through our network of verified vendors and lightning-fast delivery system. We believe clean water is a fundamental right and should never be a luxury.
                            </p>
                            <ul className="mt-6 space-y-3">
                                <li className="flex items-center gap-3 text-slate-600">
                                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                    Pure & tested water from verified sources
                                </li>
                                <li className="flex items-center gap-3 text-slate-600">
                                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                    Fastest delivery system in the region
                                </li>
                                <li className="flex items-center gap-3 text-slate-600">
                                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                    Affordable pricing for all communities
                                </li>
                            </ul>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-cyan-100 hover:shadow-2xl transition-shadow duration-300"
                        >
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="inline-block mb-4"
                            >
                                <TrendingUp className="w-12 h-12 text-cyan-600" />
                            </motion.div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Vision</h2>
                            <p className="text-slate-700 leading-relaxed text-lg">
                                To become the leading water delivery platform in the country, connecting millions of families with trusted local vendors while promoting sustainable and eco-friendly water practices.
                            </p>
                            <ul className="mt-6 space-y-3">
                                <li className="flex items-center gap-3 text-slate-600">
                                    <span className="w-2 h-2 bg-cyan-600 rounded-full"></span>
                                    Nationwide coverage by 2025
                                </li>
                                <li className="flex items-center gap-3 text-slate-600">
                                    <span className="w-2 h-2 bg-cyan-600 rounded-full"></span>
                                    Environmental sustainability initiatives
                                </li>
                                <li className="flex items-center gap-3 text-slate-600">
                                    <span className="w-2 h-2 bg-cyan-600 rounded-full"></span>
                                    Empowering 10,000+ local vendors
                                </li>
                            </ul>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Why Choose Us Section */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="max-w-7xl mx-auto mb-16 lg:mb-24"
                >
                    <div className="text-center mb-12 lg:mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Why Choose Go-Neer?</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">We're committed to excellence in every aspect of our service</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
                        {[
                            {
                                icon: Zap,
                                title: 'Lightning Fast Delivery',
                                description: 'Get your water delivered in just 15 minutes. Our optimized network ensures you never wait long.',
                                color: 'from-yellow-400 to-orange-400',
                            },
                            {
                                icon: Award,
                                title: 'Verified & Trusted Vendors',
                                description: 'Every vendor undergoes rigorous quality checks, certifications, and regular audits to maintain standards.',
                                color: 'from-blue-400 to-cyan-400',
                            },
                            {
                                icon: Droplets,
                                title: '100% Pure Water',
                                description: 'Advanced filtration & testing ensures every drop meets international quality standards and safety regulations.',
                                color: 'from-cyan-400 to-blue-400',
                            },
                        ].map((item, idx) => {
                            const Icon = item.icon
                            return (
                                <motion.div
                                    key={idx}
                                    variants={itemVariants}
                                    whileHover={{ y: -10, transition: { duration: 0.2 } }}
                                    className="relative group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                                    <div className="relative bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-slate-200 hover:border-blue-300 transition-colors h-full">
                                        <div className={`inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br ${item.color} text-white mb-6`}>
                                            <Icon className="w-8 h-8 md:w-10 md:h-10" />
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                        <p className="text-slate-600 leading-relaxed">{item.description}</p>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </motion.div>

                {/* Statistics Section */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="max-w-7xl mx-auto mb-16 lg:mb-24"
                >
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-3xl p-8 md:p-16">
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
                                    variants={itemVariants}
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
                </motion.div>

                {/* Our Story */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="max-w-7xl mx-auto mb-16 lg:mb-24"
                >
                    <div className="bg-white rounded-3xl p-8 md:p-16 shadow-lg border border-slate-200">
                        <motion.h2
                            variants={itemVariants}
                            className="text-3xl md:text-4xl font-bold text-slate-900 mb-8"
                        >
                            Our Story
                        </motion.h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                            <motion.div variants={itemVariants} className="space-y-6">
                                <p className="text-lg text-slate-700 leading-relaxed">
                                    Go-Neer was founded with a simple yet powerful vision: to make pure drinking water accessible to everyone, everywhere. What started as a small venture in a single city has grown into a nationwide network connecting passionate vendors with thousands of satisfied customers.
                                </p>
                                <p className="text-lg text-slate-700 leading-relaxed">
                                    We recognized a critical gap in the market. Families were struggling to get reliable access to clean water, while local vendors lacked a platform to reach customers efficiently. We built Go-Neer to bridge this gap.
                                </p>
                            </motion.div>
                            <motion.div variants={itemVariants} className="space-y-6">
                                <p className="text-lg text-slate-700 leading-relaxed">
                                    Today, we're proud to have facilitated millions of water deliveries, maintained the highest quality standards, and built a community of vendors and customers who trust us. But we're just getting started. Our commitment to innovation, sustainability, and excellence drives us forward.
                                </p>
                                <p className="text-lg text-slate-700 leading-relaxed">
                                    Every bottle we deliver represents our promise: pure water, fast service, and unwavering commitment to your health and satisfaction.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Core Values */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="max-w-7xl mx-auto mb-16 lg:mb-24"
                >
                    <div className="text-center mb-12 lg:mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Core Values</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">These principles guide everything we do</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Purity',
                                description: 'We are unwavering in our commitment to delivering only the purest, safest water tested by international standards.',
                            },
                            {
                                title: 'Speed',
                                description: 'Your time matters. We optimize every step to ensure fastest delivery without compromising on quality.',
                            },
                            {
                                title: 'Trust',
                                description: 'Transparency and honesty form the foundation of our relationships with customers and vendors alike.',
                            },
                            {
                                title: 'Community',
                                description: 'We empower local vendors and build strong communities, creating economic opportunities at the grassroots level.',
                            },
                            {
                                title: 'Sustainability',
                                description: 'We operate with environmental responsibility, reducing waste and promoting eco-friendly practices.',
                            },
                            {
                                title: 'Excellence',
                                description: 'We continuously improve, innovate, and set higher standards in everything we do for our customers.',
                            },
                        ].map((value, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                whileHover={{ scale: 1.05 }}
                                className="bg-gradient-to-br from-slate-50 to-blue-50 p-8 rounded-xl border border-blue-200 hover:border-blue-400 transition-colors"
                            >
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* CTA Section */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="w-full bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-16 lg:py-24 px-4"
            >
                <div className="max-w-4xl mx-auto text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold mb-6"
                    >
                        Join the Water Revolution
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10"
                    >
                        Be part of the clean water revolution. Whether you're a customer looking for pure water or a vendor wanting to join our growing network, Go-Neer welcomes you.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        viewport={{ once: true }}
                        className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-8 md:px-10 py-4 rounded-xl font-bold transition-colors shadow-lg"
                        >
                            Become a Vendor
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white/20 hover:bg-white/30 border-2 border-white text-white px-8 md:px-10 py-4 rounded-xl font-bold transition-colors backdrop-blur-sm"
                        >
                            Get Pure Water Now
                        </motion.button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}
