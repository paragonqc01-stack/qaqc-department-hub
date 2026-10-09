import React from 'react';
import { PartyPopper, CheckCircle2 } from 'lucide-react';

interface WelcomeBannerProps {
  isGuest: boolean;
  onSignInClick: () => void;
  announcement?: string;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  isGuest,
  onSignInClick,
  announcement,
}) => {
  return (
    <div className="relative rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-blue-50/70 border border-blue-100/80 p-5 shadow-2xs mb-6 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Icon & Text */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-white border border-blue-200/60 shadow-xs flex items-center justify-center text-xl shrink-0">
            {isGuest ? (
              <PartyPopper className="w-5 h-5 text-indigo-500" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            )}
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              {isGuest ? (
                <>
                  <span>Browsing as Guest</span>
                  <span className="text-slate-400 font-normal">|</span>
                  <span className="font-semibold text-slate-800">กำลังเข้าชมในฐานะทีมงาน QA/QC</span>
                </>
              ) : (
                <>
                  <span>QA/QC Specialist Mode</span>
                  <span className="text-slate-400 font-normal">|</span>
                  <span className="font-semibold text-emerald-700">เข้าสู่ระบบเรียบร้อย (พร้อมสิทธิ์เต็ม)</span>
                </>
              )}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              {announcement ||
                'Anyone can browse projects, view analytics, and access quality tools! เข้าถึงระบบตรวจสอบคุณภาพ IQC, IPQC, OQC, การสอบเทียบ และมาตรฐาน ISO'}
            </p>
          </div>
        </div>

        {/* Right: Action Button */}
        <div className="shrink-0">
          <button
            onClick={onSignInClick}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold shadow-xs hover:shadow-blue-500/20 transition-all cursor-pointer whitespace-nowrap"
          >
            {isGuest ? 'Sign In with Google' : 'สลับบัญชีผู้ใช้'}
          </button>
        </div>
      </div>
    </div>
  );
};
