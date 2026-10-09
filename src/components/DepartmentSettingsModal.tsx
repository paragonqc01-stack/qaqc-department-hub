import React, { useState, useEffect } from 'react';
import { X, Building2, Save, RotateCcw } from 'lucide-react';
import { DepartmentInfo } from '../types';
import { DEFAULT_DEPARTMENT_INFO } from '../data/initialApps';

interface DepartmentSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: DepartmentInfo;
  onSave: (info: DepartmentInfo) => void;
}

export const DepartmentSettingsModal: React.FC<DepartmentSettingsModalProps> = ({
  isOpen,
  onClose,
  department,
  onSave,
}) => {
  const [name, setName] = useState(department.name);
  const [slogan, setSlogan] = useState(department.slogan);
  const [shortCode, setShortCode] = useState(department.shortCode);
  const [announcement, setAnnouncement] = useState(department.announcement || '');

  useEffect(() => {
    setName(department.name);
    setSlogan(department.slogan);
    setShortCode(department.shortCode);
    setAnnouncement(department.announcement || '');
  }, [department, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: name.trim() || DEFAULT_DEPARTMENT_INFO.name,
      englishName: DEFAULT_DEPARTMENT_INFO.englishName,
      hubName: shortCode.trim() ? `${shortCode.trim()} HUB` : 'QAQC HUB',
      slogan: slogan.trim() || DEFAULT_DEPARTMENT_INFO.slogan,
      shortCode: shortCode.trim() || 'QAQC',
      announcement: announcement.trim(),
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleReset = () => {
    setName(DEFAULT_DEPARTMENT_INFO.name);
    setSlogan(DEFAULT_DEPARTMENT_INFO.slogan);
    setShortCode(DEFAULT_DEPARTMENT_INFO.shortCode);
    setAnnouncement(DEFAULT_DEPARTMENT_INFO.announcement || '');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold">ตั้งค่าข้อมูลแผนก / องค์กร</h2>
              <p className="text-xs text-slate-400">ปรับแต่งชื่อแผนก สโลแกน และข้อความประกาศกลาง</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ชื่อแผนก / ส่วนงาน
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="เช่น ฝ่ายเทคโนโลยีสารสนเทศ, ฝ่ายทรัพยากรบุคคล"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                รหัสย่อแผนก / แท็ก
              </label>
              <input
                type="text"
                value={shortCode}
                onChange={(e) => setShortCode(e.target.value)}
                placeholder="เช่น IT-HUB, HR-PORTAL"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                การรีเซ็ตค่าเริ่มต้น
              </label>
              <button
                type="button"
                onClick={handleReset}
                className="w-full py-2 px-3 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>คืนค่าเริ่มต้น</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              สโลแกนหรือคำอธิบายแผนก
            </label>
            <input
              type="text"
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
              placeholder="เช่น ศูนย์รวมระบบงานและบริการออนไลน์สำหรับบุคลากร"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ข้อความประกาศด่วน / ข้อมูลติดต่อ (เว้นว่างได้)
            </label>
            <textarea
              rows={2}
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              placeholder="เช่น ติดต่อแจ้งปัญหาด่วนได้ที่เบอร์ภายใน 1042..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none transition-all"
            />
          </div>

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
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกข้อมูลแผนก</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
