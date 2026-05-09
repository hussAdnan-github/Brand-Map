import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { stages, questions, maturityLevels } from '@/mocks/brandMapData';
import Navbar from '@/components/feature/Navbar';
import {
  FadeInUp,
  StaggerContainer,
  StaggerItem,
  AnimatedSwitch,
  AnimatedCard,
  AnimatedProgress,
  AnimatedMaturityDots,
  AnimatedExpand,
} from '@/components/animation/AnimationComponents';

interface SelectedCard {
  questionId: string;
  cardId: string;
  maturityLevel: number;
  customText?: string;
}

interface DetectedConflict {
  card1Id: string;
  card2Id: string;
  type: 'blocker' | 'warning' | 'synergy';
  message: string;
}

export default function BrandMapPlay() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState(0);
  const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([]);
  const [showConflicts, setShowConflicts] = useState(false);
  const [direction, setDirection] = useState(1);

  const stageQuestions = useMemo(
    () => questions.filter((q) => q.stageId === stages[currentStage].id),
    [currentStage]
  );

  const stage = stages[currentStage];

  const stageSelections = useMemo(() => {
    return selectedCards.filter((s) =>
      stageQuestions.some((q) => q.id === s.questionId)
    );
  }, [selectedCards, stageQuestions]);

  const conflicts = useMemo(() => {
    const detected: DetectedConflict[] = [];
    for (let i = 0; i < selectedCards.length; i++) {
      for (let j = i + 1; j < selectedCards.length; j++) {
        const card1 = selectedCards[i];
        const card2 = selectedCards[j];
        const q1 = questions.find((q) => q.id === card1.questionId);
        const q2 = questions.find((q) => q.id === card2.questionId);
        if (!q1 || !q2 || q1.type !== 'single_choice' || q2.type !== 'single_choice') continue;
        const card1Data = q1.cards?.find((c) => c.id === card1.cardId);
        const card2Data = q2.cards?.find((c) => c.id === card2.cardId);
        if (!card1Data || !card2Data) continue;
        if (card1Data.blockers?.includes(card2.cardId)) {
          detected.push({
            card1Id: card1.cardId,
            card2Id: card2.cardId,
            type: 'blocker',
            message: `⚠ تعارض مانع: ${card1Data.titleAr} لا يتوافق مع ${card2Data.titleAr}`,
          });
        } else if (card1Data.warnings?.includes(card2.cardId)) {
          detected.push({
            card1Id: card1.cardId,
            card2Id: card2.cardId,
            type: 'warning',
            message: `⚡ تحذير: ${card1Data.titleAr} يخلق توتراً مع ${card2Data.titleAr}`,
          });
        } else if (card1Data.synergies?.includes(card2.cardId) || card1Data.synergies?.includes('all')) {
          detected.push({
            card1Id: card1.cardId,
            card2Id: card2.cardId,
            type: 'synergy',
            message: `✓ توافق ممتاز: ${card1Data.titleAr} يقوّي ${card2Data.titleAr}`,
          });
        }
      }
    }
    return detected;
  }, [selectedCards]);

  const handleCardSelect = (questionId: string, cardId: string) => {
    setSelectedCards((prev) => {
      const filtered = prev.filter((s) => s.questionId !== questionId);
      return [...filtered, { questionId, cardId, maturityLevel: 3 }];
    });
  };

  const handleMaturityChange = (questionId: string, level: number) => {
    setSelectedCards((prev) =>
      prev.map((s) =>
        s.questionId === questionId ? { ...s, maturityLevel: level } : s
      )
    );
  };

  const goToStage = (index: number) => {
    setDirection(index > currentStage ? 1 : -1);
    setCurrentStage(index);
    setShowConflicts(false);
  };

  const handleNextStage = () => {
    if (currentStage < stages.length - 1) {
      setDirection(1);
      setCurrentStage((prev) => prev + 1);
      setShowConflicts(false);
    } else {
      navigate(`/brand-map/${id}/output`);
    }
  };

  const handlePrevStage = () => {
    if (currentStage > 0) {
      setDirection(-1);
      setCurrentStage((prev) => prev - 1);
      setShowConflicts(false);
    }
  };

  const isStageComplete = stageQuestions.every((q) =>
    q.type === 'open_text'
      ? selectedCards.some((s) => s.questionId === q.id && s.customText)
      : selectedCards.some((s) => s.questionId === q.id)
  );

  const allStageQuestions = questions;
  const totalAnswered = selectedCards.filter((s) => allStageQuestions.some((q) => q.id === s.questionId)).length;
  const totalQuestions = allStageQuestions.length;

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-bm-black">
      <Navbar />

      <main className="pt-20 pb-8 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header with animated progress */}
          <FadeInUp>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <motion.h1
                    className="font-cairo font-bold text-white text-lg md:text-xl"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    براند شركة التقنية
                  </motion.h1>
                  <motion.p
                    className="font-cairo text-white/50 text-xs md:text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    المرحلة {currentStage + 1} من ٧: {stage.nameAr}
                  </motion.p>
                </div>
                <div className="text-right">
                  <p className="font-cairo text-white/50 text-xs">
                    {totalAnswered} / {totalQuestions} سؤال
                  </p>
                  <AnimatedProgress
                    value={totalAnswered}
                    max={totalQuestions}
                    color="#C8922B"
                    className="w-32 mt-1"
                    height={6}
                  />
                </div>
              </div>

              {/* Animated Stage Tabs */}
              <div className="flex gap-1 overflow-x-auto pb-2">
                {stages.map((s, index) => (
                  <motion.button
                    key={s.id}
                    onClick={() => goToStage(index)}
                    whileHover={{ scale: 1.08, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      backgroundColor: index === currentStage ? s.color + '30' : 'transparent',
                      scale: index === currentStage ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.25 }}
                    className={`flex-shrink-0 px-3 py-2 rounded-lg font-cairo text-xs whitespace-nowrap ${
                      index === currentStage
                        ? 'font-bold'
                        : index < currentStage
                        ? 'text-white/50'
                        : 'text-white/30'
                    }`}
                  >
                    <span style={{ color: index <= currentStage ? s.color : undefined }}>
                      {s.roman}
                    </span>
                    {index < currentStage && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-1 text-bm-green text-[10px]"
                      >
                        <i className="ri-check-line" />
                      </motion.span>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </FadeInUp>

          {/* Stage Content with Animated Switch */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStage}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Stage Card Header */}
              <motion.div
                className="rounded-xl p-4 md:p-6 mb-6 border"
                style={{
                  backgroundColor: stage.color + '08',
                  borderColor: stage.color + '30',
                }}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, delay: 0.1 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <motion.div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: stage.color + '20' }}
                    initial={{ rotate: -10, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.2, type: 'spring', stiffness: 200 }}
                  >
                    <span className="font-playfair font-bold text-lg" style={{ color: stage.color }}>
                      {stage.roman}
                    </span>
                  </motion.div>
                  <div>
                    <h2 className="font-cairo font-bold text-white text-base md:text-lg">
                      {stage.nameAr}
                    </h2>
                    <p className="font-playfair italic text-white/40 text-xs">
                      {stage.nameEn}
                    </p>
                  </div>
                </div>
                <p className="font-cairo text-white/60 text-sm mt-2">{stage.hint}</p>
              </motion.div>

              {/* Questions with Stagger Animation */}
              <StaggerContainer staggerDelay={0.1} className="space-y-6">
                {stageQuestions.map((question, qIdx) => {
                  const selected = selectedCards.find((s) => s.questionId === question.id);

                  return (
                    <StaggerItem key={question.id}>
                      <motion.div
                        className="bg-bm-black/30 border border-bm-warm/10 rounded-xl p-4 md:p-6"
                        whileHover={{ borderColor: 'rgba(217,205,174,0.2)' }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* Question Header */}
                        <div className="flex items-start gap-3 mb-4">
                          <motion.div
                            className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: stage.color + '20' }}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                          >
                            <span className="font-cairo font-bold text-sm" style={{ color: stage.color }}>
                              {question.id}
                            </span>
                          </motion.div>
                          <div className="flex-1">
                            <h3 className="font-cairo font-bold text-white text-sm md:text-base">
                              {question.question}
                            </h3>
                            <p className="font-cairo text-white/40 text-xs mt-1">
                              {question.hint}
                            </p>
                          </div>
                          <span className="font-cairo text-white/30 text-xs flex-shrink-0">
                            {question.time}
                          </span>
                        </div>

                        {/* Answer Cards with Stagger */}
                        {question.type === 'single_choice' && question.cards && (
                          <StaggerContainer staggerDelay={0.06} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {question.cards.map((card, cIdx) => {
                              const isSelected = selected?.cardId === card.id;
                              return (
                                <StaggerItem key={card.id}>
                                  <motion.button
                                    onClick={() => handleCardSelect(question.id, card.id)}
                                    animate={{
                                      scale: isSelected ? 1.02 : 1,
                                      borderColor: isSelected
                                        ? 'rgba(200, 146, 43, 0.5)'
                                        : 'rgba(217, 205, 174, 0.15)',
                                      backgroundColor: isSelected
                                        ? 'rgba(200, 146, 43, 0.08)'
                                        : 'rgba(14, 17, 22, 0.2)',
                                    }}
                                    whileHover={{ scale: 1.01, y: -3 }}
                                    whileTap={{ scale: 0.97 }}
                                    transition={{ duration: 0.25 }}
                                    className="relative p-4 rounded-lg border text-right w-full"
                                  >
                                    {/* Card Header */}
                                    <div className="flex items-center gap-3 mb-2">
                                      <motion.div
                                        className="w-8 h-8 rounded-md flex items-center justify-center"
                                        style={{ backgroundColor: stage.color + '15' }}
                                        animate={{
                                          backgroundColor: isSelected
                                            ? stage.color + '25'
                                            : stage.color + '15',
                                        }}
                                      >
                                        <div className="w-5 h-5 flex items-center justify-center">
                                          <i className={card.icon} style={{ color: stage.color, fontSize: '14px' }} />
                                        </div>
                                      </motion.div>
                                      <div className="flex-1">
                                        <h4 className="font-cairo font-bold text-white text-sm">
                                          {card.titleAr}
                                        </h4>
                                        <p className="font-playfair italic text-white/30 text-xs">
                                          {card.titleEn}
                                        </p>
                                      </div>
                                      <AnimatePresence>
                                        {isSelected && (
                                          <motion.div
                                            className="w-6 h-6 flex items-center justify-center"
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            exit={{ scale: 0, rotate: 180 }}
                                            transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
                                          >
                                            <i className="ri-check-line text-bm-gold text-lg" />
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>

                                    {/* Description */}
                                    <p className="font-cairo text-white/50 text-xs leading-relaxed mb-3">
                                      {card.description}
                                    </p>

                                    {/* Conflict Rules */}
                                    {(card.blockers?.length > 0 || card.warnings?.length > 0) && (
                                      <motion.div
                                        className="border-t border-bm-warm/10 pt-2 mt-2"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        transition={{ duration: 0.3, delay: 0.1 }}
                                      >
                                        {card.blockers?.length > 0 && (
                                          <div className="flex items-start gap-2">
                                            <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">
                                              <i className="ri-forbid-line text-bm-red text-xs" />
                                            </div>
                                            <p className="font-cairo text-bm-red/70 text-xs">
                                              لا تختر مع: {card.blockers.map((b) => {
                                                const q = questions.find((q2) => q2.cards?.some((c) => c.id === b));
                                                const c = q?.cards?.find((c) => c.id === b);
                                                return c?.titleAr || b;
                                              }).join(' · ')}
                                            </p>
                                          </div>
                                        )}
                                        {card.warnings?.length > 0 && (
                                          <div className="flex items-start gap-2 mt-1">
                                            <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">
                                              <i className="ri-error-warning-line text-bm-orange text-xs" />
                                            </div>
                                            <p className="font-cairo text-bm-orange/70 text-xs">
                                              تحذير مع: {card.warnings.map((w) => {
                                                const q = questions.find((q2) => q2.cards?.some((c) => c.id === w));
                                                const c = q?.cards?.find((c) => c.id === w);
                                                return c?.titleAr || w;
                                              }).join(' · ')}
                                            </p>
                                          </div>
                                        )}
                                      </motion.div>
                                    )}
                                  </motion.button>
                                </StaggerItem>
                              );
                            })}
                          </StaggerContainer>
                        )}

                        {/* Open Text Answer */}
                        {question.type === 'open_text' && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                          >
                            <textarea
                              value={selected?.customText || ''}
                              onChange={(e) =>
                                setSelectedCards((prev) => {
                                  const filtered = prev.filter((s) => s.questionId !== question.id);
                                  return [
                                    ...filtered,
                                    {
                                      questionId: question.id,
                                      cardId: 'open-text',
                                      maturityLevel: 3,
                                      customText: e.target.value,
                                    },
                                  ];
                                })
                              }
                              className="w-full bg-bm-black border border-bm-warm/30 rounded-lg px-4 py-3 font-cairo text-white text-sm focus:outline-none focus:border-bm-gold transition-colors resize-none"
                              rows={4}
                              placeholder="اكتب إجابتك هنا..."
                              maxLength={500}
                            />
                            <p className="font-cairo text-white/30 text-xs mt-1 text-left">
                              {selected?.customText?.length || 0} / 500
                            </p>
                          </motion.div>
                        )}

                        {/* Maturity Level with Animated Dots */}
                        <AnimatePresence>
                          {selected && (
                            <motion.div
                              className="mt-4 pt-4 border-t border-bm-warm/10"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                            >
                              <p className="font-cairo text-white/50 text-xs mb-2">
                                مستوى ثقتك بهذا القرار:
                              </p>
                              <div className="flex gap-2">
                                {maturityLevels.map((level) => (
                                  <motion.button
                                    key={level.level}
                                    onClick={() => handleMaturityChange(question.id, level.level)}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    animate={{
                                      backgroundColor:
                                        selected.maturityLevel === level.level
                                          ? level.color + '30'
                                          : 'transparent',
                                    }}
                                    transition={{ duration: 0.2 }}
                                    className={`flex-1 py-2 rounded-lg font-cairo text-xs transition-all ${
                                      selected.maturityLevel === level.level
                                        ? 'text-white font-bold'
                                        : 'text-white/30 hover:text-white/50'
                                    }`}
                                  >
                                    <AnimatedMaturityDots
                                      level={level.level}
                                      color={level.color}
                                      size={6}
                                      gap={3}
                                    />
                                    <span className="block mt-1">{level.label}</span>
                                  </motion.button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>
            </motion.div>
          </AnimatePresence>

          {/* Conflicts Panel with Animation */}
          <AnimatePresence>
            {conflicts.length > 0 && (
              <motion.div
                className="mt-6 bg-bm-red-dark/10 border border-bm-red-dark/30 rounded-xl p-4"
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.97 }}
                transition={{ duration: 0.4 }}
              >
                <motion.button
                  onClick={() => setShowConflicts(!showConflicts)}
                  className="flex items-center gap-2 w-full"
                  whileHover={{ x: 2 }}
                >
                  <motion.div
                    className="w-5 h-5 flex items-center justify-center"
                    animate={{ rotate: showConflicts ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <i className="ri-error-warning-line text-bm-red" />
                  </motion.div>
                  <span className="font-cairo text-white text-sm">
                    {conflicts.length} تعارض استراتيجي مكتشف
                  </span>
                  <motion.div
                    className="w-5 h-5 flex items-center justify-center mr-auto"
                    animate={{ rotate: showConflicts ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <i className="ri-arrow-down-s-line text-white/50" />
                  </motion.div>
                </motion.button>

                <AnimatedExpand isOpen={showConflicts}>
                  <div className="mt-3 space-y-2">
                    {conflicts.map((conflict, index) => (
                      <motion.div
                        key={index}
                        className={`p-3 rounded-lg text-xs font-cairo ${
                          conflict.type === 'blocker'
                            ? 'bg-bm-red/10 text-bm-red'
                            : conflict.type === 'warning'
                            ? 'bg-bm-orange/10 text-bm-orange'
                            : 'bg-bm-green/10 text-bm-green'
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08, duration: 0.3 }}
                        whileHover={{ x: 4, scale: 1.01 }}
                      >
                        <div className="flex items-center gap-2">
                          <motion.div
                            animate={{
                              scale: [1, 1.2, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatDelay: 1,
                            }}
                          >
                            <i
                              className={
                                conflict.type === 'blocker'
                                  ? 'ri-forbid-line'
                                  : conflict.type === 'warning'
                                  ? 'ri-error-warning-line'
                                  : 'ri-check-double-line'
                              }
                            />
                          </motion.div>
                          {conflict.message}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </AnimatedExpand>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation with Animation */}
          <motion.div
            className="flex gap-3 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <motion.button
              onClick={handlePrevStage}
              disabled={currentStage === 0}
              whileHover={currentStage > 0 ? { scale: 1.02, x: -2 } : {}}
              whileTap={currentStage > 0 ? { scale: 0.97 } : {}}
              className="px-5 py-2.5 rounded-lg border border-bm-warm/30 text-white font-cairo text-sm hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap"
            >
              السابق
            </motion.button>
            <motion.button
              onClick={handleNextStage}
              disabled={!isStageComplete}
              whileHover={isStageComplete ? { scale: 1.02, y: -2 } : {}}
              whileTap={isStageComplete ? { scale: 0.97 } : {}}
              animate={{
                boxShadow: isStageComplete
                  ? [
                      '0 0 0 0 rgba(215,50,46,0)',
                      '0 0 0 8px rgba(215,50,46,0.1)',
                      '0 0 0 0 rgba(215,50,46,0)',
                    ]
                  : '0 0 0 0 rgba(215,50,46,0)',
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="flex-1 bg-bm-red text-white font-cairo font-bold py-2.5 rounded-lg hover:bg-bm-red-dark transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {currentStage === stages.length - 1 ? 'إنهاء وعرض النتيجة' : 'المرحلة التالية'}
            </motion.button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}