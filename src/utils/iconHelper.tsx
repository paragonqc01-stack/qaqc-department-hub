import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  ClipboardCheck,
  SlidersHorizontal,
  Microscope,
  BarChart3,
  AlertTriangle,
  BookOpen,
  Boxes,
  Truck,
  FileSpreadsheet,
  Users,
  Globe,
  LucideProps,
} from 'lucide-react';

export const renderPresetIcon = (presetName: string, props: LucideProps = { className: 'w-5 h-5' }) => {
  switch (presetName) {
    case 'ShieldCheck':
      return <ShieldCheck {...props} />;
    case 'CheckCircle2':
      return <CheckCircle2 {...props} />;
    case 'ClipboardCheck':
      return <ClipboardCheck {...props} />;
    case 'SlidersHorizontal':
      return <SlidersHorizontal {...props} />;
    case 'Microscope':
      return <Microscope {...props} />;
    case 'BarChart3':
      return <BarChart3 {...props} />;
    case 'AlertTriangle':
      return <AlertTriangle {...props} />;
    case 'BookOpen':
      return <BookOpen {...props} />;
    case 'Boxes':
      return <Boxes {...props} />;
    case 'Truck':
      return <Truck {...props} />;
    case 'FileSpreadsheet':
      return <FileSpreadsheet {...props} />;
    case 'Users':
      return <Users {...props} />;
    default:
      return <Globe {...props} />;
  }
};

/**
 * Returns a category badge styling matching the QA/QC dashboard aesthetic
 */
export const getCategoryBadgeStyle = (category: string) => {
  const norm = category.toUpperCase();
  if (norm === 'IQC') {
    return 'bg-blue-50 text-blue-700 border-blue-200';
  }
  if (norm === 'IPQC') {
    return 'bg-indigo-50 text-indigo-700 border-indigo-200';
  }
  if (norm === 'OQC') {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }
  if (norm.includes('QA') || norm.includes('QM')) {
    return 'bg-violet-50 text-violet-700 border-violet-200';
  }
  if (norm.includes('CALIB') || norm === 'CALIBRATION') {
    return 'bg-amber-50 text-amber-700 border-amber-200';
  }
  if (norm.includes('LAB') || norm.includes('TEST')) {
    return 'bg-cyan-50 text-cyan-700 border-cyan-200';
  }
  if (norm.includes('SOP') || norm.includes('DOC')) {
    return 'bg-rose-50 text-rose-700 border-rose-200';
  }
  return 'bg-slate-100 text-slate-700 border-slate-200';
};

export const getCategoryColor = (category: string) => {
  return {
    bg: getCategoryBadgeStyle(category),
    dot: 'bg-blue-600',
    iconBg: 'bg-blue-600 text-white',
    lightBadge: 'bg-blue-100 text-blue-800',
  };
};
