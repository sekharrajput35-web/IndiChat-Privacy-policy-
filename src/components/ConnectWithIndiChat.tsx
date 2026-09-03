import React from 'react';
import { ThemeMode } from '../types';
import { usePortal } from '../context/PortalContext';
import { SocialPlatformIcon } from './SocialIcons';
import { Share2, ExternalLink, ShieldCheck } from 'lucide-react';

interface ConnectWithIndiChatProps {
  theme: ThemeMode;
}

export const ConnectWithIndiChat: React.FC<ConnectWithIndiChatProps> = ({ theme }) => {
  const { socialLinks } = usePortal();

  // Filter only enabled links
  const enabledLinks = socialLinks.filter((link) => link.isEnabled);

  if (enabledLinks.length === 0) {
    return null;
  }

  // Get gradient background accents based on platform
  const getPlatformColors = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return {
          hoverBorder: 'hover:border-pink-500/60',
          hoverBg: 'hover:bg-gradient-to-br hover:from-pink-500/10 hover:via-purple-500/10 hover:to-amber-500/10',
          iconColor: 'text-pink-500 group-hover:text-pink-400',
          badgeBg: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
        };
      case 'facebook':
        return {
          hoverBorder: 'hover:border-blue-500/60',
          hoverBg: 'hover:bg-blue-500/10',
          iconColor: 'text-blue-500 group-hover:text-blue-400',
          badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        };
      case 'x':
      case 'twitter':
        return {
          hoverBorder: 'hover:border-slate-400/60',
          hoverBg: 'hover:bg-slate-500/10',
          iconColor: theme === 'dark' ? 'text-white' : 'text-slate-900',
          badgeBg: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
        };
      case 'youtube':
        return {
          hoverBorder: 'hover:border-red-500/60',
          hoverBg: 'hover:bg-red-500/10',
          iconColor: 'text-red-500 group-hover:text-red-400',
          badgeBg: 'bg-red-500/10 text-red-400 border-red-500/20',
        };
      case 'telegram':
        return {
          hoverBorder: 'hover:border-sky-500/60',
          hoverBg: 'hover:bg-sky-500/10',
          iconColor: 'text-sky-500 group-hover:text-sky-400',
          badgeBg: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
        };
      case 'linkedin':
        return {
          hoverBorder: 'hover:border-blue-600/60',
          hoverBg: 'hover:bg-blue-600/10',
          iconColor: 'text-blue-600 group-hover:text-blue-500',
          badgeBg: 'bg-blue-600/10 text-blue-400 border-blue-600/20',
        };
      case 'whatsapp':
        return {
          hoverBorder: 'hover:border-emerald-500/60',
          hoverBg: 'hover:bg-emerald-500/10',
          iconColor: 'text-emerald-500 group-hover:text-emerald-400',
          badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        };
      case 'discord':
        return {
          hoverBorder: 'hover:border-indigo-500/60',
          hoverBg: 'hover:bg-indigo-500/10',
          iconColor: 'text-indigo-500 group-hover:text-indigo-400',
          badgeBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
        };
      default:
        return {
          hoverBorder: 'hover:border-purple-500/60',
          hoverBg: 'hover:bg-purple-500/10',
          iconColor: 'text-purple-500 group-hover:text-purple-400',
          badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        };
    }
  };

  return (
    <section id="connect" className="py-20 sm:py-24 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 -left-28 w-80 h-80 bg-pink-500/10 dark:bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-28 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-purple-500/15 via-indigo-500/15 to-pink-500/15 border border-purple-500/30 text-purple-600 dark:text-purple-400 shadow-sm">
            <Share2 className="w-3.5 h-3.5" />
            <span>Official Social Channels</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            <span className={theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}>Connect With </span>
            <span className="bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 bg-clip-text text-transparent">
              IndiChat
            </span>
          </h2>

          <p
            className={`text-base sm:text-lg leading-relaxed max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Stay updated with product releases, security announcements, community showcases, and feature highlights
            across our official channels.
          </p>

          <div className="inline-flex items-center gap-2 text-xs font-mono-code text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>All links verified & secured by IndiChat Administration</span>
          </div>
        </div>

        {/* Dynamic Social Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {enabledLinks.map((link) => {
            const colors = getPlatformColors(link.platform);
            return (
              <a
                key={link.id}
                id={`social-link-${link.platform}`}
                href={link.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit IndiChat on ${link.platformName} (${link.handle || 'Official Profile'})`}
                className={`group relative p-5 sm:p-6 rounded-2xl sm:rounded-3xl border transition-all duration-300 transform hover:-translate-y-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 min-h-[48px] flex flex-col justify-between ${
                  colors.hoverBorder
                } ${colors.hoverBg} ${
                  theme === 'dark'
                    ? 'bg-[#0b0e18]/80 border-white/10 shadow-lg shadow-black/30'
                    : 'bg-white/90 border-slate-200 shadow-md shadow-slate-100'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  {/* Platform SVG Icon */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 shadow-md ${
                      theme === 'dark'
                        ? 'bg-white/5 border border-white/10'
                        : 'bg-slate-50 border border-slate-200'
                    }`}
                  >
                    <SocialPlatformIcon platform={link.platform} className={`w-6 h-6 ${colors.iconColor}`} />
                  </div>

                  {/* External Link Arrow Icon */}
                  <div
                    className={`p-2 rounded-xl transition-all duration-300 ${
                      theme === 'dark'
                        ? 'text-slate-400 group-hover:text-white group-hover:bg-white/10'
                        : 'text-slate-400 group-hover:text-slate-900 group-hover:bg-slate-100'
                    }`}
                  >
                    <ExternalLink className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>

                <div>
                  <h3
                    className={`font-display font-bold text-base sm:text-lg mb-1 transition-colors ${
                      theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                    }`}
                  >
                    {link.platformName}
                  </h3>
                  <p
                    className={`text-xs sm:text-sm font-mono-code truncate ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {link.handle || 'Official Channel'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 dark:border-white/5 flex items-center justify-between text-[11px] font-semibold">
                  <span className={`px-2 py-0.5 rounded-md border font-mono-code ${colors.badgeBg}`}>
                    Verified
                  </span>
                  <span
                    className={`transition-colors flex items-center gap-1 ${
                      theme === 'dark'
                        ? 'text-indigo-400 group-hover:text-indigo-300'
                        : 'text-indigo-600 group-hover:text-indigo-700'
                    }`}
                  >
                    Follow <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
