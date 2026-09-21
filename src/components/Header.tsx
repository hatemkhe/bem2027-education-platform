import React from 'react';
import {
  GraduationCap,
  Sun,
  Moon,
  Shield,
  ShieldAlert,
  LogOut,
  PlusCircle,
  FilePlus,
  Search,
  BookMarked,
} from 'lucide-react';
import { ThemeMode } from '../types';

interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  isAdmin: boolean;
  onOpenAdminLogin: () => void;
  onAdminLogout: () => void;
  onOpenAddSubject: () => void;
  onOpenAddLesson: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onGoHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  isAdmin,
  onOpenAdminLogin,
  onAdminLogout,
  onOpenAddSubject,
  onOpenAddLesson,
  searchQuery,
  onSearchChange,
  onGoHome,
}) => {
  return (
    <header
      id="main-app-header"
      className="sticky top-0 z-40 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo and Brand */}
          <div
            id="brand-logo-btn"
            onClick={onGoHome}
            className="flex items-center gap-3.5 cursor-pointer group shrink-0"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-neutral-900 dark:text-white">
                  منصة الدروس
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-mono">
                  BEM 2027
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 hidden sm:block">
                مستودع شامل لجميع المواد والدروس المقررة
              </p>
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                id="search-lessons-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="ابحث عن مادة، درس، أو موضوع دراسي..."
                className="w-full pl-4 pr-10 py-2 rounded-xl text-sm border border-neutral-200 dark:border-neutral-700 bg-neutral-50/80 dark:bg-neutral-800/80 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-neutral-800 transition-all"
              />
              <Search className="absolute right-3 top-2.5 w-4 h-4 text-neutral-400" />
            </div>
          </div>

          {/* Action Controls: Theme & Admin */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Theme Toggle (Starts Light, Can Toggle to Dark) */}
            <button
              id="theme-toggle-btn"
              type="button"
              onClick={onToggleTheme}
              className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-100/80 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200/80 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
              title={theme === 'dark' ? 'التحويل إلى الوضع الفاتح' : 'التحويل إلى الوضع الداكن'}
              aria-label="تغيير المظهر"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-neutral-600" />
              )}
            </button>

            {/* Admin State / Admin Button in the top corner */}
            {isAdmin ? (
              <div className="flex items-center gap-2">
                {/* Add Subject Button */}
                <button
                  id="admin-add-subject-btn"
                  type="button"
                  onClick={onOpenAddSubject}
                  className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 transition-colors cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>مادة جديدة</span>
                </button>

                {/* Add Lesson Button */}
                <button
                  id="admin-add-lesson-btn"
                  type="button"
                  onClick={onOpenAddLesson}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors cursor-pointer"
                >
                  <FilePlus className="w-4 h-4" />
                  <span className="hidden sm:inline">نشر درس جديد</span>
                  <span className="sm:hidden">درس</span>
                </button>

                {/* Admin Status Pill */}
                <div
                  id="admin-status-badge"
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>المسؤول</span>
                </div>

                {/* Logout Button */}
                <button
                  id="admin-logout-btn"
                  type="button"
                  onClick={onAdminLogout}
                  className="p-2 sm:px-3 sm:py-2 text-xs font-semibold rounded-xl border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="تسجيل الخروج من وضع المسؤول"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">خروج</span>
                </button>
              </div>
            ) : (
              /* The specified Admin button in the top corner */
              <button
                id="open-admin-login-btn"
                type="button"
                onClick={onOpenAdminLogin}
                className="flex items-center gap-2 px-3.5 py-2 text-sm font-bold rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 shadow-sm transition-all hover:shadow-md cursor-pointer"
              >
                <Shield className="w-4 h-4 text-amber-400 dark:text-amber-600" />
                <span>Admin</span>
              </button>
            )}

          </div>

        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <input
              id="search-lessons-mobile-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ابحث عن مادة أو درس..."
              className="w-full pl-4 pr-10 py-2 rounded-xl text-sm border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <Search className="absolute right-3 top-2.5 w-4 h-4 text-neutral-400" />
          </div>
        </div>

      </div>
    </header>
  );
};
