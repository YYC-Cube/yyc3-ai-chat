'use client';
import AIAssistantUI from '../components/AIAssistantUI';

export default function Page() {
  return (
    <div className="container-fluid px-4 md:px-6 pt-6">
      {/* 主交互区域（移除品牌横幅与徽章，恢复简洁首页） */}
      <div className="mt-2">
        <AIAssistantUI />
      </div>
    </div>
  );
}
