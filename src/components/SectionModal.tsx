import React, { useState, useEffect } from 'react';
import { Subject, Section } from '../types';
import { X, Layers, AlertCircle } from 'lucide-react';

interface SectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sectionData: Omit<Section, 'id'>, existingId?: string) => Promise<void>;
  subjects: Subject[];
  initialSubjectId?: string;
  editingSection?: Section | null;
}

export const SectionModal: React.FC<SectionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  subjects,
  initialSubjectId,
  editingSection,
}) => {
  const [subjectId, setSubjectId] = useState('');
  const [title, setTitle] = useState('');
  const [order, setOrder] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingSection) {
      setSubjectId(editingSection.subjectId);
      setTitle(editingSection.title);
      setOrder(editingSection.order);
    } else {
      setSubjectId(initialSubjectId || (subjects.length > 0 ? subjects[0].id : ''));
      setTitle('');
      setOrder(1);
    }
    setError(null);
  }, [isOpen, editingSection, initialSubjectId, subjects]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectId) {
      setError('يرجى اختيار المادة الدراسية.');
      return;
    }
    if (!title.trim()) {
      setError('يرجى كتابة عنوان الخانة / القسم.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSave(
        {
          subjectId,
          title: title.trim(),
          order: Number(order) || 1,
        },
        editingSection ? editingSection.id : undefined
      );
      onClose();
    } catch {
      setError('حدث خطأ أثناء حفظ الخانة.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="section-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="section-modal-card"
        className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl p-6 sm:p-7"
      >
        <button
          id="close-section-modal-btn"
          type="button"
          onClick={onClose}
          className="absolute top-5 left-5 p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800/80">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              {editingSection ? 'تعديل الخانة / القسم' : 'إنشاء خانة جديدة داخل المادة'}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              تقسيم المادة إلى فصول أو وحدات لتنظيم الدروس
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="section-subject-select"
              className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5"
            >
              المادة التابعة لها الخانة *
            </label>
            <select
              id="section-subject-select"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="section-title-input"
              className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5"
            >
              عنوان الخانة / الفصل / الوحدة *
            </label>
            <input
              id="section-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: الفصل الأول: الدوال العددية"
              required
              autoFocus
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label
              htmlFor="section-order-input"
              className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5"
            >
              ترتيب الظهور
            </label>
            <input
              id="section-order-input"
              type="number"
              min="1"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              id="save-section-btn"
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {editingSection ? 'حفظ التعديلات' : 'إنشاء الخانة'}
            </button>
            <button
              id="cancel-section-btn"
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-semibold text-sm rounded-xl transition-colors cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
