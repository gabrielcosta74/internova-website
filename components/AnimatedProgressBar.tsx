import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useDevice } from '../lib/DeviceContext';

export const AnimatedProgressBar: React.FC = () => {
    const { scrollYProgress } = useScroll();
    const { isMobile } = useDevice();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    if (isMobile) return null;

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 origin-left z-50 pointer-events-none"
            style={{ scaleX }}
        />
    );
};
