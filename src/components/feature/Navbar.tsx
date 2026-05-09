import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAuth = !!user;

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/pricing', label: t('nav.pricing') },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bm-black/95 backdrop-blur-sm">
      <div className="flex items-center justify-between h-16 px-4 md:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-bm-red rounded-md flex items-center justify-center">
            <span className="text-white font-playfair font-bold text-lg">B</span>
          </div>
          <span className="text-white font-cairo font-bold text-lg">Brand Map</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-cairo transition-colors whitespace-nowrap ${
                isActive(link.path) ? 'text-bm-red' : 'text-white/70 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuth ? (
            <>
              <Link
                to="/dashboard"
                className={`text-sm font-cairo transition-colors whitespace-nowrap ${
                  isActive('/dashboard') ? 'text-bm-red' : 'text-white/70 hover:text-white'
                }`}
              >
                {t('nav.dashboard')}
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-bm-gold/20 flex items-center justify-center">
                  <span className="font-cairo text-bm-gold text-xs font-bold">
                    {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </span>
                </div>
                <button
                  onClick={signOut}
                  className="text-sm font-cairo text-white/70 hover:text-white transition-colors whitespace-nowrap"
                >
                  {t('nav.logout')}
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-cairo text-white/70 hover:text-white transition-colors whitespace-nowrap"
              >
                {t('nav.login')}
              </Link>
              <Link
                to="/register"
                className="bg-bm-red text-white text-sm font-cairo font-semibold px-4 py-2 rounded-md hover:bg-bm-red-dark transition-colors whitespace-nowrap"
              >
                {t('nav.register')}
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <i className={`ri-${mobileOpen ? 'close' : 'menu'}-line text-xl`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-bm-black/95 border-t border-white/10 px-4 py-4">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`text-sm font-cairo py-2 ${
                  isActive(link.path) ? 'text-bm-red' : 'text-white/70'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-white/10 pt-3 flex flex-col gap-3">
              {isAuth ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="text-sm font-cairo text-white/70">
                    {t('nav.dashboard')}
                  </Link>
                  <button
                    onClick={() => { signOut(); setMobileOpen(false); }}
                    className="text-sm font-cairo text-white/70 text-right"
                  >
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm font-cairo text-white/70">
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="bg-bm-red text-white text-sm font-cairo font-semibold px-4 py-2 rounded-md text-center"
                  >
                    {t('nav.register')}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}