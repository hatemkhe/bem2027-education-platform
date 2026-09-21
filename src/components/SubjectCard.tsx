import React from 'react';
import { Subject, Section, Lesson } from '../types';
import { SubjectIcon } from './SubjectIcon';
import { Layers, FileText, ChevronLeft, Edit3, Trash2, PlusCircle } from 'lucide-react';

interface SubjectCardProps {
  subject: Subject;
  sections: Section[];
  lessons: Lesson[];
  isAdmin: boolean;
  onSelect: (subject: Subject) => void;
  onEdit: (subject: Subject, e: React.MouseEvent) => void;
  onDelete: (subject: Subject, e: React.MouseEvent) => void;
  onAddSection: (subject: Subject, e: React.MouseEvent) => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  sections,
  lessons,
  isAdmin,
  onSelect,
  onEdit,
  onDelete,
  onAddSection,
}) => {
  const subjectSections = sections.filter((s) => s.subjectId === subject.id);
  const subjectLessons = lessons.filter((l) => l.subjectId === subject.id);

  return (
    <div
      id={`subject-card-${subject.id}`}
      onClick={() => onSelect(subject)}
      className="group relative bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden"
    >
      {/* Decorative subtle top bar with gradient */}
      <div
        className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${subject.colorScheme.gradient || 'from-amber-500 to-amber-600'}`}
      />

      {/* Main card content */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div
            className={`w-13 h-13 rounded-2xl ${subject.colorScheme.bg} ${subject.colorScheme.border} border flex items-center justify-center ${subject.colorScheme.text} shadow-xs group-hover:scale-110 transition-transform`}
          >
            <SubjectIcon name={subject.iconName} className="w-6 h-6" />
          </div>

          {/* Admin Controls */}
          {isAdmin && (
            <div
              className="flex items-center gap-1 bg-neutral-100/90 dark:bg-neutral-800/90 p-1 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                id={`add-section-to-${subject.id}-btn`}
                type="button"
                onClick={(e) => onAddSection(subject, e)}
                title="إضافة خانة / قسم داخل المادة"
                className="p-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-lg transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
              </button>
              <button
                id={`edit-subject-${subject.id}-btn`}
                type="button"
                onClick={(e) => onEdit(subject, e)}
                title="تعديل المادة"
                className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                id={`delete-subject-${subject.id}-btn`}
                type="button"
                onClick={(e) => onDelete(subject, e)}
                title="حذف المادة وكل دروسها"
                className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Subject Title */}
        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
          {subject.title}
        </h3>
      </div>

      {/* Footer stats & enter action */}
      <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
            <Layers className="w-3.5 h-3.5 text-neutral-400" />
            <span>{subjectSections.length} خانات / أقسام</span>
          </div>
          <div className="flex items-center gap-1.5 font-semibold text-neutral-700 dark:text-neutral-300">
            <FileText className="w-3.5 h-3.5 text-amber-500" />
            <span>{subjectLessons.length} دروس</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold group-hover:-translate-x-1 transition-transform">
          <span>دخول</span>
          <ChevronLeft className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
