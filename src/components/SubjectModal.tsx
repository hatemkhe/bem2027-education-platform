import React, { useState, useEffect } from 'react';
import { Subject } from '../types';
import { AVAILABLE_ICONS, SubjectIcon } from './SubjectIcon';
import { X, BookPlus, AlertCircle } from 'lucide-react';

interface SubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (subjectData: Omit<Subject, 'id'>, existingId?: string) => Promise<void>;
  editingSubject?: Subject | null;
  totalSubjectsCount: number;
}

const COLOR_PRESETS = [
  {
    name: 'أخضر زمردي',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-900/60',
    gradient: 'from-emerald-600 to-teal-700',
  },
  {
    name: 'أزرق سماوي',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
    badgeBg: 'bg-blue-100 dark:bg-blue-900/60',
    gradient: 'from-blue-600 to-indigo-700',
  },
  {
    name: 'بنفسجي نيلي',
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    text: 'text-indigo-700 dark:text-indigo-300',
    border: 'border-indigo-200 dark:border-indigo-800',
    badgeBg: 'bg-indigo-100 dark:bg-indigo-900/60',
    gradient: 'from-indigo-600 to-violet-700',
  },
  {
    name: 'كهرماني / برتقالي',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800',
    badgeBg: 'bg-amber-100 dark:bg-amber-900/60',
    gradient: 'from-amber-600 to-orange-700',
  },
  {
    name: 'وردي / أحمر',
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    text: 'text-rose-700 dark:text-rose-300',
    border: 'border-rose-200 dark:border-rose-800',
    badgeBg: 'bg-rose-100 dark:bg-rose-900/60',
    gradient: 'from-rose-600 to-red-700',
  },
  {
    name: 'رمادي حجري',
    bg: 'bg-stone-50 dark:bg-stone-900/40',
    text: 'text-stone-700 dark:text-stone-300',
    border: 'border-stone-200 dark:border-stone-700',
    badgeBg: 'bg-stone-100 dark:bg-stone-800',
    gradient: 'from-stone-600 to-neutral-700',
  },
  {
    name: 'ليموني / تفاحي',
    bg: 'bg-lime-50 dark:bg-lime-950/40',
    text: 'text-lime-700 dark:text-lime-300',
    border: 'border-lime-200 dark:border-lime-800',
    badgeBg: 'bg-lime-100 dark:bg-lime-900/60',
    gradient: 'from-lime-600 to-emerald-700',
  },
  {
    name: 'سماوي فاقع',
    bg: 'bg-sky-50 dark:bg-sky-950/40',
    text: 'text-sky-700 dark:text-sky-300',
    border: 'border-sky-200 dark:border-sky-800',
    badgeBg: 'bg-sky-100 dark:bg-sky-900/60',
    gradient: 'from-sky-600 to-teal-700',
  },
];

export const SubjectModal: React.FC<SubjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingSubject,
  totalSubjectsCount,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('BookOpen');
  const [colorIndex, setColorIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingSubject) {
      setTitle(editingSubject.title);
      setDescription(editingSubject.description || '');
      setIconName(editingSubject.iconName || 'BookOpen');
      const idx = COLOR_PRESETS.findIndex((c) => c.gradient === editingSubject.colorScheme.gradient);
      setColorIndex(idx >= 0 ? idx : 0);
    } else {
      setTitle('');
      setDescription('');
      setIconName('BookOpen');
      setColorIndex(totalSubjectsCount % COLOR_PRESETS.length);
    }
    setError(null);
  }, [isOpen, editingSubject, totalSubjectsCount]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('يرجى إدخال اسم المادة الدراسية.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const chosenColor = COLOR_PRESETS[colorIndex];
      await onSave(
        {
          title: title.trim(),
          description: description.trim() || undefined,
          iconName,
          colorScheme: chosenColor,
          order: editingSubject ? editingSubject.order : totalSubjectsCount + 1,
        },
        editingSubject ? editingSubject.id : undefined
      );
      onClose();
    } catch {
      setError('حدث خطأ أثناء حفظ المادة.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="subject-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="subject-modal-card"
        className="relative w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
      >
        <button
          id="close-subject-modal-btn"
          type="button"
          onClick={onClose}
          className="absolute top-5 left-5 p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-800/80">
            <BookPlus className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              {editingSubject ? 'تعديل بيانات المادة' : 'إضافة مادة دراسية جديدة'}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              إنشاء خانة مادة جديدة تضاف إلى المواد الدراسية في الصفحة الرئيسية
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="subject-title-input"
              className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5"
            >
              اسم المادة الدراسية *
            </label>
            <input
              id="subject-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: فلسفة، أو لغة ألمانية، أو إعلام آلي..."
              required
              autoFocus
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label
              htmlFor="subject-description-input"
              className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5"
            >
              وصف المادة (اختياري)
            </label>
            <input
              id="subject-description-input"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="وصف مختصر للمواضيع والوحدات المتضمنة..."
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Icon Picker */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-2">
              أيقونة المادة
            </label>
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-2xl border border-neutral-200 dark:border-neutral-800 max-h-36 overflow-y-auto">
              {AVAILABLE_ICONS.map((icon) => (
                <button
                  key={icon.name}
                  type="button"
                  onClick={() => setIconName(icon.name)}
                  title={icon.label}
                  className={`p-2.5 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    iconName === icon.name
                      ? 'bg-amber-600 text-white shadow-xs scale-105'
                      : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-neutral-700'
                  }`}
                >
                  <SubjectIcon name={icon.name} className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Color Scheme Picker */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-2">
              لون وهوية المادة
            </label>
            <div className="grid grid-cols-4 gap-2">
              {COLOR_PRESETS.map((color, idx) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setColorIndex(idx)}
                  className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    colorIndex === idx
                      ? 'border-neutral-900 dark:border-white ring-2 ring-amber-500/50 shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-700 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className={`w-full h-4 rounded-md bg-gradient-to-r ${color.gradient}`} />
                  <span className="text-[10px] font-semibold text-neutral-700 dark:text-neutral-300 truncate w-full">
                    {color.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 flex gap-3">
            <button
              id="save-subject-btn"
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {editingSubject ? 'حفظ التعديلات' : 'إضافة المادة الآن'}
            </button>
            <button
              id="cancel-subject-btn"
              type="button"
              onClick={onClose}
              className="py-3 px-4 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-semibold text-sm rounded-xl transition-colors cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
