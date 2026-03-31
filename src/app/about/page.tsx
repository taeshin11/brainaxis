import type { Metadata } from 'next';
import Link from 'next/link';
import { Brain, Shield, Zap, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About BrainAxis — Free Web-Based Brain DICOM AC-PC Alignment',
  description: 'BrainAxis is a free, zero-install web application for aligning brain DICOM images to the AC-PC line. 100% client-side processing ensures patient data never leaves the browser.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-screen-lg mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-indigo-500" />
            <span className="text-lg font-semibold tracking-tight text-slate-900">BrainAxis</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/how-to-use" className="text-slate-600 hover:text-slate-900 transition-colors">How to Use</Link>
            <Link href="/" className="px-3 py-1.5 rounded-lg bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition-colors">Open Tool</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-screen-lg mx-auto px-4 sm:px-6 py-12">
        <article>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
            About BrainAxis
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl">
            A free, zero-install web tool for aligning brain DICOM images to the AC-PC
            (Anterior Commissure &ndash; Posterior Commissure) line &mdash; entirely in your browser.
          </p>

          <section className="grid sm:grid-cols-2 gap-6 mb-12">
            {[
              {
                icon: Shield,
                title: 'Privacy First',
                desc: 'All DICOM processing happens 100% client-side. Your medical images never leave the browser. No uploads to any server.',
              },
              {
                icon: Zap,
                title: 'Fast & Lightweight',
                desc: 'No software to install, no plugins required. Works on any modern browser — Chrome, Firefox, Safari, Edge.',
              },
              {
                icon: Globe,
                title: 'Free & Accessible',
                desc: 'Core alignment features are completely free. Designed for radiologists and researchers who need quick AC-PC alignment without heavyweight desktop software.',
              },
              {
                icon: Brain,
                title: 'Medical-Grade Workflow',
                desc: 'Upload DICOM series, view in three orthogonal planes, mark AC/PC landmarks, auto-align with trilinear interpolation, and export results.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-6 shadow-sm">
                <Icon className="w-8 h-8 text-indigo-500 mb-3" />
                <h2 className="text-lg font-semibold text-slate-900 mb-2">{title}</h2>
                <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">What is AC-PC Alignment?</h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 leading-relaxed">
                The AC-PC line connects two anatomical landmarks in the brain: the Anterior Commissure (AC) and the
                Posterior Commissure (PC). Aligning brain images to this line standardizes the orientation,
                making it easier to compare scans across patients and studies. This is a fundamental step in
                neuroimaging research and clinical practice.
              </p>
              <p className="text-slate-600 leading-relaxed mt-4">
                Traditionally, AC-PC alignment requires desktop software like 3D Slicer, which needs installation
                and configuration. BrainAxis eliminates this barrier by providing the same capability directly
                in your web browser.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Technical Details</h2>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-1">&#x2022;</span>
                <span>Built with Next.js, TypeScript, and Tailwind CSS</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-1">&#x2022;</span>
                <span>DICOM parsing via dicom-parser library</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-1">&#x2022;</span>
                <span>Rigid-body rotation with trilinear interpolation for smooth reslicing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-1">&#x2022;</span>
                <span>Exports to DICOM-compatible raw format and PNG snapshots</span>
              </li>
            </ul>
          </section>
        </article>
      </main>

      <footer className="border-t border-slate-200/60 bg-white/50">
        <div className="max-w-screen-lg mx-auto px-4 sm:px-6 py-3 flex items-center justify-between text-xs text-slate-400">
          <span>Built by SPINAI</span>
          <span>&copy; {new Date().getFullYear()} BrainAxis</span>
        </div>
      </footer>
    </div>
  );
}
