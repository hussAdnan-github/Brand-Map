import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { stages } from '@/mocks/brandMapData';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import {
  FadeInUp,
  StaggerContainer,
  StaggerItem,
} from '@/components/animation/AnimationComponents';

export default function NewBrandMap() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [mode, setMode] = useState<'solo' | 'team'>('solo');
  const [step, setStep] = useState(1);
  const [inviteCode, setInviteCode] = useState('');
  const [createdMapId, setCreatedMapId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!title.trim() || !user) return;
    setLoading(true);
    setError('');

    const code = mode === 'team' ? `BRAND-${Math.random().toString(36).substring(2, 8).toUpperCase()}` : null;

    const { data, error: insertError } = await supabase
      .from('brand_maps')
      .insert({
        user_id: user.id,
        name: title.trim(),
        mode: mode === 'team' ? 'team' : 'individual',
        invite_code: code,
        status: 'active',
        current_stage: 0,
        total_stages: 7,
        progress_percent: 0,
        team_member_count: 1,
      })
      .select('id, invite_code')
      .single();

    if (insertError) {
      setError('فشل إنشاء Brand Map. حاول مرة أخرى.');
      setLoading(false);
      return;
    }

    if (data) {
      setCreatedMapId(data.id);
      if (code) {
        setInviteCode(code);
        setStep(3);
      } else {
        navigate(`/brand-map/${data.id}`);
      }
    }
    setLoading(false);
  };

  const goStep = (newStep: number) => {
    setStep(newStep);
  };

  return (
    <div className="min-h-screen bg-bm-black flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <motion.div className="text-center mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-bm-red rounded-lg flex items-center justify-center">
              <span className="text-white font-playfair font-bold text-xl">B</span>
            </div>
            <span className="font-cairo font-bold text-white text-xl">Brand Map</span>
          </Link>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div className="bg-bm-red/10 border border-bm-red/30 rounded-lg p-3 mb-4 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="font-cairo text-bm-red text-sm">{error}</p>
          </motion.div>
        )}

        {/* Progress */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {[1, 2, 3].map((s) => (
            <motion.div key={s} className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-cairo font-bold ${s <= step ? 'bg-bm-red text-white' : 'bg-bm-black border border-bm-warm/30 text-bm-gray-gold'}`}
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.3, delay: s * 0.1 }}>
              {s < step ? <motion.i className="ri-check-line" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }} /> : s}
            </motion.div>
          ))}
        </div>

        {/* Steps */}
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}>
            
            {/* Step 1 */}
            {step === 1 && (
              <motion.div className="bg-bm-black/50 border border-bm-gold/20 rounded-xl p-6 md:p-8">
                <h1 className="font-cairo font-bold text-white text-xl md:text-2xl text-center mb-2">Brand Map جديد</h1>
                <p className="font-cairo text-white/50 text-sm text-center mb-6">ابدأ رحلة بناء علامتك التجارية</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block font-cairo text-white/70 text-sm mb-2">اسم المشروع <span className="text-bm-red">*</span></label>
                    <motion.input type="text" value={title} onChange={(e) => setTitle(e.target.value)} whileFocus={{ scale: 1.01 }}
                      className="w-full bg-bm-black border border-bm-warm/30 rounded-lg px-4 py-3 font-cairo text-white text-sm focus:outline-none focus:border-bm-gold transition-colors" placeholder="مثال: براند شركة التقنية" />
                  </div>
                  <div>
                    <label className="block font-cairo text-white/70 text-sm mb-2">نمط العمل</label>
                    <div className="grid grid-cols-2 gap-3">
                      <motion.button onClick={() => setMode('solo')} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                        animate={{ borderColor: mode === 'solo' ? '#D7322E' : 'rgba(217,205,174,0.2)', backgroundColor: mode === 'solo' ? 'rgba(215,50,46,0.1)' : 'transparent' }}
                        transition={{ duration: 0.2 }} className="p-4 rounded-lg border text-center">
                        <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center"><i className={`ri-user-line text-xl ${mode === 'solo' ? 'text-bm-red' : 'text-bm-gray-gold'}`} /></div>
                        <p className={`font-cairo font-bold text-sm ${mode === 'solo' ? 'text-white' : 'text-bm-gray-gold'}`}>فردي</p>
                        <p className="font-cairo text-xs text-bm-gray-gold mt-1">للعمل بمفردك</p>
                      </motion.button>
                      <motion.button onClick={() => setMode('team')} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                        animate={{ borderColor: mode === 'team' ? '#2A4E86' : 'rgba(217,205,174,0.2)', backgroundColor: mode === 'team' ? 'rgba(42,78,134,0.1)' : 'transparent' }}
                        transition={{ duration: 0.2 }} className="p-4 rounded-lg border text-center">
                        <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center"><i className={`ri-team-line text-xl ${mode === 'team' ? 'text-bm-blue' : 'text-bm-gray-gold'}`} /></div>
                        <p className={`font-cairo font-bold text-sm ${mode === 'team' ? 'text-white' : 'text-bm-gray-gold'}`}>فريق</p>
                        <p className="font-cairo text-xs text-bm-gray-gold mt-1">مع فريق العمل</p>
                      </motion.button>
                    </div>
                  </div>
                </div>
                <motion.button onClick={() => goStep(2)} disabled={!title.trim()}
                  whileHover={title.trim() ? { scale: 1.02 } : {}} whileTap={title.trim() ? { scale: 0.97 } : {}}
                  className="w-full bg-bm-red text-white font-cairo font-bold py-3 rounded-lg hover:bg-bm-red-dark transition-colors text-sm mt-6 disabled:opacity-50 disabled:cursor-not-allowed">
                  التالي
                </motion.button>
              </motion.div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <motion.div className="bg-bm-black/50 border border-bm-gold/20 rounded-xl p-6 md:p-8">
                <h1 className="font-cairo font-bold text-white text-xl md:text-2xl text-center mb-2">مراجعة قبل البدء</h1>
                <p className="font-cairo text-white/50 text-sm text-center mb-6">هذه المراحل التي ستمر بها</p>
                <motion.div className={`flex items-center justify-center gap-2 mb-4 py-2 rounded-lg ${mode === 'team' ? 'bg-bm-blue/10' : 'bg-bm-green/10'}`}>
                  <div className="w-5 h-5 flex items-center justify-center"><i className={mode === 'team' ? 'ri-team-line text-bm-blue' : 'ri-user-line text-bm-green'} /></div>
                  <span className={`font-cairo text-sm font-bold ${mode === 'team' ? 'text-bm-blue' : 'text-bm-green'}`}>{mode === 'team' ? 'وضع الفريق' : 'وضع فردي'}</span>
                </motion.div>
                <StaggerContainer staggerDelay={0.06} className="space-y-2 mb-6">
                  {stages.map((stage) => (
                    <StaggerItem key={stage.id}>
                      <motion.div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: stage.color + '10' }} whileHover={{ scale: 1.02, x: 4 }}>
                        <div className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: stage.color + '20' }}>
                          <span className="font-playfair font-bold text-sm" style={{ color: stage.color }}>{stage.roman}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-cairo font-bold text-white text-sm">{stage.nameAr}</p>
                          <p className="font-cairo text-white/40 text-xs">{stage.cardCount} بطاقات</p>
                        </div>
                      </motion.div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
                <div className="flex gap-3">
                  <motion.button onClick={() => goStep(1)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="flex-1 border border-bm-warm/30 text-white font-cairo py-3 rounded-lg hover:bg-white/5 text-sm">رجوع</motion.button>
                  <motion.button onClick={handleCreate} disabled={loading} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.97 }}
                    className="flex-1 bg-bm-red text-white font-cairo font-bold py-3 rounded-lg hover:bg-bm-red-dark text-sm disabled:opacity-50">
                    {loading ? 'جاري الإنشاء...' : mode === 'team' ? 'إنشاء غرفة الفريق' : 'ابدأ Brand Map'}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Team */}
            {step === 3 && mode === 'team' && inviteCode && createdMapId && (
              <motion.div className="bg-bm-black/50 border border-bm-gold/20 rounded-xl p-6 md:p-8">
                <motion.div className="text-center mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="w-16 h-16 mx-auto mb-4 bg-bm-green/10 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 flex items-center justify-center"><i className="ri-team-line text-bm-green text-2xl" /></div>
                  </div>
                  <h1 className="font-cairo font-bold text-white text-xl mb-2">غرفة الفريق جاهزة!</h1>
                  <p className="font-cairo text-white/50 text-sm">شارك الكود مع فريقك للانضمام</p>
                </motion.div>
                <div className="bg-bm-warm/5 border border-bm-warm/20 rounded-xl p-4 mb-4">
                  <p className="font-cairo text-white/40 text-xs text-center mb-2">كود الدعوة</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-bm-black rounded-lg px-4 py-3 font-mono text-bm-gold text-lg text-center tracking-wider">{inviteCode}</code>
                    <button onClick={() => navigator.clipboard.writeText(inviteCode)} className="p-3 rounded-lg bg-bm-warm/10 hover:bg-bm-warm/20 transition-colors"><i className="ri-file-copy-line text-white/50" /></button>
                  </div>
                </div>
                <motion.button onClick={() => navigate(`/brand-map/${createdMapId}/team`)} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.97 }}
                  className="w-full bg-bm-red text-white font-cairo font-bold py-3 rounded-lg hover:bg-bm-red-dark text-sm">دخول الغرفة</motion.button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}