export interface Lesson {
  id: string;
  subjectId: string;
  sectionId: string;
  title: string;
  description?: string;
  pdfFileName: string;
  pdfFileSize?: string;
  pdfDataUrl: string; // Base64 data URL or object URL
  createdAt: string;
}

export interface Section {
  id: string;
  subjectId: string;
  title: string;
  order: number;
}

export interface Subject {
  id: string;
  title: string;
  iconName: string;
  colorScheme: {
    bg: string;
    text: string;
    border: string;
    badgeBg: string;
    gradient: string;
  };
  description?: string;
  order: number;
}

export type ThemeMode = 'light' | 'dark';
