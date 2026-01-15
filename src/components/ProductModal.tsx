import React, { useState, useMemo, useEffect } from 'react';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { Product } from '@/data/products';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  // Reset state when product changes
  useEffect(() => {
    setQuantity(1);
    setSelectedVariantIndex(0);
  }, [product?.id]);

  if (!product) return null;

  const name = language === 'en' ? product.name.en : product.name.ta;
  const description = language === 'en' ? product.description.en : product.description.ta;

  // Get current variant price and unit
  const currentVariant = product.variants && product.variants.length > 0
    ? product.variants[selectedVariantIndex]
    : { unit: product.unit, price: product.price };

  const handleAddToCart = () => {
    const productWithVariant = {
      ...product,
      price: currentVariant.price,
      unit: currentVariant.unit,
      id: product.variants ? `${product.id}-${currentVariant.unit}` : product.id,
    };
    addToCart(productWithVariant, quantity);
    setQuantity(1);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">{name}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <img
              src={product.image}
              alt={name}
              className="w-full h-full object-cover"
            />
            <Badge
              variant={product.inStock ? "default" : "destructive"}
              className="absolute top-3 left-3"
            >
              {product.inStock ? t('inStock') : t('outOfStock')}
            </Badge>
            {product.featured && (
              <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
                ⭐ Featured
              </Badge>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <h2 className="font-heading text-2xl font-bold text-foreground">{name}</h2>

            <p className="mt-3 text-muted-foreground">{description}</p>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">{t('selectSize') || 'Select Size'}</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant, idx) => (
                    <button
                      key={variant.unit}
                      onClick={() => setSelectedVariantIndex(idx)}
                      className={`px-4 py-2 text-sm rounded-md border transition-all ${selectedVariantIndex === idx
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-muted border-border hover:border-primary'
                        }`}
                    >
                      {variant.unit} - ₹{variant.price}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4">
              <p className="text-3xl font-bold text-primary">₹{currentVariant.price}</p>
              <p className="text-sm text-muted-foreground">{currentVariant.unit}</p>
            </div>

            {/* Quantity Selector */}
            {product.inStock && (
              <div className="mt-6">
                <p className="text-sm font-medium mb-2">{t('quantity')}</p>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Total */}
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{t('total')}</span>
                <span className="text-xl font-bold text-primary">₹{currentVariant.price * quantity}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                variant="outline"
                className="w-full gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                {t('addToCart')}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
