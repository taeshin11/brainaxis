'use client';

import Link from 'next/link';
import { Brain, Upload, HelpCircle } from 'lucide-react';

interface HeaderProps {
  hasVolume: boolean;
  onUploadNew: () => void;
}

export default function Header({ hasVolume, onUploadNew }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-indigo-500" />
          <span className="text-lg font-semibold tracking-tight text-slate-900">BrainAxis</span>
          <span className="hidden sm:inline text-xs text-slate-400 ml-2">AC-PC Alignment Tool</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/how-to-use"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Guide
          </Link>
          <Link
            href="/about"
            className="hidden sm:inline-block px-2.5 py-1.5 rounded-lg text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            About
          </Link>
          {hasVolume && (
            <button
              onClick={onUploadNew}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all duration-200"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Upload</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
