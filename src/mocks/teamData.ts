export interface TeamMember {
  id: string;
  name: string;
  role: 'owner' | 'facilitator' | 'member';
  avatar: string;
  color: string;
  status: 'online' | 'away' | 'offline';
  joinedAt: string;
  selections: TeamSelection[];
}

export interface TeamSelection {
  questionId: string;
  cardId: string;
  maturityLevel: number;
  customText?: string;
  selectedAt: string;
}

export interface TeamVote {
  questionId: string;
  cardId: string;
  voterId: string;
  voterName: string;
  vote: 'agree' | 'disagree' | 'neutral';
  comment?: string;
  votedAt: string;
}

export interface ActivityItem {
  id: string;
  type: 'select' | 'vote' | 'join' | 'leave' | 'stage_change' | 'conflict_detected' | 'maturity_set';
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
  metadata?: {
    questionId?: string;
    cardTitle?: string;
    stageName?: string;
  };
}

export interface TeamRoom {
  id: string;
  brandMapId: string;
  title: string;
  mode: 'team';
  inviteCode: string;
  members: TeamMember[];
  currentStage: number;
  isLocked: boolean;
  createdAt: string;
  activity: ActivityItem[];
  votes: TeamVote[];
}

const memberColors = [
  '#D7322E', '#2A4E86', '#C8922B', '#5B3A86', '#2E6F57', '#8B6914', '#6B8E23', '#CD5C5C'
];

export const mockTeamMembers: TeamMember[] = [
  {
    id: 'user-1',
    name: 'أحمد المدير',
    role: 'owner',
    avatar: 'AM',
    color: memberColors[0],
    status: 'online',
    joinedAt: '٢٠٢٦/٠٥/٠٨ ١٠:٠٠',
    selections: [
      { questionId: '1.1', cardId: '1.1.specialized', maturityLevel: 4, selectedAt: '٢٠٢٦/٠٥/٠٨ ١٠:١٥' },
      { questionId: '2.1', cardId: '2.1.millennial', maturityLevel: 4, selectedAt: '٢٠٢٦/٠٥/٠٨ ١٠:٣٠' },
    ],
  },
  {
    id: 'user-2',
    name: 'سارة المصممة',
    role: 'facilitator',
    avatar: 'SM',
    color: memberColors[1],
    status: 'online',
    joinedAt: '٢٠٢٦/٠٥/٠٨ ١٠:٠٥',
    selections: [
      { questionId: '1.1', cardId: '1.1.luxury', maturityLevel: 3, selectedAt: '٢٠٢٦/٠٥/٠٨ ١٠:٢٠' },
      { questionId: '2.1', cardId: '2.1.gen_z', maturityLevel: 5, selectedAt: '٢٠٢٦/٠٥/٠٨ ١٠:٣٥' },
    ],
  },
  {
    id: 'user-3',
    name: 'محمد التسويق',
    role: 'member',
    avatar: 'MT',
    color: memberColors[2],
    status: 'online',
    joinedAt: '٢٠٢٦/٠٥/٠٨ ١٠:١٠',
    selections: [
      { questionId: '1.1', cardId: '1.1.specialized', maturityLevel: 5, selectedAt: '٢٠٢٦/٠٥/٠٨ ١٠:٢٥' },
    ],
  },
  {
    id: 'user-4',
    name: 'ليلى الاستراتيجية',
    role: 'member',
    avatar: 'LA',
    color: memberColors[3],
    status: 'away',
    joinedAt: '٢٠٢٦/٠٥/٠٨ ١٠:١٢',
    selections: [],
  },
  {
    id: 'user-5',
    name: 'خالد المحتوى',
    role: 'member',
    avatar: 'KM',
    color: memberColors[4],
    status: 'offline',
    joinedAt: '٢٠٢٦/٠٥/٠٨ ١٠:٢٠',
    selections: [],
  },
];

