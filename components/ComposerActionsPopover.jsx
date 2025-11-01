'use client';
import {
  Paperclip,
  Bot,
  Search,
  Palette,
  BookOpen,
  Globe,
} from 'lucide-react';
import { useState } from 'react';


import { useI18n } from '@/lib/i18n';

export default function ComposerActionsPopover({ children }) {
  const [open, setOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const { t } = useI18n();

  const mainActions = [
    {
      icon: Paperclip,
      label: t('message.addPhotosAndFiles'),
      action: () => console.log('Add photos & files'),
    },
    {
      icon: Bot,
      label: t('message.agentMode'),
      badge: t('common.newBadge'),
      action: () => console.log('Agent mode'),
    },
    {
      icon: Search,
      label: t('message.deepResearch'),
      action: () => console.log('Deep research'),
    },
    {
      icon: Palette,
      label: t('message.createImage'),
      action: () => console.log('Create image'),
    },
    {
      icon: BookOpen,
      label: t('message.studyAndLearn'),
      action: () => console.log('Study and learn'),
    },
  ];

  const moreActions = [
    {
      icon: Globe,
      label: t('message.webSearch'),
      action: () => console.log('Web search'),
    },
    {
      icon: Palette,
      label: t('message.canvas'),
      action: () => console.log('Canvas'),
    },
    {
      icon: () => (
        <div className="h-4 w-4 rounded bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
          <div className="h-2 w-2 bg-white rounded-full" />
        </div>
      ),
      label: t('message.connectGoogleDrive'),
      action: () => console.log('Connect Google Drive'),
    },
    {
      icon: () => (
        <div className="h-4 w-4 rounded bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
          <div className="h-2 w-2 bg-white rounded-full" />
        </div>
      ),
      label: t('message.createImage'),
      action: () => console.log('Create image'),
    },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        {!showMore ? (
          <div className="space-y-1">
            {mainActions.map((item, idx) => (
              <button
                key={idx}
                onClick={item.action}
                className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <div className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span className="text-sm">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="rounded bg-zinc-200 px-1.5 py-0.5 text-xs dark:bg-zinc-700">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
            <button
              onClick={() => setShowMore(true)}
              className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <div className="flex items-center gap-2">
                <MoreHorizontal className="h-4 w-4" />
                <span className="text-sm">{t('common.more')}</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            {moreActions.map((item, idx) => (
              <button
                key={idx}
                onClick={item.action}
                className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <div className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span className="text-sm">{item.label}</span>
                </div>
              </button>
            ))}
            <button
              onClick={() => setShowMore(false)}
              className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <div className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 rotate-180" />
                <span className="text-sm">{t('common.more')}</span>
              </div>
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
