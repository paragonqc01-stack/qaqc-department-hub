import React from 'react';
import { Search, Share2, LogIn, X, User } from 'lucide-react';

interface TopNavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onShare: () => void;
  currentUser: { name: string; email: string; isGuest: boolean };
  onToggleUserMode: () => void;
  onToggleMobileMenu?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  searchQuery,
  onSearchChange,
  onShare,
  currentUser,
  onToggleUserMode,
  onToggleMobileMenu,
}) => {
  return (
    <header className="h-18 bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between gap-3 sm:gap-4">
      {/* Mobile Menu Button */}
      {onToggleMobileMenu && (
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          title="เปิดเมนู"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Search Bar matching screenshot */}
      <div className="flex-1 max-w-2xl relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search projects, categories..."
          className="w-full pl-10 pr-9 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-800 placeholder-slate-400 text-sm rounded-full border border-transparent focus:border-blue-400 focus:ring-3 focus:ring-blue-100 outline-none transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            title="ล้างคำค้นหา"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onShare}
          title="แชร์ลิงก์ QAQC HUB"
          className="p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
        </button>

        {currentUser.isGuest ? (
          <button
            onClick={onToggleUserMode}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        ) : (
          <button
            onClick={onToggleUserMode}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold transition-colors cursor-pointer"
            title="คลิกเพื่อสลับเป็น Guest"
          >
            <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xs">
              <User className="w-3 h-3" />
            </div>
            <span className="max-w-[120px] truncate">{currentUser.name}</span>
          </button>
        )}
      </div>
    </header>
  );
};
