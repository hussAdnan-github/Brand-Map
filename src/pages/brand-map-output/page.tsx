import { useParams, useNavigate } from 'react-router-dom';
import { useState, useMemo, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { stages, questions } from '@/mocks/brandMapData';
import Navbar from '@/components/feature/Navbar';
import { FadeInUp, StaggerContainer, StaggerItem, CountUp } from '@/components/animation/AnimationComponents';

interface SelectedCard {
  questionId: string;
  cardId: string;
  maturityLevel: number;
  customText?: string;
}

const mockSelectedCards: SelectedCard[] = [
  { questionId: '1.1', cardId: '1.1.specialized', maturityLevel: 4 },
  { questionId: '1.2', cardId: '1.2.medium', maturityLevel: 3 },
  { questionId: '1.3', cardId: '1.3.growth', maturityLevel: 5 },
  { questionId: '1.4', cardId: 'open-text', maturityLevel: 3, customText: 'تحوّل رقمي كبير في سلوك المستهلك نحو التسوق الإلكتروني والتوصيل السريع' },
  { questionId: '2.1', cardId: '2.1.millennial', maturityLevel: 4 },
  { questionId: '2.2', cardId: '2.2.upper', maturityLevel: 3 },
  { questionId: '2.3', cardId: 'open-text', maturityLevel: 3, customText: 'صعوبة العثور على منتجات عالية الجودة بتصميم عصري وبأسعار معقولة' },
  { questionId: '3.1', cardId: '3.1.product', maturityLevel: 5 },
  { questionId: '3.2', cardId: 'open-text', maturityLevel: 4, customText: 'الجودة العالية مقابل السعر المنافس، مع التصميم المبتكر الذي يتحدّث عن نفسه' },
  { questionId: '4.1', cardId: '4.1.friendly', maturityLevel: 3 },
  { questionId: '4.2', cardId: '4.2.balanced', maturityLevel: 4 },
  { questionId: '5.1', cardId: 'open-text', maturityLevel: 4, customText: 'نساعد المحترفين الشباب على التألّق بمنتجات عالية الجودة بتصاميم عصرية وبأسعار معقولة' },
  { questionId: '5.2', cardId: 'open-text', maturityLevel: 5, customText: 'تألّق بأسلوبك الخاص' },
  { questionId: '6.1', cardId: '6.1.minimal', maturityLevel: 4 },
  { questionId: '6.2', cardId: '6.2.combo', maturityLevel: 3 },
  { questionId: '7.1', cardId: 'open-text', maturityLevel: 4, customText: 'أن نكون البراند الرائد في مجال التصاميم المهنية الشبابية في المنطقة خلال ٣ سنوات' },
];

interface ConflictItem {
  id: string;
  conflict: string;
  decision: 'adjust' | 'accept';
  justification: string;
}

interface ResearchItem {
  id: string;
  decision: string;
  method: string;
  deadline: string;
}

interface PriorityItem {
  id: string;
  text: string;
}

const mockConflicts: ConflictItem[] = [
  { id: '1', conflict: 'قيادة المنتج × سوق متوسّط المنافسة', decision: 'accept', justification: 'المنافسة المتوسّطة تسمح بفرصة للتميّز بالمنتج دون سعر خيالي' },
  { id: '2', conflict: 'جيل الألفية × نبرة ودودة', decision: 'accept', justification: 'الجيل يقدّر الودّ في التعامل مع العلامات التجارية' },
];

const mockResearch: ResearchItem[] = [
  { id: '1', decision: 'قيادة المنتج', method: 'استبيان ٥٠ عميل محتمل عن احتياجاتهم التصميمية', deadline: '٢٠٢٦/٠٦/١٥' },
  { id: '2', decision: 'تصميم بصري بسيط', method: 'تجربة A/B لثلاثة اتجاهات بصريّة مختلفة', deadline: '٢٠٢٦/٠٥/٣٠' },
];

const mockPriorities: PriorityItem[] = [
  { id: '1', text: 'تطوير تصاميم المنتجات الأساسية واختبارها مع ٢٠ عميل' },
  { id: '2', text: 'بناء قاعدة بيانات ١٠٠ عميل محتمل عبر التسويق الرقمي' },
  { id: '3', text: 'تصميم الهوية البصرية وشعار البراند' },
];

function getCardData(questionId: string, cardId: string) {
  const q = questions.find((q2) => q2.id === questionId);
  if (!q || cardId === 'open-text') return null;
  return q.cards?.find((c) => c.id === cardId) || null;
}

function StageBox({ stage, index }: { stage: (typeof stages)[0]; index: number }) {
  const stageQuestions = questions.filter((q) => q.stageId === stage.id);
  const selections = stageQuestions.map((q) => {
    const sel = mockSelectedCards.find((s) => s.questionId === q.id);
    if (!sel) return null;
    if (q.type === 'open_text') {
      return { type: 'open' as const, text: sel.customText || '', question: q.question };
    }
    const card = getCardData(q.id, sel.cardId);
    return card ? { type: 'card' as const, card, maturity: sel.maturityLevel, question: q.question } : null;
  }).filter(Boolean);

  const avgMaturity = selections.length > 0
    ? Math.round(selections.reduce((sum, s) => sum + (s?.type === 'card' ? s.maturity : 3), 0) / selections.length)
    : 0;

  return (
    <motion.div
      className="relative bg-white rounded-lg border overflow-hidden flex flex-col h-full print:break-inside-avoid"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, scale: 1.02 }}
    >
      <div className="h-6 flex items-center px-2 gap-1.5" style={{ backgroundColor: stage.color }}>
        <span className="font-playfair font-bold text-white text-[10px] leading-none">{stage.roman}</span>
        <span className="font-cairo text-white text-[10px] leading-none truncate">{stage.nameAr}</span>
      </div>

      <div className="flex-1 p-2 space-y-1.5 min-h-0">
        {selections.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <span className="font-cairo text-bm-gray-gold/40 text-xs">لا توجد اختيارات</span>
          </div>
        ) : (
          selections.map((sel, idx) => (
            <motion.div
              key={idx}
              className="text-right"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.05 }}
            >
              {sel?.type === 'card' ? (
                <>
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                      <i className={sel.card.icon} style={{ color: stage.color, fontSize: '11px' }} />
                    </div>
                    <span className="font-cairo font-bold text-bm-black text-[11px] leading-tight truncate">{sel.card.titleAr}</span>
                  </div>
                  <p className="font-cairo text-bm-gray-gold text-[10px] leading-tight mt-0.5 line-clamp-2">{sel.card.description}</p>
                </>
              ) : (
                <>
                  <p className="font-cairo text-bm-black text-[11px] font-bold leading-tight">{sel?.question}</p>
                  <p className="font-cairo text-bm-gray-gold text-[10px] leading-tight mt-0.5 line-clamp-3">{sel?.text}</p>
                </>
              )}
            </motion.div>
          ))
        )}
      </div>

      <div className="px-2 pb-1.5">
        <div className="flex items-center justify-between">
          <span className="font-cairo text-[8px] text-bm-gray-gold">مستوى الثقة</span>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full border"
                style={{ borderColor: stage.color }}
                initial={{ scale: 0 }}
                animate={{ scale: 1, backgroundColor: i < avgMaturity ? stage.color : 'transparent' }}
                transition={{ delay: 0.3 + i * 0.06, duration: 0.2 }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="px-2 pb-1 flex justify-center">
        <div className="w-4 h-4 flex items-center justify-center opacity-20">
          <i className={stage.icon} style={{ color: stage.color, fontSize: '10px' }} />
        </div>
      </div>
    </motion.div>
  );
}

