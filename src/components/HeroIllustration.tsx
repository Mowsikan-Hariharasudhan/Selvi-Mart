import React from 'react';
import { motion } from 'framer-motion';

const HeroIllustration: React.FC = () => {
    // Curated positions with responsive adjustments - Widely open on desktop, balanced spread on mobile
    const products = [
        {
            src: '/images/hero-products/oil.png',
            alt: 'Premium Oil',
            delay: 0.2,
            initial: { x: -45, y: -65, scale: 0.85, rotate: -5 },
            lg: { x: -180, y: -130, scale: 1.1, rotate: -5 },
            floating: { y: [0, -15, 0], rotate: [-5, -8, -5] },
            size: 'w-24 sm:w-56',
            zIndex: 10
        },
        {
            src: '/images/hero-products/tea.png',
            alt: 'Elite Tea',
            delay: 0.4,
            initial: { x: 55, y: -45, scale: 0.8, rotate: 10 },
            lg: { x: 200, y: -90, scale: 1.05, rotate: 10 },
            floating: { y: [0, -20, 0], rotate: [10, 15, 10] },
            size: 'w-20 sm:w-48',
            zIndex: 15
        },
        {
            src: '/images/hero-products/soap.png',
            alt: 'Luxury Soap',
            delay: 0.6,
            initial: { x: -65, y: 75, scale: 0.75, rotate: -10 },
            lg: { x: -220, y: 150, scale: 1, rotate: -10 },
            floating: { y: [0, -10, 0], rotate: [-10, -5, -10] },
            size: 'w-18 sm:w-40',
            zIndex: 20
        },
        {
            src: '/images/hero-products/turmeric.png',
            alt: 'Turmeric Powder',
            delay: 0.8,
            initial: { x: 75, y: 65, scale: 0.7, rotate: 5 },
            lg: { x: 240, y: 160, scale: 0.95, rotate: 5 },
            floating: { y: [0, -18, 0], rotate: [5, 8, 5] },
            size: 'w-18 sm:w-36',
            zIndex: 25
        },
        {
            src: '/images/hero-products/chilli.png',
            alt: 'Chilli Powder',
            delay: 1.0,
            initial: { x: 0, y: 25, scale: 0.95, rotate: 0 },
            lg: { x: 0, y: 40, scale: 1.2, rotate: 0 },
            floating: { y: [0, -12, 0], rotate: [0, 2, 0] },
            size: 'w-28 sm:w-72',
            zIndex: 30
        },
    ];

    return (
        <div className="relative w-full aspect-[4/3] sm:aspect-square lg:aspect-[1.2/1] max-w-[650px] lg:max-w-[850px] mx-auto flex items-center justify-center p-4 sm:p-6 select-none overflow-visible">
            {/* Background Luxury Elements */}
            <div className="absolute inset-0 z-0">
                <motion.div
                    animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-tr from-primary/20 via-primary/5 to-transparent rounded-full blur-[40px] sm:blur-[80px]"
                />
            </div>

            {/* Premium Container/Bag Outline */}
            <svg viewBox="0 0 600 600" className="absolute inset-0 w-full h-full z-10 pointer-events-none overflow-visible opacity-50 sm:opacity-100">
                <defs>
                    <linearGradient id="luxuryStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                        <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
                    </linearGradient>
                </defs>
                <motion.path
                    d="M140 240 Q300 160 460 240 L430 540 Q300 560 170 540 Z"
                    fill="none"
                    stroke="url(#luxuryStroke)"
                    strokeWidth="1.5"
                    strokeDasharray="10 5"
                    animate={{ strokeDashoffset: [0, 100] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                />
            </svg>

            {/* Products Layer */}
            <div className="relative z-20 w-full h-full flex items-center justify-center">
                {products.map((product, index) => (
                    <motion.div
                        key={index}
                        variants={{
                            mobile: {
                                opacity: 1,
                                x: product.initial.x,
                                y: product.initial.y,
                                scale: product.initial.scale,
                                rotate: product.initial.rotate,
                            },
                            desktop: {
                                opacity: 1,
                                x: product.lg?.x || product.initial.x,
                                y: product.lg?.y || product.initial.y,
                                scale: product.lg?.scale || product.initial.scale,
                                rotate: product.initial.rotate,
                            }
                        }}
                        initial={{
                            opacity: 0,
                            scale: 0.5,
                        }}
                        animate={typeof window !== 'undefined' && window.innerWidth < 640 ? "mobile" : "desktop"}
                        transition={{
                            delay: product.delay,
                            type: "spring",
                            stiffness: 60,
                            damping: 15
                        }}
                        className={`absolute ${product.size}`}
                        style={{ zIndex: product.zIndex }}
                    >
                        {/* Floating Animation Wrapper */}
                        <motion.div
                            animate={{
                                y: product.floating.y,
                                rotate: product.floating.rotate
                            }}
                            transition={{
                                duration: 5 + index,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: index * 0.2
                            }}
                            className="relative group cursor-pointer"
                        >
                            {/* Product Image */}
                            <img
                                src={product.src}
                                alt={product.alt}
                                className="w-full h-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.2)] sm:drop-shadow-[0_25px_45px_rgba(0,0,0,0.3)] group-hover:drop-shadow-[0_35px_60px_rgba(0,0,0,0.45)] group-hover:scale-105 transition-all duration-500"
                                draggable="false"
                            />

                            {/* Individual Glow behind each product */}
                            <div className="absolute inset-0 bg-primary/20 blur-[15px] sm:blur-[30px] -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />

                            {/* Reflection / Ground Shadow */}
                            <div className="absolute -bottom-2 sm:-bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-2 sm:h-6 bg-black/10 blur-md sm:blur-xl rounded-[100%] opacity-60" />
                        </motion.div>
                    </motion.div>
                ))}
            </div>

            {/* Ambient Sparkles / Particles - Reduced for mobile */}
            <motion.div className="absolute inset-0 pointer-events-none z-40">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: [0, 0.8, 0],
                            scale: [0, 1.2, 0],
                            y: [0, -30 - (i * 8)]
                        }}
                        transition={{
                            duration: 3 + i,
                            repeat: Infinity,
                            delay: i * 0.5,
                            ease: "easeOut"
                        }}
                        className="absolute w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-primary/40 shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]"
                        style={{
                            left: `${15 + (i * 15)}%`,
                            top: `${30 + (i * 10)}%`
                        }}
                    />
                ))}
            </motion.div>


        </div>
    );
};

export default HeroIllustration;
