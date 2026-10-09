import React, { useState } from 'react';
import { X, Download, Upload, Copy, Check, FileJson, AlertCircle } from 'lucide-react';
import { AppItem, DepartmentInfo } from '../types';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  apps: AppItem[];
  department: DepartmentInfo;
  onImport: (importedData: { apps?: AppItem[]; department?: DepartmentInfo }) => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
  apps,
  department,
  onImport,
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [copied, setCopied] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

  if (!isOpen) return null;

  const exportData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    department,
    apps,
  };

  const exportJsonString = JSON.stringify(exportData, null, 2);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(exportJsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([exportJsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `department-portal-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setImportError(null);

    try {
      const parsed = JSON.parse(importJson);
      if (!parsed || (typeof parsed !== 'object')) {
        throw new Error('โครงสร้างไฟล์ไม่ถูกต้อง');
      }

      if (!Array.isArray(parsed.apps) && !Array.isArray(parsed)) {
        throw new Error('ไม่พบข้อมูลรายการแอปพลิเคชันที่ถูกต้อง');
      }

      const importedApps = Array.isArray(parsed.apps) ? parsed.apps : (Array.isArray(parsed) ? parsed : []);
      const importedDepartment = parsed.department;

      onImport({
        apps: importedApps,
        department: importedDepartment,
      });
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการอ่าน JSON';
      setImportError(`ไม่สามารถนำเข้าข้อมูลได้: ${msg}`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setImportJson(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <FileJson className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold">นำเข้า / ส่งออกข้อมูล Hub</h2>
              <p className="text-xs text-slate-400">สำรองข้อมูลรายการแอป หรือส่งต่อการตั้งค่าให้เพื่อนร่วมแผนก</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3">
          <button
            onClick={() => setActiveTab('export')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'export'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            ส่งออกข้อมูล (Export)
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'import'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            นำเข้าข้อมูล (Import)
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'export' ? (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                คุณสามารถดาวน์โหลดไฟล์ JSON หรือคัดลอกโครงสร้างข้อมูลด้านล่าง เพื่อนำไปใช้กับเครื่องอื่นหรือสำรองไว้ได้
              </p>

              <div className="relative">
                <textarea
                  readOnly
                  rows={8}
                  value={exportJsonString}
                  className="w-full p-3 font-mono text-2xs bg-slate-900 text-slate-200 rounded-lg outline-none select-all overflow-x-auto"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'คัดลอกแล้ว!' : 'คัดลอก JSON'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadFile}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ดาวน์โหลดไฟล์ .json</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleImportSubmit} className="space-y-4">
              <p className="text-xs text-slate-600">
                เลือกไฟล์ .json หรือวางข้อมูลโครงสร้าง JSON เพื่อนำเข้าแอปพลิเคชันเข้าสู่ Hub
              </p>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  อัปโหลดไฟล์ (.json)
                </label>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  หรือวางข้อความ JSON ที่นี่
                </label>
                <textarea
                  rows={6}
                  value={importJson}
                  onChange={(e) => setImportJson(e.target.value)}
                  placeholder='{"apps": [...]}'
                  className="w-full p-3 font-mono text-2xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                />
              </div>

              {importError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{importError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={!importJson.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>ยืนยันการนำเข้าข้อมูล</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
