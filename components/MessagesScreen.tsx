
import React, { useEffect, useState } from 'react';
import { Message } from '../types';
import { userApi } from '../apiService';
import BottomNav from './BottomNav';

interface MessagesScreenProps {
  userId: string;
  messages: Message[];
  onTabChange: (tab: string) => void;
}

const MessagesScreen: React.FC<MessagesScreenProps> = ({ userId, messages, onTabChange }) => {
  const [loading, setLoading] = useState(false);
  return (
    <div className="pb-24 bg-white dark:bg-background-dark min-h-screen font-chinese">
      <header className="pt-16 px-6 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">消息中心</h1>
          <p className="text-sm text-slate-400 mt-1">查看领养通知与私聊内容</p>
        </div>
        <button className="text-primary text-xs font-bold">全部已读</button>
      </header>

      <main className="px-4">
        {messages.length > 0 ? (
          <div className="space-y-1">
            {messages.map(msg => (
              <div key={msg.id} className="flex gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-colors cursor-pointer border-b border-slate-50 dark:border-slate-800">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                   <span className="material-icons-round">{msg.type === 'system' ? 'campaign' : 'chat'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white truncate">{msg.title}</h3>
                    <span className="text-[10px] text-slate-400">{msg.date}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{msg.content}</p>
                </div>
                {!msg.isRead && (
                  <div className="w-2 h-2 bg-red-500 rounded-full shrink-0 mt-2"></div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 opacity-30">
            <span className="material-icons-round text-6xl mb-4">chat_bubble_outline</span>
            <p className="text-sm font-bold">暂无消息</p>
          </div>
        )}
      </main>

      <BottomNav activeTab="messages" onTabChange={onTabChange} />
    </div>
  );
};

export default MessagesScreen;
