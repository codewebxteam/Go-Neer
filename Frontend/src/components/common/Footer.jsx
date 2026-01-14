import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Droplets, Truck, Shield, Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react'

export default function Footer() {
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
        <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-400">
            <div className="border-t border-slate-700">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="container mx-auto px-4 py-24 lg:py-32 grid grid-cols-1 md:grid-cols-4 gap-16 lg:gap-20"
                >
                    {/* Brand Section */}
                    <motion.div variants={itemVariants}>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-3 mb-6"
                        >
                            <Droplets className="w-10 h-10 text-blue-400" />
                            <h3 className="text-white text-3xl font-bold">Go-Neer</h3>
                        </motion.div>
                        <p className="text-lg leading-relaxed">Premium water delivery service bringing pure, instant hydration directly to your doorstep.</p>
                    </motion.div>

                    {/* Company Links */}
                    <motion.div variants={itemVariants}>
                        <h4 className="text-white font-semibold mb-8 flex items-center gap-2 text-xl">
                            <Truck className="w-6 h-6 text-blue-400" />
                            Company
                        </h4>
                        <ul className="space-y-4 text-lg">
                            <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                                <Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link>
                            </motion.li>
                            <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                                <a href="#" className="hover:text-blue-400 transition-colors">Careers</a>
                            </motion.li>
                            <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                                <Link to="/contact" className="hover:text-blue-400 transition-colors">Contact</Link>
                            </motion.li>
                        </ul>
                    </motion.div>

                    {/* Legal Links */}
                    <motion.div variants={itemVariants}>
                        <h4 className="text-white font-semibold mb-8 flex items-center gap-2 text-xl">
                            <Shield className="w-6 h-6 text-blue-400" />
                            Legal
                        </h4>
                        <ul className="space-y-4 text-lg">
                            <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                                <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
                            </motion.li>
                            <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                                <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
                            </motion.li>
                        </ul>
                    </motion.div>

                    {/* Social & Contact */}
                    <motion.div variants={itemVariants}>
                        <h4 className="text-white font-semibold mb-8 flex items-center gap-2 text-xl">
                            <Phone className="w-6 h-6 text-blue-400" />
                            Connect
                        </h4>
                        <div className="flex space-x-5 mb-8">
                            <motion.a
                                href="#"
                                variants={iconVariants}
                                whileHover="hover"
                                className="text-slate-400 hover:text-blue-400 transition-colors"
                            >
                                <Facebook className="w-6 h-6" />
                            </motion.a>
                            <motion.a
                                href="#"
                                variants={iconVariants}
                                whileHover="hover"
                                className="text-slate-400 hover:text-pink-400 transition-colors"
                            >
                                <Instagram className="w-6 h-6" />
                            </motion.a>
                            <motion.a
                                href="#"
                                variants={iconVariants}
                                whileHover="hover"
                                className="text-slate-400 hover:text-blue-400 transition-colors"
                            >
                                <Linkedin className="w-6 h-6" />
                            </motion.a>
                        </div>
                        <div className="space-y-3 text-base">
                            <div className="flex items-center gap-2">
                                <Mail className="w-5 h-5 text-blue-400" />
                                <a href="mailto:info@goneer.com" className="hover:text-blue-400 transition-colors">info@goneer.com</a>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="w-5 h-5 text-blue-400" />
                                <a href="tel:+911234567890" className="hover:text-blue-400 transition-colors">+91 123-456-7890</a>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Divider */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"
                />

                {/* Copyright */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="container mx-auto px-4 py-12 text-center text-base text-slate-500"
                >
                    <p>© {new Date().getFullYear()} Go-Neer. All rights reserved. | Made with <span className="text-blue-400">💙</span> for clean water.</p>
                </motion.div>
            </div>
        </footer>
    )
}
