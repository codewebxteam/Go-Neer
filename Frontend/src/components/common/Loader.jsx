import { motion } from "framer-motion"

export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-cyan-950 via-blue-900 to-slate-900 z-50">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative"
      >
        {/* Water Glow */}
        <div className="absolute inset-0 rounded-full blur-3xl bg-cyan-400/40 animate-pulse" />

        {/* Ripple Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
          className="w-24 h-24 rounded-full border-[3px] border-cyan-300/70 border-t-transparent border-l-transparent"
        />

        {/* Inner Ripple */}
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="absolute inset-3 rounded-full border border-blue-300/40"
        />

        {/* Water Drop Core */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-cyan-200 to-blue-500 shadow-lg shadow-cyan-400/60" />
        </div>
      </motion.div>
    </div>
  )
}
