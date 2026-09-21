import React, { useState } from 'react';
import { Subject, Section, Lesson } from '../types';
import { SubjectIcon } from './SubjectIcon';
import {
  ArrowRight,
  PlusCircle,
  FilePlus,
  Layers,
  FileText,
  Eye,
  Download,
  Edit3,
  Trash2,
  Calendar,
  FolderOpen,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface SubjectDetailViewProps {
  subject: Subject;
  sections: Section[];
  lessons: Lesson[];
  isAdmin: boolean;
  onBack: () => void;
  onOpenAddSection: (subjectId: string) => void;
  onOpenEditSection: (section: Section) => void;
  onDeleteSection: (section: Section) => void;
  onOpenAddLesson: (subjectId: string, sectionId?: string) => void;
  onOpenEditLesson: (lesson: Lesson) => void;
  onDeleteLesson: (lesson: Lesson) => void;
  onViewPdf: (lesson: Lesson) => void;
  onDownloadPdf: (lesson: Lesson) => void;
}

export const SubjectDetailView: React.FC<SubjectDetailViewProps> = ({
  subject,
  sections,
  lessons,
  isAdmin,
  onBack,
  onOpenAddSection,
  onOpenEditSection,
  onDeleteSection,
  onOpenAddLesson,
  onOpenEditLesson,
  onDeleteLesson,
  onViewPdf,
  onDownloadPdf,
}) => {
  // Filter sections and lessons for this subject
  const subjectSections = sections
    .filter((s) => s.subjectId === subject.id)
    .sort((a, b) => a.order - b.order);

  const subjectLessons = lessons.filter((l) => l.subjectId === subject.id);

  // Keep track of collapsed/expanded sections (all expanded by default)
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  return (
    <div id={`subject-detail-view-${subject.id}`} className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          id="back-to-all-subjects-btn"
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-sm font-bold shadow-xs transition-colors cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>الرجوع إلى جميع المواد</span>
        </button>

        {/* Admin Quick Action Buttons */}
        {isAdmin && (
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="admin-add-section-btn"
              type="button"
              onClick={() => onOpenAddSection(subject.id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 text-xs font-bold transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>إضافة خانة / قسم جديد</span>
            </button>
            <button
              id="admin-add-lesson-in-subject-btn"
              type="button"
              onClick={() => onOpenAddLesson(subject.id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <FilePlus className="w-4 h-4" />
              <span>نشر درس جديد (PDF)</span>
            </button>
          </div>
        )}
      </div>

      {/* Subject Header Banner */}
      <div
        className={`relative overflow-hidden rounded-3xl border ${subject.colorScheme.border} bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-sm`}
      >
        <div
          className={`absolute top-0 inset-x-0 h-2 bg-gradient-to-r ${subject.colorScheme.gradient}`}
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ${subject.colorScheme.bg} ${subject.colorScheme.border} border-2 flex items-center justify-center ${subject.colorScheme.text} shadow-sm shrink-0`}
            >
              <SubjectIcon name={subject.iconName} className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">
                  {subject.title}
                </h1>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${subject.colorScheme.badgeBg} ${subject.colorScheme.text}`}
                >
                  مادة مقررة
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-4 bg-neutral-50 dark:bg-neutral-800/80 px-4 py-2.5 rounded-2xl border border-neutral-200 dark:border-neutral-700 text-xs font-medium">
            <div className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300">
              <Layers className="w-4 h-4 text-neutral-400" />
              <span>{subjectSections.length} خانات / أقسام</span>
            </div>
            <div className="w-px h-4 bg-neutral-300 dark:bg-neutral-700" />
            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
              <FileText className="w-4 h-4" />
              <span>{subjectLessons.length} دروس منشورة</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sections and Lessons */}
      <div className="space-y-6">
        {subjectSections.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white dark:bg-neutral-900 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-3xl">
            <FolderOpen className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200 mb-1">
              لا توجد خانات أو أقسام مضافة بعد
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mb-5">
              {isAdmin
                ? 'يمكنك الآن إنشاء الخانة الأولى في وسط هذه المادة ثم تقسيمها لدروس معينة.'
                : 'سيتم نشر الخانات والدروس من قبل المسؤول قريباً.'}
            </p>
            {isAdmin && (
              <button
                type="button"
                onClick={() => onOpenAddSection(subject.id)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-sm transition-colors cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>إنشاء خانة في وسط المادة الآن</span>
              </button>
            )}
          </div>
        ) : (
          subjectSections.map((section, index) => {
            const sectionLessons = subjectLessons.filter((l) => l.sectionId === section.id);
            const isCollapsed = !!collapsedSections[section.id];

            return (
              <div
                key={section.id}
                id={`section-container-${section.id}`}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xs overflow-hidden transition-all"
              >
                {/* Section Header Bar */}
                <div
                  className="p-4 sm:p-5 bg-neutral-50/80 dark:bg-neutral-800/40 border-b border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between gap-4 cursor-pointer select-none"
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 font-bold text-sm flex items-center justify-center border border-amber-500/20">
                      {index + 1}
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                        {section.title}
                      </h2>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {sectionLessons.length === 0
                          ? 'لا توجد دروس حالياً'
                          : `${sectionLessons.length} ${sectionLessons.length === 1 ? 'درس متاح' : 'دروس متاحة'}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {/* Admin Section Actions */}
                    {isAdmin && (
                      <div className="flex items-center gap-1.5 bg-white dark:bg-neutral-800 p-1 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-xs">
                        <button
                          type="button"
                          onClick={() => onOpenAddLesson(subject.id, section.id)}
                          title="إضافة درس في هذه الخانة"
                          className="px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">درس</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenEditSection(section)}
                          title="تعديل اسم الخانة"
                          className="p-1.5 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteSection(section)}
                          title="حذف الخانة وجميع دروسها"
                          className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Collapse / Expand icon */}
                    <button
                      type="button"
                      onClick={() => toggleSection(section.id)}
                      className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-xl hover:bg-neutral-200/50 dark:hover:bg-neutral-800 transition-colors"
                      aria-label="طي أو توسيع الخانة"
                    >
                      {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Section Lessons List */}
                {!isCollapsed && (
                  <div className="p-4 sm:p-5">
                    {sectionLessons.length === 0 ? (
                      <div className="text-center py-8 text-neutral-400 dark:text-neutral-500 text-sm">
                        <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                        <p>لا توجد دروس في هذه الخانة بعد.</p>
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => onOpenAddLesson(subject.id, section.id)}
                            className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                          >
                            <FilePlus className="w-4 h-4" />
                            <span>رفع أول درس PDF هنا</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {sectionLessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            id={`lesson-item-${lesson.id}`}
                            className="relative group bg-neutral-50/70 dark:bg-neutral-800/40 hover:bg-amber-50/40 dark:hover:bg-amber-950/20 border border-neutral-200/80 dark:border-neutral-800/80 hover:border-amber-300 dark:hover:border-amber-700/80 rounded-2xl p-4 transition-all flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-start justify-between gap-3 mb-2">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 border border-red-200 dark:border-red-900/60 font-black text-xs">
                                    PDF
                                  </div>
                                  <div>
                                    <h3 className="font-bold text-sm sm:text-base text-neutral-900 dark:text-white line-clamp-2">
                                      {lesson.title}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                                      <span>{lesson.pdfFileName}</span>
                                      {lesson.pdfFileSize && (
                                        <>
                                          <span>•</span>
                                          <span>{lesson.pdfFileSize}</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Admin Edit / Delete Lesson */}
                                {isAdmin && (
                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => onOpenEditLesson(lesson)}
                                      title="تعديل الدرس"
                                      className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors cursor-pointer"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => onDeleteLesson(lesson)}
                                      title="حذف الدرس"
                                      className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                )}
                              </div>

                              {lesson.description && (
                                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2 leading-relaxed">
                                  {lesson.description}
                                </p>
                              )}
                            </div>

                            {/* Actions: Open PDF / Download PDF */}
                            <div className="pt-3 border-t border-neutral-200/60 dark:border-neutral-700/60 flex items-center justify-between gap-2 mt-2">
                              <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{lesson.createdAt}</span>
                              </span>

                              <div className="flex items-center gap-2">
                                <button
                                  id={`view-pdf-${lesson.id}-btn`}
                                  type="button"
                                  onClick={() => onViewPdf(lesson)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                                  <span>فتح وقراءة</span>
                                </button>

                                <button
                                  id={`download-pdf-${lesson.id}-btn`}
                                  type="button"
                                  onClick={() => onDownloadPdf(lesson)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  <span>تحميل</span>
                                </button>
                              </div>
                            </div>

                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