export default function BrandMapOutput() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'pdf' | 'print' | null>(null);
  const pdfContentRef = useRef<HTMLDivElement>(null);

  const gridPositions = [
    { row: 1, col: 4, stage: stages[0] },
    { row: 1, col: 3, stage: stages[1] },
    { row: 1, col: 2, stage: stages[2] },
    { row: 1, col: 1, stage: stages[3] },
    { row: 2, col: 4, stage: stages[4] },
    { row: 2, col: 3, stage: stages[5] },
    { row: 2, col: 2, stage: stages[6] },
  ];

  const handleExportPDF = useCallback(async () => {
    if (!pdfContentRef.current || isExporting) return;
    setIsExporting(true);
    setExportType('pdf');

    try {
      const jsPDF = (window as unknown as { jspdf: { jsPDF: typeof import('jspdf').jsPDF } }).jspdf.jsPDF;
      const element = pdfContentRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#F5F0E0',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 8;
      const contentWidth = pdfWidth - margin * 2;

      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * contentWidth) / imgProps.width;

      let heightLeft = imgHeight;
      let position = margin;

      pdf.addImage(imgData, 'PNG', margin, position, contentWidth, imgHeight);
      heightLeft -= (pdfHeight - margin * 2);

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + margin;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', margin, position, contentWidth, imgHeight);
        heightLeft -= (pdfHeight - margin * 2);
      }

      pdf.save(`BrandMap-Output-${id || '1'}.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  }, [id, isExporting]);

  const handlePrint = useCallback(() => {
    setIsExporting(true);
    setExportType('print');
    setTimeout(() => {
      window.print();
      setIsExporting(false);
      setExportType(null);
    }, 300);
  }, []);

  const totalMaturity = useMemo(() => {
    const allMaturities = mockSelectedCards.map((s) => s.maturityLevel);
    return Math.round(allMaturities.reduce((a, b) => a + b, 0) / allMaturities.length);
  }, []);

  const completedStages = useMemo(() => {
    return stages.filter((s) => {
      const stageQs = questions.filter((q) => q.stageId === s.id);
      return stageQs.every((q) => mockSelectedCards.some((sel) => sel.questionId === q.id));
    }).length;
  }, []);

  return (
    <div className="min-h-screen bg-bm-cream">
      <Navbar />

      <main className="pt-20 pb-8 px-4 md:px-8 print:pt-0 print:pb-0 print:px-0">
        <div className="max-w-5xl mx-auto">
          {/* Actions bar */}
          <FadeInUp>
            <div className="flex items-center justify-between mb-6 print:hidden">
              <div>
                <motion.h1
                  className="font-cairo font-bold text-bm-black text-xl md:text-2xl"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Output Map
                </motion.h1>
                <p className="font-cairo text-bm-gray-gold text-sm mt-1">
                  براند شركة التقنية · خريطة البراند الاستراتيجية
                </p>
              </div>
              <div className="flex gap-2 flex-wrap justify-end">
                <motion.button
                  onClick={() => navigate(`/brand-map/${id}`)}
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-4 py-2 rounded-lg border border-bm-warm/30 font-cairo text-sm text-bm-black hover:bg-bm-warm/10 transition-colors whitespace-nowrap"
                >
                  العودة للتعديل
                </motion.button>
                <motion.button
                  onClick={handlePrint}
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-4 py-2 rounded-lg border border-bm-warm/40 text-bm-black font-cairo text-sm hover:bg-bm-warm/10 transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-printer-line" />
                  </div>
                  طباعة
                </motion.button>
                <motion.button
                  onClick={handleExportPDF}
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  animate={{
                    boxShadow: [
                      '0 0 0 0 rgba(200,146,43,0)',
                      '0 0 0 6px rgba(200,146,43,0.12)',
                      '0 0 0 0 rgba(200,146,43,0)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="px-4 py-2 rounded-lg bg-bm-gold text-white font-cairo text-sm hover:bg-bm-gold/80 transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-file-pdf-line" />
                  </div>
                  تصدير PDF
                </motion.button>
              </div>
            </div>
          </FadeInUp>

          {/* PDF Content — captured for export */}
          <div ref={pdfContentRef} className="bg-bm-cream">
            {/* Progress summary */}
            <motion.div
              className="bg-white rounded-xl border border-bm-warm/20 p-4 md:p-6 mb-6 print:mb-4 print:shadow-none print:border-bm-warm/40"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex flex-wrap items-center gap-4 md:gap-8">
                <motion.div className="text-center" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                  <p className="font-playfair font-bold text-2xl text-bm-black">
                    <CountUp value={completedStages} duration={1.2} />
                  </p>
                  <p className="font-cairo text-bm-gray-gold text-xs">مراحل مكتملة</p>
                </motion.div>
                <motion.div className="text-center" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
                  <p className="font-playfair font-bold text-2xl text-bm-black">
                    <CountUp value={mockSelectedCards.length} duration={1.2} />
                  </p>
                  <p className="font-cairo text-bm-gray-gold text-xs">قرار استراتيجي</p>
                </motion.div>
                <motion.div className="text-center" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
                  <p className="font-playfair font-bold text-2xl text-bm-black">
                    <CountUp value={totalMaturity} duration={1.2} />/5
                  </p>
                  <p className="font-cairo text-bm-gray-gold text-xs">متوسط الثقة</p>
                </motion.div>
                <div className="flex-1 min-w-[200px]">
                  <div className="flex justify-between mb-1">
                    <span className="font-cairo text-xs text-bm-gray-gold">تقدّم البراند</span>
                    <span className="font-cairo text-xs font-bold text-bm-black">
                      {Math.round((completedStages / 7) * 100)}%
                    </span>
                  </div>
                  <motion.div
                    className="h-2 bg-bm-warm/20 rounded-full overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.div
                      className="h-full rounded-full bg-bm-gold"
                      initial={{ width: 0 }}
                      animate={{ width: `${(completedStages / 7) * 100}%` }}
                      transition={{ duration: 1.2, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Stage Grid */}
            <div className="mb-6 print:mb-4">
              <h2 className="font-cairo font-bold text-bm-black text-base mb-3 print:hidden">المراحل السبع</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 print:grid-cols-4 print:gap-2">
                {gridPositions.map((pos, idx) => (
                  <StageBox key={pos.stage.id} stage={pos.stage} index={idx} />
                ))}
                <motion.div
                  className="bg-bm-black rounded-lg border border-bm-warm/20 p-3 flex flex-col items-center justify-center min-h-[180px] print:min-h-[140px] print:break-inside-avoid"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.div
                    className="w-8 h-8 flex items-center justify-center mb-2"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <i className="ri-lock-line text-bm-warm text-lg" />
                  </motion.div>
                  <p className="font-cairo text-bm-warm text-xs text-center">⚐ سرّ النسخة</p>
                  <p className="font-cairo text-bm-warm/50 text-[10px] text-center mt-1">محفوظ للمنشّط</p>
                </motion.div>
              </div>
            </div>

            {/* Three Horizontal Cards */}
            <StaggerContainer staggerDelay={0.15} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 print:mb-4 print:grid-cols-3 print:gap-2">
              <StaggerItem>
                <motion.div
                  className="bg-bm-red-dark/5 border border-bm-red-dark/20 rounded-xl p-4 print:p-3 print:break-inside-avoid"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ y: -3 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <i className="ri-error-warning-line text-bm-red-dark" />
                    </div>
                    <h3 className="font-cairo font-bold text-bm-red-dark text-sm">التعارضات والقرارات الواعية</h3>
                  </div>
                  <div className="space-y-3">
                    {mockConflicts.map((conflict, idx) => (
                      <motion.div
                        key={conflict.id}
                        className="border-b border-bm-warm/10 pb-2 last:border-0 last:pb-0"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + idx * 0.08 }}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="font-cairo text-bm-gray-gold text-[10px]">{idx + 1}.</span>
                          <p className="font-cairo text-bm-black text-xs">{conflict.conflict}</p>
                        </div>
                        <div className="flex items-center gap-3 mr-4">
                          <label className="flex items-center gap-1">
                            <input type="radio" name={`conflict-${conflict.id}`} checked={conflict.decision === 'adjust'} readOnly className="accent-bm-red" />
                            <span className="font-cairo text-[10px] text-bm-gray-gold">تعديل</span>
                          </label>
                          <label className="flex items-center gap-1">
                            <input type="radio" name={`conflict-${conflict.id}`} checked={conflict.decision === 'accept'} readOnly className="accent-bm-red" />
                            <span className="font-cairo text-[10px] text-bm-gray-gold">قبول</span>
                          </label>
                        </div>
                        {conflict.justification && (
                          <p className="font-cairo text-bm-gray-gold text-[10px] mr-4 mt-1 leading-relaxed">
                            التبرير: {conflict.justification}
                          </p>
                        )}
                      </motion.div>
                    ))}
                    {Array.from({ length: Math.max(0, 4 - mockConflicts.length) }).map((_, i) => (
                      <div key={`empty-c-${i}`} className="border-b border-bm-warm/10 pb-2">
                        <p className="font-cairo text-bm-warm/30 text-xs">{mockConflicts.length + i + 1}. التعارض: ____________</p>
                        <div className="flex items-center gap-3 mr-4 mt-1">
                          <span className="font-cairo text-bm-warm/20 text-[10px]">[ ] تعديل</span>
                          <span className="font-cairo text-bm-warm/20 text-[10px]">[ ] قبول مع تبرير</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </StaggerItem>

              <StaggerItem>
                <motion.div
                  className="bg-bm-gold/5 border border-bm-gold/20 rounded-xl p-4 print:p-3 print:break-inside-avoid"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -3 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <i className="ri-search-line text-bm-gold" />
                    </div>
                    <h3 className="font-cairo font-bold text-bm-gold text-sm">ما يحتاج بحثاً وتحقّقاً</h3>
                  </div>
                  <div className="space-y-3">
                    {mockResearch.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        className="border-b border-bm-warm/10 pb-2 last:border-0 last:pb-0"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + idx * 0.08 }}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="font-cairo text-bm-gray-gold text-[10px]">{idx + 1}.</span>
                          <p className="font-cairo text-bm-black text-xs font-bold">{item.decision}</p>
                        </div>
                        <p className="font-cairo text-bm-gray-gold text-[10px] mr-4">كيف نتحقّق: {item.method}</p>
                        <p className="font-cairo text-bm-gray-gold text-[10px] mr-4">موعد: {item.deadline}</p>
                      </motion.div>
                    ))}
                    {Array.from({ length: Math.max(0, 4 - mockResearch.length) }).map((_, i) => (
                      <div key={`empty-r-${i}`} className="border-b border-bm-warm/10 pb-2">
                        <p className="font-cairo text-bm-warm/30 text-xs">{mockResearch.length + i + 1}. القرار: ____________</p>
                        <p className="font-cairo text-bm-warm/20 text-[10px] mr-4 mt-1">كيف نتحقّق: ____________</p>
                        <p className="font-cairo text-bm-warm/20 text-[10px] mr-4">موعد: __/__/____</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </StaggerItem>

              <StaggerItem>
                <motion.div
                  className="bg-bm-green/5 border border-bm-green/20 rounded-xl p-4 print:p-3 print:break-inside-avoid"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ y: -3 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <i className="ri-focus-3-line text-bm-green" />
                    </div>
                    <h3 className="font-cairo font-bold text-bm-green text-sm">الأولويّات الـ٣٠ يوماً القادمة</h3>
                  </div>
                  <div className="space-y-3">
                    {mockPriorities.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        className="border-b border-bm-warm/10 pb-2 last:border-0 last:pb-0"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + idx * 0.08 }}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="font-cairo text-bm-gray-gold text-[10px]">{idx + 1}.</span>
                          <p className="font-cairo text-bm-black text-xs">{item.text}</p>
                        </div>
                      </motion.div>
                    ))}
                    {Array.from({ length: Math.max(0, 3 - mockPriorities.length) }).map((_, i) => (
                      <div key={`empty-p-${i}`} className="border-b border-bm-warm/10 pb-2">
                        <p className="font-cairo text-bm-warm/30 text-xs">{mockPriorities.length + i + 1}. الأولويّة {mockPriorities.length + i + 1}: ____________</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </StaggerItem>
            </StaggerContainer>

            {/* Signatures */}
            <motion.div
              className="bg-white rounded-xl border border-bm-warm/20 p-4 md:p-6 mb-6 print:mb-4 print:break-inside-avoid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <h2 className="font-cairo font-bold text-bm-black text-sm mb-4 print:hidden">التوقيعات والاعتماد</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="font-cairo font-bold text-bm-black text-xs mb-3">صاحب القرار / Decision Maker</p>
                  <div className="border-b-2 border-bm-warm/40 h-12 mb-2" />
                  <p className="font-cairo text-bm-gray-gold text-xs mb-1">الاسم: __________________</p>
                  <p className="font-cairo text-bm-gray-gold text-xs">التاريخ: ___/___/________</p>
                </div>
                <div className="text-center">
                  <p className="font-cairo font-bold text-bm-black text-xs mb-3">المنشّط / Facilitator</p>
                  <div className="border-b-2 border-bm-warm/40 h-12 mb-2" />
                  <p className="font-cairo text-bm-gray-gold text-xs mb-1">الاسم: __________________</p>
                  <p className="font-cairo text-bm-gray-gold text-xs">التاريخ: ___/___/________</p>
                  <p className="font-cairo text-bm-warm/50 text-[10px] mt-1">(في حالة اللعب الفرديّ، يُترك فارغاً)</p>
                </div>
                <div className="flex items-center justify-center">
                  <motion.div
                    className="w-24 h-24 rounded-full border-[3px] border-bm-red flex items-center justify-center relative"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                  >
                    <div className="absolute inset-2 rounded-full border border-bm-red/30" />
                    <div className="text-center">
                      <div className="w-6 h-6 mx-auto mb-1 flex items-center justify-center">
                        <i className="ri-check-line text-bm-red text-xl" />
                      </div>
                      <p className="font-playfair text-[8px] text-bm-red leading-tight">APPROVED</p>
                      <p className="font-playfair text-[7px] text-bm-red/70 leading-tight">FOR EXECUTION</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Footer */}
            <motion.div
              className="flex flex-col md:flex-row items-center justify-between gap-3 py-3 border-t border-bm-warm/20 print:mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center gap-1">
                {stages.map((s) => (
                  <motion.div
                    key={s.id}
                    className="w-4 h-4 rounded-sm"
                    style={{ backgroundColor: s.color }}
                    title={s.nameAr}
                    whileHover={{ scale: 1.3, rotate: 10 }}
                  />
                ))}
              </div>
              <p className="font-playfair italic text-bm-gray-gold/50 text-xs">BRAND MAP · OUTPUT v1.0</p>
              <p className="font-cairo text-bm-gray-gold/50 text-xs">#1 of 5</p>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Export overlay */}
      {isExporting && (
        <div className="fixed inset-0 bg-white/90 z-50 flex items-center justify-center print:hidden">
          <motion.div className="text-center" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <motion.div
              className="w-12 h-12 mx-auto mb-4 border-2 border-bm-gold border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className="font-cairo text-bm-black text-lg font-bold">
              {exportType === 'pdf' ? 'جاري تصدير PDF...' : 'جاري التحضير للطباعة...'}
            </p>
            <p className="font-cairo text-bm-gray-gold text-sm mt-2">
              {exportType === 'pdf' ? 'قد يستغرق بضع ثوانٍ' : 'يرجى الانتظار'}
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}