export const mockTeamRoom: TeamRoom = {
  id: 'team-1',
  brandMapId: 'bm-1',
  title: 'براند شركة التقنية',
  mode: 'team',
  inviteCode: 'BRAND-2026-XYZ',
  members: mockTeamMembers,
  currentStage: 1,
  isLocked: false,
  createdAt: '٢٠٢٦/٠٥/٠٨',
  activity: [
    {
      id: 'act-1',
      type: 'join',
      userId: 'user-2',
      userName: 'سارة المصممة',
      message: 'انضمت إلى الغرفة كمنشّط',
      timestamp: 'منذ ٤٥ دقيقة',
      metadata: { stageName: 'السوق والبيئة' },
    },
    {
      id: 'act-2',
      type: 'select',
      userId: 'user-1',
      userName: 'أحمد المدير',
      message: 'اختار "منتج متخصّص"',
      timestamp: 'منذ ٣٠ دقيقة',
      metadata: { questionId: '1.1', cardTitle: 'منتج متخصّص' },
    },
    {
      id: 'act-3',
      type: 'select',
      userId: 'user-2',
      userName: 'سارة المصممة',
      message: 'اختارت "منتج فاخر"',
      timestamp: 'منذ ٢٥ دقيقة',
      metadata: { questionId: '1.1', cardTitle: 'منتج فاخر' },
    },
    {
      id: 'act-4',
      type: 'conflict_detected',
      userId: 'system',
      userName: 'النظام',
      message: 'تعارض مكتشف: المدير اختار متخصّص والمصممة اختارت فاخر!',
      timestamp: 'منذ ٢٥ دقيقة',
      metadata: { stageName: 'السوق والبيئة' },
    },
    {
      id: 'act-5',
      type: 'vote',
      userId: 'user-3',
      userName: 'محمد التسويق',
      message: 'صوّت لـ"منتج متخصّص"',
      timestamp: 'منذ ٢٠ دقيقة',
      metadata: { questionId: '1.1', cardTitle: 'منتج متخصّص' },
    },
    {
      id: 'act-6',
      type: 'stage_change',
      userId: 'user-1',
      userName: 'أحمد المدير',
      message: 'انتقل إلى المرحلة الثانية',
      timestamp: 'منذ ١٥ دقيقة',
      metadata: { stageName: 'الجمهور المستهدف' },
    },
    {
      id: 'act-7',
      type: 'maturity_set',
      userId: 'user-3',
      userName: 'محمد التسويق',
      message: 'حدّد مستوى الثقة: ٥/٥',
      timestamp: 'منذ ١٠ دقائق',
      metadata: { questionId: '1.1' },
    },
    {
      id: 'act-8',
      type: 'join',
      userId: 'user-5',
      userName: 'خالد المحتوى',
      message: 'انضم إلى الغرفة',
      timestamp: 'منذ ٥ دقائق',
    },
  ],
  votes: [
    { questionId: '1.1', cardId: '1.1.specialized', voterId: 'user-1', voterName: 'أحمد المدير', vote: 'agree', comment: 'الأنسب لسوقنا', votedAt: '٢٠٢٦/٠٥/٠٨ ١٠:١٥' },
    { questionId: '1.1', cardId: '1.1.specialized', voterId: 'user-3', voterName: 'محمد التسويق', vote: 'agree', comment: 'أتفق تماماً', votedAt: '٢٠٢٦/٠٥/٠٨ ١٠:٢٥' },
    { questionId: '1.1', cardId: '1.1.luxury', voterId: 'user-2', voterName: 'سارة المصممة', vote: 'disagree', comment: 'سعرنا لا يسمح', votedAt: '٢٠٢٦/٠٥/٠٨ ١٠:٢٠' },
  ],
};

export function getVotesForCard(questionId: string, cardId: string, votes: TeamVote[]): {
  agree: number;
  disagree: number;
  neutral: number;
  total: number;
  comments: { name: string; comment: string; vote: string }[];
} {
  const cardVotes = votes.filter((v) => v.questionId === questionId && v.cardId === cardId);
  return {
    agree: cardVotes.filter((v) => v.vote === 'agree').length,
    disagree: cardVotes.filter((v) => v.vote === 'disagree').length,
    neutral: cardVotes.filter((v) => v.vote === 'neutral').length,
    total: cardVotes.length,
    comments: cardVotes.map((v) => ({ name: v.voterName, comment: v.comment || '', vote: v.vote })),
  };
}

export function getMembersForCard(questionId: string, cardId: string, members: TeamMember[]): TeamMember[] {
  return members.filter((m) => m.selections.some((s) => s.questionId === questionId && s.cardId === cardId));
}

export function getConsensusForQuestion(questionId: string, members: TeamMember[]): {
  cardId: string;
  count: number;
  percentage: number;
  isMajority: boolean;
} | null {
  const selections = members.flatMap((m) => m.selections.filter((s) => s.questionId === questionId));
  if (selections.length === 0) return null;

  const counts: Record<string, number> = {};
  selections.forEach((s) => {
    counts[s.cardId] = (counts[s.cardId] || 0) + 1;
  });

  const total = selections.length;
  const entries = Object.entries(counts);
  entries.sort((a, b) => b[1] - a[1]);

  const [topCardId, topCount] = entries[0];
  return {
    cardId: topCardId,
    count: topCount,
    percentage: Math.round((topCount / total) * 100),
    isMajority: topCount > total / 2,
  };
}

export function getConsensusForStage(stageId: number, members: TeamMember[], allQuestions: { id: string; stageId: number }[]): {
  completed: number;
  total: number;
  consensusCount: number;
  percentage: number;
} {
  const stageQuestions = allQuestions.filter((q) => q.stageId === stageId);
  const total = stageQuestions.length;
  let completed = 0;
  let consensusCount = 0;

  stageQuestions.forEach((q) => {
    const consensus = getConsensusForQuestion(q.id, members);
    if (consensus) {
      completed++;
      if (consensus.isMajority) consensusCount++;
    }
  });

  return { completed, total, consensusCount, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
}