import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, Star } from 'lucide-react'

export default function Contact() {
    return (
        <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-20">
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full"
                >
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Contact Us</h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Have questions or need support? We're here to help. Get in touch with our team.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
                        >
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Get In Touch</h2>
                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 mb-1">Phone</h3>
                                        <p className="text-slate-600">+1 (555) 123-4567</p>
                                        <p className="text-slate-600">+1 (555) 987-6543</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 mb-1">Email</h3>
                                        <p className="text-slate-600">support@go-neer.com</p>
                                        <p className="text-slate-600">business@go-neer.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 mb-1">Address</h3>
                                        <p className="text-slate-600">123 Water Street<br />Hydration City, HC 12345</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 mb-1">Business Hours</h3>
                                        <p className="text-slate-600">Mon - Fri: 8:00 AM - 8:00 PM</p>
                                        <p className="text-slate-600">Sat - Sun: 9:00 AM - 6:00 PM</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-2xl">📱</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 mb-1">Follow Us</h3>
                                        <div className="flex space-x-4">
                                            <a href="https://facebook.com/go-neer" className="text-blue-600 hover:text-blue-700 transition-colors">
                                                <Facebook className="w-6 h-6" />
                                            </a>
                                            <a href="https://instagram.com/go-neer" className="text-blue-600 hover:text-blue-700 transition-colors">
                                                <Instagram className="w-6 h-6" />
                                            </a>
                                            <a href="https://twitter.com/go-neer" className="text-blue-600 hover:text-blue-700 transition-colors">
                                                <Twitter className="w-6 h-6" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
                        >
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h2>
                            <form className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                                    <input
                                        type="text"
                                        defaultValue="John Doe"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Your full name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        defaultValue="john.doe@example.com"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="your@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                                    <input
                                        type="text"
                                        defaultValue="Inquiry about water delivery service"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="How can we help?"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                                    <textarea
                                        rows="4"
                                        defaultValue="Hello, I am interested in your weekly water delivery service. Could you please provide more information about pricing and delivery schedules? Thank you."
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                        placeholder="Tell us more about your inquiry..."
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                                >
                                    Send Message
                                </button>
                            </form>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-16"
                    >
                        <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">What Our Customers Say</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="flex justify-center mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <p className="text-slate-600 mb-4 italic">
                                    "The water quality is exceptional! I've never tasted such pure water. Delivery is always on time."
                                </p>
                                <p className="font-bold text-slate-800">- Sarah Johnson</p>
                            </div>
                            <div className="text-center">
                                <div className="flex justify-center mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <p className="text-slate-600 mb-4 italic">
                                    "Super fast delivery! Ordered at 9 AM and had water by 10 AM. Go-Neer is a lifesaver."
                                </p>
                                <p className="font-bold text-slate-800">- Mike Chen</p>
                            </div>
                            <div className="text-center">
                                <div className="flex justify-center mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <p className="text-slate-600 mb-4 italic">
                                    "Reliable service with top-notch water quality. The delivery speed is impressive every time."
                                </p>
                                <p className="font-bold text-slate-800">- Priya Patel</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                        className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-16"
                    >
                        <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Our Regional Offices</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="p-4 bg-slate-50 rounded-2xl text-center">
                                <h3 className="font-bold text-slate-800 mb-2">North Zone</h3>
                                <p className="text-sm text-slate-600">45, Mall Road</p>
                                <p className="text-sm text-slate-600">Shimla, HP 171001</p>
                                <p className="text-sm text-blue-600 mt-2 font-medium">+91 98765 43210</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl text-center">
                                <h3 className="font-bold text-slate-800 mb-2">West Zone</h3>
                                <p className="text-sm text-slate-600">12, Linking Road</p>
                                <p className="text-sm text-slate-600">Mumbai, MH 400050</p>
                                <p className="text-sm text-blue-600 mt-2 font-medium">+91 98765 43211</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl text-center">
                                <h3 className="font-bold text-slate-800 mb-2">South Zone</h3>
                                <p className="text-sm text-slate-600">88, Anna Salai</p>
                                <p className="text-sm text-slate-600">Chennai, TN 600002</p>
                                <p className="text-sm text-blue-600 mt-2 font-medium">+91 98765 43212</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl text-center">
                                <h3 className="font-bold text-slate-800 mb-2">East Zone</h3>
                                <p className="text-sm text-slate-600">23, Park Street</p>
                                <p className="text-sm text-slate-600">Kolkata, WB 700016</p>
                                <p className="text-sm text-blue-600 mt-2 font-medium">+91 98765 43213</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.6 }}
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-8 text-white text-center"
                    >
                        <h2 className="text-2xl font-bold mb-4">Need Immediate Help?</h2>
                        <p className="mb-6 opacity-90">
                            For urgent water delivery requests or support, call our hotline directly.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <a
                                href="tel:+15551234567"
                                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors flex items-center justify-center"
                            >
                                <Phone className="w-4 h-4 mr-2" />
                                Call Now: (555) 123-4567
                            </a>
                            <button className="bg-blue-700/50 border border-blue-400 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
                                Live Chat Support
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}
