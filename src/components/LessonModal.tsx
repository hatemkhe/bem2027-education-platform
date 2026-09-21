import React, { useState, useEffect, useRef } from 'react';
import { Subject, Section, Lesson } from '../types';
import {
  X,
  UploadCloud,
  FileText,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Plus,
} from 'lucide-react';
import { createSamplePdfDataUrl } from '../utils/storage';

interface LessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lessonData: Omit<Lesson, 'id' | 'createdAt'>, existingId?: string) => Promise<void>;
  subjects: Subject[];
  sections: Section[];
  initialSubjectId?: string;
  initialSectionId?: string;
  editingLesson?: Lesson | null;
  onQuickAddSection?: (subjectId: string, title: string) => Promise<Section>;
}

export const LessonModal: React.FC<LessonModalProps> = ({
  isOpen,
  onClose,
  onSave,
  subjects,
  sections,
  initialSubjectId,
  initialSectionId,
  editingLesson,
  onQuickAddSection,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');
  const [pdfFileSize, setPdfFileSize] = useState('');
  const [pdfDataUrl, setPdfDataUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Quick section add state
  const [isAddingNewSection, setIsAddingNewSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingLesson) {
      setSelectedSubjectId(editingLesson.subjectId);
      setSelectedSectionId(editingLesson.sectionId);
      setTitle(editingLesson.title);
      setDescription(editingLesson.description || '');
      setPdfFileName(editingLesson.pdfFileName);
      setPdfFileSize(editingLesson.pdfFileSize || '');
      setPdfDataUrl(editingLesson.pdfDataUrl);
    } else {
      const defaultSubId = initialSubjectId || (subjects.length > 0 ? subjects[0].id : '');
      setSelectedSubjectId(defaultSubId);

      const availableSecs = sections.filter((s) => s.subjectId === defaultSubId);
      setSelectedSectionId(
        initialSectionId || (availableSecs.length > 0 ? availableSecs[0].id : '')
      );
      setTitle('');
      setDescription('');
      setPdfFileName('');
      setPdfFileSize('');
      setPdfDataUrl('');
    }
    setError(null);
    setIsAddingNewSection(false);
    setNewSectionTitle('');
  }, [isOpen, editingLesson, initialSubjectId, initialSectionId, subjects, sections]);

  if (!isOpen) return null;

  // Filter sections belonging to selected subject
  const currentSubjectSections = sections.filter(
    (s) => s.subjectId === selectedSubjectId
  );

  const handleSubjectChange = (newSubId: string) => {
    setSelectedSubjectId(newSubId);
    const secs = sections.filter((s) => s.subjectId === newSubId);
    setSelectedSectionId(secs.length > 0 ? secs[0].id : '');
  };

  const processFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setError('يرجى اختيار ملف بصيغة PDF فقط.');
      return;
    }

    // Calculate human readable size
    let sizeStr = '';
    if (file.size < 1024 * 1024) {
      sizeStr = `${Math.round(file.size / 1024)} KB`;
    } else {
      sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    }

    setPdfFileName(file.name);
    setPdfFileSize(sizeStr);
    setError(null);

    // Read as Base64 Data URL
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPdfDataUrl(reader.result);
      }
    };
    reader.onerror = () => {
      setError('حدث خطأ أثناء قراءة ملف الـ PDF. يرجى المحاولة مرة أخرى.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleQuickAddSectionSubmit = async () => {
    if (!newSectionTitle.trim()) return;
    if (!onQuickAddSection || !selectedSubjectId) return;

    try {
      const createdSec = await onQuickAddSection(selectedSubjectId, newSectionTitle.trim());
      setSelectedSectionId(createdSec.id);
      setIsAddingNewSection(false);
      setNewSectionTitle('');
    } catch {
      setError('تعذر إنشاء الخانة الجديدة');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSubjectId) {
      setError('يرجى اختيار المادة الدراسية.');
      return;
    }

    if (!selectedSectionId) {
      setError('يرجى اختيار أو إنشاء خانة / قسم داخل المادة.');
      return;
    }

    if (!title.trim()) {
      setError('يرجى إدخال عنوان الدرس.');
      return;
    }

    if (!pdfDataUrl) {
      setError('يرجى رفع ملف الـ PDF للدرس.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const targetSubject = subjects.find((s) => s.id === selectedSubjectId);
      const finalPdfUrl = pdfDataUrl || createSamplePdfDataUrl(title, targetSubject?.title || 'درس تعليمي');

      await onSave(
        {
          subjectId: selectedSubjectId,
          sectionId: selectedSectionId,
          title: title.trim(),
          description: description.trim() || undefined,
          pdfFileName: pdfFileName || `${title.trim()}.pdf`,
          pdfFileSize: pdfFileSize || '1 MB',
          pdfDataUrl: finalPdfUrl,
        },
        editingLesson ? editingLesson.id : undefined
      );

      onClose();
    } catch {
      setError('حدث خطأ أثناء حفظ الدرس. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="lesson-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="lesson-modal-card"
        className="relative w-full max-w-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          id="close-lesson-modal-btn"
          type="button"
          onClick={onClose}
          className="absolute top-5 left-5 p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            {editingLesson ? 'تعديل بيانات الدرس' : 'نشر درس جديد (رفع ملف PDF)'}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            حدد المادة والخانة، وأدخل عنوان الدرس وارفع ملف الـ PDF ليكون متاحاً للفتح والتحميل
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Subject & Section Selection in Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Subject Dropdown */}
            <div>
              <label
                htmlFor="lesson-subject-select"
                className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5"
              >
                المادة الدراسية *
              </label>
              <select
                id="lesson-subject-select"
                value={selectedSubjectId}
                onChange={(e) => handleSubjectChange(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Section Dropdown */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="lesson-section-select"
                  className="block text-xs font-bold text-neutral-700 dark:text-neutral-300"
                >
                  الخانة / القسم داخل المادة *
                </label>
                {onQuickAddSection && !isAddingNewSection && (
                  <button
                    type="button"
                    onClick={() => setIsAddingNewSection(true)}
                    className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>خانة جديدة</span>
                  </button>
                )}
              </div>

              {isAddingNewSection ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={newSectionTitle}
                    onChange={(e) => setNewSectionTitle(e.target.value)}
                    placeholder="اسم الخانة الجديدة..."
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleQuickAddSectionSubmit}
                    className="px-2.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    حفظ
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingNewSection(false)}
                    className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 text-xs cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <select
                  id="lesson-section-select"
                  value={selectedSectionId}
                  onChange={(e) => setSelectedSectionId(e.target.value)}
                  required
                  disabled={currentSubjectSections.length === 0}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer disabled:opacity-50"
                >
                  {currentSubjectSections.length === 0 ? (
                    <option value="">لا توجد خانات (اضغط "خانة جديدة")</option>
                  ) : (
                    currentSubjectSections.map((sec) => (
                      <option key={sec.id} value={sec.id}>
                        {sec.title}
                      </option>
                    ))
                  )}
                </select>
              )}
            </div>

          </div>

          {/* Lesson Title */}
          <div>
            <label
              htmlFor="lesson-title-input"
              className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5"
            >
              عنوان الدرس *
            </label>
            <input
              id="lesson-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: إعراب إذا وإذ بالتفصيل مع أمثلة ونماذج إعرابية"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
            />
          </div>

          {/* Lesson Description (Optional) */}
          <div>
            <label
              htmlFor="lesson-description-input"
              className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5"
            >
              وصف مختصر أو محاور الدرس (اختياري)
            </label>
            <textarea
              id="lesson-description-input"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="شرح موجز لمحتوى الدرس أو أهم النقاط الواردة فيه..."
              className="w-full px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all resize-none"
            />
          </div>

          {/* PDF File Upload Area */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
              ملف الـ PDF للدرس *
            </label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".pdf,application/pdf"
              className="hidden"
            />

            {pdfFileName ? (
              /* Selected File Card */
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                    PDF
                  </div>
                  <div>
                    <p className="font-bold text-sm text-neutral-900 dark:text-white truncate max-w-xs sm:max-w-sm">
                      {pdfFileName}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>جاهز للفتح والتحميل</span>
                      </span>
                      {pdfFileSize && <span>• {pdfFileSize}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-neutral-700 rounded-xl transition-colors cursor-pointer"
                  >
                    تغيير الملف
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPdfFileName('');
                      setPdfFileSize('');
                      setPdfDataUrl('');
                    }}
                    className="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-950/60 rounded-xl transition-colors cursor-pointer"
                    title="حذف الملف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Drag and drop upload container */
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30'
                    : 'border-neutral-300 dark:border-neutral-700 hover:border-amber-500 dark:hover:border-amber-500 bg-neutral-50/50 dark:bg-neutral-800/30'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                  انقر هنا لاختيار ملف PDF أو اسحبه وأفلته هنا
                </p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                  يدعم مستندات وملخصات PDF المدرسية
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex gap-3">
            <button
              id="save-lesson-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <FileText className="w-4 h-4" />
              <span>{editingLesson ? 'حفظ التعديلات' : 'نشر الدرس الآن'}</span>
            </button>
            <button
              id="cancel-lesson-modal-btn"
              type="button"
              onClick={onClose}
              className="py-3 px-5 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-semibold text-sm rounded-xl transition-colors cursor-pointer"
            >
              إلغاء
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
