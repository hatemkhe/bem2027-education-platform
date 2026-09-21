import React, { useEffect } from 'react';
import { Lesson, Subject } from '../types';
import { X, Download, ExternalLink, FileText, AlertTriangle } from 'lucide-react';

interface PdfViewerModalProps {
  lesson: Lesson | null;
  subject?: Subject;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (lesson: Lesson) => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  lesson,
  subject,
  isOpen,
  onClose,
  onDownload,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !lesson) return null;

  const handleOpenInNewTab = () => {
    // Open the PDF in a new browser tab/window
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(
        `<iframe src="${lesson.pdfDataUrl}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
      );
      newWindow.document.title = lesson.title;
    } else {
      // Fallback
      window.open(lesson.pdfDataUrl, '_blank');
    }
  };

  return (
    <div
      id="pdf-viewer-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        id="pdf-viewer-card"
        className="relative flex flex-col w-full max-w-5xl h-[92vh] bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Top bar controls */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/90 dark:bg-neutral-900/90 backdrop-blur-md">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xs shrink-0 border border-red-200 dark:border-red-900/60">
              PDF
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white truncate">
                {lesson.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                {subject && <span>{subject.title}</span>}
                {subject && <span>•</span>}
                <span className="truncate">{lesson.pdfFileName}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              id="open-pdf-new-tab-btn"
              type="button"
              onClick={handleOpenInNewTab}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs font-semibold transition-colors cursor-pointer"
              title="فتح في تبويب مستقل"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>تبويب جديد</span>
            </button>

            <button
              id="modal-download-pdf-btn"
              type="button"
              onClick={() => onDownload(lesson)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تحميل</span>
            </button>

            <button
              id="close-pdf-viewer-btn"
              type="button"
              onClick={onClose}
              className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-xl hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Frame / Viewer Canvas */}
        <div className="flex-1 w-full h-full bg-neutral-100 dark:bg-neutral-950 relative overflow-hidden">
          {lesson.pdfDataUrl ? (
            <iframe
              id="pdf-iframe-element"
              src={lesson.pdfDataUrl}
              className="w-full h-full border-none"
              title={lesson.title}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center text-neutral-500">
              <AlertTriangle className="w-12 h-12 text-amber-500 mb-3" />
              <p className="font-bold text-neutral-800 dark:text-neutral-200">
                الملف غير متوفر حالياً للعرض المباشر
              </p>
              <button
                type="button"
                onClick={() => onDownload(lesson)}
                className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold"
              >
                تحميل الملف بدلاً من ذلك
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
