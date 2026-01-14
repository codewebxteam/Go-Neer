import { MapPin, Star, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function VendorCard({ vendor }) {
    return (
        <Link to={`/vendor/${vendor.id}`} className="block group">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 h-full flex flex-col">
                {/* Placeholder Cover Image - In real app, vendor would upload one */}
                <div className="h-40 bg-gradient-to-r from-blue-400 to-cyan-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                    <div className="absolute bottom-4 left-4 bg-white p-2 rounded-lg shadow-lg">
                        <StoreIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    {vendor.is_open ? (
                        <span className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">Open Now</span>
                    ) : (
                        <span className="absolute top-4 right-4 bg-slate-500 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">Closed</span>
                    )}
                </div>

                <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{vendor.shop_name}</h3>
                        <div className="flex items-center text-slate-500 text-sm mb-3">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span className="truncate">{vendor.address || 'Location not set'}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-2">
                        <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-md">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-bold text-slate-700">{vendor.rating || 'New'}</span>
                        </div>
                        <div className="flex flex-col text-right text-xs">
                            <div className="flex items-center text-slate-400">
                                <Clock className="w-3 h-3 mr-1" />
                                {vendor.delivery_time || '15-30 min'}
                            </div>
                            {vendor.distance && (
                                <div className="text-slate-400 text-xs">
                                    <MapPin className="w-3 h-3 inline mr-1" />
                                    {vendor.distance} km away
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

function StoreIcon({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" /><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" /><path d="M2 7h20" /><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" /></svg>
    )
}
