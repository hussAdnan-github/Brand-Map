import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function HowItWorksSection() {
  const { t } = useTranslation();

  const steps = [
    { num: '١', key: 'step1', desc: 'step1.desc', icon: 'ri-question-line' },
    { num: '٢', key: 'step2', desc: 'step2.desc', icon: 'ri-stack-line' },
    { num: '٣', key: 'step3', desc: 'step3.desc', icon: 'ri-bar-chart-grouped-line' },
    { num: '٤', key: 'step4', desc: 'step4.desc', icon: 'ri-shield-check-line' },
    { num: '٥', key: 'step5', desc: 'step5.desc', icon: 'ri-file-list-line' },
  ];

  return (
    <section className="bg-bm-black py-16 md:py-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-10 md:mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-cairo font-bold text-2xl md:text-4xl text-bm-gold mb-3">
            {t('how.title')}
          </h2>
        </motion.div>

        <div className="flex flex-col gap-6 md:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.key}
              className={`flex items-start gap-4 md:gap-6 ${
                index % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Number circle */}
              <motion.div
                className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-bm-gold flex items-center justify-center bg-bm-black"
                whileHover={{ scale: 1.15, borderWidth: '3px' }}
                transition={{ duration: 0.2 }}
              >
                <motion.span
                  className="font-playfair font-bold text-bm-gold text-lg md:text-xl"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 300, delay: 0.1 + index * 0.1 }}
                >
                  {step.num}
                </motion.span>
              </motion.div>

              {/* Content */}
              <motion.div
                className="flex-1 bg-bm-black/50 border border-bm-gold/20 rounded-lg p-4 md:p-5"
                whileHover={{ borderColor: 'rgba(200,146,43,0.4)', y: -3 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <motion.div
                    className="w-6 h-6 flex items-center justify-center"
                    whileHover={{ rotate: 15, scale: 1.2 }}
                  >
                    <i className={`${step.icon} text-bm-gold`} />
                  </motion.div>
                  <h3 className="font-cairo font-bold text-white text-sm md:text-base">
                    {t(`how.${step.key}`)}
                  </h3>
                </div>
                <p className="font-cairo text-white/50 text-xs md:text-sm leading-relaxed">
                  {t(`how.${step.desc}`)}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}