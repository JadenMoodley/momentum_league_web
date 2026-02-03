import { motion } from 'framer-motion'

export default function LiveIndicator({ size = 'default' }) {
    const sizeClasses = {
        small: 'text-xs px-2 py-0.5',
        default: 'text-sm px-3 py-1',
        large: 'text-base px-4 py-1.5',
    }

    return (
        <motion.div
            className={`inline-flex items-center gap-1.5 bg-red-500 text-white font-bold rounded-full ${sizeClasses[size]}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <motion.span
                className="w-2 h-2 bg-white rounded-full"
                animate={{
                    opacity: [1, 0.3, 1],
                    scale: [1, 0.8, 1]
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
            />
            LIVE
        </motion.div>
    )
}
