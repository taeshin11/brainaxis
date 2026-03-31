'use client';

import Link from 'next/link';
import { Brain, Upload, MousePointer, Compass, SlidersHorizontal, Download } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';

const stepIcons = [Upload, MousePointer, MousePointer, Compass, SlidersHorizontal, Download];
const stepKeys = ['step1', 'step2', 'step3', 'step4', 'step5', 'step6'];

export default function HowToUsePage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-screen-lg mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-indigo-500" />
            <span className="text-lg font-semibold tracking-tight text-slate-900">BrainAxis</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/about" className="text-slate-600 hover:text-slate-900 transition-colors">{t('header.about')}</Link>
            <Link href="/" className="px-3 py-1.5 rounded-lg bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition-colors">{t('nav.openTool')}</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-screen-lg mx-auto px-4 sm:px-6 py-12">
        <article>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
            {t('howto.title')}
          </h1>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl">
            {t('howto.subtitle')}
          </p>

          <div className="space-y-8">
            {stepKeys.map((key, i) => {
              const Icon = stepIcons[i];
              return (
                <section key={key} className="bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900 mb-2">{t(`howto.${key}.title`)}</h2>
                      <p className="text-sm text-slate-600 leading-relaxed mb-3">{t(`howto.${key}.desc`)}</p>
                      <div className="flex items-start gap-2 bg-indigo-50/50 rounded-lg px-3 py-2">
                        <span className="text-indigo-500 text-xs font-semibold mt-0.5">TIP</span>
                        <span className="text-xs text-slate-600">{t(`howto.${key}.tip`)}</span>
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-all shadow-sm hover:shadow-md"
            >
              <Brain className="w-5 h-5" />
              {t('howto.cta')}
            </Link>
          </div>
        </article>
      </main>

      <footer className="border-t border-slate-200/60 bg-white/50">
        <div className="max-w-screen-lg mx-auto px-4 sm:px-6 py-3 flex items-center justify-between text-xs text-slate-400">
          <span>{t('footer.builtBy')}</span>
          <span>&copy; {new Date().getFullYear()} BrainAxis</span>
        </div>
      </footer>
    </div>
  );
}
