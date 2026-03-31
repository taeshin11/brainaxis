'use client';

import Link from 'next/link';
import { Brain, Shield, Zap, Globe } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';

export default function AboutPage() {
  const { t } = useI18n();

  const features = [
    { icon: Shield, titleKey: 'about.privacy.title', descKey: 'about.privacy.desc' },
    { icon: Zap, titleKey: 'about.fast.title', descKey: 'about.fast.desc' },
    { icon: Globe, titleKey: 'about.free.title', descKey: 'about.free.desc' },
    { icon: Brain, titleKey: 'about.workflow.title', descKey: 'about.workflow.desc' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-screen-lg mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-indigo-500" />
            <span className="text-lg font-semibold tracking-tight text-slate-900">BrainAxis</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/how-to-use" className="text-slate-600 hover:text-slate-900 transition-colors">{t('nav.howToUse')}</Link>
            <Link href="/" className="px-3 py-1.5 rounded-lg bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition-colors">{t('nav.openTool')}</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-screen-lg mx-auto px-4 sm:px-6 py-12">
        <article>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
            {t('about.title')}
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl">
            {t('about.subtitle')}
          </p>

          <section className="grid sm:grid-cols-2 gap-6 mb-12">
            {features.map(({ icon: Icon, titleKey, descKey }) => (
              <div key={titleKey} className="bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-6 shadow-sm">
                <Icon className="w-8 h-8 text-indigo-500 mb-3" />
                <h2 className="text-lg font-semibold text-slate-900 mb-2">{t(titleKey)}</h2>
                <p className="text-sm text-slate-600 leading-relaxed">{t(descKey)}</p>
              </div>
            ))}
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">{t('about.whatIsACPC')}</h2>
            <p className="text-slate-600 leading-relaxed">{t('about.whatIsACPC.p1')}</p>
            <p className="text-slate-600 leading-relaxed mt-4">{t('about.whatIsACPC.p2')}</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">{t('about.techDetails')}</h2>
            <ul className="space-y-2 text-slate-600">
              {['about.tech1', 'about.tech2', 'about.tech3', 'about.tech4'].map((key) => (
                <li key={key} className="flex items-start gap-2">
                  <span className="text-indigo-500 mt-1">&#x2022;</span>
                  <span>{t(key)}</span>
                </li>
              ))}
            </ul>
          </section>
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
