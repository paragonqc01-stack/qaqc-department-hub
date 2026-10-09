import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  Heart,
  Copy,
  Send,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Share2,
} from 'lucide-react';
import { AppItem, ProjectComment } from '../types';

interface ProjectDetailModalProps {
  isOpen: boolean;
  app: AppItem | null;
  onClose: () => void;
  onLaunchApp: (app: AppItem) => void;
  onToggleLike: (id: string, e: React.MouseEvent) => void;
  onAddComment: (appId: string, comment: ProjectComment) => void;
  currentUser: { name: string; email: string };
  onCopyUrl: (url: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  isOpen,
  app,
  onClose,
  onLaunchApp,
  onToggleLike,
  onAddComment,
  currentUser,
  onCopyUrl,
}) => {
  const [commentText, setCommentText] = useState('');

  if (!isOpen || !app) return null;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: ProjectComment = {
      id: `comment-${Date.now()}`,
      author: currentUser.name || 'QA Specialist',
      text: commentText.trim(),
      createdAt: new Date().toISOString(),
    };

    onAddComment(app.id, newComment);
    setCommentText('');
  };

  const formattedDate = new Date(app.createdAt).toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Top Image Banner */}
        <div className="relative aspect-21/9 w-full bg-slate-900 shrink-0 overflow-hidden">
          <img
            src={app.thumbnailUrl}
            alt={app.title}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-950/60 text-white hover:bg-slate-950/90 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Category Pill & Status on image */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md shadow-xs text-slate-800 text-xs font-bold uppercase tracking-wider">
              {app.category}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-medium shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              ระบบเปิดใช้งานปกติ
            </span>
          </div>

          {/* Title on the Banner Bottom */}
          <div className="absolute bottom-4 left-5 right-5 z-20">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-md">
              {app.title}
            </h2>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Action Row: Launch Button + Favorite + Copy URL */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onLaunchApp(app)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-blue-500/25 transition-all cursor-pointer"
              >
                <span>เข้าใช้งานระบบ (Launch App)</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              <button
                onClick={(e) => onToggleLike(app.id, e)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  app.isPinned
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-rose-500 hover:bg-rose-50'
                }`}
              >
                <Heart className={`w-4 h-4 ${app.isPinned ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{app.likesCount || 0} ถูกใจ</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onCopyUrl(app.url)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 transition-colors cursor-pointer"
                title="คัดลอกลิงก์"
              >
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>คัดลอก URL</span>
              </button>
            </div>
          </div>

          {/* Project Details Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Owner Box */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80">
              <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                ผู้รับผิดชอบโครงการ
              </span>
              <div className="flex items-center gap-3">
                {app.owner?.avatarUrl ? (
                  <img
                    src={app.owner.avatarUrl}
                    alt={app.owner.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                    {app.owner?.name?.charAt(0) || 'Q'}
                  </div>
                )}
                <div>
                  <div className="text-xs font-extrabold text-blue-600 uppercase">
                    {app.owner?.role || 'OWNER'}
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    {app.owner?.name || 'QA Lead'}
                  </div>
                </div>
              </div>
            </div>

            {/* Quality Standard */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80">
              <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                มาตรฐานการควบคุม
              </span>
              <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs mt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>ISO 9001 / AQL Standard</span>
              </div>
              <div className="text-2xs text-slate-400 mt-1">
                รับรองกระบวนการควบคุมคุณภาพ
              </div>
            </div>

            {/* Total Visits / Created */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80">
              <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                สถิติการใช้งาน
              </span>
              <div className="text-xs font-bold text-slate-800">
                เปิดใช้งานแล้ว {app.clickCount || 0} ครั้ง
              </div>
              <div className="text-2xs text-slate-400 mt-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>เพิ่มเข้าระบบเมื่อ {formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              คำอธิบายและวัตถุประสงค์ของระบบ
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
              {app.description || 'ไม่มีคำอธิบายเพิ่มเติม'}
            </p>
          </div>

          {/* Comments & Discussion Section (matching "3 Comments" in screenshot) */}
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">
                ความคิดเห็นและบันทึกงาน ({app.comments?.length || 0})
              </h3>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-4">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="เขียนข้อความ หรือบันทึกหมายเหตุการตรวจสอบ..."
                className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>ส่ง</span>
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-2.5">
              {app.comments && app.comments.length > 0 ? (
                app.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-3 bg-white border border-slate-200/80 rounded-xl flex items-start gap-3 text-xs"
                  >
                    <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-bold text-2xs shrink-0">
                      {comment.author.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-slate-800">{comment.author}</span>
                        <span className="text-3xs text-slate-400">
                          {new Date(comment.createdAt).toLocaleTimeString('th-TH', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{comment.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  ยังไม่มีบันทึกความคิดเห็น เป็นคนแรกที่เริ่มการสนทนา!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
