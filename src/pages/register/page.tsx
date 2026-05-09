import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('يرجى ملء الحقول المطلوبة');
      return;
    }
    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    setLoading(true);
    setError('');
    const { error: signUpError } = await signUp(email, password, name);
    if (signUpError) {
      setError(signUpError);
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-bm-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <motion.div className="text-center mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-bm-red rounded-lg flex items-center justify-center">
              <span className="text-white font-playfair font-bold text-xl">B</span>
            </div>
            <span className="font-cairo font-bold text-white text-xl">Brand Map</span>
          </Link>
        </motion.div>

        <motion.div className="bg-bm-black/50 border border-bm-gold/20 rounded-xl p-6 md:p-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <h1 className="font-cairo font-bold text-white text-xl md:text-2xl text-center mb-6">
            إنشاء حساب جديد
          </h1>

          {error && (
            <motion.div className="bg-bm-red/10 border border-bm-red/30 rounded-lg p-3 mb-4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <p className="font-cairo text-bm-red text-sm text-center">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-cairo text-white/70 text-sm mb-2">{t('form.name')} <span className="text-bm-red">*</span></label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-bm-black border border-bm-warm/30 rounded-lg px-4 py-3 font-cairo text-white text-sm focus:outline-none focus:border-bm-gold transition-colors" placeholder="اسمك الكامل" />
            </div>
            <div>
              <label className="block font-cairo text-white/70 text-sm mb-2">{t('form.email')} <span className="text-bm-red">*</span></label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-bm-black border border-bm-warm/30 rounded-lg px-4 py-3 font-cairo text-white text-sm focus:outline-none focus:border-bm-gold transition-colors" placeholder="example@company.com" dir="ltr" />
            </div>
            <div>
              <label className="block font-cairo text-white/70 text-sm mb-2">{t('form.password')} <span className="text-bm-red">*</span></label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-bm-black border border-bm-warm/30 rounded-lg px-4 py-3 font-cairo text-white text-sm focus:outline-none focus:border-bm-gold transition-colors" placeholder="••••••••" dir="ltr" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-bm-red text-white font-cairo font-bold py-3 rounded-lg hover:bg-bm-red-dark transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'جاري إنشاء الحساب...' : t('nav.register')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="font-cairo text-white/50 text-sm">
              لديك حساب بالفعل؟{' '}
              <Link to="/login" className="text-bm-gold hover:text-bm-gold/80 transition-colors">تسجيل الدخول</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}