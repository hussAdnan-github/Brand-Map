import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { stages } from '@/mocks/brandMapData';
import { StaggerContainer, StaggerItem, CountUp } from '@/components/animation/AnimationComponents';

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[700px] md:min-h-[800px] bg-bm-black overflow-hidden pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-bm-black via-bm-black to-bm-black/95" />

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-bm-gold/10"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.8,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 md:px-8 py-12 md:py-16">
        {/* Text */}
        <div className="text-center mb-10 md:mb-14">
          <motion.h1
            className="font-cairo font-black text-3xl md:text-5xl lg:text-6xl text-white mb-3"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Brand Map
          </motion.h1>
          <motion.p
            className="font-playfair italic text-bm-gold text-lg md:text-xl mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Strategic Brand Building Game
          </motion.p>
          <motion.p
            className="font-cairo text-white/60 text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {t('hero.description')}
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/register"
                className="inline-block bg-bm-red text-white font-cairo font-bold px-6 py-3 rounded-lg hover:bg-bm-red-dark transition-colors whitespace-nowrap text-sm md:text-base"
              >
                {t('hero.cta.primary')}
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/about"
                className="inline-block border border-white/30 text-white font-cairo font-medium px-6 py-3 rounded-lg hover:bg-white/5 transition-colors whitespace-nowrap text-sm md:text-base"
              >
                {t('hero.cta.secondary')}
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Stage Cards - Board Layout */}
        <StaggerContainer staggerDelay={0.08} className="max-w-4xl mx-auto">
          {/* Top Row - 4 stages */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-3 md:mb-4">
            {stages.slice(0, 4).map((stage, idx) => (
              <StaggerItem key={stage.id}>
                <motion.div
                  className="relative rounded-lg overflow-hidden cursor-pointer"
                  style={{ backgroundColor: stage.color + '15' }}
                  whileHover={{ y: -8, scale: 1.03 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <motion.div
                    className="h-1.5 md:h-2"
                    style={{ backgroundColor: stage.color }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 + idx * 0.1 }}
                    styleOrigin="left"
                  />
                  <div className="p-3 md:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <motion.span
                        className="font-playfair font-bold text-lg md:text-2xl"
                        style={{ color: stage.color }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.7 + idx * 0.1 }}
                      >
                        {stage.roman}
                      </motion.span>
                      <motion.div
                        className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center"
                        whileHover={{ rotate: 15, scale: 1.2 }}
                      >
                        <i className={`${stage.icon} text-sm md:text-base`} style={{ color: stage.color }} />
                      </motion.div>
                    </div>
                    <h3 className="font-cairo font-bold text-white text-xs md:text-sm mb-1">
                      {stage.nameAr}
                    </h3>
                    <p className="font-playfair italic text-white/40 text-xs hidden md:block">
                      {stage.nameEn}
                    </p>
                  </div>
                  <motion.div
                    className="h-0.5 md:h-1"
                    style={{ backgroundColor: stage.color }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 + idx * 0.1 }}
                    styleOrigin="right"
                  />
                </motion.div>
              </StaggerItem>
            ))}
          </div>

          {/* Center Statement */}
          <motion.div
            className="flex justify-center mb-3 md:mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.0, type: 'spring', stiffness: 150 }}
          >
            <motion.div
              className="bg-bm-beige/10 border-2 border-bm-gold/30 rounded-lg px-6 md:px-10 py-3 md:py-4 text-center"
              whileHover={{ scale: 1.05, borderColor: 'rgba(200,146,43,0.6)' }}
            >
              <p className="font-playfair font-bold text-bm-gold text-sm md:text-lg">
                YOUR BRAND MAP
              </p>
              <p className="font-cairo text-white/50 text-xs md:text-sm">
                خريطة براندك
              </p>
            </motion.div>
          </motion.div>

          {/* Bottom Row - 3 stages + conflict */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {stages.slice(4, 7).map((stage, idx) => (
              <StaggerItem key={stage.id}>
                <motion.div
                  className="relative rounded-lg overflow-hidden cursor-pointer"
                  style={{ backgroundColor: stage.color + '15' }}
                  whileHover={{ y: -8, scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="h-1.5 md:h-2"
                    style={{ backgroundColor: stage.color }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, delay: 1.2 + idx * 0.1 }}
                    styleOrigin="left"
                  />
                  <div className="p-3 md:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <motion.span
                        className="font-playfair font-bold text-lg md:text-2xl"
                        style={{ color: stage.color }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 1.3 + idx * 0.1 }}
                      >
                        {stage.roman}
                      </motion.span>
                      <motion.div
                        className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center"
                        whileHover={{ rotate: 15, scale: 1.2 }}
                      >
                        <i className={`${stage.icon} text-sm md:text-base`} style={{ color: stage.color }} />
                      </motion.div>
                    </div>
                    <h3 className="font-cairo font-bold text-white text-xs md:text-sm mb-1">
                      {stage.nameAr}
                    </h3>
                    <p className="font-playfair italic text-white/40 text-xs hidden md:block">
                      {stage.nameEn}
                    </p>
                  </div>
                  <motion.div
                    className="h-0.5 md:h-1"
                    style={{ backgroundColor: stage.color }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, delay: 1.4 + idx * 0.1 }}
                    styleOrigin="right"
                  />
                </motion.div>
              </StaggerItem>
            ))}
            {/* Conflict Log */}
            <StaggerItem>
              <motion.div
                className="relative rounded-lg overflow-hidden cursor-pointer bg-bm-red-dark/15"
                whileHover={{ y: -8, scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="h-1.5 md:h-2 bg-bm-red-dark"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                  styleOrigin="left"
                />
                <div className="p-3 md:p-4">
                  <div className="flex items-center justify-between mb-2">
                    <motion.span
                      className="font-playfair font-bold text-lg md:text-2xl text-bm-red-dark"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, delay: 1.6 }}
                    >
                      ⚐
                    </motion.span>
                    <motion.div
                      className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center"
                      whileHover={{ rotate: 15, scale: 1.2 }}
                    >
                      <i className="ri-error-warning-line text-bm-red-dark text-sm md:text-base" />
                    </motion.div>
                  </div>
                  <h3 className="font-cairo font-bold text-white text-xs md:text-sm mb-1">
                    سجلّ التعارضات
                  </h3>
                  <p className="font-playfair italic text-white/40 text-xs hidden md:block">
                    Conflict Log
                  </p>
                </div>
                <motion.div
                  className="h-0.5 md:h-1 bg-bm-red-dark"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: 1.7 }}
                  styleOrigin="right"
                />
              </motion.div>
            </StaggerItem>
          </div>
        </StaggerContainer>

        {/* Stats */}
        <motion.div
          className="flex justify-center gap-6 md:gap-12 mt-10 md:mt-14"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          {[
            { value: 7, label: t('hero.stats.stages') },
            { value: 17, label: 'سؤال استراتيجي' },
            { value: 45, label: t('hero.stats.minutes') },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 1.4 + idx * 0.15, type: 'spring', stiffness: 200 }}
              whileHover={{ scale: 1.1, y: -4 }}
            >
              <p className="font-playfair font-bold text-bm-gold text-2xl md:text-3xl">
                <CountUp value={stat.value} duration={1.5 + idx * 0.3} />
              </p>
              <p className="font-cairo text-white/50 text-xs md:text-sm mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}