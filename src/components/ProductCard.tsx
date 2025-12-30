import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, ShoppingCart, Check, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '@/data/products';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProductModal from './ProductModal';

const WHATSAPP_NUMBER = '919629323252';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const name = language === 'en' ? product.name.en : product.name.ta;
  const description = language === 'en' ? product.description.en : product.description.ta;

  // Get current variant price and unit
  const currentVariant = useMemo(() => {
    if (product.variants && product.variants.length > 0) {
      return product.variants[selectedVariantIndex];
    }
    return { unit: product.unit, price: product.price };
  }, [product, selectedVariantIndex]);

  const handleAddToCart = () => {
    const productWithVariant = {
      ...product,
      price: currentVariant.price,
      unit: currentVariant.unit,
      id: product.variants ? `${product.id}-${currentVariant.unit}` : product.id,
    };
    addToCart(productWithVariant, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      setQuantity(1);
    }, 1500);
  };

  const handleBuyNow = () => {
    const itemTotal = currentVariant.price * quantity;
    const message = `Hello! I'd like to purchase:

🛒 *Order Details:*

📦 Product:
${name} (${currentVariant.unit}) - ₹${currentVariant.price} × ${quantity} = ₹${itemTotal}

📊 *Total Amount:* ₹${itemTotal}

Please confirm my order and let me know delivery details.

Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="card-product group"
      >
        {/* Image */}
        <div
          className="relative overflow-hidden aspect-square cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <img
            src={product.image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Stock Badge */}
          <Badge
            variant={product.inStock ? "default" : "destructive"}
            className="absolute top-3 left-3"
          >
            {product.inStock ? t('inStock') : t('outOfStock')}
          </Badge>

          {/* Featured Badge */}
          {product.featured && (
            <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
              ⭐ Featured
            </Badge>
          )}

          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <Button
                variant="secondary"
                size="sm"
                className="gap-2 shadow-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
              >
                <Eye className="w-4 h-4" />
                {t('quickView')}
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-heading font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {name}
          </h3>

          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>

          {/* Variant Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-muted-foreground mb-2">{t('selectSize') || 'Select Size'}</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant, idx) => (
                  <button
                    key={variant.unit}
                    onClick={() => setSelectedVariantIndex(idx)}
                    className={`px-3 py-1.5 text-sm rounded-md border transition-all ${selectedVariantIndex === idx
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted border-border hover:border-primary'
                      }`}
                  >
                    {variant.unit}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-primary">₹{currentVariant.price}</p>
              <p className="text-xs text-muted-foreground">{currentVariant.unit}</p>
            </div>

            {/* Quantity Selector */}
            {product.inStock && (
              <div className="flex items-center gap-2 bg-muted rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={!product.inStock}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-6 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={!product.inStock}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock || isAdded}
              variant="outline"
              className={`w-full sm:flex-1 gap-2 border-primary/20 hover:border-primary transition-all duration-300 ${isAdded ? 'bg-green-600 hover:bg-green-600 text-white border-green-600' : ''
                }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  {t('added') || 'Added!'}
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  {t('addToCart')}
                </>
              )}
            </Button>

            <Button
              onClick={handleBuyNow}
              disabled={!product.inStock}
              className="w-full sm:flex-1 gap-2 bg-green-600 hover:bg-green-700"
            >
              <ShoppingBag className="w-4 h-4" />
              {t('buyNow')}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Product Modal */}
      <ProductModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ProductCard;
