import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import FeaturesSection from '@/components/FeaturesSection';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProducts } from '@/contexts/ProductContext';

interface IndexProps {
  searchQuery?: string;
}

const Index: React.FC<IndexProps> = ({ searchQuery = '' }) => {
  const { t, language } = useLanguage();
  const { products, categories, getFeaturedProducts, getProductsByCategory, getNewArrivals, searchProducts } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const featuredProducts = getFeaturedProducts();
  const newArrivals = getNewArrivals();

  // Handle search and category filtering
  const getDisplayProducts = () => {
    if (searchQuery.trim()) {
      return searchProducts(searchQuery);
    }
    if (selectedCategory) {
      return getProductsByCategory(selectedCategory);
    }
    return products;
  };

  const displayProducts = getDisplayProducts();
  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section - Hide when searching */}
      {!isSearching && <HeroSection />}

      {/* Search Results Section */}
      {isSearching && (
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-10"
            >
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                {t('searchResults')}
              </h2>
              <p className="mt-2 text-muted-foreground">
                {displayProducts.length} {t('products').toLowerCase()} found for "{searchQuery}"
              </p>
              <div className="mt-4 w-24 h-1 bg-primary mx-auto rounded-full" />
            </motion.div>

            {displayProducts.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayProducts.map((product, idx) => (
                  <ProductCard key={product.id} product={product} index={idx} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">{t('noResults')}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Categories Section - Hide when searching */}
      {!isSearching && (
        <section id="categories" className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                {t('shopByCategory')}
              </h2>
              <div className="mt-4 w-24 h-1 bg-primary mx-auto rounded-full" />
            </motion.div>

            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category, idx) => (
                <div key={category.id} className="w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.66rem)] lg:w-[calc(16.666%-0.83rem)]">
                  <CategoryCard
                    category={category}
                    index={idx}
                    onClick={() => setSelectedCategory(
                      selectedCategory === category.id ? null : category.id
                    )}
                  />
                </div>
              ))}
            </div>

            {selectedCategory && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-center"
              >
                <Button
                  variant="outline"
                  onClick={() => setSelectedCategory(null)}
                >
                  Clear Filter - View All Products
                </Button>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* New Arrivals Section - Hide when searching */}
      {!isSearching && !selectedCategory && newArrivals.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-accent/10 to-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <span className="text-sm font-medium text-accent uppercase tracking-wide">Just Added</span>
                </div>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                  {t('newArrivals')}
                </h2>
                <div className="mt-4 w-24 h-1 bg-accent rounded-full" />
              </div>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.slice(0, 4).map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section - Hide when searching */}
      {!isSearching && !selectedCategory && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4"
            >
              <div>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                  {t('featuredProducts')}
                </h2>
                <div className="mt-4 w-24 h-1 bg-primary rounded-full" />
              </div>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Products Section */}
      {!isSearching && (
        <section id="products" className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                {selectedCategory
                  ? categories.find(c => c.id === selectedCategory)?.name[language] || t('products')
                  : t('products')
                }
              </h2>
              <div className="mt-4 w-24 h-1 bg-primary mx-auto rounded-full" />
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <FeaturesSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
