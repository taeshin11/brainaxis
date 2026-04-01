'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Trash2, Download, Shield, Filter } from 'lucide-react';
import { DicomTag, extractAllTags, removeTagsAndDownload } from '@/lib/dicom-tags';
import { useI18n } from '@/lib/i18n-context';

interface DicomTagEditorProps {
  rawBuffers: ArrayBuffer[];
  onClose: () => void;
}

type FilterMode = 'all' | 'private' | 'patient';

const PATIENT_TAGS = new Set([
  'x00100010', 'x00100020', 'x00100030', 'x00100040',
  'x00100042', 'x00101000', 'x00101010', 'x00101020', 'x00101030',
  'x00080050', 'x00080080', 'x00080081', 'x00080090',
  'x00081040', 'x00081050', 'x00081010',
]);

export default function DicomTagEditor({ rawBuffers, onClose }: DicomTagEditorProps) {
  const { t } = useI18n();
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [isExporting, setIsExporting] = useState(false);

  const allTags = useMemo(() => {
    if (rawBuffers.length === 0) return [];
    return extractAllTags(rawBuffers[0]);
  }, [rawBuffers]);

  const filteredTags = useMemo(() => {
    let tags = allTags;

    if (filterMode === 'private') {
      tags = tags.filter(t => t.isPrivate);
    } else if (filterMode === 'patient') {
      tags = tags.filter(t => PATIENT_TAGS.has(t.tagHex));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      tags = tags.filter(t =>
        t.tag.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        t.value.toLowerCase().includes(q)
      );
    }

    return tags;
  }, [allTags, filterMode, search]);

  const privateCount = useMemo(() => allTags.filter(t => t.isPrivate).length, [allTags]);

  const toggleTag = (tagHex: string) => {
    setSelectedTags(prev => {
      const next = new Set(prev);
      if (next.has(tagHex)) next.delete(tagHex);
      else next.add(tagHex);
      return next;
    });
  };

  const selectAllPrivate = () => {
    setSelectedTags(prev => {
      const next = new Set(prev);
      allTags.filter(t => t.isPrivate).forEach(t => next.add(t.tagHex));
      return next;
    });
  };

  const selectAllPatient = () => {
    setSelectedTags(prev => {
      const next = new Set(prev);
      allTags.filter(t => PATIENT_TAGS.has(t.tagHex)).forEach(t => next.add(t.tagHex));
      return next;
    });
  };

  const selectAllFiltered = () => {
    setSelectedTags(prev => {
      const next = new Set(prev);
      filteredTags.forEach(t => next.add(t.tagHex));
      return next;
    });
  };

  const deselectAll = () => setSelectedTags(new Set());

  const handleExport = async () => {
    if (selectedTags.size === 0) return;
    setIsExporting(true);
    try {
      await removeTagsAndDownload(rawBuffers, selectedTags);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl border border-slate-200/60 w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">
              {t('tags.title')}
              <span className="ml-2 text-sm font-normal text-slate-400">
                {allTags.length} {t('tags.tagsFound')}
              </span>
            </h2>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Toolbar */}
          <div className="px-5 py-3 border-b border-slate-100 space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('tags.search')}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-400 focus:bg-white transition-colors"
              />
            </div>

            {/* Filter + Quick actions */}
            <div className="flex flex-wrap gap-2">
              <div className="flex rounded-lg bg-slate-100 p-0.5 gap-0.5">
                {(['all', 'private', 'patient'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setFilterMode(mode)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                      filterMode === mode
                        ? 'bg-white text-slate-800 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {mode === 'all' ? t('tags.filterAll') :
                     mode === 'private' ? `${t('tags.filterPrivate')} (${privateCount})` :
                     t('tags.filterPatient')}
                  </button>
                ))}
              </div>

              <div className="flex gap-1.5 ml-auto">
                <button
                  onClick={selectAllPrivate}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  <Shield className="w-3 h-3" />
                  {t('tags.selectPrivate')}
                </button>
                <button
                  onClick={selectAllPatient}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Filter className="w-3 h-3" />
                  {t('tags.selectPatient')}
                </button>
                <button
                  onClick={selectAllFiltered}
                  className="px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  {t('tags.selectAll')}
                </button>
                <button
                  onClick={deselectAll}
                  className="px-2.5 py-1 text-xs font-medium text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  {t('tags.deselectAll')}
                </button>
              </div>
            </div>
          </div>

          {/* Tag list */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="w-10 px-3 py-2"></th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-slate-500">{t('tags.colTag')}</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-slate-500">{t('tags.colName')}</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-slate-500">VR</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-slate-500">{t('tags.colValue')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredTags.map((tag) => (
                  <tr
                    key={tag.tagHex}
                    onClick={() => toggleTag(tag.tagHex)}
                    className={`cursor-pointer border-b border-slate-50 transition-colors ${
                      selectedTags.has(tag.tagHex)
                        ? 'bg-red-50 hover:bg-red-100'
                        : tag.isPrivate
                          ? 'bg-orange-50/30 hover:bg-orange-50'
                          : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="px-3 py-1.5 text-center">
                      <input
                        type="checkbox"
                        checked={selectedTags.has(tag.tagHex)}
                        onChange={() => toggleTag(tag.tagHex)}
                        className="w-3.5 h-3.5 rounded border-slate-300 text-red-500 focus:ring-red-400"
                      />
                    </td>
                    <td className="px-3 py-1.5 font-mono text-xs text-slate-600">{tag.tag}</td>
                    <td className="px-3 py-1.5">
                      <span className={`text-xs ${tag.isPrivate ? 'text-orange-600' : PATIENT_TAGS.has(tag.tagHex) ? 'text-red-600 font-medium' : 'text-slate-700'}`}>
                        {tag.name}
                      </span>
                    </td>
                    <td className="px-3 py-1.5 font-mono text-xs text-slate-400">{tag.vr}</td>
                    <td className="px-3 py-1.5 font-mono text-xs text-slate-500 max-w-[200px] truncate">{tag.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTags.length === 0 && (
              <div className="text-center py-8 text-sm text-slate-400">
                {t('tags.noResults')}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
            <span className="text-xs text-slate-500">
              {selectedTags.size > 0 ? t('tags.selectedCount', { count: selectedTags.size }) : t('tags.selectHint')}
            </span>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all"
              >
                {t('tags.close')}
              </button>
              <button
                onClick={handleExport}
                disabled={selectedTags.size === 0 || isExporting}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-all shadow-sm ${
                  selectedTags.size > 0 && !isExporting
                    ? 'bg-red-500 hover:bg-red-600 text-white hover:shadow-md'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Trash2 className="w-4 h-4" />
                {isExporting ? t('tags.exporting') : t('tags.deleteAndDownload')}
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
