import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, type BrandMap } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/feature/Navbar';
import { FadeInUp, StaggerContainer, StaggerItem, AnimatedProgress } from '@/components/animation/AnimationComponents';

const stageNames = ['السوق', 'الجمهور', 'القيمة', 'الشخصية', 'الرسالة', 'الهوية', 'الرؤية'];
const stageColors = ['#D7322E', '#2A4E86', '#C8922B', '#5B3A86', '#2E6F57', '#0E1116', '#8A8372'];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ar-SA', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [maps, setMaps] = useState<BrandMap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetchMaps();
  }, [user]);

  async function fetchMaps() {
    setLoading(true);
    setError('');
    const { data, error: fetchError } = await supabase
      .from('brand_maps')
      .select('*')
      .order('updated_at', { ascending: false });

    if (fetchError) {
      setError('فشل تحميل Brand Maps. حاول مرة أخرى.');
    } else {
      setMaps(data || []);
    }
    setLoading(false);
  }

  const filteredMaps = maps.filter((map) => {
    if (filter === 'all') return true;
    return map.status === filter;
  });

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('هل أنت متأكد من حذف هذا Brand Map؟')) return;
    const { error: deleteError } = await supabase.from('brand_maps').delete().eq('id', id);
    if (!deleteError) {
      setMaps((prev) => prev.filter((m) => m.id !== id));
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-bm-cream">
        <Navbar />
        <div className="pt-32 text-center">
          <p className="font-cairo text-bm-gray-gold text-lg">يرجى تسجيل الدخول أولاً</p>
          <Link to="/login" className="inline-block mt-4 px-6 py-2 bg-bm-red text-white font-cairo rounded-lg">تسجيل الدخول</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bm-cream">
      <Navbar />

      <main className="pt-20 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <FadeInUp>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <motion.h1 className="font-cairo font-bold text-2xl md:text-3xl text-bm-black" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                  لوحة التحكم
                </motion.h1>
                <p className="font-cairo text-bm-gray-gold text-sm mt-1">
                  إدارة مشاريع Brand Map الخاصة بك
                </p>
              </div>
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link to="/brand-map/new" className="inline-block bg-bm-red text-white font-cairo font-bold px-5 py-2.5 rounded-lg hover:bg-bm-red-dark transition-colors whitespace-nowrap text-sm">
                  <div className="inline-flex items-center gap-2">
                    <div className="w-5 h-5 flex items-center justify-center"><i className="ri-add-line" /></div>
                    Brand Map جديد
                  </div>
                </Link>
              </motion.div>
            </div>
          </FadeInUp>

          {/* Filters */}
          <motion.div className="flex gap-2 mb-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }}>
            {(['all', 'active', 'completed'] as const).map((f) => (
              <motion.button key={f} onClick={() => setFilter(f)} whileHover={{ scale: 1.05, y: -1 }} whileTap={{ scale: 0.95 }}
                animate={{ backgroundColor: filter === f ? '#0E1116' : 'transparent', color: filter === f ? '#FFFFFF' : undefined }}
                transition={{ duration: 0.2 }}
                className={`font-cairo text-sm px-4 py-2 rounded-lg transition-colors whitespace-nowrap border ${filter === f ? 'border-bm-black' : 'border-bm-warm/20 text-bm-gray-gold hover:text-bm-black'}`}>
                {f === 'all' ? 'الكل' : f === 'active' ? 'نشط' : 'مكتمل'}
              </motion.button>
            ))}
          </motion.div>

          {/* Error */}
          {error && (
            <motion.div className="bg-bm-red/10 border border-bm-red/30 rounded-lg p-4 mb-6 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="font-cairo text-bm-red text-sm">{error}</p>
            </motion.div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <motion.div className="w-10 h-10 border-2 border-bm-gold border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
            </div>
          )}

          {/* Maps Grid */}
          {!loading && (
            <AnimatePresence mode="wait">
              <motion.div key={filter} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <StaggerContainer staggerDelay={0.08}>
                  {filteredMaps.map((map, idx) => (
                    <StaggerItem key={map.id}>
                      <motion.div whileHover={{ y: -6, scale: 1.02 }} transition={{ duration: 0.25 }} className="relative">
                        <Link to={`/brand-map/${map.id}${map.mode === 'team' ? '/team' : ''}`} className="block bg-white rounded-xl p-5 border border-bm-warm/20 hover:border-bm-warm/50 transition-all">
                          <div className="flex items-center gap-2 mb-3">
                            <motion.div className="w-2 h-2 rounded-full" style={{ backgroundColor: stageColors[map.current_stage] || stageColors[0] }} animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3 }} />
                            <span className="font-cairo text-xs text-bm-gray-gold">
                              المرحلة {map.current_stage + 1}: {stageNames[map.current_stage] || 'السوق'}
                            </span>
                          </div>

                          <h3 className="font-cairo font-bold text-bm-black text-base mb-2">{map.name}</h3>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <motion.span className={`text-xs font-cairo px-2 py-1 rounded-full ${map.status === 'completed' ? 'bg-bm-green/10 text-bm-green' : 'bg-bm-blue/10 text-bm-blue'}`} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, delay: 0.1 + idx * 0.05 }}>
                                {map.status === 'completed' ? 'مكتمل' : 'نشط'}
                              </motion.span>
                              <span className="text-xs font-cairo text-bm-gray-gold">{map.mode === 'team' ? 'فريق' : 'فردي'}</span>
                            </div>
                            <span className="font-cairo text-xs text-bm-gray-gold">{formatDate(map.updated_at)}</span>
                          </div>

                          <div className="mt-3">
                            <AnimatedProgress value={map.current_stage + 1} max={7} color={stageColors[map.current_stage] || stageColors[0]} height={6} />
                          </div>
                        </Link>
                        <motion.button onClick={(e) => handleDelete(map.id, e)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="absolute top-3 left-3 w-7 h-7 flex items-center justify-center rounded-full bg-bm-red/10 hover:bg-bm-red/20 text-bm-red opacity-0 hover:opacity-100 transition-opacity z-10">
                          <i className="ri-delete-bin-line text-xs" />
                        </motion.button>
                      </motion.div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Empty state */}
          <AnimatePresence>
            {!loading && filteredMaps.length === 0 && (
              <motion.div className="text-center py-16" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                <motion.div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center" animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                  <i className="ri-map-line text-4xl text-bm-gray-gold/50" />
                </motion.div>
                <p className="font-cairo text-bm-gray-gold text-sm mb-4">
                  {maps.length === 0 ? 'لا توجد Brand Maps. ابدأ بإنشاء واحدة جديدة!' : 'لا توجد نتائج لهذا الفلتر'}
                </p>
                {maps.length === 0 && (
                  <Link to="/brand-map/new" className="inline-block bg-bm-red text-white font-cairo px-5 py-2.5 rounded-lg hover:bg-bm-red-dark transition-colors text-sm">
                    إنشاء Brand Map
                  </Link>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}