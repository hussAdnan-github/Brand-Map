import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { stages } from '@/mocks/brandMapData';
import { StaggerContainer, StaggerItem, CountUp } from '@/components/animation/AnimationComponents';

export default function FeaturesSection() {
  const { t } = useTranslation();

  const featureKeys = ['market', 'audience', 'value', 'personality', 'messaging', 'identity', 'vision'] as const;

  return (
    <section className="bg-bm-cream py-16 md:py-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-10 md:mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2 className="font-cairo font-bold text-2xl md:text-4xl text-bm-black mb-3">
            {t('features.title')}
          </h2>
          <p className="font-cairo text-bm-gray-gold text-sm md:text-base max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </motion.div>

        <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {featureKeys.map((key, index) => {
            const stage = stages[index];
            return (
              <StaggerItem key={key}>
                <motion.div
                  className="bg-white rounded-lg p-5 md:p-6 border border-bm-warm/20"
                  whileHover={{ y: -8, scale: 1.02, borderColor: 'rgba(217,205,174,0.5)' }}
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <motion.div
                    className="w-10 h-10 rounded-md flex items-center justify-center mb-4"
                    style={{ backgroundColor: stage.color + '15' }}
                    whileHover={{ rotate: 10, scale: 1.1 }}
                  >
                    <div className="w-6 h-6 flex items-center justify-center">
                      <i className={stage.icon} style={{ color: stage.color }} />
                    </div>
                  </motion.div>
                  <div className="flex items-center gap-2 mb-2">
                    <motion.span
                      className="font-playfair font-bold text-lg"
                      style={{ color: stage.color }}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {stage.roman}
                    </motion.span>
                    <motion.div
                      className="h-px flex-1"
                      style={{ backgroundColor: stage.color + '30' }}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.08 }}
                    />
                  </div>
                  <h3 className="font-cairo font-bold text-bm-black text-sm mb-2">
                    {t(`feature.${key}.title`)}
                  </h3>
                  <p className="font-cairo text-bm-gray-gold text-xs leading-relaxed">
                    {t(`feature.${key}.desc`)}
                  </p>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}