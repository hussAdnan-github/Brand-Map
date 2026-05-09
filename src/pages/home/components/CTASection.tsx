import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function CTASection() {
  const { t } = useTranslation();

  return (
    <section className="bg-bm-beige py-16 md:py-20 px-4 md:px-8">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-cairo font-bold text-2xl md:text-4xl text-bm-black mb-4">
          {t('cta.title')}
        </h2>
        <p className="font-cairo text-bm-gray-gold text-sm md:text-base mb-8 leading-relaxed">
          {t('cta.description')}
        </p>
        <Link
          to="/register"
          className="inline-block bg-bm-red text-white font-cairo font-bold px-8 py-4 rounded-lg hover:bg-bm-red-dark transition-colors whitespace-nowrap text-sm md:text-base"
        >
          {t('cta.button')}
        </Link>
      </div>
    </section>
  );
}