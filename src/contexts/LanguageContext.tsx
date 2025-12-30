import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type Language = 'en' | 'ta';

interface Translations {
  [key: string]: {
    en: string;
    ta: string;
  };
}

const translations: Translations = {
  // Navigation
  home: { en: 'Home', ta: 'முகப்பு' },
  products: { en: 'Products', ta: 'பொருட்கள்' },
  categories: { en: 'Categories', ta: 'வகைகள்' },
  about: { en: 'About Us', ta: 'எங்களை பற்றி' },
  contact: { en: 'Contact', ta: 'தொடர்பு' },

  // Hero Section
  heroTitle: { en: 'Premium Quality Groceries', ta: 'தரமான மளிகை பொருட்கள்' },
  heroSubtitle: { en: 'Delivered Fresh to Your Doorstep', ta: 'உங்கள் வீட்டு வாசலில் புதிதாக டெலிவரி' },
  heroDescription: { en: 'Experience the finest selection of premium groceries, authentic spices, and quality essentials. Order via WhatsApp for quick and easy service.', ta: 'தரமான மளிகை பொருட்கள், நம்பகமான மசாலா மற்றும் தரமான அத்தியாவசியப் பொருட்களின் சிறந்த தேர்வை அனுபவியுங்கள். விரைவான மற்றும் எளிதான சேவைக்கு WhatsApp வழியாக ஆர்டர் செய்யுங்கள்.' },
  shopNow: { en: 'Shop Now', ta: 'இப்போது வாங்கு' },
  exploreProducts: { en: 'Explore Products', ta: 'பொருட்களை ஆராயுங்கள்' },

  // Categories
  'food-groceries': { en: 'Food & Groceries', ta: 'உணவு & மளிகை' },
  'households': { en: 'Households', ta: 'வீட்டு உபயோக பொருட்கள்' },
  'personal-care': { en: 'Personal Care', ta: 'தனிநபர் பராமரிப்பு' },
  'health-care': { en: 'Health Care', ta: 'சுகாதார பராமரிப்பு' },

  // Product
  addToCart: { en: 'Add to Cart', ta: 'கூடையில் சேர்' },
  buyNow: { en: 'Buy Now', ta: 'இப்போது வாங்கு' },
  inStock: { en: 'In Stock', ta: 'கையிருப்பு உள்ளது' },
  outOfStock: { en: 'Out of Stock', ta: 'கையிருப்பு இல்லை' },
  quantity: { en: 'Quantity', ta: 'அளவு' },
  viewDetails: { en: 'View Details', ta: 'விவரங்களைக் காண்க' },
  quickView: { en: 'Quick View', ta: 'விரைவு பார்வை' },
  selectSize: { en: 'Select Size', ta: 'அளவைத் தேர்ந்தெடுக்கவும்' },

  // Cart
  cart: { en: 'Cart', ta: 'கூடை' },
  yourCart: { en: 'Your Cart', ta: 'உங்கள் கூடை' },
  cartEmpty: { en: 'Your cart is empty', ta: 'உங்கள் கூடை காலியாக உள்ளது' },
  startShopping: { en: 'Start shopping to add items', ta: 'பொருட்களைச் சேர்க்க ஷாப்பிங் தொடங்குங்கள்' },
  subtotal: { en: 'Subtotal', ta: 'கூட்டுத்தொகை' },
  total: { en: 'Total', ta: 'மொத்தம்' },
  items: { en: 'items', ta: 'பொருட்கள்' },
  clearCart: { en: 'Clear Cart', ta: 'கூடையை காலி செய்' },
  remove: { en: 'Remove', ta: 'நீக்கு' },

  // Features
  whyChooseUs: { en: 'Why Choose Us', ta: 'ஏன் எங்களைத் தேர்வு செய்ய வேண்டும்' },
  freshProducts: { en: 'Quality Products', ta: 'தரமான பொருட்கள்' },
  freshProductsDesc: { en: 'Handpicked quality groceries from trusted suppliers', ta: 'நம்பகமான சப்ளையர்களிடமிருந்து கையால் தேர்ந்தெடுக்கப்பட்ட தரமான மளிகை' },
  qualityAssured: { en: 'Quality Assured', ta: 'தரம் உறுதி' },
  qualityAssuredDesc: { en: 'Every item checked for premium quality', ta: 'ஒவ்வொரு பொருளும் உயர்தரத்திற்காக சோதிக்கப்படுகிறது' },
  fastResponse: { en: 'Fast Response', ta: 'விரைவான பதில்' },
  fastResponseDesc: { en: 'Quick WhatsApp support and order processing', ta: 'விரைவான WhatsApp ஆதரவு மற்றும் ஆர்டர் செயலாக்கம்' },
  easyOrdering: { en: 'Easy Ordering', ta: 'எளிதான ஆர்டர்' },
  easyOrderingDesc: { en: 'Simple cart and WhatsApp checkout', ta: 'எளிய கூடை மற்றும் WhatsApp செக்அவுட்' },

  // Sections
  featuredProducts: { en: 'Featured Products', ta: 'சிறப்பு பொருட்கள்' },
  newArrivals: { en: 'New Arrivals', ta: 'புதிய வரவுகள்' },
  shopByCategory: { en: 'Shop by Category', ta: 'வகை வாரியாக வாங்கு' },
  viewAll: { en: 'View All', ta: 'அனைத்தையும் காண்க' },

  // Footer
  followUs: { en: 'Follow Us', ta: 'எங்களை பின்தொடருங்கள்' },
  businessHours: { en: 'Business Hours', ta: 'வணிக நேரம்' },
  monday: { en: 'Monday - Saturday', ta: 'திங்கள் - சனி' },
  sunday: { en: 'Sunday', ta: 'ஞாயிறு' },
  closed: { en: 'Closed', ta: 'மூடப்பட்டது' },
  quickLinks: { en: 'Quick Links', ta: 'விரைவு இணைப்புகள்' },
  allRightsReserved: { en: 'All rights reserved', ta: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை' },

  // Search
  searchProducts: { en: 'Search products...', ta: 'பொருட்களைத் தேடு...' },
  noResults: { en: 'No products found', ta: 'பொருட்கள் இல்லை' },
  searchResults: { en: 'Search Results', ta: 'தேடல் முடிவுகள்' },

  // WhatsApp Message
  whatsappGreeting: { en: "Hello! I'd like to purchase the following items:", ta: 'வணக்கம்! நான் பின்வரும் பொருட்களை வாங்க விரும்புகிறேன்:' },
  orderDetails: { en: 'Order Details', ta: 'ஆர்டர் விவரங்கள்' },
  orderSummary: { en: 'Order Summary', ta: 'ஆர்டர் சுருக்கம்' },
  totalAmount: { en: 'Total Amount', ta: 'மொத்த தொகை' },
  confirmOrder: { en: 'Please confirm my order and let me know delivery details.', ta: 'என் ஆர்டரை உறுதிப்படுத்தி, டெலிவரி விவரங்களை தெரிவிக்கவும்.' },
  thankYou: { en: 'Thank you!', ta: 'நன்றி!' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = useCallback((key: string): string => {
    return translations[key]?.[language] || key;
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'en' ? 'ta' : 'en');
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
