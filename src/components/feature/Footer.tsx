import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-bm-beige border-t border-bm-warm/30">
      <div className="px-4 md:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:w-1/3">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-bm-red rounded-md flex items-center justify-center">
                <span className="text-white font-playfair font-bold text-lg">B</span>
              </div>
              <span className="font-cairo font-bold text-bm-black text-lg">Brand Map</span>
            </div>
            <p className="text-sm font-cairo text-bm-gray-gold leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Links */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-6">
            <div>
              <h4 className="font-cairo font-semibold text-bm-black text-sm mb-3">{t('footer.links.product')}</h4>
              <div className="flex flex-col gap-2">
                <Link to="/" className="text-sm font-cairo text-bm-gray-gold hover:text-bm-black transition-colors">
                  {t('footer.links.features')}
                </Link>
                <Link to="/pricing" className="text-sm font-cairo text-bm-gray-gold hover:text-bm-black transition-colors">
                  {t('footer.links.pricing')}
                </Link>
                <Link to="/about" className="text-sm font-cairo text-bm-gray-gold hover:text-bm-black transition-colors">
                  {t('footer.links.about')}
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-cairo font-semibold text-bm-black text-sm mb-3">{t('footer.links.support')}</h4>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-cairo text-bm-gray-gold cursor-pointer hover:text-bm-black transition-colors">
                  {t('footer.links.help')}
                </span>
                <span className="text-sm font-cairo text-bm-gray-gold cursor-pointer hover:text-bm-black transition-colors">
                  {t('footer.links.contact')}
                </span>
              </div>
            </div>
            <div>
              <h4 className="font-cairo font-semibold text-bm-black text-sm mb-3">{t('footer.legal')}</h4>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-cairo text-bm-gray-gold cursor-pointer hover:text-bm-black transition-colors">
                  {t('footer.legal.privacy')}
                </span>
                <span className="text-sm font-cairo text-bm-gray-gold cursor-pointer hover:text-bm-black transition-colors">
                  {t('footer.legal.terms')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-bm-warm/30 mt-8 pt-6 text-center">
          <p className="text-xs font-cairo text-bm-gray-gold">{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}