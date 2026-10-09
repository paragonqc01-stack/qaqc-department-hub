import React from 'react';
import { BookOpen, Tag, Flame, Activity } from 'lucide-react';
import { AppItem } from '../types';

interface StatsCardsProps {
  apps: AppItem[];
  hubVisitsCount: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ apps, hubVisitsCount }) => {
  // 1. Total projects
  const totalProjects = apps.length;

  // 2. Top category
  const categoryCountMap: { [cat: string]: number } = {};
  apps.forEach((app) => {
    categoryCountMap[app.category] = (categoryCountMap[app.category] || 0) + 1;
  });

  let topCategoryName = 'IQC';
  let topCategoryCount = 0;
  Object.entries(categoryCountMap).forEach(([cat, count]) => {
    if (count > topCategoryCount) {
      topCategoryCount = count;
      topCategoryName = cat;
    }
  });

  // 3. Most Popular project (highest likes + clicks)
  const mostPopular = [...apps].sort((a, b) => {
    const scoreA = (a.likesCount || 0) * 10 + (a.clickCount || 0);
    const scoreB = (b.likesCount || 0) * 10 + (b.clickCount || 0);
    return scoreB - scoreA;
  })[0] || apps[0];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* 1. Total Projects */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 block">
              TOTAL PROJECTS
            </span>
            <span className="text-xs text-slate-500 font-medium">โครงการทั้งหมด</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {totalProjects}
          </div>
          <div className="text-2xs text-slate-400 mt-0.5">Submitted & Active</div>
        </div>
      </div>

      {/* 2. Top Category */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 block">
              TOP CATEGORY
            </span>
            <span className="text-xs text-slate-500 font-medium">หมวดหมู่ที่มีโครงการเยอะสุด</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <Tag className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-black text-slate-900 tracking-tight truncate">
            {topCategoryName}
          </div>
          <div className="text-2xs text-slate-400 mt-0.5">{topCategoryCount} Projects</div>
        </div>
      </div>

      {/* 3. Most Popular */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 block">
              MOST POPULAR
            </span>
            <span className="text-xs text-slate-500 font-medium">โครงการที่ถูกชื่นชอบมากที่สุด</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 shrink-0">
            <Flame className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-sm font-bold text-slate-900 truncate" title={mostPopular?.title}>
            {mostPopular ? mostPopular.title : '-'}
          </div>
          <div className="text-2xs text-slate-400 mt-0.5">
            {mostPopular ? `${mostPopular.likesCount || 0} Favorites • ${mostPopular.commentsCount || 0} Comments` : '0 Favorites'}
          </div>
        </div>
      </div>

      {/* 4. Hub Visits */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 block">
              HUB VISITS
            </span>
            <span className="text-xs text-slate-500 font-medium">จำนวนการเข้าชม QAQC HUB</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shrink-0">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {hubVisitsCount.toLocaleString()}
          </div>
          <div className="text-2xs text-slate-400 mt-0.5">Total Page Views</div>
        </div>
      </div>
    </div>
  );
};
