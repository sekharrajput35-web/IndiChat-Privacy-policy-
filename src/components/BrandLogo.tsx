import React, { useState } from 'react';
import { Shield, Lock, MessageSquare, Sparkles, Radio, KeyRound, CheckCircle2 } from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { WebsiteLogoConfig, LogoIconDesign, LogoIconGradient, LogoShape } from '../types';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  customHeightPx?: number;
  showText?: boolean;
  showTagline?: boolean;
  overrideLogo?: Partial<WebsiteLogoConfig>;
  className?: string;
  textClassName?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  customHeightPx,
  showText = true,
  showTagline = false,
  overrideLogo,
  className = '',
  textClassName = '',
  onClick,
}) => {
  const { logoConfig } = usePortal();
  const [imageFailed, setImageFailed] = useState(false);

  // Merge context logo with any live override (useful in Admin preview)
  const activeLogo: WebsiteLogoConfig = {
    ...logoConfig,
    ...(overrideLogo || {}),
  };

  // Dimensions
  const sizeMap = {
    sm: { iconBox: 'w-7 h-7', iconSize: 15, text: 'text-base', subText: 'text-[9px]', height: 28 },
    md: { iconBox: 'w-9 h-9', iconSize: 20, text: 'text-xl', subText: 'text-[10px]', height: 38 },
    lg: { iconBox: 'w-11 h-11', iconSize: 24, text: 'text-2xl', subText: 'text-xs', height: 44 },
    xl: { iconBox: 'w-14 h-14', iconSize: 30, text: 'text-3xl', subText: 'text-xs', height: 56 },
  };

  const currentSize = sizeMap[size];
  const targetHeight = customHeightPx || activeLogo.heightPx || currentSize.height;

  // Shape classes
  const getShapeClass = (shape: LogoShape) => {
    switch (shape) {
      case 'circle':
        return 'rounded-full';
      case 'square':
        return 'rounded-none';
      case 'glow':
        return 'rounded-xl ring-2 ring-indigo-500/40 shadow-lg shadow-indigo-500/25';
      case 'rounded':
      default:
        return 'rounded-xl';
    }
  };

  // Gradient classes
  const getGradientClass = (gradient: LogoIconGradient) => {
    switch (gradient) {
      case 'purple_cyan':
        return 'bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-cyan-400 text-white';
      case 'emerald_teal':
        return 'bg-gradient-to-tr from-emerald-500 to-teal-600 text-white';
      case 'sunset_amber':
        return 'bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 text-white';
      case 'electric_blue':
        return 'bg-gradient-to-tr from-blue-600 to-indigo-700 text-white';
      case 'monochrome':
        return 'bg-slate-900 text-white dark:bg-white dark:text-slate-900';
      case 'indigo_pink':
      default:
        return 'bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white';
    }
  };

  // Render Icon according to design
  const renderDesignIcon = (design: LogoIconDesign, iconSize: number) => {
    switch (design) {
      case 'chat_bubble':
        return (
          <div className="relative flex items-center justify-center">
            <MessageSquare size={iconSize} className="stroke-[2.2]" />
            <Sparkles size={Math.round(iconSize * 0.5)} className="absolute -top-1 -right-1 text-amber-300 fill-amber-300" />
          </div>
        );
      case 'lotus_sparkle':
        return (
          <div className="relative flex items-center justify-center">
            <Sparkles size={iconSize} className="stroke-[2.2]" />
          </div>
        );
      case 'radar_privacy':
        return (
          <div className="relative flex items-center justify-center">
            <Radio size={iconSize} className="stroke-[2.2]" />
          </div>
        );
      case 'key_shield':
        return (
          <div className="relative flex items-center justify-center">
            <KeyRound size={iconSize} className="stroke-[2.2]" />
          </div>
        );
      case 'shield_lock':
      default:
        return (
          <div className="relative flex items-center justify-center">
            <Shield size={iconSize} className="stroke-[2.2]" />
            <Lock
              size={Math.round(iconSize * 0.45)}
              className="absolute text-white stroke-[2.5]"
            />
          </div>
        );
    }
  };

  const isImageLogo = activeLogo.logoType === 'image' && activeLogo.imageUrl && !imageFailed;
  const shapeClass = getShapeClass(activeLogo.shape || 'rounded');
  const gradientClass = getGradientClass(activeLogo.iconGradient || 'indigo_pink');

  return (
    <div
      id="brand-logo-container"
      onClick={onClick}
      className={`inline-flex items-center gap-3 transition-opacity ${onClick ? 'cursor-pointer hover:opacity-90' : ''} ${className}`}
    >
      {/* LOGO VISUAL */}
      {isImageLogo ? (
        <div
          className={`relative overflow-hidden flex items-center justify-center flex-shrink-0 bg-slate-100 dark:bg-slate-800 ${shapeClass}`}
          style={{ height: `${targetHeight}px`, maxHeight: `${targetHeight}px` }}
        >
          <img
            id="brand-logo-image"
            src={activeLogo.imageUrl}
            alt={activeLogo.altText || activeLogo.brandText || 'IndiChat Logo'}
            referrerPolicy="no-referrer"
            onError={() => setImageFailed(true)}
            className={`h-full w-auto object-contain max-w-[200px] ${shapeClass}`}
            style={{ height: `${targetHeight}px` }}
          />
        </div>
      ) : activeLogo.logoType === 'text' ? (
        // Monogram / Text pill badge
        <div
          id="brand-logo-monogram"
          className={`flex items-center justify-center font-black tracking-wider uppercase flex-shrink-0 shadow-md ${gradientClass} ${shapeClass}`}
          style={{
            height: `${targetHeight}px`,
            minWidth: `${targetHeight}px`,
            padding: '0 10px',
            fontSize: `${Math.round(targetHeight * 0.4)}px`,
          }}
        >
          {(activeLogo.brandText || 'IC').slice(0, 3)}
        </div>
      ) : (
        // Dynamic Modern Icon
        <div
          id="brand-logo-icon"
          className={`flex items-center justify-center shadow-md shadow-indigo-500/20 flex-shrink-0 transition-transform duration-300 ${gradientClass} ${shapeClass}`}
          style={{
            width: `${targetHeight}px`,
            height: `${targetHeight}px`,
          }}
        >
          {renderDesignIcon(activeLogo.iconDesign || 'shield_lock', Math.round(targetHeight * 0.52))}
        </div>
      )}

      {/* BRAND TEXT & TAGLINE */}
      {showText && (activeLogo.showBrandText !== false) && (
        <div className={`flex flex-col leading-tight ${textClassName}`}>
          <div className="flex items-center gap-1.5">
            <span
              id="brand-logo-title"
              className={`font-black tracking-tight text-slate-900 dark:text-white ${currentSize.text}`}
            >
              {activeLogo.brandText || 'IndiChat'}
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 size={10} className="mr-0.5" /> SECURE
            </span>
          </div>

          {(showTagline || activeLogo.taglineText) && (
            <span
              id="brand-logo-tagline"
              className={`text-slate-500 dark:text-slate-400 font-medium tracking-wide truncate max-w-[200px] ${currentSize.subText}`}
            >
              {activeLogo.taglineText || 'Private & Secure Super App'}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
