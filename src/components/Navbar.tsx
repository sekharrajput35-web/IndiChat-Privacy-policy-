import React, { useState, useEffect } from 'react';
import { ThemeMode } from '../types';
import { usePortal } from '../context/PortalContext';
import { BrandLogo } from './BrandLogo';
import {
  Shield,
  Lock,
  Menu,
  X,
  Sun,
  Moon,
  LogIn,
  UserPlus,
  ShieldCheck,
  ArrowRight,
  LogOut,
  User,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Smartphone,
  Download,
} from 'lucide-react';

interface NavbarProps {
  theme: ThemeMode;
  toggleTheme: () => void;
  activeSection: string;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenAdminLogin: () => void;
  onOpenInstallApk?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  toggleTheme,
  activeSection,
  onOpenLogin,
  onOpenRegister,
  onOpenAdminLogin,
  onOpenInstallApk,
}) => {
  const { currentUser, setCurrentUser, registrationLink, apkConfig } = usePortal();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#hero', id: 'hero' },
    { name: 'Privacy', href: '#privacy-overview', id: 'privacy-overview' },
    { name: 'Security', href: '#security', id: 'security' },
    { name: 'Your Control', href: '#privacy-controls', id: 'privacy-controls' },
    { name: 'Transparency', href: '#transparency', id: 'transparency' },
    { name: 'Connect', href: '#connect', id: 'connect' },
    { name: 'FAQ', href: '#faq', id: 'faq' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegisterClick = () => {
    setIsMenuOpen(false);
    if (registrationLink.isEnabled && registrationLink.destinationUrl) {
      if (registrationLink.openInNewTab) {
        window.open(registrationLink.destinationUrl, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = registrationLink.destinationUrl;
      }
    } else {
      onOpenRegister();
    }
  };

  const isApkVisible = apkConfig.displayStatus
    ? apkConfig.displayStatus !== 'hidden'
    : apkConfig.directDownloadEnabled;

  return (
    <>
      <header
        id="indichat-navbar"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? theme === 'dark'
              ? 'bg-[#07090e]/85 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-indigo-950/20'
              : 'bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-md shadow-slate-300/30'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* LEFT: Logo & Brand */}
            <button
              id="nav-brand-logo"
              onClick={handleLogoClick}
              className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl p-1"
              aria-label="IndiChat Home"
            >
              <BrandLogo size="md" showTagline={false} />
            </button>

            {/* CENTER: Desktop Quick Section Links */}
            <nav
              className={`hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full backdrop-blur-md ${
                theme === 'dark'
                  ? 'bg-white/[0.03] border border-white/[0.06]'
                  : 'bg-slate-100/80 border border-slate-200/80 shadow-sm'
              }`}
            >
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.name}
                    id={`nav-link-${item.id}`}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`relative px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-white bg-indigo-600 border border-indigo-400/40 shadow-sm shadow-indigo-500/30'
                        : theme === 'dark'
                        ? 'text-slate-300 hover:text-white hover:bg-white/5'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    {item.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-pink-400 shadow-[0_0_8px_rgba(244,114,182,0.8)]" />
                    )}
                  </a>
                );
              })}
            </nav>

            {/* RIGHT: Action Controls & Three-Line Hamburger Button */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Quick Theme Toggle */}
              <button
                id="theme-toggle-button"
                onClick={toggleTheme}
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 flex items-center justify-center ${
                  theme === 'dark'
                    ? 'border-white/10 bg-white/5 text-amber-300 hover:bg-white/10 hover:text-amber-200'
                    : 'border-slate-300 bg-slate-100 text-indigo-700 hover:bg-slate-200'
                }`}
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Desktop quick login/register buttons for convenience */}
              <div className="hidden sm:flex items-center gap-2">
                {currentUser ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-xs font-semibold text-indigo-400">
                    <User className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[100px]">{currentUser.fullName}</span>
                  </div>
                ) : (
                  <button
                    id="btn-nav-desktop-login"
                    onClick={onOpenLogin}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                      theme === 'dark'
                        ? 'border-white/10 hover:bg-white/10 text-slate-200'
                        : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    Login
                  </button>
                )}

                <button
                  id="btn-nav-desktop-register"
                  onClick={handleRegisterClick}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 transition-all shadow-md shadow-indigo-600/30"
                >
                  {registrationLink.isEnabled ? 'Join Portal' : 'Register'}
                </button>

                {/* Direct Install APK Button */}
                {isApkVisible && (
                  <button
                    id="btn-nav-desktop-install-apk"
                    onClick={() => {
                      if (onOpenInstallApk) {
                        onOpenInstallApk();
                      } else {
                        window.location.href = '/api/apk/download';
                      }
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-300 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/30 transition-all transform hover:-translate-y-0.5 active:scale-95"
                    title={`Download & Install ${apkConfig.fileName}`}
                  >
                    <Smartphone className="w-3.5 h-3.5 text-white" />
                    <span>Install APK</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-mono text-white">
                      {apkConfig.versionName}
                    </span>
                  </button>
                )}
              </div>

              {/* THREE-LINE HAMBURGER MENU BUTTON */}
              <button
                id="three-line-hamburger-btn"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`relative w-11 h-11 rounded-2xl border flex items-center justify-center transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  isMenuOpen
                    ? 'border-indigo-500/50 bg-indigo-600/20 text-indigo-400'
                    : theme === 'dark'
                    ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:border-white/20'
                    : 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                aria-label="Toggle main menu"
                aria-expanded={isMenuOpen}
              >
                {/* Custom animated 3-line icon or X */}
                {isMenuOpen ? (
                  <X className="w-5 h-5 text-indigo-400 transform rotate-90 transition-transform duration-300" />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-1.5 w-5 h-5">
                    <span className="w-5 h-[2px] rounded-full bg-current transform transition-all duration-200" />
                    <span className="w-3.5 h-[2px] rounded-full bg-current transform transition-all duration-200 self-start" />
                    <span className="w-5 h-[2px] rounded-full bg-current transform transition-all duration-200" />
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* PREMIUM ANIMATED SIDE MENU / DROPDOWN MENU */}
      {isMenuOpen && (
        <div
          id="menu-backdrop-overlay"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            id="premium-animated-side-menu"
            onClick={(e) => e.stopPropagation()}
            className={`fixed top-0 right-0 bottom-0 w-full max-w-md p-6 sm:p-8 flex flex-col justify-between border-l shadow-2xl transition-transform duration-300 ease-out transform animate-in slide-in-from-right overflow-y-auto ${
              theme === 'dark'
                ? 'bg-[#0b0e18]/95 border-white/10 text-white shadow-indigo-950/60'
                : 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-400/40'
            }`}
          >
            {/* Top Bar of Drawer: Title & Close Button */}
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/10 dark:border-white/10 mb-6">
                <BrandLogo size="md" showTagline={false} />

                <button
                  id="btn-close-hamburger-menu"
                  onClick={() => setIsMenuOpen(false)}
                  className={`p-2.5 rounded-full border transition-colors ${
                    theme === 'dark'
                      ? 'border-white/10 hover:bg-white/10 text-slate-400 hover:text-white'
                      : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                  }`}
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* USER STATUS IF LOGGED IN */}
              {currentUser && (
                <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-pink-500/10 border border-indigo-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                      {currentUser.fullName.charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs font-bold block">{currentUser.fullName}</span>
                      <span className="text-[11px] text-slate-400 font-mono-code">
                        {currentUser.email}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentUser(null);
                      setIsMenuOpen(false);
                    }}
                    className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                    title="Sign Out"
                    aria-label="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* PRIMARY OPTIONS */}
              <div className="space-y-2.5">
                {/* Option 1: Login */}
                <button
                  id="menu-opt-login"
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenLogin();
                  }}
                  className={`w-full group p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between text-left active:scale-[0.99] ${
                    theme === 'dark'
                      ? 'bg-[#0f1424] hover:bg-white/5 border-white/10 hover:border-indigo-500/50'
                      : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-indigo-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
                      <LogIn className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm group-hover:text-indigo-400 transition-colors">
                        Login
                      </h4>
                      <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        Access your account
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                </button>

                {/* Option 2: Register */}
                <button
                  id="menu-opt-register"
                  type="button"
                  onClick={handleRegisterClick}
                  className={`w-full group p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between text-left active:scale-[0.99] ${
                    theme === 'dark'
                      ? 'bg-[#0f1424] hover:bg-white/5 border-white/10 hover:border-pink-500/50'
                      : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-pink-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center text-white shadow-sm">
                      <UserPlus className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm group-hover:text-pink-400 transition-colors">
                        Register
                      </h4>
                      <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        Create a new account
                      </p>
                    </div>
                  </div>
                  {registrationLink.isEnabled ? (
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-pink-400 transition-all" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-pink-400 group-hover:translate-x-0.5 transition-all" />
                  )}
                </button>

                {/* Option 3: Admin Login */}
                <button
                  id="menu-opt-admin-login"
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenAdminLogin();
                  }}
                  className={`w-full group p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between text-left active:scale-[0.99] ${
                    theme === 'dark'
                      ? 'bg-[#0f1424] hover:bg-white/5 border-white/10 hover:border-emerald-500/50'
                      : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-emerald-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 to-emerald-600 flex items-center justify-center text-white shadow-sm">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm group-hover:text-emerald-400 transition-colors">
                        Admin Login
                      </h4>
                      <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        Manage site and portal settings
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                </button>

                {/* Option 4: Install Android APK */}
                {isApkVisible && (
                  <button
                    id="menu-opt-install-apk"
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      if (onOpenInstallApk) {
                        onOpenInstallApk();
                      } else {
                        window.location.href = '/api/apk/download';
                      }
                    }}
                    className={`w-full group p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between text-left active:scale-[0.99] ${
                      theme === 'dark'
                        ? 'bg-[#0f1424] hover:bg-emerald-950/20 border-emerald-500/30'
                        : 'bg-emerald-50/40 hover:bg-emerald-50 border-emerald-200 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-sm">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-emerald-600 dark:text-emerald-400">
                          Install APK ({apkConfig.versionName})
                        </h4>
                        <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          Direct Android package download
                        </p>
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-emerald-500" />
                  </button>
                )}
              </div>

              {/* Quick Section Navigation */}
              <div className="mt-6 pt-5 border-t border-white/10 dark:border-white/10">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                  Navigation
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {navItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                        activeSection === item.id
                          ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                          : theme === 'dark'
                          ? 'text-slate-300 hover:bg-white/5'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{item.name}</span>
                      <ChevronRight className="w-3 h-3 text-slate-500" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Footer Info */}
            <div className="pt-4 border-t border-white/10 dark:border-white/10 text-center">
              <span className="text-xs text-slate-400 font-mono-code">
                © 2026 IndiChat
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
