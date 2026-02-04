import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Droplets, Truck, Shield, Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Twitter, ArrowUp } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Footer() {
    const [showScrollTop, setShowScrollTop] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    }

    const iconVariants = {
        hover: {
            scale: 1.2,
            rotate: 5,
            transition: { duration: 0.3 },
        },
    }

    return (
        <>
            <footer className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-400 overflow-hidden">
                {/* Background gradient effects */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(6,182,212,0.05),transparent_50%)]" />

                <div className="relative border-t border-slate-800/50">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="container mx-auto px-4 py-16 md:py-20 lg:py-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16"
                    >
                        {/* Brand Section */}
                        <motion.div variants={itemVariants} className="sm:col-span-2 lg:col-span-1">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center gap-3 mb-6 group"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                                    <Droplets className="relative w-10 h-10 text-blue-400" />
                                </div>
                                <h3 className="text-white text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Go-Neer</h3>
                            </motion.div>
                            <p className="text-base md:text-lg leading-relaxed text-slate-400 mb-6">
                                Premium water delivery service bringing pure, instant hydration directly to your doorstep. Quality you can trust, service you can rely on.
                            </p>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <MapPin className="w-4 h-4 text-blue-400" />
                                <span>Serving communities nationwide</span>
                            </div>
                        </motion.div>

                        {/* Company Links */}
                        <motion.div variants={itemVariants}>
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-1">
                                    <Truck className="w-5 h-5 text-blue-400" />
                                    <h4 className="text-white font-bold text-lg">Company</h4>
                                </div>
                                <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
                            </div>
                            <ul className="space-y-3 text-base">
                                <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                                    <Link to="/about" className="flex items-center gap-2 hover:text-blue-400 transition-colors group">
                                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                        About Us
                                    </Link>
                                </motion.li>
                                <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                                    <a href="#" className="flex items-center gap-2 hover:text-blue-400 transition-colors group">
                                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                        Careers
                                    </a>
                                </motion.li>
                                <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                                    <Link to="/contact" className="flex items-center gap-2 hover:text-blue-400 transition-colors group">
                                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                        Contact
                                    </Link>
                                </motion.li>
                                <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                                    <a href="#" className="flex items-center gap-2 hover:text-blue-400 transition-colors group">
                                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                        Blog
                                    </a>
                                </motion.li>
                            </ul>
                        </motion.div>

                        {/* Legal Links */}
                        <motion.div variants={itemVariants}>
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-1">
                                    <Shield className="w-5 h-5 text-blue-400" />
                                    <h4 className="text-white font-bold text-lg">Legal</h4>
                                </div>
                                <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
                            </div>
                            <ul className="space-y-3 text-base">
                                <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                                    <a href="#" className="flex items-center gap-2 hover:text-blue-400 transition-colors group">
                                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                        Terms of Service
                                    </a>
                                </motion.li>
                                <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                                    <a href="#" className="flex items-center gap-2 hover:text-blue-400 transition-colors group">
                                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                        Privacy Policy
                                    </a>
                                </motion.li>
                                <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                                    <a href="#" className="flex items-center gap-2 hover:text-blue-400 transition-colors group">
                                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                        Cookie Policy
                                    </a>
                                </motion.li>
                                <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                                    <a href="#" className="flex items-center gap-2 hover:text-blue-400 transition-colors group">
                                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                        Refund Policy
                                    </a>
                                </motion.li>
                            </ul>
                        </motion.div>

                        {/* Social & Contact */}
                        <motion.div variants={itemVariants}>
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-1">
                                    <Phone className="w-5 h-5 text-blue-400" />
                                    <h4 className="text-white font-bold text-lg">Connect</h4>
                                </div>
                                <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
                            </div>

                            <div className="flex gap-3 mb-6 flex-wrap">
                                <motion.a
                                    href="#"
                                    variants={iconVariants}
                                    whileHover="hover"
                                    className="p-2.5 bg-slate-800/50 hover:bg-gradient-to-br hover:from-blue-600 hover:to-blue-500 rounded-xl transition-all duration-300 group border border-slate-700/50 hover:border-blue-500/50"
                                >
                                    <Facebook className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                                </motion.a>
                                <motion.a
                                    href="#"
                                    variants={iconVariants}
                                    whileHover="hover"
                                    className="p-2.5 bg-slate-800/50 hover:bg-gradient-to-br hover:from-pink-600 hover:to-orange-500 rounded-xl transition-all duration-300 group border border-slate-700/50 hover:border-pink-500/50"
                                >
                                    <Instagram className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                                </motion.a>
                                <motion.a
                                    href="#"
                                    variants={iconVariants}
                                    whileHover="hover"
                                    className="p-2.5 bg-slate-800/50 hover:bg-gradient-to-br hover:from-sky-600 hover:to-sky-500 rounded-xl transition-all duration-300 group border border-slate-700/50 hover:border-sky-500/50"
                                >
                                    <Twitter className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                                </motion.a>
                                <motion.a
                                    href="#"
                                    variants={iconVariants}
                                    whileHover="hover"
                                    className="p-2.5 bg-slate-800/50 hover:bg-gradient-to-br hover:from-blue-700 hover:to-blue-600 rounded-xl transition-all duration-300 group border border-slate-700/50 hover:border-blue-500/50"
                                >
                                    <Linkedin className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                                </motion.a>
                            </div>

                            <div className="space-y-3 text-sm">
                                <motion.a
                                    href="mailto:info@goneer.com"
                                    whileHover={{ x: 3 }}
                                    className="flex items-center gap-3 p-3 bg-slate-800/30 hover:bg-slate-800/50 rounded-lg transition-all group border border-slate-700/30"
                                >
                                    <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                    <span className="group-hover:text-blue-400 transition-colors">info@goneer.com</span>
                                </motion.a>
                                <motion.a
                                    href="tel:+911234567890"
                                    whileHover={{ x: 3 }}
                                    className="flex items-center gap-3 p-3 bg-slate-800/30 hover:bg-slate-800/50 rounded-lg transition-all group border border-slate-700/30"
                                >
                                    <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                    <span className="group-hover:text-blue-400 transition-colors">+91 123-456-7890</span>
                                </motion.a>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Divider */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="container mx-auto px-4"
                    >
                        <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
                    </motion.div>

                    {/* Copyright */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        viewport={{ once: true }}
                        className="container mx-auto px-4 py-8 text-center"
                    >
                        <p className="text-sm md:text-base text-slate-500">
                            © {new Date().getFullYear()} Go-Neer. All rights reserved. | Made with <span className="text-red-400 animate-pulse">💙</span> for clean water.
                        </p>
                    </motion.div>
                </div>
            </footer>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-50 p-3 md:p-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all"
                    aria-label="Scroll to top"
                >
                    <ArrowUp className="w-5 h-5 md:w-6 md:h-6" />
                </motion.button>
            )}
        </>
    )
}
