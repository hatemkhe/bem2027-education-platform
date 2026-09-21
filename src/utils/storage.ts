import { Subject, Section, Lesson } from '../types';

const DB_NAME = 'EducationalLessonsDB';
const DB_VERSION = 1;
const STORE_SUBJECTS = 'subjects';
const STORE_SECTIONS = 'sections';
const STORE_LESSONS = 'lessons';

// Helper to generate a valid minimal PDF Data URL for sample lessons
export function createSamplePdfDataUrl(title: string, subject: string): string {
  // A clean, valid minimal PDF document
  const content = `BT /F1 20 Tf 50 720 Td (${escapePdfText(subject)}) Tj ET ` +
    `BT /F1 16 Tf 50 670 Td (${escapePdfText(title)}) Tj ET ` +
    `BT /F1 12 Tf 50 620 Td (Educational Lesson Document - Manassat Al-Dourous) Tj ET ` +
    `BT /F1 10 Tf 50 580 Td (Prepared for Academic School Year) Tj ET ` +
    `BT /F1 10 Tf 50 550 Td (You can replace this document with any custom PDF from the Admin dashboard.) Tj ET`;

  const streamLength = content.length;

  const pdfSource = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length ${streamLength} >>
stream
${content}
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
0000000227 00000 n 
0000000300 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
${400 + streamLength}
%%EOF`;

  const base64 = btoa(unescape(encodeURIComponent(pdfSource)));
  return `data:application/pdf;base64,${base64}`;
}

function escapePdfText(text: string): string {
  return text.replace(/[()\\]/g, '\\$&');
}

// Initial default subjects requested by user
export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'sub-arabic',
    title: 'لغة عربية',
    iconName: 'BookOpen',
    colorScheme: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-200 dark:border-emerald-800',
      badgeBg: 'bg-emerald-100 dark:bg-emerald-900/60',
      gradient: 'from-emerald-600 to-teal-700',
    },
    description: 'دروس النحو، الصرف، البلاغة، النصوص الأدبية والمطالعة الموجهة',
    order: 1,
  },
  {
    id: 'sub-math',
    title: 'رياضيات',
    iconName: 'Calculator',
    colorScheme: {
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800',
      badgeBg: 'bg-blue-100 dark:bg-blue-900/60',
      gradient: 'from-blue-600 to-indigo-700',
    },
    description: 'الدوال، المتتاليات، الجبر، الهندسة الفضائية والاحتمالات',
    order: 2,
  },
  {
    id: 'sub-french',
    title: 'لغة فرنسية',
    iconName: 'Languages',
    colorScheme: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      text: 'text-indigo-700 dark:text-indigo-300',
      border: 'border-indigo-200 dark:border-indigo-800',
      badgeBg: 'bg-indigo-100 dark:bg-indigo-900/60',
      gradient: 'from-indigo-600 to-violet-700',
    },
    description: 'النصوص التاريخية والحجاجية، قواعد اللغة والتعبير الكتابي',
    order: 3,
  },
  {
    id: 'sub-english',
    title: 'لغة انجليزية',
    iconName: 'Globe',
    colorScheme: {
      bg: 'bg-cyan-50 dark:bg-cyan-950/40',
      text: 'text-cyan-700 dark:text-cyan-300',
      border: 'border-cyan-200 dark:border-cyan-800',
      badgeBg: 'bg-cyan-100 dark:bg-cyan-900/60',
      gradient: 'from-cyan-600 to-blue-700',
    },
    description: 'قواعد الإنجليزية والمفردات وكتابة الفقرات والوحدات التعليمية',
    order: 4,
  },
  {
    id: 'sub-nature',
    title: 'علوم طبيعية',
    iconName: 'Atom',
    colorScheme: {
      bg: 'bg-teal-50 dark:bg-teal-950/40',
      text: 'text-teal-700 dark:text-teal-300',
      border: 'border-teal-200 dark:border-teal-800',
      badgeBg: 'bg-teal-100 dark:bg-teal-900/60',
      gradient: 'from-teal-600 to-emerald-700',
    },
    description: 'المناعة، التركيب الضوئي، الجيولوجيا، والاتصال العصبي',
    order: 5,
  },
  {
    id: 'sub-physics',
    title: 'علوم فيزيائية',
    iconName: 'Flame',
    colorScheme: {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-200 dark:border-amber-800',
      badgeBg: 'bg-amber-100 dark:bg-amber-900/60',
      gradient: 'from-amber-600 to-orange-700',
    },
    description: 'الميكانيك، الكهرباء، الكيمياء العضوية، والظواهر الطاقوية',
    order: 6,
  },
  {
    id: 'sub-history',
    title: 'تاريخ',
    iconName: 'History',
    colorScheme: {
      bg: 'bg-stone-50 dark:bg-stone-900/40',
      text: 'text-stone-700 dark:text-stone-300',
      border: 'border-stone-200 dark:border-stone-700',
      badgeBg: 'bg-stone-100 dark:bg-stone-800',
      gradient: 'from-stone-600 to-neutral-700',
    },
    description: 'العالم المعاصر، الحرب الباردة، وحركات التحرر والثورة التحريرية',
    order: 7,
  },
  {
    id: 'sub-geography',
    title: 'جغرافيا',
    iconName: 'Compass',
    colorScheme: {
      bg: 'bg-sky-50 dark:bg-sky-950/40',
      text: 'text-sky-700 dark:text-sky-300',
      border: 'border-sky-200 dark:border-sky-800',
      badgeBg: 'bg-sky-100 dark:bg-sky-900/60',
      gradient: 'from-sky-600 to-teal-700',
    },
    description: 'القوى الاقتصادية الكبرى، حركة رؤوس الأموال، والتنمية المستدامة',
    order: 8,
  },
  {
    id: 'sub-civics',
    title: 'تربية مدنية',
    iconName: 'Scale',
    colorScheme: {
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      text: 'text-rose-700 dark:text-rose-300',
      border: 'border-rose-200 dark:border-rose-800',
      badgeBg: 'bg-rose-100 dark:bg-rose-900/60',
      gradient: 'from-rose-600 to-red-700',
    },
    description: 'المؤسسات الدستورية، حقوق الإنسان، المواطنة والسلطة القضائية',
    order: 9,
  },
  {
    id: 'sub-islamic',
    title: 'تربية اسلامية',
    iconName: 'Sparkles',
    colorScheme: {
      bg: 'bg-lime-50 dark:bg-lime-950/40',
      text: 'text-lime-700 dark:text-lime-300',
      border: 'border-lime-200 dark:border-lime-800',
      badgeBg: 'bg-lime-100 dark:bg-lime-900/60',
      gradient: 'from-lime-600 to-emerald-700',
    },
    description: 'العقيدة، مقاصد الشريعة، مصادر التشريع الإسلامي، والأسرة',
    order: 10,
  },
];

// Initial sections - set to empty so the user creates their own sections / categories
export const INITIAL_SECTIONS: Section[] = [];

// Initial starter lessons - set to empty so the user adds lessons themselves
export const INITIAL_LESSONS: Lesson[] = [];

// Open IndexedDB database
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_SUBJECTS)) {
        db.createObjectStore(STORE_SUBJECTS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_SECTIONS)) {
        db.createObjectStore(STORE_SECTIONS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_LESSONS)) {
        db.createObjectStore(STORE_LESSONS, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Initialize database with default data if empty
export async function initStorage(): Promise<{
  subjects: Subject[];
  sections: Section[];
  lessons: Lesson[];
}> {
  const db = await openDB();

  // One-time clear of previous sample sections & lessons so all sections and lessons start completely empty
  const sectionsMigrationKey = 'manassa_bem_2027_cleared_sections_v2';
  if (!localStorage.getItem(sectionsMigrationKey)) {
    try {
      const tx = db.transaction([STORE_SECTIONS, STORE_LESSONS], 'readwrite');
      tx.objectStore(STORE_SECTIONS).clear();
      tx.objectStore(STORE_LESSONS).clear();
      localStorage.setItem(sectionsMigrationKey, 'true');
    } catch {
      // Continue safely
    }
  }

  const subjects = await getAllFromStore<Subject>(db, STORE_SUBJECTS);
  const sections = await getAllFromStore<Section>(db, STORE_SECTIONS);
  const lessons = await getAllFromStore<Lesson>(db, STORE_LESSONS);

  if (subjects.length === 0) {
    // Populate defaults (only the 10 subjects)
    for (const sub of INITIAL_SUBJECTS) {
      await putItem(db, STORE_SUBJECTS, sub);
    }
    return {
      subjects: INITIAL_SUBJECTS,
      sections: [],
      lessons: [],
    };
  }

  return { subjects, sections, lessons };
}

// Helper methods for IndexedDB
function getAllFromStore<T>(db: IDBDatabase, storeName: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result as T[]);
    req.onerror = () => reject(req.error);
  });
}

function putItem<T>(db: IDBDatabase, storeName: string, item: T): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.put(item);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

function deleteItem(db: IDBDatabase, storeName: string, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// Subject operations
export async function saveSubject(subject: Subject): Promise<void> {
  const db = await openDB();
  await putItem(db, STORE_SUBJECTS, subject);
}

export async function removeSubject(id: string): Promise<void> {
  const db = await openDB();
  await deleteItem(db, STORE_SUBJECTS, id);
  // Also remove associated sections and lessons
  const sections = await getAllFromStore<Section>(db, STORE_SECTIONS);
  const lessons = await getAllFromStore<Lesson>(db, STORE_LESSONS);

  for (const sec of sections.filter(s => s.subjectId === id)) {
    await deleteItem(db, STORE_SECTIONS, sec.id);
  }
  for (const les of lessons.filter(l => l.subjectId === id)) {
    await deleteItem(db, STORE_LESSONS, les.id);
  }
}

// Section operations
export async function saveSection(section: Section): Promise<void> {
  const db = await openDB();
  await putItem(db, STORE_SECTIONS, section);
}

export async function removeSection(id: string): Promise<void> {
  const db = await openDB();
  await deleteItem(db, STORE_SECTIONS, id);
  // Also remove associated lessons
  const lessons = await getAllFromStore<Lesson>(db, STORE_LESSONS);
  for (const les of lessons.filter(l => l.sectionId === id)) {
    await deleteItem(db, STORE_LESSONS, les.id);
  }
}

// Lesson operations
export async function saveLesson(lesson: Lesson): Promise<void> {
  const db = await openDB();
  await putItem(db, STORE_LESSONS, lesson);
}

export async function removeLesson(id: string): Promise<void> {
  const db = await openDB();
  await deleteItem(db, STORE_LESSONS, id);
}

export async function resetAllData(): Promise<{
  subjects: Subject[];
  sections: Section[];
  lessons: Lesson[];
}> {
  const db = await openDB();
  const tx = db.transaction([STORE_SUBJECTS, STORE_SECTIONS, STORE_LESSONS], 'readwrite');
  tx.objectStore(STORE_SUBJECTS).clear();
  tx.objectStore(STORE_SECTIONS).clear();
  tx.objectStore(STORE_LESSONS).clear();

  for (const sub of INITIAL_SUBJECTS) {
    await putItem(db, STORE_SUBJECTS, sub);
  }
  for (const sec of INITIAL_SECTIONS) {
    await putItem(db, STORE_SECTIONS, sec);
  }
  for (const les of INITIAL_LESSONS) {
    await putItem(db, STORE_LESSONS, les);
  }

  return {
    subjects: INITIAL_SUBJECTS,
    sections: INITIAL_SECTIONS,
    lessons: INITIAL_LESSONS,
  };
}
