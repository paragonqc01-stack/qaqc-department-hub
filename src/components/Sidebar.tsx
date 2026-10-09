import React from 'react';
import {
  LayoutGrid,
  FolderKanban,
  Heart,
  Plus,
  ShieldCheck,
  Settings2,
  Download,
  RotateCcw,
} from 'lucide-react';
import { NavTab } from '../types';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenNewProject: () => void;
  onOpenSettings: () => void;
  onOpenExportModal: () => void;
  onResetDefaults: () => void;
  favoritesCount: number;
  totalProjectsCount: number;
  hubName?: string;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onOpenNewProject,
  onOpenSettings,
  onOpenExportModal,
  onResetDefaults,
  favoritesCount,
  totalProjectsCount,
  hubName = 'QAQC HUB',
  isMobileOpen = false,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 z-50 md:z-40 h-screen w-64 bg-white border-r border-slate-200/90 flex flex-col shrink-0 select-none transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
      {/* Top Logo Capsule Pill matching image */}
      <div className="p-5 pb-6">
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-900 text-white rounded-2xl shadow-sm border border-slate-800">
          <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400">
            <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div className="flex items-center gap-1.5 font-bold tracking-tight text-sm">
            <span>QAQC</span>
            <span className="px-1.5 py-0.5 text-2xs font-extrabold bg-blue-600 text-white rounded-md tracking-wider">
              HUB
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Menu Links */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        {/* Overview */}
        <button
          onClick={() => onTabChange('overview')}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-blue-50 text-blue-700 shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <LayoutGrid className={`w-4 h-4 ${activeTab === 'overview' ? 'text-blue-600' : 'text-slate-400'}`} />
          <span>Overview</span>
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">
            {totalProjectsCount}
          </span>
        </button>

        {/* My Projects */}
        <button
          onClick={() => onTabChange('my-projects')}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
            activeTab === 'my-projects'
              ? 'bg-blue-50 text-blue-700 shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FolderKanban className={`w-4 h-4 ${activeTab === 'my-projects' ? 'text-blue-600' : 'text-slate-400'}`} />
          <span>My Projects</span>
        </button>

        {/* Favorites */}
        <button
          onClick={() => onTabChange('favorites')}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
            activeTab === 'favorites'
              ? 'bg-blue-50 text-blue-700 shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Heart
            className={`w-4 h-4 ${
              activeTab === 'favorites' ? 'text-rose-500 fill-rose-500' : 'text-slate-400'
            }`}
          />
          <span className="truncate">Favorites (รายการที่ชอบ)</span>
          {favoritesCount > 0 && (
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 font-medium">
              {favoritesCount}
            </span>
          )}
        </button>

        {/* Quick Tools Divider */}
        <div className="pt-6 pb-2">
          <span className="px-3.5 text-2xs font-bold uppercase tracking-wider text-slate-400 block">
            เครื่องมือบริหารจัดการ
          </span>
        </div>

        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <Settings2 className="w-4 h-4 text-slate-400" />
          <span>ตั้งค่าข้อมูล QA/QC Hub</span>
        </button>

        <button
          onClick={onOpenExportModal}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4 text-slate-400" />
          <span>ส่งออก / นำเข้าข้อมูล</span>
        </button>

        <button
          onClick={onResetDefaults}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-slate-400" />
          <span>รีเซ็ตเป็นค่าเริ่มต้น</span>
        </button>
      </nav>

      {/* Bottom Action: + New Project button in prominent blue/indigo like image */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={onOpenNewProject}
          className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.8]" />
          <span>+ New Project</span>
        </button>
      </div>
    </aside>
    </>
  );
};
