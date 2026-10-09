import React, { useState, useEffect, useMemo } from 'react';
import {
  Heart,
  FolderKanban,
  LayoutGrid,
  Search,
  Plus,
  RotateCcw,
} from 'lucide-react';
import { AppItem, DepartmentInfo, NavTab } from './types';
import {
  INITIAL_APPS,
  DEFAULT_DEPARTMENT_INFO,
  QAQC_CATEGORIES,
} from './data/initialApps';
import { Sidebar } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { WelcomeBanner } from './components/WelcomeBanner';
import { StatsCards } from './components/StatsCards';
import { ShowcaseFilterBar } from './components/ShowcaseFilterBar';
import { QAQCCard } from './components/QAQCCard';
import { AppModal } from './components/AppModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { DepartmentSettingsModal } from './components/DepartmentSettingsModal';
import { ExportImportModal } from './components/ExportImportModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { ProjectComment } from './types';

const APPS_STORAGE_KEY = 'qaqc_hub_apps_v2';
const DEPT_STORAGE_KEY = 'qaqc_hub_dept_v2';
const VISITS_STORAGE_KEY = 'qaqc_hub_visits_v2';

export default function App() {
  // 1. Initial State from LocalStorage
  const [apps, setApps] = useState<AppItem[]>(() => {
    try {
      const saved = localStorage.getItem(APPS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_APPS;
  });

  const [department, setDepartment] = useState<DepartmentInfo>(() => {
    try {
      const saved = localStorage.getItem(DEPT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name) return parsed;
      }
    } catch {
      // ignore
    }
    return DEFAULT_DEPARTMENT_INFO;
  });

  const [hubVisits, setHubVisits] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(VISITS_STORAGE_KEY);
      if (saved) return parseInt(saved, 10);
    } catch {
      // ignore
    }
    return 930;
  });

  // Navigation & Filter State
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // User session state
  const [currentUser, setCurrentUser] = useState({
    name: 'QC Specialist (Guest)',
    email: 'paragon.qc01@gmail.com',
    isGuest: true,
  });

  // Modal States
  const [selectedDetailApp, setSelectedDetailApp] = useState<AppItem | null>(null);
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<AppItem | null>(null);
  const [deleteTargetApp, setDeleteTargetApp] = useState<AppItem | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Toast Notifications State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Increment page visits once on load
  useEffect(() => {
    const newVisits = hubVisits + 1;
    setHubVisits(newVisits);
    try {
      localStorage.setItem(VISITS_STORAGE_KEY, newVisits.toString());
    } catch {
      // ignore
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(APPS_STORAGE_KEY, JSON.stringify(apps));
    } catch (err) {
      console.error('Failed to save QA/QC apps to localStorage', err);
    }
  }, [apps]);

  useEffect(() => {
    try {
      localStorage.setItem(DEPT_STORAGE_KEY, JSON.stringify(department));
    } catch (err) {
      console.error('Failed to save department to localStorage', err);
    }
  }, [department]);

  // Dynamic Categories from initial list and created apps
  const categories = useMemo(() => {
    const set = new Set<string>(QAQC_CATEGORIES);
    apps.forEach((a) => {
      if (a.category && a.category.trim()) {
        set.add(a.category.trim());
      }
    });
    return Array.from(set);
  }, [apps]);

  const favoritesCount = useMemo(() => {
    return apps.filter((a) => a.isPinned).length;
  }, [apps]);

  // Filtered Apps
  const filteredApps = useMemo(() => {
    let result = [...apps];

    // NavTab filter
    if (activeTab === 'favorites') {
      result = result.filter((app) => app.isPinned);
    } else if (activeTab === 'my-projects') {
      // Show user's projects or top projects assigned
      result = result.filter((app) => app.owner?.name?.toLowerCase().includes('qa') || app.isPinned);
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((app) => app.category === selectedCategory);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (app) =>
          app.title.toLowerCase().includes(q) ||
          app.description.toLowerCase().includes(q) ||
          app.category.toLowerCase().includes(q) ||
          app.owner?.name?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [apps, activeTab, selectedCategory, searchQuery]);

  // Handlers
  const handleOpenApp = (app: AppItem) => {
    setApps((prev) =>
      prev.map((item) =>
        item.id === app.id ? { ...item, clickCount: (item.clickCount || 0) + 1 } : item
      )
    );
    window.open(app.url, '_blank', 'noopener,noreferrer');
    addToast(`กำลังเปิดระบบ "${app.title}"`, 'info');
  };

  const handleToggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setApps((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newPinned = !item.isPinned;
          const newLikes = newPinned ? (item.likesCount || 0) + 1 : Math.max(0, (item.likesCount || 0) - 1);
          addToast(
            newPinned
              ? `ถูกใจและเพิ่ม "${item.title}" ใน Favorites แล้ว`
              : `ยกเลิกรายการที่ชอบ "${item.title}" แล้ว`,
            'success'
          );
          const updated = { ...item, isPinned: newPinned, likesCount: newLikes };
          if (selectedDetailApp?.id === id) {
            setSelectedDetailApp(updated);
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handleAddComment = (appId: string, comment: ProjectComment) => {
    setApps((prev) =>
      prev.map((item) => {
        if (item.id === appId) {
          const updatedComments = [comment, ...(item.comments || [])];
          const updatedApp = {
            ...item,
            comments: updatedComments,
            commentsCount: updatedComments.length,
          };
          if (selectedDetailApp?.id === appId) {
            setSelectedDetailApp(updatedApp);
          }
          return updatedApp;
        }
        return item;
      })
    );
    addToast('ส่งความคิดเห็นเรียบร้อยแล้ว', 'success');
  };

  const handleSaveApp = (
    appData: Omit<AppItem, 'id' | 'clickCount' | 'createdAt'>,
    editingId?: string
  ) => {
    if (editingId) {
      setApps((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? { ...item, ...appData, updatedAt: new Date().toISOString() }
            : item
        )
      );
      addToast(`อัปเดตข้อมูล "${appData.title}" เรียบร้อยแล้ว`, 'success');
    } else {
      const newApp: AppItem = {
        ...appData,
        id: `qaqc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        clickCount: 1,
        likesCount: 1,
        commentsCount: 0,
        createdAt: new Date().toISOString(),
      };
      setApps((prev) => [newApp, ...prev]);
      addToast(`เพิ่มโครงการ "${newApp.title}" เข้าสู่ QAQC HUB แล้ว`, 'success');
    }
    setIsAppModalOpen(false);
    setEditingApp(null);
  };

  const handleDeleteAppConfirm = (appId: string) => {
    const target = apps.find((a) => a.id === appId);
    setApps((prev) => prev.filter((item) => item.id !== appId));
    setDeleteTargetApp(null);
    if (target) {
      addToast(`ลบ "${target.title}" ออกจากระบบแล้ว`, 'success');
    }
  };

  const handleCopyUrl = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    addToast('คัดลอกลิงก์ไปยังคลิปบอร์ดแล้ว', 'success');
  };

  const handleShareHub = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast('คัดลอกลิงก์แชร์ QAQC HUB แล้ว!', 'success');
  };

  const handleResetDefaults = () => {
    if (window.confirm('คุณต้องการรีเซ็ตโครงการ QA/QC ทั้งหมดกลับเป็นค่าเริ่มต้นหรือไม่?')) {
      setApps(INITIAL_APPS);
      setDepartment(DEFAULT_DEPARTMENT_INFO);
      setSelectedCategory('All');
      setSearchQuery('');
      setActiveTab('overview');
      addToast('คืนค่าระบบเริ่มต้น QAQC HUB เรียบร้อยแล้ว', 'success');
    }
  };

  const handleToggleUserMode = () => {
    if (currentUser.isGuest) {
      setCurrentUser({
        name: 'Paragon QC (Admin)',
        email: 'paragon.qc01@gmail.com',
        isGuest: false,
      });
      addToast('เข้าสู่ระบบในฐานะ QA Lead (Paragon QC)', 'success');
    } else {
      setCurrentUser({
        name: 'QC Specialist (Guest)',
        email: 'paragon.qc01@gmail.com',
        isGuest: true,
      });
      addToast('สลับเป็นโหมด Guest', 'info');
    }
  };

  const handleImportData = (imported: { apps?: AppItem[]; department?: DepartmentInfo }) => {
    if (imported.apps && Array.isArray(imported.apps)) {
      setApps(imported.apps);
    }
    if (imported.department) {
      setDepartment(imported.department);
    }
    addToast('นำเข้าข้อมูล QAQC HUB สำเร็จแล้ว', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
      {/* Toast Feedback */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Left Sidebar matching reference image */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'favorites') {
            setSelectedCategory('All');
          }
          setIsMobileSidebarOpen(false);
        }}
        onOpenNewProject={() => {
          setEditingApp(null);
          setIsAppModalOpen(true);
          setIsMobileSidebarOpen(false);
        }}
        onOpenSettings={() => {
          setIsSettingsModalOpen(true);
          setIsMobileSidebarOpen(false);
        }}
        onOpenExportModal={() => {
          setIsExportModalOpen(true);
          setIsMobileSidebarOpen(false);
        }}
        onResetDefaults={handleResetDefaults}
        favoritesCount={favoritesCount}
        totalProjectsCount={apps.length}
        hubName={department.hubName}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar matching screenshot */}
        <TopNavbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onShare={handleShareHub}
          currentUser={currentUser}
          onToggleUserMode={handleToggleUserMode}
          onToggleMobileMenu={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        {/* Scrollable Dashboard Body */}
        <main className="flex-1 px-6 sm:px-8 py-6 max-w-7xl w-full mx-auto">
          {/* Welcome / Guest Banner matching screenshot */}
          <WelcomeBanner
            isGuest={currentUser.isGuest}
            onSignInClick={handleToggleUserMode}
            announcement={department.announcement}
          />

          {/* 4 Stats Cards matching screenshot */}
          <StatsCards apps={apps} hubVisitsCount={hubVisits} />

          {/* Internal Showcase Section Header + Category Pills matching screenshot */}
          <ShowcaseFilterBar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            title={
              activeTab === 'favorites'
                ? 'Favorites Showcase (รายการที่ชอบ)'
                : activeTab === 'my-projects'
                ? 'My QA/QC Projects (โครงการของฉัน)'
                : 'Internal Showcase'
            }
            subtitle={
              activeTab === 'favorites'
                ? 'โครงการและระบบงาน QA/QC ที่คุณปักหมุดชื่นชอบไว้'
                : 'Discover and access quality management tools and inspection systems at QAQC HUB'
            }
          />

          {/* Cards Showcase Grid */}
          {filteredApps.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredApps.map((app) => (
                <QAQCCard
                  key={app.id}
                  app={app}
                  onOpenApp={(item) => setSelectedDetailApp(item)}
                  onLaunchDirect={(item, e) => {
                    e.stopPropagation();
                    handleOpenApp(item);
                  }}
                  onToggleLike={handleToggleLike}
                  onEdit={(item, e) => {
                    e.stopPropagation();
                    setEditingApp(item);
                    setIsAppModalOpen(true);
                  }}
                  onDelete={(item, e) => {
                    e.stopPropagation();
                    setDeleteTargetApp(item);
                  }}
                  onCopyUrl={handleCopyUrl}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="py-16 text-center bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs max-w-md mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                {searchQuery ? (
                  <Search className="w-6 h-6" />
                ) : activeTab === 'favorites' ? (
                  <Heart className="w-6 h-6 text-rose-500" />
                ) : (
                  <LayoutGrid className="w-6 h-6" />
                )}
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-1">
                {searchQuery
                  ? `ไม่พบโครงการที่ตรงกับ "${searchQuery}"`
                  : activeTab === 'favorites'
                  ? 'ยังไม่มีโครงการในรายการที่ชอบ'
                  : 'ไม่พบโครงการในหมวดหมู่นี้'}
              </h3>
              <p className="text-xs text-slate-400 mb-5">
                {activeTab === 'favorites'
                  ? 'กดไอคอนรูปหัวใจบนการ์ด เพื่อบันทึกเป็นโครงการที่เข้าใช้งานบ่อย'
                  : 'ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่น'}
              </p>
              <div className="flex items-center justify-center gap-2">
                {searchQuery || selectedCategory !== 'All' ? (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    ดูทั้งหมด
                  </button>
                ) : null}
                <button
                  onClick={() => {
                    setEditingApp(null);
                    setIsAppModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>เพิ่มโครงการใหม่</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add / Edit App Modal */}
      <AppModal
        isOpen={isAppModalOpen}
        onClose={() => {
          setIsAppModalOpen(false);
          setEditingApp(null);
        }}
        onSave={handleSaveApp}
        editingApp={editingApp}
        existingCategories={categories}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTargetApp}
        app={deleteTargetApp}
        onClose={() => setDeleteTargetApp(null)}
        onConfirm={handleDeleteAppConfirm}
      />

      {/* Department Settings Modal */}
      <DepartmentSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        department={department}
        onSave={(updatedDept) => {
          setDepartment(updatedDept);
          setIsSettingsModalOpen(false);
          addToast('บันทึกข้อมูล QAQC HUB เรียบร้อยแล้ว', 'success');
        }}
      />

      {/* Export / Import Modal */}
      <ExportImportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        apps={apps}
        department={department}
        onImport={handleImportData}
      />

      {/* Project Detail & Comments Modal */}
      <ProjectDetailModal
        isOpen={!!selectedDetailApp}
        app={selectedDetailApp}
        onClose={() => setSelectedDetailApp(null)}
        onLaunchApp={handleOpenApp}
        onToggleLike={handleToggleLike}
        onAddComment={handleAddComment}
        currentUser={currentUser}
        onCopyUrl={(url) => {
          navigator.clipboard.writeText(url);
          addToast('คัดลอกลิงก์ไปยังคลิปบอร์ดแล้ว', 'success');
        }}
      />
    </div>
  );
}
