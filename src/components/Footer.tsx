import React from 'react';
import { Leaf, Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background/90">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/selvi_logo.png"
                alt="Selvi Mart Logo"
                className="w-12 h-12 object-contain bg-white rounded-full p-1" // Added white bg since footer is dark
              />
              <img
                src="/selvi_text.png"
                alt="Selvi Mart"
                className="h-10 object-contain brightness-0 invert" // Make text white for footer
              />
            </div>
            <p className="text-background/70 text-sm leading-relaxed">
              Your trusted partner for fresh, premium quality groceries. Experience the best in organic and locally sourced produce.
            </p>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/919629323252"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">Chat on WhatsApp</span>
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-background mb-4">
              {t('quickLinks')}
            </h4>
            <ul className="space-y-2">
              {['home', 'products', 'categories', 'about'].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link === 'home' ? '' : link}`}
                    className="text-background/70 hover:text-primary transition-colors"
                  >
                    {t(link)}
                  </a>
                </li>
              ))}

            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-background mb-4">
              {t('businessHours')}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-background/70">
                <Clock className="w-4 h-4 text-primary" />
                <div>
                  <p className="font-medium text-background">{t('monday')}</p>
                  <p className="text-sm">8:00 AM - 7:00 PM</p>
                </div>
              </li>
              <li className="flex items-center gap-3 text-background/70">
                <Clock className="w-4 h-4 text-primary" />
                <div>
                  <p className="font-medium text-background">{t('sunday')}</p>
                  <p className="text-sm">9:00 AM - 6:00 PM</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-background mb-4">
              {t('contact')}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-background/70">
                <Phone className="w-4 h-4 text-primary" />
                <span>+91 96293 23252</span>
              </li>
              <li className="flex items-center gap-3 text-background/70">
                <Mail className="w-4 h-4 text-primary" />
                <span>mowsikan02@gmail.com</span>
              </li>
              <li className="flex items-start gap-3 text-background/70">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span>Pon Sastha Complex, Pon Sastha Textiles, Sarkar Kannadiputhur(North), Madathukulam, Tirupur, Tamil Nadu 642113</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-background/10 text-center">
          <p className="text-background/50 text-sm">
            © {currentYear} Selvi Mart. {t('allRightsReserved')}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
