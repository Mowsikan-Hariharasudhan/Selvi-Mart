import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Shield, MessageCircle, ShoppingBag } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const features = [
  {
    icon: Leaf,
    titleKey: 'freshProducts',
    descKey: 'freshProductsDesc',
    gradient: 'from-green-500 to-emerald-600',
  },
  {
    icon: Shield,
    titleKey: 'qualityAssured',
    descKey: 'qualityAssuredDesc',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    icon: MessageCircle,
    titleKey: 'fastResponse',
    descKey: 'fastResponseDesc',
    gradient: 'from-green-600 to-green-700',
  },
  {
    icon: ShoppingBag,
    titleKey: 'easyOrdering',
    descKey: 'easyOrderingDesc',
    gradient: 'from-amber-500 to-orange-600',
  },
];

const FeaturesSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            {t('whyChooseUs')}
          </h2>
          <div className="mt-4 w-24 h-1 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.titleKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-card transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                {t(feature.titleKey)}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(feature.descKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
