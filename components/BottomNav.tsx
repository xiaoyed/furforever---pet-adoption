
import React from 'react';

interface BottomNavProps {
  activeTab: 'home' | 'favorites' | 'messages' | 'profile';
  onTabChange: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: '首页', icon: 'home' },
    { id: 'favorites', label: '收藏', icon: 'favorite_border', activeIcon: 'favorite' },
    { id: 'messages', label: '消息', icon: 'chat_bubble_outline', activeIcon: 'chat_bubble' },
    { id: 'profile', label: '我的', icon: 'person_outline', activeIcon: 'person' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 safe-area-bottom z-50">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => (
          <button 
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center w-full h-full transition-all active:scale-90 ${
              activeTab === tab.id ? 'text-primary' : 'text-slate-400'
            }`}
          >
            <span className="material-icons-round text-[24px]">
              {activeTab === tab.id ? (tab.activeIcon || tab.icon) : tab.icon}
            </span>
            <span className="text-[10px] font-bold mt-1 tracking-wider">{tab.label}</span>
            {activeTab === tab.id && <div className="w-1 h-1 bg-primary rounded-full mt-0.5"></div>}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
