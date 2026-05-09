import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { stages, questions, maturityLevels } from '@/mocks/brandMapData';
import { mockTeamRoom, getVotesForCard, getMembersForCard, getConsensusForQuestion, getConsensusForStage } from '@/mocks/teamData';
import type { TeamMember, TeamVote } from '@/mocks/teamData';
import Navbar from '@/components/feature/Navbar';
import {
  FadeInUp,
  StaggerContainer,
  StaggerItem,
  AnimatedProgress,
  ActivityItem,
} from '@/components/animation/AnimationComponents';

interface SelectedCard {
  questionId: string;
  cardId: string;
  maturityLevel: number;
  customText?: string;
}

function Avatar({ member, size = 'sm' }: { member: TeamMember; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-12 h-12 text-sm',
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 border-2 border-white/20`}
      style={{ backgroundColor: member.color }}
      title={member.name}
      whileHover={{ scale: 1.15, zIndex: 10 }}
      transition={{ duration: 0.2 }}
    >
      {member.avatar}
    </motion.div>
  );
}

function StatusDot({ status }: { status: string }) {
  const colors = {
    online: 'bg-bm-green',
    away: 'bg-bm-orange',
    offline: 'bg-bm-gray-gold/40',
  };
  return (
    <motion.div
      className={`w-2 h-2 rounded-full ${colors[status as keyof typeof colors]} absolute bottom-0 right-0 border border-white`}
      animate={status === 'online' ? {
        scale: [1, 1.3, 1],
        opacity: [1, 0.7, 1],
      } : {}}
      transition={status === 'online' ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : {}}
    />
  );
}

export default function TeamRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState(mockTeamRoom.currentStage);
  const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([
    { questionId: '1.1', cardId: '1.1.specialized', maturityLevel: 4 },
    { questionId: '1.2', cardId: '1.2.medium', maturityLevel: 3 },
    { questionId: '1.3', cardId: '1.3.growth', maturityLevel: 5 },
  ]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showActivity, setShowActivity] = useState(false);
  const [activeVoteQuestion, setActiveVoteQuestion] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const room = mockTeamRoom;
  const stage = stages[currentStage];
  const stageQuestions = useMemo(() => questions.filter((q) => q.stageId === stage.id), [stage]);

  const handleCardSelect = (questionId: string, cardId: string) => {
    setSelectedCards((prev) => {
      const filtered = prev.filter((s) => s.questionId !== questionId);
      return [...filtered, { questionId, cardId, maturityLevel: 3 }];
    });
  };

  const handleVote = (questionId: string, cardId: string, vote: 'agree' | 'disagree' | 'neutral') => {
    setActiveVoteQuestion(null);
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(room.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const consensus = getConsensusForStage(stage.id, room.members, questions);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  const [direction, setDirection] = useState(1);

  const goStage = (index: number) => {
    setDirection(index > currentStage ? 1 : -1);
    setCurrentStage(index);
  };

  return (
    <div className="min-h-screen bg-bm-black">
      <Navbar />

      <main className="pt-16 pb-8 flex">
        {/* Sidebar - Team Members */}
        <AnimatePresence>
          {showSidebar && (
            <motion.aside
              className="w-64 bg-bm-black border-l border-bm-warm/10 flex-shrink-0 hidden lg:flex flex-col h-[calc(100vh-4rem)] sticky top-16"
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Room Header */}
              <div className="p-4 border-b border-bm-warm/10">
                <h2 className="font-cairo font-bold text-white text-sm truncate">{room.title}</h2>
                <p className="font-cairo text-white/40 text-xs mt-1">
                  غرفة فريق · {room.members.filter((m) => m.status === 'online').length} متصل
                </p>
              </div>

              {/* Invite Code */}
              <motion.div
                className="p-3 border-b border-bm-warm/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className="font-cairo text-white/40 text-[10px] mb-1">كود الدعوة</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-bm-warm/10 rounded px-2 py-1 font-mono text-bm-gold text-xs text-center">
                    {room.inviteCode}
                  </code>
                  <motion.button
                    onClick={copyInviteCode}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1.5 rounded hover:bg-white/5 transition-colors"
                    title="نسخ الكود"
                  >
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className={copied ? 'ri-check-line text-bm-green' : 'ri-file-copy-line text-white/50'} />
                    </div>
                  </motion.button>
                </div>
                <AnimatePresence>
                  {copied && (
                    <motion.p
                      className="font-cairo text-bm-green text-[10px] text-center mt-1"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                    >
                      تم النسخ!
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Members List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                <p className="font-cairo text-white/30 text-[10px] uppercase tracking-wider mb-2">
                  الأعضاء ({room.members.length})
                </p>
                <StaggerContainer staggerDelay={0.05}>
                  {room.members.map((member) => (
                    <StaggerItem key={member.id}>
                      <motion.div
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors"
                        whileHover={{ x: 4 }}
                      >
                        <div className="relative">
                          <Avatar member={member} size="sm" />
                          <StatusDot status={member.status} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-cairo text-white text-xs truncate">{member.name}</p>
                          <p className="font-cairo text-white/30 text-[10px]">
                            {member.role === 'owner' ? 'صاحب القرار' : member.role === 'facilitator' ? 'منشّط' : 'عضو'}
                          </p>
                        </div>
                        {member.selections.length > 0 && (
                          <motion.span
                            className="font-cairo text-bm-gold text-[10px]"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            {member.selections.length} اختيار
                          </motion.span>
                        )}
                      </motion.div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>

              {/* Stage Consensus */}
              <div className="p-3 border-t border-bm-warm/10">
                <p className="font-cairo text-white/40 text-[10px] mb-2">توافق المرحلة</p>
                <div className="flex items-center gap-2">
                  <AnimatedProgress
                    value={consensus.consensusCount}
                    max={consensus.total}
                    color="#2E6F57"
                    height={6}
                    className="flex-1"
                  />
                  <span className="font-cairo text-white/50 text-[10px]">
                    {consensus.consensusCount}/{consensus.total}
                  </span>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            {/* Mobile Header */}
            <div className="flex items-center justify-between mb-4 lg:hidden">
              <div>
                <h1 className="font-cairo font-bold text-white text-sm">{room.title}</h1>
                <p className="font-cairo text-white/40 text-xs">
                  المرحلة {currentStage + 1} من ٧ · {room.members.filter((m) => m.status === 'online').length} متصل
                </p>
              </div>
              <div className="flex gap-1">
                {room.members.slice(0, 3).map((m) => (
                  <motion.div key={m.id} className="relative -ml-1 first:ml-0" whileHover={{ scale: 1.1, zIndex: 10 }}>
                    <Avatar member={m} size="sm" />
                  </motion.div>
                ))}
                {room.members.length > 3 && (
                  <div className="w-7 h-7 rounded-full bg-bm-warm/20 flex items-center justify-center">
                    <span className="font-cairo text-white/50 text-[10px]">+{room.members.length - 3}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={() => setShowSidebar(!showSidebar)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <i className="ri-team-line text-white/50" />
                  </div>
                </motion.button>
                <div>
                  <h1 className="font-cairo font-bold text-white text-lg">{room.title}</h1>
                  <p className="font-cairo text-white/40 text-xs">
                    المرحلة {currentStage + 1} من ٧: {stage.nameAr}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Activity Toggle */}
                <motion.button
                  onClick={() => setShowActivity(!showActivity)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 rounded-lg transition-colors ${showActivity ? 'bg-bm-gold/20' : 'hover:bg-white/5'}`}
                >
                  <div className="w-5 h-5 flex items-center justify-center relative">
                    <i className="ri-notification-3-line text-white/50" />
                    {room.activity.length > 0 && (
                      <motion.span
                        className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-bm-red rounded-full text-[8px] text-white flex items-center justify-center"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        {room.activity.length}
                      </motion.span>
                    )}
                  </div>
                </motion.button>
                {/* Online avatars */}
                <div className="flex -space-x-2">
                  {room.members.filter((m) => m.status === 'online').map((m) => (
                    <div key={m.id} className="relative z-10 hover:z-20 transition-all">
                      <Avatar member={m} size="md" />
                    </div>
                  ))}
                </div>
                <motion.button
                  onClick={() => navigate(`/brand-map/${id}/output`)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-3 py-1.5 rounded-lg bg-bm-red text-white font-cairo text-xs hover:bg-bm-red-dark transition-colors whitespace-nowrap"
                >
                  النتيجة
                </motion.button>
              </div>
            </div>

            {/* Stage Tabs */}
            <div className="flex gap-1 overflow-x-auto pb-2 mb-4">
              {stages.map((s, index) => (
                <motion.button
                  key={s.id}
                  onClick={() => goStage(index)}
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    backgroundColor: index === currentStage ? s.color + '30' : 'transparent',
                    scale: index === currentStage ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                  className={`flex-shrink-0 px-3 py-2 rounded-lg font-cairo text-xs whitespace-nowrap ${
                    index === currentStage ? 'font-bold' : ''
                  }`}
                >
                  <span style={{ color: index <= currentStage ? s.color : undefined }}>{s.roman}</span>
                </motion.button>
              ))}
            </div>

            {/* Stage Header */}
            <motion.div
              className="rounded-xl p-4 md:p-5 mb-5 border"
              style={{ backgroundColor: stage.color + '08', borderColor: stage.color + '30' }}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: stage.color + '20' }}
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  <span className="font-playfair font-bold text-lg" style={{ color: stage.color }}>
                    {stage.roman}
                  </span>
                </motion.div>
                <div className="flex-1">
                  <h2 className="font-cairo font-bold text-white text-base">{stage.nameAr}</h2>
                  <p className="font-cairo text-white/40 text-xs">{stage.hint}</p>
                </div>
                {consensus.percentage > 0 && (
                  <motion.div className="text-center" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                    <p className="font-playfair font-bold text-bm-green text-lg">{consensus.percentage}%</p>
                    <p className="font-cairo text-white/30 text-[10px]">توافق</p>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Questions */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStage}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="space-y-5"
              >
                {stageQuestions.map((question, qIdx) => {
                  const selected = selectedCards.find((s) => s.questionId === question.id);
                  const questionConsensus = getConsensusForQuestion(question.id, room.members);
                  const cardMembers = question.type === 'single_choice' && selected
                    ? getMembersForCard(question.id, selected.cardId, room.members)
                    : [];

                  return (
                    <motion.div
                      key={question.id}
                      className="bg-bm-black/30 border border-bm-warm/10 rounded-xl p-4 md:p-5"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: qIdx * 0.08, duration: 0.4 }}
                      whileHover={{ borderColor: 'rgba(217,205,174,0.2)' }}
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
                          <h3 className="font-cairo font-bold text-white text-sm">{question.question}</h3>
                          <p className="font-cairo text-white/40 text-xs mt-1">{question.hint}</p>
                        </div>
                        {questionConsensus && (
                          <div className="text-right flex-shrink-0">
                            <motion.span
                              className={`font-cairo text-[10px] px-2 py-1 rounded-full ${
                                questionConsensus.isMajority
                                  ? 'bg-bm-green/20 text-bm-green'
                                  : 'bg-bm-orange/20 text-bm-orange'
                              }`}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 300 }}
                            >
                              {questionConsensus.percentage}% توافق
                            </motion.span>
                          </div>
                        )}
                      </div>

                      {/* Cards */}
                      {question.type === 'single_choice' && question.cards && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {question.cards.map((card) => {
                            const isSelected = selected?.cardId === card.id;
                            const votes = getVotesForCard(question.id, card.id, room.votes);
                            const cardVoters = getMembersForCard(question.id, card.id, room.members);

                            return (
                              <motion.button
                                key={card.id}
                                onClick={() => handleCardSelect(question.id, card.id)}
                                animate={{
                                  scale: isSelected ? 1.02 : 1,
                                  borderColor: isSelected ? 'rgba(200,146,43,0.5)' : 'rgba(217,205,174,0.15)',
                                  backgroundColor: isSelected ? 'rgba(200,146,43,0.08)' : 'rgba(14,17,22,0.2)',
                                }}
                                whileHover={{ scale: 1.01, y: -3 }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ duration: 0.25 }}
                                className="relative p-4 rounded-lg border text-right w-full"
                              >
                                {/* Vote count badge */}
                                <AnimatePresence>
                                  {votes.total > 0 && (
                                    <motion.div
                                      className="absolute top-2 left-2 flex items-center gap-1"
                                      initial={{ opacity: 0, scale: 0 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0 }}
                                    >
                                      <span className="font-cairo text-[10px] text-bm-green bg-bm-green/10 px-1.5 py-0.5 rounded">
                                        {votes.agree} موافق
                                      </span>
                                      {votes.disagree > 0 && (
                                        <span className="font-cairo text-[10px] text-bm-red bg-bm-red/10 px-1.5 py-0.5 rounded">
                                          {votes.disagree} معارض
                                        </span>
                                      )}
                                    </motion.div>
                                  )}
                                </AnimatePresence>

                                <div className="flex items-center gap-3 mb-2">
                                  <div
                                    className="w-8 h-8 rounded-md flex items-center justify-center"
                                    style={{ backgroundColor: stage.color + '15' }}
                                  >
                                    <div className="w-5 h-5 flex items-center justify-center">
                                      <i className={card.icon} style={{ color: stage.color, fontSize: '14px' }} />
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-cairo font-bold text-white text-sm">{card.titleAr}</h4>
                                    <p className="font-playfair italic text-white/30 text-xs">{card.titleEn}</p>
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

                                <p className="font-cairo text-white/50 text-xs leading-relaxed mb-3">
                                  {card.description}
                                </p>

                                {/* Member avatars */}
                                <AnimatePresence>
                                  {cardVoters.length > 0 && (
                                    <motion.div
                                      className="flex items-center gap-1 mb-2"
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                    >
                                      <span className="font-cairo text-white/30 text-[10px] ml-1">اختاره:</span>
                                      {cardVoters.map((m) => (
                                        <motion.div key={m.id} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
                                          <Avatar member={m} size="sm" />
                                        </motion.div>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>

                                {/* Vote button */}
                                <AnimatePresence>
                                  {isSelected && (
                                    <motion.div
                                      className="border-t border-bm-warm/10 pt-2 mt-2"
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="font-cairo text-white/40 text-[10px]">تصويتك:</span>
                                        <motion.button
                                          onClick={(e) => { e.stopPropagation(); handleVote(question.id, card.id, 'agree'); }}
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          className="px-2 py-1 rounded bg-bm-green/10 text-bm-green font-cairo text-[10px] hover:bg-bm-green/20 transition-colors"
                                        >
                                          موافق
                                        </motion.button>
                                        <motion.button
                                          onClick={(e) => { e.stopPropagation(); handleVote(question.id, card.id, 'disagree'); }}
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          className="px-2 py-1 rounded bg-bm-red/10 text-bm-red font-cairo text-[10px] hover:bg-bm-red/20 transition-colors"
                                        >
                                          غير موافق
                                        </motion.button>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.button>
                            );
                          })}
                        </div>
                      )}

                      {/* Open Text */}
                      {question.type === 'open_text' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                          <textarea
                            value={selected?.customText || ''}
                            onChange={(e) =>
                              setSelectedCards((prev) => {
                                const filtered = prev.filter((s) => s.questionId !== question.id);
                                return [...filtered, { questionId: question.id, cardId: 'open-text', maturityLevel: 3, customText: e.target.value }];
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
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <motion.div className="flex gap-3 mt-8 mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <motion.button
                onClick={() => {
                  setDirection(-1);
                  setCurrentStage((prev) => Math.max(0, prev - 1));
                }}
                disabled={currentStage === 0}
                whileHover={currentStage > 0 ? { scale: 1.02, x: -2 } : {}}
                whileTap={currentStage > 0 ? { scale: 0.97 } : {}}
                className="px-5 py-2.5 rounded-lg border border-bm-warm/30 text-white font-cairo text-sm hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap"
              >
                السابق
              </motion.button>
              <motion.button
                onClick={() => {
                  if (currentStage < stages.length - 1) {
                    setDirection(1);
                    setCurrentStage((prev) => prev + 1);
                  } else {
                    navigate(`/brand-map/${id}/output`);
                  }
                }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.97 }}
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(215,50,46,0)',
                    '0 0 0 8px rgba(215,50,46,0.1)',
                    '0 0 0 0 rgba(215,50,46,0)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="flex-1 bg-bm-red text-white font-cairo font-bold py-2.5 rounded-lg hover:bg-bm-red-dark transition-colors text-sm whitespace-nowrap"
              >
                {currentStage === stages.length - 1 ? 'إنهاء وعرض النتيجة' : 'المرحلة التالية'}
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Activity Panel */}
        <AnimatePresence>
          {showActivity && (
            <motion.aside
              className="w-72 bg-bm-black border-r border-bm-warm/10 flex-shrink-0 hidden lg:flex flex-col h-[calc(100vh-4rem)] sticky top-16"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="p-4 border-b border-bm-warm/10 flex items-center justify-between">
                <h3 className="font-cairo font-bold text-white text-sm">النشاط</h3>
                <motion.button
                  onClick={() => setShowActivity(false)}
                  whileHover={{ scale: 1.15, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1 rounded hover:bg-white/5 transition-colors"
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-close-line text-white/50" />
                  </div>
                </motion.button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {room.activity.map((act, idx) => (
                  <ActivityItem key={act.id} index={idx}>
                    <motion.div
                      className="flex gap-2"
                      whileHover={{ x: 4 }}
                    >
                      <motion.div
                        className="w-6 h-6 rounded-full bg-bm-warm/10 flex items-center justify-center flex-shrink-0 mt-0.5"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, delay: idx * 0.03 }}
                      >
                        {act.type === 'join' && <i className="ri-user-add-line text-bm-green text-xs" />}
                        {act.type === 'select' && <i className="ri-checkbox-circle-line text-bm-blue text-xs" />}
                        {act.type === 'vote' && <i className="ri-thumb-up-line text-bm-gold text-xs" />}
                        {act.type === 'conflict_detected' && <i className="ri-error-warning-line text-bm-red text-xs" />}
                        {act.type === 'stage_change' && <i className="ri-arrow-right-line text-bm-purple text-xs" />}
                        {act.type === 'maturity_set' && <i className="ri-bar-chart-line text-bm-orange text-xs" />}
                        {act.type === 'leave' && <i className="ri-user-unfollow-line text-bm-gray-gold text-xs" />}
                      </motion.div>
                      <div>
                        <p className="font-cairo text-white/70 text-xs leading-relaxed">
                          <span className="font-bold text-white">{act.userName}</span>{' '}
                          {act.message}
                        </p>
                        <p className="font-cairo text-white/30 text-[10px] mt-0.5">{act.timestamp}</p>
                      </div>
                    </motion.div>
                  </ActivityItem>
                ))}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}