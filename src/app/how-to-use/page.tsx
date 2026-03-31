import type { Metadata } from 'next';
import Link from 'next/link';
import { Brain, Upload, MousePointer, Compass, SlidersHorizontal, Download } from 'lucide-react';

export const metadata: Metadata = {
  title: 'How to Use BrainAxis — Step-by-Step AC-PC Alignment Guide',
  description: 'Learn how to align brain DICOM images to the AC-PC line using BrainAxis. Step-by-step guide: upload DICOM, mark landmarks, auto-align, fine-tune, and export.',
};

const steps = [
  {
    icon: Upload,
    title: 'Step 1: Upload DICOM Files',
    desc: 'Drag and drop your brain DICOM files onto the upload area, or click to browse. You can upload an entire folder of .dcm files. BrainAxis will parse all slices and reconstruct the 3D volume automatically.',
    tip: 'For best results, upload a complete axial MRI series (typically 100-200 slices).',
  },
  {
    icon: MousePointer,
    title: 'Step 2: Navigate the Tri-Plane Viewer',
    desc: 'Once loaded, you\'ll see three orthogonal views: Axial, Sagittal, and Coronal. Scroll the mouse wheel on any panel to change the slice. Click to set the crosshair position, which synchronizes across all views.',
    tip: 'Navigate to the mid-sagittal slice to best visualize the AC and PC landmarks.',
  },
  {
    icon: MousePointer,
    title: 'Step 3: Mark AC and PC Points',
    desc: 'Click "Mark AC Point" in the control panel, then click on the Anterior Commissure in any viewer panel. Repeat for the PC point. Green marks AC, amber marks PC. You can re-mark by clicking the button again.',
    tip: 'The AC is the white matter bundle at the anterior wall of the third ventricle. The PC is at the posterior end.',
  },
  {
    icon: Compass,
    title: 'Step 4: Auto-Align',
    desc: 'With both landmarks set, click "Auto Align to AC-PC". BrainAxis computes the rotation matrix needed to make the AC-PC line horizontal, then reslices the volume using trilinear interpolation for smooth results.',
    tip: 'The status bar shows the computed rotation angles (pitch, roll, yaw).',
  },
  {
    icon: SlidersHorizontal,
    title: 'Step 5: Fine-Tune (Optional)',
    desc: 'Use the X (Pitch), Y (Roll), and Z (Yaw) sliders to manually adjust the alignment. Changes are applied in real-time. You can type exact angle values in the numeric input fields.',
    tip: 'Small adjustments of 0.5-2 degrees are typical for fine-tuning after auto-alignment.',
  },
  {
    icon: Download,
    title: 'Step 6: Export Results',
    desc: 'Click Export to download your results. Choose "Download DICOM (ZIP)" for the full aligned volume, or "Download PNG Snapshots" for quick reference images including a combined tri-plane report.',
    tip: 'The DICOM export includes a metadata.json file with volume dimensions and spacing for easy import into 3D Slicer.',
  },
];

export default function HowToUsePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-screen-lg mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-indigo-500" />
            <span className="text-lg font-semibold tracking-tight text-slate-900">BrainAxis</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/about" className="text-slate-600 hover:text-slate-900 transition-colors">About</Link>
            <Link href="/" className="px-3 py-1.5 rounded-lg bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition-colors">Open Tool</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-screen-lg mx-auto px-4 sm:px-6 py-12">
        <article>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
            How to Align Brain DICOM Images to AC-PC
          </h1>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl">
            Follow these steps to align your brain MRI DICOM images to the AC-PC line
            using BrainAxis &mdash; entirely in your browser, in under 2 minutes.
          </p>

          <div className="space-y-8">
            {steps.map(({ icon: Icon, title, desc, tip }, i) => (
              <section key={i} className="bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 mb-2">{title}</h2>
                    <p className="text-sm text-slate-600 leading-relaxed mb-3">{desc}</p>
                    <div className="flex items-start gap-2 bg-indigo-50/50 rounded-lg px-3 py-2">
                      <span className="text-indigo-500 text-xs font-semibold mt-0.5">TIP</span>
                      <span className="text-xs text-slate-600">{tip}</span>
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-all shadow-sm hover:shadow-md"
            >
              <Brain className="w-5 h-5" />
              Start Aligning Now
            </Link>
          </div>
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
