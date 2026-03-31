import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Use BrainAxis — Step-by-Step AC-PC Alignment Guide',
  description: 'Learn how to align brain DICOM images to the AC-PC line using BrainAxis. Step-by-step guide: upload DICOM, mark landmarks, auto-align, fine-tune, and export. 뇌 DICOM AC-PC 정렬 가이드.',
  alternates: { canonical: 'https://brainaxis.vercel.app/how-to-use' },
};

export default function HowToUseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
