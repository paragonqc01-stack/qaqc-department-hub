import React, { useState } from 'react';
import {
  ExternalLink,
  MoreVertical,
  Edit2,
  Trash2,
  Copy,
  Heart,
  MessageSquare,
} from 'lucide-react';
import { AppItem } from '../types';
import { renderPresetIcon } from '../utils/iconHelper';

interface QAQCCardProps {
  app: AppItem;
  onOpenApp: (app: AppItem) => void;
  onLaunchDirect: (app: AppItem, e: React.MouseEvent) => void;
  onToggleLike: (id: string, e: React.MouseEvent) => void;
  onEdit: (app: AppItem, e: React.MouseEvent) => void;
  onDelete: (app: AppItem, e: React.MouseEvent) => void;
  onCopyUrl: (url: string, e: React.MouseEvent) => void;
}

export const QAQCCard: React.FC<QAQCCardProps> = ({
  app,
  onOpenApp,
  onLaunchDirect,
  onToggleLike,
  onEdit,
  onDelete,
  onCopyUrl,
}) => {
  const [imageError, setImageError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setMenuOpen(!menuOpen);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.action-control')) {
      return;
    }
    onOpenApp(app);
  };

  const commentsCount = app.comments?.length ?? app.commentsCount ?? 0;

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between cursor-pointer"
    >
      <div>
        {/* Thumbnail Image Container with Category Badge in top-right corner */}
        <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
          {app.thumbnailUrl && !imageError ? (
            <img
              src={app.thumbnailUrl}
              alt={app.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-slate-300 p-4">
              {renderPresetIcon(app.iconPreset, { className: 'w-10 h-10 text-blue-400 mb-2' })}
              <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400">
                {app.category}
              </span>
            </div>
          )}

          {/* Top-Right Category Badge matching image */}
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-md shadow-xs text-slate-800 text-2xs font-bold uppercase tracking-wider border border-slate-100">
              {app.category}
            </span>
          </div>

          {/* Floating Actions: Favorite / Menu */}
          <div className="action-control absolute top-3 left-3 z-10 flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => onToggleLike(app.id, e)}
              className={`p-1.5 rounded-full backdrop-blur-md transition-colors ${
                app.isPinned
                  ? 'bg-white text-rose-500 shadow-sm'
                  : 'bg-slate-950/60 text-white hover:text-rose-400'
              }`}
              title={app.isPinned ? 'ยกเลิกถูกใจ' : 'ถูกใจระบบนี้'}
            >
              <Heart className={`w-3.5 h-3.5 ${app.isPinned ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Card Body matching screenshot */}
        <div className="p-4 sm:p-5">
          {/* Title */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 flex-1">
              {app.title}
            </h3>

            {/* Menu button */}
            <div className="action-control relative shrink-0">
              <button
                type="button"
                onClick={toggleMenu}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="เมนูเพิ่มเติม"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                    }}
                  />
                  <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 text-xs">
                    <button
                      onClick={(e) => {
                        setMenuOpen(false);
                        onEdit(app, e);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-100 flex items-center gap-2 text-slate-700 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>แก้ไข</span>
                    </button>
                    <button
                      onClick={(e) => {
                        setMenuOpen(false);
                        onCopyUrl(app.url, e);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-100 flex items-center gap-2 text-slate-700 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>คัดลอกลิงก์</span>
                    </button>
                    <div className="my-1 border-t border-slate-100" />
                    <button
                      onClick={(e) => {
                        setMenuOpen(false);
                        onDelete(app, e);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      <span>ลบแอป</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Owner Pill Badge matching image */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-slate-100/90 rounded-full text-2xs text-slate-600 mb-3 border border-slate-200/60 max-w-full">
            {app.owner?.avatarUrl ? (
              <img
                src={app.owner.avatarUrl}
                alt={app.owner.name}
                className="w-4 h-4 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xs font-bold shrink-0">
                {app.owner?.name?.charAt(0) || 'Q'}
              </div>
            )}
            <span className="font-extrabold text-blue-600 uppercase text-3xs tracking-wider">
              {app.owner?.role || 'OWNER'}
            </span>
            <span className="truncate font-medium text-slate-700">
              {app.owner?.name || 'QA Team'}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {app.description || 'ไม่มีคำอธิบายเพิ่มเติม'}
          </p>
        </div>
      </div>

      {/* Card Footer matching screenshot metrics */}
      <div className="px-4 sm:px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-2xs text-slate-400">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1 font-medium">
            <Heart className={`w-3 h-3 ${app.isPinned ? 'text-rose-500 fill-rose-500' : 'text-slate-400'}`} />
            <span>{app.likesCount || 0}</span>
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3 text-slate-400" />
            <span>{commentsCount}</span>
          </span>
        </div>

        <div className="action-control">
          <button
            type="button"
            onClick={(e) => onLaunchDirect(app, e)}
            className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 group-hover:underline cursor-pointer"
          >
            <span>เข้าใช้งาน</span>
            <ExternalLink className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
