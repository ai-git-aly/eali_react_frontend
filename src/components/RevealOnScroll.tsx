import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface Props {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
    onClick?: () => void;
}

export const RevealOnScroll: React.FC<Props> = ({
    children,
    className = "",
    delay = 0,
    direction = 'up',
    onClick
}) => {
    const shouldReduceMotion = useReducedMotion();
    const getInitial = () => {
        switch (direction) {
            case 'up': return { opacity: 0, y: 50 };
            case 'down': return { opacity: 0, y: -50 };
            case 'left': return { opacity: 0, x: 50 };
            case 'right': return { opacity: 0, x: -50 };
            default: return { opacity: 0, y: 50 };
        }
    };

    const getAnimate = () => {
        switch (direction) {
            case 'up': return { opacity: 1, y: 0 };
            case 'down': return { opacity: 1, y: 0 };
            case 'left': return { opacity: 1, x: 0 };
            case 'right': return { opacity: 1, x: 0 };
            default: return { opacity: 1, y: 0 };
        }
    };

    return (
        <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : getInitial()}
            whileInView={shouldReduceMotion ? { opacity: 1 } : getAnimate()}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, delay: delay, ease: "easeOut" }}
            className={className}
            onClick={onClick}
        >
            {children}
        </motion.div>
    );
};

export default RevealOnScroll;

