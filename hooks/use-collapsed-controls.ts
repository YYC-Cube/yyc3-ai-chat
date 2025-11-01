/**
 * @file 折叠状态控制 Hook
 * @description 提供统一的折叠/展开全部与单项折叠控制，兼容 Sidebar 等各区域调用
 * @author YYC
 * @created 2025-10-31
 */
import * as React from 'react';

export type CollapsedSections = {
  pinned: boolean;
  recent: boolean;
  folders: boolean;
  templates: boolean;
};

export function useCollapsedControls(
  collapsed: CollapsedSections,
  setCollapsed: React.Dispatch<React.SetStateAction<CollapsedSections>>
) {
  const collapseAll = React.useCallback(() => {
    setCollapsed((s) => ({ ...s, pinned: true, recent: true, folders: true, templates: true }));
  }, [setCollapsed]);

  const expandAll = React.useCallback(() => {
    setCollapsed((s) => ({ ...s, pinned: false, recent: false, folders: false, templates: false }));
  }, [setCollapsed]);

  const toggle = React.useCallback(
    (section: keyof CollapsedSections) => {
      setCollapsed((s) => ({ ...s, [section]: !s[section] }));
    },
    [setCollapsed]
  );

  const collapse = React.useCallback(
    (section: keyof CollapsedSections) => {
      setCollapsed((s) => ({ ...s, [section]: true }));
    },
    [setCollapsed]
  );

  const expand = React.useCallback(
    (section: keyof CollapsedSections) => {
      setCollapsed((s) => ({ ...s, [section]: false }));
    },
    [setCollapsed]
  );

  const allCollapsed = collapsed.pinned && collapsed.recent && collapsed.folders && collapsed.templates;
  const allExpanded = !collapsed.pinned && !collapsed.recent && !collapsed.folders && !collapsed.templates;

  return { collapseAll, expandAll, toggle, collapse, expand, allCollapsed, allExpanded };
}
