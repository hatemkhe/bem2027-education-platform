import React, { useState, useEffect, useMemo } from 'react';
import { Subject, Section, Lesson, ThemeMode } from './types';
import {
  initStorage,
  saveSubject,
  removeSubject,
  saveSection,
  removeSection,
  saveLesson,
  removeLesson,
  resetAllData,
} from './utils/storage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SubjectCard } from './components/SubjectCard';
import { SubjectDetailView } from './components/SubjectDetailView';
import { AdminLoginModal } from './components/AdminLoginModal';
import { SubjectModal } from './components/SubjectModal';
import { SectionModal } from './components/SectionModal';
import { LessonModal } from './components/LessonModal';
import { PdfViewerModal } from './components/PdfViewerModal';
import {
  BookOpen,
  PlusCircle,
  FilePlus,
  Layers,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Check,
  Search,
  Eye,
  Download,
} from 'lucide-react';

export default function App() {
  // Theme state: starts in Dark mode by default on initial opening, with toggle capability
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('manassa_theme_v2');
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    // Default on initial opening is dark
    return 'dark';
  });

  // Admin authentication state
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem('manassa_admin_logged') === 'true';
  });

  // Data states
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Navigation: selected subject view
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // Subject Modal
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // Section Modal
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [sectionModalSubjectId, setSectionModalSubjectId] = useState<string>('');

  // Lesson Modal
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [lessonModalSubjectId, setLessonModalSubjectId] = useState<string>('');
  const [lessonModalSectionId, setLessonModalSectionId] = useState<string>('');

  // PDF Viewer Modal
  const [viewingLesson, setViewingLesson] = useState<Lesson | null>(null);
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);

  // Delete confirmation modal
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    type: 'subject' | 'section' | 'lesson';
    id: string;
    title: string;
  } | null>(null);

  // Notification message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync theme with DOM
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('manassa_theme_v2', theme);
  }, [theme]);

  // Load initial data from storage
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const data = await initStorage();
        setSubjects(data.subjects.sort((a, b) => a.order - b.order));
        setSections(data.sections.sort((a, b) => a.order - b.order));
        setLessons(data.lessons);
      } catch (err) {
        console.error('Failed to load storage data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Theme toggle
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Admin login success
  const handleAdminLoginSuccess = () => {
    setIsAdmin(true);
    sessionStorage.setItem('manassa_admin_logged', 'true');
    showToast('تم تسجيل الدخول بنجاح! يمكنك الآن إضافة وتعديل وحذف المواد والدروس.');
  };

  // Admin logout
  const handleAdminLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('manassa_admin_logged');
    showToast('تم تسجيل الخروج من وضع المسؤول.');
  };

  // Subject actions
  const handleOpenAddSubject = () => {
    setEditingSubject(null);
    setIsSubjectModalOpen(true);
  };

  const handleOpenEditSubject = (subj: Subject, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSubject(subj);
    setIsSubjectModalOpen(true);
  };

  const handleSaveSubject = async (
    subjectData: Omit<Subject, 'id'>,
    existingId?: string
  ) => {
    const id = existingId || `sub-${Date.now()}`;
    const newSubject: Subject = {
      ...subjectData,
      id,
    };
    await saveSubject(newSubject);
    setSubjects((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      return [...filtered, newSubject].sort((a, b) => a.order - b.order);
    });
    showToast(existingId ? 'تم تعديل المادة بنجاح' : 'تمت إضافة المادة الدراسية بنجاح');
  };

  const handleDeleteSubject = (subj: Subject, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDeleteConfirmation({
      type: 'subject',
      id: subj.id,
      title: subj.title,
    });
  };

  // Section actions
  const handleOpenAddSection = (subjectId?: string) => {
    setEditingSection(null);
    setSectionModalSubjectId(subjectId || selectedSubjectId || (subjects[0]?.id ?? ''));
    setIsSectionModalOpen(true);
  };

  const handleOpenEditSection = (sec: Section) => {
    setEditingSection(sec);
    setSectionModalSubjectId(sec.subjectId);
    setIsSectionModalOpen(true);
  };

  const handleSaveSection = async (
    sectionData: Omit<Section, 'id'>,
    existingId?: string
  ) => {
    const id = existingId || `sec-${Date.now()}`;
    const newSection: Section = {
      ...sectionData,
      id,
    };
    await saveSection(newSection);
    setSections((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      return [...filtered, newSection].sort((a, b) => a.order - b.order);
    });
    showToast(existingId ? 'تم تعديل الخانة بنجاح' : 'تمت إضافة الخانة في وسط المادة بنجاح');
  };

  const handleQuickAddSection = async (subjectId: string, title: string): Promise<Section> => {
    const existingCount = sections.filter((s) => s.subjectId === subjectId).length;
    const newSec: Section = {
      id: `sec-${Date.now()}`,
      subjectId,
      title,
      order: existingCount + 1,
    };
    await saveSection(newSec);
    setSections((prev) => [...prev, newSec].sort((a, b) => a.order - b.order));
    showToast(`تمت إضافة خانة "${title}"`);
    return newSec;
  };

  const handleDeleteSection = (sec: Section) => {
    setDeleteConfirmation({
      type: 'section',
      id: sec.id,
      title: sec.title,
    });
  };

  // Lesson actions
  const handleOpenAddLesson = (subjectId?: string, sectionId?: string) => {
    setEditingLesson(null);
    setLessonModalSubjectId(subjectId || selectedSubjectId || (subjects[0]?.id ?? ''));
    setLessonModalSectionId(sectionId || '');
    setIsLessonModalOpen(true);
  };

  const handleOpenEditLesson = (les: Lesson) => {
    setEditingLesson(les);
    setLessonModalSubjectId(les.subjectId);
    setLessonModalSectionId(les.sectionId);
    setIsLessonModalOpen(true);
  };

  const handleSaveLesson = async (
    lessonData: Omit<Lesson, 'id' | 'createdAt'>,
    existingId?: string
  ) => {
    const id = existingId || `les-${Date.now()}`;
    const createdAt = existingId
      ? (lessons.find((l) => l.id === existingId)?.createdAt || new Date().toISOString().split('T')[0])
      : new Date().toISOString().split('T')[0];

    const newLesson: Lesson = {
      ...lessonData,
      id,
      createdAt,
    };
    await saveLesson(newLesson);
    setLessons((prev) => {
      const filtered = prev.filter((l) => l.id !== id);
      return [newLesson, ...filtered];
    });
    showToast(existingId ? 'تم تعديل الدرس بنجاح' : 'تم نشر الدرس بنجاح وجاهز للفتح والتحميل');
  };

  const handleDeleteLesson = (les: Lesson) => {
    setDeleteConfirmation({
      type: 'lesson',
      id: les.id,
      title: les.title,
    });
  };

  // Confirm delete handler
  const handleConfirmDelete = async () => {
    if (!deleteConfirmation) return;
    const { type, id, title } = deleteConfirmation;

    if (type === 'subject') {
      await removeSubject(id);
      setSubjects((prev) => prev.filter((s) => s.id !== id));
      setSections((prev) => prev.filter((s) => s.subjectId !== id));
      setLessons((prev) => prev.filter((l) => l.subjectId !== id));
      if (selectedSubjectId === id) {
        setSelectedSubjectId(null);
      }
      showToast(`تم حذف مادة "${title}" وجميع محتوياتها`);
    } else if (type === 'section') {
      await removeSection(id);
      setSections((prev) => prev.filter((s) => s.id !== id));
      setLessons((prev) => prev.filter((l) => l.sectionId !== id));
      showToast(`تم حذف خانة "${title}"`);
    } else if (type === 'lesson') {
      await removeLesson(id);
      setLessons((prev) => prev.filter((l) => l.id !== id));
      showToast(`تم حذف درس "${title}"`);
    }

    setDeleteConfirmation(null);
  };

  // PDF Viewer & Download
  const handleViewPdf = (lesson: Lesson) => {
    setViewingLesson(lesson);
    setIsPdfViewerOpen(true);
  };

  const handleDownloadPdf = (lesson: Lesson) => {
    const link = document.createElement('a');
    link.href = lesson.pdfDataUrl;
    link.download = lesson.pdfFileName.toLowerCase().endsWith('.pdf')
      ? lesson.pdfFileName
      : `${lesson.pdfFileName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`جاري تحميل ملف "${lesson.pdfFileName}"...`);
  };

  // Reset to default sample lessons
  const handleResetData = async () => {
    if (window.confirm('هل تريد استعادة المواد والدروس النموذجية الافتراضية؟')) {
      const def = await resetAllData();
      setSubjects(def.subjects);
      setSections(def.sections);
      setLessons(def.lessons);
      showToast('تمت استعادة البيانات الافتراضية بنجاح.');
    }
  };

  // Active Subject Object
  const currentSubject = useMemo(() => {
    return subjects.find((s) => s.id === selectedSubjectId) || null;
  }, [subjects, selectedSubjectId]);

  // Global search filtering
  const filteredSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().trim();

    const matchedSubjects = subjects.filter(
      (s) => s.title.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q)
    );
    const matchedSections = sections.filter((sec) => sec.title.toLowerCase().includes(q));
    const matchedLessons = lessons.filter(
      (les) =>
        les.title.toLowerCase().includes(q) ||
        les.description?.toLowerCase().includes(q) ||
        les.pdfFileName.toLowerCase().includes(q)
    );

    return {
      subjects: matchedSubjects,
      sections: matchedSections,
      lessons: matchedLessons,
    };
  }, [searchQuery, subjects, sections, lessons]);

  return (
    <div className={`min-h-screen flex flex-col bg-neutral-100/60 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors selection:bg-amber-500 selection:text-white ${theme === 'dark' ? 'dark' : ''}`}>
      
      {/* Header */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        isAdmin={isAdmin}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onAdminLogout={handleAdminLogout}
        onOpenAddSubject={handleOpenAddSubject}
        onOpenAddLesson={() => handleOpenAddLesson()}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onGoHome={() => {
          setSelectedSubjectId(null);
          setSearchQuery('');
        }}
      />

      {/* Admin Sticky Notice Bar if logged in */}
      {isAdmin && (
        <div
          id="admin-active-banner"
          className="bg-amber-500 text-neutral-950 text-xs sm:text-sm font-bold py-2.5 px-4 shadow-inner"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-950 animate-pulse" />
              <span>وضع المسؤول نشط (Admin Mode): يمكنك إضافة مواد، وخانات داخل المواد، ونشر أو تعديل أو حذف أي درس.</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetData}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/15 hover:bg-black/25 text-neutral-950 text-xs font-bold transition-colors cursor-pointer"
                title="إعادة تعيين المواد والدروس الافتراضية"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>استعادة الافتراضي</span>
              </button>
              <button
                type="button"
                onClick={handleAdminLogout}
                className="underline hover:text-white transition-colors cursor-pointer"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="app-toast-alert"
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-neutral-900/95 dark:bg-white/95 text-white dark:text-neutral-900 text-sm font-bold shadow-2xl flex items-center gap-2.5 border border-neutral-700 dark:border-neutral-300 animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-bold text-neutral-600 dark:text-neutral-400">
              جاري تجهيز المواد والدروس...
            </p>
          </div>
        ) : filteredSearchResults ? (
          /* Search Results View */
          <div className="space-y-8">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
              <div>
                <h2 className="text-xl font-black text-neutral-900 dark:text-white flex items-center gap-2">
                  <Search className="w-5 h-5 text-amber-500" />
                  <span>نتائج البحث عن: "{searchQuery}"</span>
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  وجدنا {filteredSearchResults.lessons.length} درس و {filteredSearchResults.subjects.length} مادة
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-3.5 py-1.5 text-xs font-bold rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                مسح البحث
              </button>
            </div>

            {/* Matching Lessons */}
            {filteredSearchResults.lessons.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                  الدروس المطابقة ({filteredSearchResults.lessons.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {filteredSearchResults.lessons.map((lesson) => {
                    const sub = subjects.find((s) => s.id === lesson.subjectId);
                    return (
                      <div
                        key={lesson.id}
                        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 flex flex-col justify-between shadow-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300">
                              {sub?.title || 'مادة'}
                            </span>
                            <span className="text-xs text-neutral-400">{lesson.pdfFileName}</span>
                          </div>
                          <h4 className="font-bold text-sm text-neutral-900 dark:text-white mb-2">
                            {lesson.title}
                          </h4>
                          {lesson.description && (
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-3">
                              {lesson.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                          <button
                            type="button"
                            onClick={() => handleViewPdf(lesson)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-bold"
                          >
                            <Eye className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                            <span>فتح</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownloadPdf(lesson)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>تحميل</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Matching Subjects */}
            {filteredSearchResults.subjects.length > 0 && (
              <div className="space-y-3 pt-4">
                <h3 className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                  المواد الدراسية ({filteredSearchResults.subjects.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSearchResults.subjects.map((sub) => (
                    <SubjectCard
                      key={sub.id}
                      subject={sub}
                      sections={sections}
                      lessons={lessons}
                      isAdmin={isAdmin}
                      onSelect={(s) => {
                        setSelectedSubjectId(s.id);
                        setSearchQuery('');
                      }}
                      onEdit={handleOpenEditSubject}
                      onDelete={handleDeleteSubject}
                      onAddSection={(s, e) => {
                        e.stopPropagation();
                        handleOpenAddSection(s.id);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {filteredSearchResults.lessons.length === 0 &&
              filteredSearchResults.subjects.length === 0 && (
                <div className="text-center py-16 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800">
                  <Search className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
                  <p className="font-bold text-neutral-700 dark:text-neutral-300">
                    لم يتم العثور على أي نتائج مطابقة
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    جرب البحث بكلمات أخرى أو تصفح المواد مباشرة
                  </p>
                </div>
              )}
          </div>
        ) : selectedSubjectId && currentSubject ? (
          /* Detail view of a chosen subject */
          <SubjectDetailView
            subject={currentSubject}
            sections={sections}
            lessons={lessons}
            isAdmin={isAdmin}
            onBack={() => setSelectedSubjectId(null)}
            onOpenAddSection={handleOpenAddSection}
            onOpenEditSection={handleOpenEditSection}
            onDeleteSection={handleDeleteSection}
            onOpenAddLesson={handleOpenAddLesson}
            onOpenEditLesson={handleOpenEditLesson}
            onDeleteLesson={handleDeleteLesson}
            onViewPdf={handleViewPdf}
            onDownloadPdf={handleDownloadPdf}
          />
        ) : (
          /* Main Homepage: Subjects Grid */
          <div className="space-y-8">
            
            {/* Hero Banner with summary */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 text-white p-6 sm:p-10 shadow-lg">
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>جميع المواد والدروس المقررة - BEM 2027</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-3">
                  البرنامج السنوي - BEM 2027 -
                </h1>
                <p className="text-sm sm:text-base text-amber-100 leading-relaxed mb-6">
                  اختر أي مادة لتصفح وحداتها وخاناتها التعليمية، وقراءة أو تحميل دروسها بصيغة PDF بجودة عالية.
                </p>

                {isAdmin && (
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={handleOpenAddSubject}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-neutral-900 font-bold text-xs sm:text-sm hover:bg-neutral-100 shadow-md transition-all cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4 text-amber-600" />
                      <span>إضافة خانة مادة جديدة</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenAddLesson()}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-900 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                    >
                      <FilePlus className="w-4 h-4 text-amber-400" />
                      <span>نشر درس جديد (رفع PDF)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Decorative background circle */}
              <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            </div>

            {/* Section Title */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
                  المواد الدراسية المقررة
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  انقر على أي مادة لاستعراض الخانات والدروس الخاصة بها
                </p>
              </div>

              {isAdmin && (
                <button
                  type="button"
                  onClick={handleOpenAddSubject}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>إضافة مادة</span>
                </button>
              )}
            </div>

            {/* Subjects Grid */}
            <div
              id="subjects-grid"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              {subjects.map((subj) => (
                <SubjectCard
                  key={subj.id}
                  subject={subj}
                  sections={sections}
                  lessons={lessons}
                  isAdmin={isAdmin}
                  onSelect={(s) => setSelectedSubjectId(s.id)}
                  onEdit={handleOpenEditSubject}
                  onDelete={handleDeleteSubject}
                  onAddSection={(s, e) => {
                    e.stopPropagation();
                    handleOpenAddSection(s.id);
                  }}
                />
              ))}
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <Footer />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={handleAdminLoginSuccess}
      />

      {/* Subject Modal */}
      <SubjectModal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        onSave={handleSaveSubject}
        editingSubject={editingSubject}
        totalSubjectsCount={subjects.length}
      />

      {/* Section Modal */}
      <SectionModal
        isOpen={isSectionModalOpen}
        onClose={() => setIsSectionModalOpen(false)}
        onSave={handleSaveSection}
        subjects={subjects}
        initialSubjectId={sectionModalSubjectId}
        editingSection={editingSection}
      />

      {/* Lesson Modal */}
      <LessonModal
        isOpen={isLessonModalOpen}
        onClose={() => setIsLessonModalOpen(false)}
        onSave={handleSaveLesson}
        subjects={subjects}
        sections={sections}
        initialSubjectId={lessonModalSubjectId}
        initialSectionId={lessonModalSectionId}
        editingLesson={editingLesson}
        onQuickAddSection={handleQuickAddSection}
      />

      {/* PDF Viewer Modal */}
      <PdfViewerModal
        isOpen={isPdfViewerOpen}
        onClose={() => {
          setIsPdfViewerOpen(false);
          setViewingLesson(null);
        }}
        lesson={viewingLesson}
        subject={subjects.find((s) => s.id === viewingLesson?.subjectId)}
        onDownload={handleDownloadPdf}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div
          id="delete-confirmation-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
              تأكيد عملية الحذف
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 leading-relaxed">
              هل أنت متأكد من رغبتك في حذف{' '}
              <span className="font-bold text-neutral-900 dark:text-white">
                "{deleteConfirmation.title}"
              </span>
              ؟ هذا الإجراء لا يمكن التراجع عنه.
            </p>
            <div className="flex gap-3">
              <button
                id="confirm-delete-btn"
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                تأكيد الحذف
              </button>
              <button
                id="cancel-delete-btn"
                type="button"
                onClick={() => setDeleteConfirmation(null)}
                className="py-2.5 px-4 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-semibold text-sm rounded-xl transition-colors cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
