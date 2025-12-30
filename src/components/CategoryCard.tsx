import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import * as LucideIcons from 'lucide-react';

interface Category {
  id: string;
  name: {
    en: string;
    ta: string;
  };
  icon: string;
  color: string;
}

interface CategoryCardProps {
  category: Category;
  index?: number;
  onClick?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, index = 0, onClick }) => {
  const { language } = useLanguage();
  const name = language === 'en' ? category.name.en : category.name.ta;

  const getColorGradient = (color: string) => {
    if (color.includes('from-')) return color;

    const mapping: Record<string, string> = {
      green: 'from-green-400 to-green-600',
      blue: 'from-blue-400 to-blue-600',
      red: 'from-red-400 to-red-600',
      pink: 'from-pink-400 to-pink-600',
      amber: 'from-amber-400 to-amber-600',
      orange: 'from-orange-400 to-orange-600',
      indigo: 'from-indigo-400 to-indigo-600',
      slate: 'from-slate-400 to-slate-600',
    };

    return mapping[color] || 'from-slate-400 to-slate-600';
  };

  const IconComponent = (LucideIcons as any)[category.icon];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={onClick}
      className="cursor-pointer group h-full"
    >
      <div className={`relative h-full overflow-hidden rounded-3xl p-6 bg-gradient-to-br ${getColorGradient(category.color)} text-white shadow-lg hover:shadow-xl transition-all duration-300`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -right-6 -bottom-6">
            {IconComponent ? (
              <IconComponent size={120} strokeWidth={1} />
            ) : (
              <span className="text-8xl">{category.icon}</span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-start h-full">
          <div className="mb-4 bg-white/20 p-3 rounded-2xl backdrop-blur-sm group-hover:bg-white/30 transition-colors">
            {IconComponent ? (
              <IconComponent size={32} />
            ) : (
              <span className="text-3xl">{category.icon}</span>
            )}
          </div>
          <h3 className="font-heading text-lg font-bold leading-tight group-hover:translate-x-1 transition-transform">{name}</h3>
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryCard;
