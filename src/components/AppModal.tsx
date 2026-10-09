import React, { useState, useEffect } from 'react';
import { X, Globe, Sparkles, Check, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { AppItem } from '../types';
import { QAQC_CATEGORIES, PRESET_ICONS } from '../data/initialApps';

interface AppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appData: Omit<AppItem, 'id' | 'clickCount' | 'createdAt'>, editingId?: string) => void;
  editingApp?: AppItem | null;
  existingCategories: string[];
}

const QAQC_PRESET_IMAGES = [
  { label: 'Factory / Plant', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80' },
  { label: 'Warehouse / IQC', url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80' },
  { label: 'Quality Audit / NCR', url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80' },
  { label: 'Calibration / Metrology', url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80' },
  { label: 'Inspection / OQC', url: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=800&q=80' },
  { label: 'Lab / SPC Analytics', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80' },
  { label: 'Document / SOP', url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80' },
];

export const AppModal: React.FC<AppModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingApp,
  existingCategories,
}) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('IQC');
  const [customCategory, setCustomCategory] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [ownerName, setOwnerName] = useState('QA Team');
  const [ownerRole, setOwnerRole] = useState('OWNER');
  const [ownerAvatar, setOwnerAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80');
  const [isPinned, setIsPinned] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; url?: string; category?: string }>({});

  const allAvailableCategories = Array.from(
    new Set([...QAQC_CATEGORIES.filter(c => c !== 'All'), ...existingCategories.filter(c => c !== 'All')])
  );

  useEffect(() => {
    if (editingApp) {
      setTitle(editingApp.title);
      setUrl(editingApp.url);
      setDescription(editingApp.description || '');
      setThumbnailUrl(editingApp.thumbnailUrl || '');
      setOwnerName(editingApp.owner?.name || 'QA Specialist');
      setOwnerRole(editingApp.owner?.role || 'OWNER');
      setOwnerAvatar(editingApp.owner?.avatarUrl || '');
      setIsPinned(editingApp.isPinned || false);

      if (allAvailableCategories.includes(editingApp.category)) {
        setCategory(editingApp.category);
        setCustomCategory('');
      } else {
        setCategory('CUSTOM');
        setCustomCategory(editingApp.category);
      }
    } else {
      setTitle('');
      setUrl('');
      setDescription('');
      setThumbnailUrl(QAQC_PRESET_IMAGES[0].url);
      setOwnerName('QA Engineer');
      setOwnerRole('OWNER');
      setOwnerAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80');
      setIsPinned(false);
      setCategory('IPQC');
      setCustomCategory('');
    }
    setErrors({});
  }, [editingApp, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { title?: string; url?: string; category?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'กรุณากรอกชื่อโครงการหรือระบบงาน';
    }

    let trimmedUrl = url.trim();
    if (!trimmedUrl) {
      newErrors.url = 'กรุณาระบุ URL ทางเข้าใช้งาน';
    } else if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      trimmedUrl = `https://${trimmedUrl}`;
    }

    const finalCategory = category === 'CUSTOM' ? customCategory.trim() : category;
    if (!finalCategory) {
      newErrors.category = 'กรุณาระบุหมวดหมู่';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(
      {
        title: title.trim(),
        url: trimmedUrl,
        description: description.trim(),
        category: finalCategory,
        thumbnailUrl: thumbnailUrl.trim() || QAQC_PRESET_IMAGES[0].url,
        iconPreset: 'ShieldCheck',
        owner: {
          name: ownerName.trim() || 'QA Team',
          role: ownerRole.trim() || 'OWNER',
          avatarUrl: ownerAvatar.trim(),
        },
        isPinned,
        likesCount: editingApp?.likesCount || 0,
        commentsCount: editingApp?.commentsCount || 0,
        status: 'online',
      },
      editingApp ? editingApp.id : undefined
    );
  };

  const previewCategory = category === 'CUSTOM' ? customCategory || 'QA&QC' : category;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="px-6 py-4.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                {editingApp ? 'แก้ไขระบบงาน / โครงการ QA/QC' : '+ เพิ่มโครงการ / ระบบงาน QA/QC'}
              </h2>
              <p className="text-xs text-slate-400">
                เพิ่มทางเข้าระบบตรวจสอบและเครื่องมือประกันคุณภาพเข้าสู่ QAQC HUB
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left Column: Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ชื่อระบบงาน / โครงการ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors({ ...errors, title: undefined });
                  }}
                  placeholder="เช่น IQC Material Inspection, NCR Tracker"
                  className={`w-full px-3 py-2 text-sm rounded-lg border bg-slate-50 focus:bg-white outline-none transition-all ${
                    errors.title
                      ? 'border-rose-400 ring-2 ring-rose-100'
                      : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                  }`}
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ลิงก์ URL เข้าใช้งาน <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      if (errors.url) setErrors({ ...errors, url: undefined });
                    }}
                    placeholder="https://qaqc.internal-system.com"
                    className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border bg-slate-50 focus:bg-white outline-none transition-all ${
                      errors.url
                        ? 'border-rose-400 ring-2 ring-rose-100'
                        : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                    }`}
                  />
                </div>
                {errors.url && (
                  <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.url}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  หมวดหมู่ QA/QC <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      if (errors.category) setErrors({ ...errors, category: undefined });
                    }}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                  >
                    {allAvailableCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="CUSTOM">+ หมวดหมู่อื่นๆ</option>
                  </select>

                  {category === 'CUSTOM' ? (
                    <input
                      type="text"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="พิมพ์ชื่อหมวดหมู่..."
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none"
                    />
                  ) : (
                    <div className="flex items-center px-3 text-2xs text-slate-500 bg-slate-100 rounded-lg">
                      QA/QC Category
                    </div>
                  )}
                </div>
              </div>

              {/* Owner info */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ผู้รับผิดชอบ (Owner)
                  </label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="เช่น Anan K., QA Team"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    บทบาท (Role)
                  </label>
                  <input
                    type="text"
                    value={ownerRole}
                    onChange={(e) => setOwnerRole(e.target.value)}
                    placeholder="เช่น OWNER, QA LEAD"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 outline-none uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  คำอธิบายสรุป
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="รายละเอียดหน้าที่ หรือวัตถุประสงค์ของระบบ..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white outline-none resize-none transition-all"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pin-app"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="pin-app" className="text-xs font-medium text-slate-700 cursor-pointer">
                  เพิ่มในรายการที่ชอบ (Favorites)
                </label>
              </div>
            </div>

            {/* Right Column: Thumbnail image selection & Live preview */}
            <div className="space-y-4 bg-slate-50/70 p-4 rounded-xl border border-slate-200/80">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  รูปภาพหน้าปก (Cover Image URL)
                </label>
                <input
                  type="url"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white outline-none"
                />
              </div>

              {/* Quick Preset Images */}
              <div>
                <span className="text-2xs font-semibold text-slate-500 mb-1.5 block">
                  หรือเลือกภาพพรีเซ็ตสำหรับ QA/QC:
                </span>
                <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto p-1 bg-white rounded-lg border border-slate-200">
                  {QAQC_PRESET_IMAGES.map((img, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setThumbnailUrl(img.url)}
                      className={`text-left p-1.5 rounded-md border text-2xs flex items-center gap-2 transition-all cursor-pointer ${
                        thumbnailUrl === img.url
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                          : 'border-slate-100 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <img src={img.url} alt={img.label} className="w-6 h-6 rounded object-cover" />
                      <span className="truncate">{img.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Card Preview matching the screenshot layout */}
              <div>
                <span className="text-2xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  ตัวอย่างการแสดงผล (Card Preview)
                </span>
                <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                  <div className="relative aspect-16/10 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={thumbnailUrl || QAQC_PRESET_IMAGES[0].url}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-0.5 rounded-full bg-white/95 text-slate-800 text-3xs font-bold uppercase shadow-2xs">
                        {previewCategory}
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {title || 'ชื่อโครงการตัวอย่าง'}
                    </h4>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 rounded-full text-3xs text-slate-600 my-1">
                      <span className="font-extrabold text-blue-600">{ownerRole}</span>
                      <span>{ownerName}</span>
                    </div>
                    <p className="text-3xs text-slate-400 line-clamp-1">
                      {description || 'คำอธิบายโครงการและเครื่องมือ...'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{editingApp ? 'บันทึกการแก้ไข' : 'เพิ่มโครงการใหม่'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
