'use client';
import { useEffect, useState } from 'react';

import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/lib/i18n';

export default function CreateTemplateModal({
  isOpen,
  onClose,
  onCreateTemplate,
  editingTemplate,
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const { t } = useI18n();
  const { toast } = useToast();

  useEffect(() => {
    if (editingTemplate) {
      setName(editingTemplate.name || '');
      setDescription(editingTemplate.description || '');
      setContent(editingTemplate.content || '');
      setTags((editingTemplate.tags || []).join(', '));
    } else {
      setName('');
      setDescription('');
      setContent('');
      setTags('');
    }
  }, [editingTemplate, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const templateData = {
        id: editingTemplate?.id || Math.random().toString(36).slice(2),
        name: name.trim(),
        description: description.trim(),
        content: content.trim(),
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };
      onCreateTemplate(templateData);
      toast({
        title: editingTemplate ? t('button.updateTemplate') : t('button.createTemplate'),
        description: t('message.success'),
      });
      onClose();
    } catch (error) {
      toast({
        title: editingTemplate ? t('button.updateTemplate') : t('button.createTemplate'),
        description: t('message.failed'),
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60"
            onClick={handleCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{t('message.templateTitle')}</h2>
              <button
                onClick={handleCancel}
                aria-label={t('button.cancel')}
                className="rounded-lg p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('input.templateNamePlaceholder')}
                  className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800"
                  aria-label={t('input.templateNamePlaceholder')}
                  required
                />
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('input.templateDescPlaceholder')}
                  className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800"
                  aria-label={t('input.templateDescPlaceholder')}
                />
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={t('input.templateContentPlaceholder')}
                  className="w-full min-h-[160px] rounded-lg border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800"
                  aria-label={t('input.templateContentPlaceholder')}
                  required
                />
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder={t('input.templateTagsPlaceholder')}
                  className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800"
                  aria-label={t('input.templateTagsPlaceholder')}
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  aria-label={t('button.cancel')}
                  className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                >
                  {t('button.cancel')}
                </button>
                <button
                  type="submit"
                  aria-label={
                    editingTemplate ? t('button.updateTemplate') : t('button.createTemplate')
                  }
                  className="flex-1 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                >
                  {editingTemplate ? t('button.updateTemplate') : t('button.createTemplate')}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
