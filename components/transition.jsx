
import { motion, AnimatePresence } from 'framer-motion';

export default function Transition({ children }){
    return (
        <AnimatePresence>
            <motion.div
                initial = {{ opacity: 0, y: 20 }}
                animate = {{ opacity: 1, y: 0 }}
                exit = {{ opacity: 0, y: 20 }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    )
}