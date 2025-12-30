import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import HeroIllustration from './HeroIllustration';

const HeroSection: React.FC = () => {
    const { t } = useLanguage();

    const scrollToProducts = () => {
        const productsSection = document.getElementById('products');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollToCategories = () => {
        const categoriesSection = document.getElementById('categories');
        if (categoriesSection) {
            categoriesSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden py-12 lg:py-0">
            {/* Background with advanced gradient and subtle animation */}
            <div className="absolute inset-0 z-0 bg-[#0a1a12]" /> {/* Base deep green */}
            <div className="absolute inset-0 z-0 gradient-hero opacity-80" />

            {/* Animated Mesh Gradients for Premium Feel */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                    x: [0, 50, 0],
                    y: [0, -30, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px] pointer-events-none"
            />
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.4, 0.2],
                    x: [0, -40, 0],
                    y: [0, 60, 0]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[-15%] left-[-5%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[100px] pointer-events-none"
            />

            <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay" />

            <div className="container mx-auto px-4 relative z-20">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
                    {/* Text Content */}
                    <div className="w-full lg:w-1/2 text-center lg:text-left pt-8 lg:pt-0">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/90 mb-8 backdrop-blur-md shadow-2xl">
                                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]">{t('heroSubtitle')}</span>
                            </div>

                            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.1] mb-8 tracking-tight">
                                {t('heroTitle').split(' ').map((word, i) => (
                                    <span key={i} className={i === 1 ? "text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-accent" : ""}>
                                        {word}{' '}
                                    </span>
                                ))}
                            </h1>

                            <p className="text-base sm:text-lg md:text-xl text-white/70 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                                {t('heroDescription')}
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
                                <Button
                                    size="lg"
                                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 py-8 rounded-2xl shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden"
                                    onClick={scrollToProducts}
                                >
                                    <span className="relative z-10 flex items-center">
                                        <ShoppingBag className="mr-3 h-5 w-5" />
                                        {t('shopNow')}
                                        <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </span>
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                        animate={{ x: ['-100%', '200%'] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                </Button>

                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full sm:w-auto bg-white/5 border-white/10 text-white hover:bg-white/10 text-lg px-10 py-8 rounded-2xl backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    onClick={scrollToCategories}
                                >
                                    {t('exploreProducts')}
                                </Button>
                            </div>

                          
                        </motion.div>
                    </div>

                    {/* Illustration Content */}
                    <div className="w-full lg:w-1/2 relative mt-8 lg:mt-0">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                            className="relative z-20 perspective-1000"
                        >
                            <HeroIllustration />
                        </motion.div>

                        {/* Circle highlight behind illustration */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-[100px] -z-10" />
                    </div>
                </div>
            </div>

            {/* Bottom smooth fade to content */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background/50 to-transparent z-10" />
        </section>
    );
};

export default HeroSection;
