import React from 'react';
import { Filter } from 'lucide-react';

interface ShowcaseFilterBarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  title?: string;
  subtitle?: string;
}

export const ShowcaseFilterBar: React.FC<ShowcaseFilterBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  title = 'Internal Showcase',
  subtitle = 'Discover and access quality management tools and inspection systems at QAQC HUB',
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
      {/* Title & Subtitle matching image */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          {title}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {subtitle}
        </p>
      </div>

      {/* Right Category Filter Pills matching image */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none bg-slate-100/70 p-1 rounded-full border border-slate-200/60 max-w-full">
        {/* Filter funnel icon button */}
        <div className="px-2.5 py-1 text-slate-400 shrink-0">
          <Filter className="w-3.5 h-3.5" />
        </div>

        {/* Categories pills */}
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
