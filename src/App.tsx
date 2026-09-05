import React, { useState, useEffect } from 'react';
import { ThemeMode, SecurityCardItem } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PrivacyAtAGlance } from './components/PrivacyAtAGlance';
import { InformationWeCollect } from './components/InformationWeCollect';
import { SecuritySection } from './components/SecuritySection';
import { PrivacyControlsDemo } from './components/PrivacyControlsDemo';
import { PrivacyCenterDashboard } from './components/PrivacyCenterDashboard';
import { TransparencyTimeline } from './components/TransparencyTimeline';
import { PrivacyPolicyAccordion } from './components/PrivacyPolicyAccordion';
import { FAQSection } from './components/FAQSection';
import { ConnectWithIndiChat } from './components/ConnectWithIndiChat';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { Modals } from './components/Modals';
import { LanguageModal } from './components/LanguageModal';

// Auth Modals & Admin Views
import { UserLoginModal } from './components/UserLoginModal';
import { UserRegisterModal } from './components/UserRegisterModal';
import { InstallApkModal } from './components/InstallApkModal';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { authStorage } from './services/api';

type AppView = 'public' | 'admin-login' | 'admin-dashboard';

// Helper to detect user's device system theme preference
const getSystemTheme = (): ThemeMode => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark';
};

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>(getSystemTheme);
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Automatically detect and react to device light/dark mode changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(mediaQuery.matches ? 'dark' : 'light');

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
      return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleSystemThemeChange);
      return () => mediaQuery.removeListener(handleSystemThemeChange);
    }
  }, []);

  // Navigation & Authentication View State
  const [currentView, setCurrentView] = useState<AppView>('public');
  const [showUserLoginModal, setShowUserLoginModal] = useState<boolean>(false);
  const [showUserRegisterModal, setShowUserRegisterModal] = useState<boolean>(false);
  const [showInstallApkModal, setShowInstallApkModal] = useState<boolean>(false);

  // Existing Modal states
  const [selectedSecurityCard, setSelectedSecurityCard] = useState<SecurityCardItem | null>(null);
  const [showExploreModal, setShowExploreModal] = useState<boolean>(false);
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
  const [showContactModal, setShowContactModal] = useState<boolean>(false);

  // Check URL path or hash on load
  useEffect(() => {
    const handleUrlRouting = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;

      if (path === '/admin/dashboard' || hash === '#/admin/dashboard' || hash === '#admin/dashboard') {
        if (authStorage.getAdminToken()) {
          setCurrentView('admin-dashboard');
        } else {
          setCurrentView('admin-login');
        }
      } else if (
        path === '/admin' ||
        path === '/admin/login' ||
        hash === '#admin' ||
        hash === '#admin-login' ||
        hash === '#/admin/login'
      ) {
        if (authStorage.getAdminToken()) {
          setCurrentView('admin-dashboard');
        } else {
          setCurrentView('admin-login');
        }
      } else {
        setCurrentView('public');
      }
    };

    handleUrlRouting();
    window.addEventListener('popstate', handleUrlRouting);
    return () => window.removeEventListener('popstate', handleUrlRouting);
  }, []);

  // Synchronize document & body background color with theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.className =
        'bg-[#07090e] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-300';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.className =
        'bg-[#f8fafc] text-slate-800 antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-300';
    }
  }, [theme]);

  // Track active section for navigation highlighting
  useEffect(() => {
    if (currentView !== 'public') return;

    const sections = [
      'hero',
      'privacy-overview',
      'information-collected',
      'security',
      'privacy-controls',
      'privacy-center',
      'transparency',
      'privacy-policy',
      'faq',
      'connect',
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            if (sections[i] === 'information-collected') {
              setActiveSection('privacy-overview');
            } else {
              setActiveSection(sections[i]);
            }
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  const handleNavigateToPolicy = () => {
    const el = document.getElementById('privacy-policy');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Navigation helpers for Admin
  const navigateToAdminLogin = () => {
    if (authStorage.getAdminToken()) {
      window.history.pushState(null, '', '/admin/dashboard');
      setCurrentView('admin-dashboard');
    } else {
      window.history.pushState(null, '', '/admin/login');
      setCurrentView('admin-login');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAdminDashboard = () => {
    window.history.pushState(null, '', '/admin/dashboard');
    setCurrentView('admin-dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToPublicHome = () => {
    window.history.pushState(null, '', '/');
    setCurrentView('public');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If currently in Admin Dashboard view
  if (currentView === 'admin-dashboard') {
    return (
      <AdminDashboard
        theme={theme}
        onNavigateHome={navigateToPublicHome}
        onAdminLogout={() => {
          authStorage.clearAdminToken();
          navigateToPublicHome();
        }}
      />
    );
  }

  // If currently in Admin Login view
  if (currentView === 'admin-login') {
    return (
      <AdminLogin
        theme={theme}
        onLoginSuccess={navigateToAdminDashboard}
        onNavigateHome={navigateToPublicHome}
      />
    );
  }

  // Public Website View
  return (
    <div
      id="indichat-app-root"
      className={`min-h-screen transition-colors duration-500 relative overflow-hidden ${
        theme === 'dark'
          ? 'bg-[#07090e] text-slate-100 aurora-bg-dark'
          : 'bg-[#f8fafc] text-slate-900 aurora-bg-light'
      }`}
    >
      {/* Dynamic Colorful Ambient Lighting Layer */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {theme === 'dark' ? (
          <>
            <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] animate-pulse" />
            <div className="absolute top-1/3 -right-32 w-[550px] h-[550px] bg-pink-600/12 rounded-full blur-[150px]" />
            <div className="absolute top-2/3 -left-32 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[160px]" />
            <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-cyan-600/12 rounded-full blur-[140px]" />
          </>
        ) : (
          <>
            <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-indigo-200/40 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute top-1/3 -right-32 w-[550px] h-[550px] bg-pink-200/40 rounded-full blur-[130px]" />
            <div className="absolute top-2/3 -left-32 w-[600px] h-[600px] bg-purple-200/35 rounded-full blur-[140px]" />
            <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-emerald-200/35 rounded-full blur-[120px]" />
          </>
        )}
      </div>

      {/* 1. Sticky Navigation Bar with 3-Option Hamburger Menu */}
      <Navbar
        theme={theme}
        activeSection={activeSection}
        onOpenLogin={() => setShowUserLoginModal(true)}
        onOpenRegister={() => setShowUserRegisterModal(true)}
        onOpenAdminLogin={navigateToAdminLogin}
        onOpenInstallApk={() => setShowInstallApkModal(true)}
      />

      <main className="relative">
        {/* 2. Hero Section */}
        <HeroSection
          theme={theme}
          onOpenInstallApk={() => setShowInstallApkModal(true)}
        />

        {/* 3. Privacy At A Glance (4 Animated Cards) */}
        <PrivacyAtAGlance theme={theme} />

        {/* 4. Information We Collect (3 Cards & Message Banner) */}
        <InformationWeCollect theme={theme} />

        {/* 5. Security Section (Flow Diagram & 6 Cards) */}
        <SecuritySection
          theme={theme}
          onOpenSecurityModal={(item) => setSelectedSecurityCard(item)}
        />

        {/* 6. Private Mode and User Control (Public, Private, Custom Interactive Demo) */}
        <PrivacyControlsDemo theme={theme} />

        {/* 7. Privacy Center (Dashboard with 5 Interactive Cards) */}
        <PrivacyCenterDashboard theme={theme} />

        {/* 8. Transparency Section (5-Step Animated Timeline) */}
        <TransparencyTimeline theme={theme} />

        {/* 9. Privacy Policy (9 Long-Form Accordion Sections) */}
        <PrivacyPolicyAccordion theme={theme} />

        {/* 10. FAQ Section (7 Questions with Single-Open Accordion) */}
        <FAQSection theme={theme} />

        {/* 11. Connect With IndiChat (Dynamic Social Media Section) */}
        <ConnectWithIndiChat theme={theme} />

        {/* 12. Final Call To Action */}
        <FinalCTA
          theme={theme}
          onExploreClick={() => setShowExploreModal(true)}
          onOpenInstallApk={() => setShowInstallApkModal(true)}
        />
      </main>

      {/* 13. Footer */}
      <Footer
        theme={theme}
        onOpenTerms={() => setShowTermsModal(true)}
        onOpenContact={() => setShowContactModal(true)}
        onOpenAdminLogin={navigateToAdminLogin}
        onOpenInstallApk={() => setShowInstallApkModal(true)}
      />

      {/* Existing Security & Privacy Modals */}
      <Modals
        theme={theme}
        securityModalItem={selectedSecurityCard}
        onCloseSecurityModal={() => setSelectedSecurityCard(null)}
        showExploreModal={showExploreModal}
        onCloseExploreModal={() => setShowExploreModal(false)}
        showTermsModal={showTermsModal}
        onCloseTermsModal={() => setShowTermsModal(false)}
        showContactModal={showContactModal}
        onCloseContactModal={() => setShowContactModal(false)}
        onNavigateToPolicy={handleNavigateToPolicy}
      />

      {/* User Login Modal */}
      <UserLoginModal
        isOpen={showUserLoginModal}
        onClose={() => setShowUserLoginModal(false)}
        onOpenRegister={() => {
          setShowUserLoginModal(false);
          setShowUserRegisterModal(true);
        }}
        theme={theme}
      />

      {/* User Registration Modal */}
      <UserRegisterModal
        isOpen={showUserRegisterModal}
        onClose={() => setShowUserRegisterModal(false)}
        onOpenLogin={() => {
          setShowUserRegisterModal(false);
          setShowUserLoginModal(true);
        }}
        theme={theme}
      />

      {/* Install Android APK Modal */}
      <InstallApkModal
        isOpen={showInstallApkModal}
        onClose={() => setShowInstallApkModal(false)}
      />

      {/* Multilingual Language Modal (All Indian & Foreign Languages) */}
      <LanguageModal theme={theme} />
    </div>
  );
}
