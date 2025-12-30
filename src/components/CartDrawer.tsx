import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, MessageCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

const WHATSAPP_NUMBER = '919629323252';

const CartDrawer: React.FC = () => {
  const { items, removeFromCart, updateQuantity, clearCart, subtotal, totalItems, isCartOpen, setIsCartOpen } = useCart();
  const { language, t } = useLanguage();

  const generateWhatsAppMessage = () => {
    const greeting = t('whatsappGreeting');
    
    let message = `${greeting}\n\n`;
    message += `🛒 *${t('orderDetails')}:*\n\n`;
    message += `📦 Products:\n`;
    
    items.forEach((item, index) => {
      const name = language === 'en' ? item.product.name.en : item.product.name.ta;
      const itemTotal = item.product.price * item.quantity;
      message += `${index + 1}. ${name} (${item.product.unit}) - ₹${item.product.price} × ${item.quantity} = ₹${itemTotal}\n`;
    });
    
    message += `\n📊 *${t('orderSummary')}:*\n`;
    message += `${t('subtotal')}: ₹${subtotal}\n`;
    message += `${t('totalAmount')}: ₹${subtotal}\n\n`;
    message += `${t('confirmOrder')}\n\n`;
    message += `${t('thankYou')} 🙏`;
    
    return encodeURIComponent(message);
  };

  const handleWhatsAppCheckout = () => {
    const message = generateWhatsAppMessage();
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(url, '_blank');
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 font-heading text-xl">
            <ShoppingBag className="w-5 h-5 text-primary" />
            {t('yourCart')}
            <span className="text-sm text-muted-foreground font-body">
              ({totalItems} {t('items')})
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <p className="text-lg font-medium text-muted-foreground">{t('cartEmpty')}</p>
              <p className="text-sm text-muted-foreground mt-1">{t('startShopping')}</p>
              <Button 
                className="mt-6"
                onClick={() => setIsCartOpen(false)}
              >
                {t('exploreProducts')}
              </Button>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.product.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex gap-4 py-4 border-b border-border"
                >
                  <img
                    src={item.product.image}
                    alt={language === 'en' ? item.product.name.en : item.product.name.ta}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-2">
                      {language === 'en' ? item.product.name.en : item.product.name.ta}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.product.unit}
                    </p>
                    <p className="text-primary font-semibold mt-1">
                      ₹{item.product.price}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 bg-muted rounded-lg">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="font-semibold text-right">
                    ₹{item.product.price * item.quantity}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border pt-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{t('subtotal')}</span>
              <span className="font-semibold">₹{subtotal}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center text-lg">
              <span className="font-heading font-semibold">{t('total')}</span>
              <span className="font-heading font-bold text-primary">₹{subtotal}</span>
            </div>
            
            <Button
              onClick={handleWhatsAppCheckout}
              className="w-full h-12 text-base font-semibold gap-2 bg-green-600 hover:bg-green-700"
            >
              <MessageCircle className="w-5 h-5" />
              {t('buyNow')}
            </Button>
            
            <Button
              variant="outline"
              onClick={clearCart}
              className="w-full"
            >
              {t('clearCart')}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
