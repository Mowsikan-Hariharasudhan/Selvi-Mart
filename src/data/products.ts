export interface ProductVariant {
  unit: string;
  price: number;
}

export interface Product {
  id: string;
  name: {
    en: string;
    ta: string;
  };
  description: {
    en: string;
    ta: string;
  };
  price: number;
  unit: string;
  category: string;
  image: string;
  inStock: boolean;
  featured?: boolean;
  isNew?: boolean;
  variants?: ProductVariant[];
}

export interface Category {
  id: string;
  name: {
    en: string;
    ta: string;
  };
  icon: string;
  color: string;
}

export const initialCategories: Category[] = [
  { id: 'food-groceries', name: { en: 'Food & Groceries', ta: 'உணவு & மளிகை' }, icon: '🍎', color: 'from-green-200 to-green-400' },
  { id: 'households', name: { en: 'Households', ta: 'வீட்டு உபயோக பொருட்கள்' }, icon: '🏠', color: 'from-blue-200 to-blue-400' },
  { id: 'personal-care', name: { en: 'Personal Care', ta: 'தனிநபர் பராமரிப்பு' }, icon: '🧴', color: 'from-pink-200 to-pink-400' },
  { id: 'health-care', name: { en: 'Health Care', ta: 'சுகாதார பராமரிப்பு' }, icon: '💊', color: 'from-red-200 to-red-400' },
];

export const products: Product[] = [];
