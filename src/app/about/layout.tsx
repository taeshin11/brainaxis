import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About BrainAxis — Free Web-Based Brain DICOM AC-PC Alignment',
  description: 'BrainAxis is a free, zero-install web application for aligning brain DICOM images to the AC-PC line. 100% client-side processing ensures patient data never leaves the browser. 뇌 DICOM AC-PC 정렬 도구 소개.',
  alternates: { canonical: 'https://brainaxis.vercel.app/about' },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
