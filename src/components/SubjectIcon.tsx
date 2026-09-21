import React from 'react';
import {
  BookOpen,
  Calculator,
  Languages,
  Globe,
  Atom,
  Flame,
  History,
  Compass,
  Scale,
  Sparkles,
  GraduationCap,
  FileText,
  Brain,
  Palette,
  Music,
  Award,
  PenTool,
  Library,
  Folder,
} from 'lucide-react';

interface SubjectIconProps {
  name: string;
  className?: string;
}

export const AVAILABLE_ICONS = [
  { name: 'BookOpen', label: 'كتاب / لغة عربية' },
  { name: 'Calculator', label: 'آلة حاسبة / رياضيات' },
  { name: 'Languages', label: 'لغات' },
  { name: 'Globe', label: 'كرة أرضية / إنجليزية' },
  { name: 'Atom', label: 'ذرة / علوم طبيعية' },
  { name: 'Flame', label: 'شعلة / فيزياء' },
  { name: 'History', label: 'تاريخ' },
  { name: 'Compass', label: 'بوصلة / جغرافيا' },
  { name: 'Scale', label: 'ميزان / تربية مدنية' },
  { name: 'Sparkles', label: 'نجمة / تربية إسلامية' },
  { name: 'GraduationCap', label: 'قبعة تخرج' },
  { name: 'FileText', label: 'مستند' },
  { name: 'Brain', label: 'عقل / فلسفة' },
  { name: 'Palette', label: 'رسم / فنون' },
  { name: 'Music', label: 'موسيقى' },
  { name: 'Award', label: 'وسام' },
  { name: 'PenTool', label: 'قلم' },
  { name: 'Library', label: 'مكتبة' },
  { name: 'Folder', label: 'مجلد' },
];

export const SubjectIcon: React.FC<SubjectIconProps> = ({ name, className = 'w-6 h-6' }) => {
  switch (name) {
    case 'BookOpen':
      return <BookOpen className={className} />;
    case 'Calculator':
      return <Calculator className={className} />;
    case 'Languages':
      return <Languages className={className} />;
    case 'Globe':
      return <Globe className={className} />;
    case 'Atom':
      return <Atom className={className} />;
    case 'Flame':
      return <Flame className={className} />;
    case 'History':
      return <History className={className} />;
    case 'Compass':
      return <Compass className={className} />;
    case 'Scale':
      return <Scale className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'GraduationCap':
      return <GraduationCap className={className} />;
    case 'FileText':
      return <FileText className={className} />;
    case 'Brain':
      return <Brain className={className} />;
    case 'Palette':
      return <Palette className={className} />;
    case 'Music':
      return <Music className={className} />;
    case 'Award':
      return <Award className={className} />;
    case 'PenTool':
      return <PenTool className={className} />;
    case 'Library':
      return <Library className={className} />;
    case 'Folder':
    default:
      return <Folder className={className} />;
  }
};
