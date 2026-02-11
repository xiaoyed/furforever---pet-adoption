
import React, { useState, useEffect } from 'react';
import { Application } from '../types';
import { userApi } from '../apiService';
import { signOut } from '../authService';
import BottomNav from './BottomNav';

interface ProfileScreenProps {
  userId: string;
  applications: Application[];
  onBack: () => void;
  onTabChange: (tab: string) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ userId, applications, onBack, onTabChange }) => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      // 注意：这里不需要手动重定向，因为App.tsx中已经监听了SIGNED_OUT事件
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col relative pb-24 font-chinese overflow-x-hidden">
      <div className="relative w-full h-60 shrink-0">
        <div className="absolute inset-0 w-full h-full bg-primary">
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full pt-8 text-white">
          <div className="w-20 h-20 rounded-full p-1 bg-white/20 border border-white/30 backdrop-blur-md">
            <img 
              alt="Avatar" 
              className="w-full h-full object-cover rounded-full" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGn-MjG9UeN2KJmyQvCLJSxSmxw-gQzRMNy0dXxJKPXsCP6tHjZlgYJ56YINnZ3TZ7zHEP7n6G_X8Tf6pE3MI3MNd45nmakWsFcU0Zuepe-VVMdSU9ONcj84cmNy_qlwmIkVabPcigyqijksyxfx7BkOwPIQzMv9hNfD80kwj2Jfj4gPH1xaPZ0vwpDdzcP7WFoM1glcfmnt_BrpOde_6f8l0wHIGemRx_nJYNnInc4N5PYerqOMyJyY64e9v6-7xo1P2k6_c6-DI" 
            />
          </div>
          <h1 className="mt-2 text-lg font-bold">爱心铲屎官</h1>
          <p className="text-[10px] text-white/70">ID: 10245678 • 领养守护者</p>
        </div>
      </div>

      <div className="relative z-10 px-5 -mt-8 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl font-black text-slate-800 dark:text-white">12</div>
            <div className="text-[10px] text-slate-400 mt-1">足迹</div>
          </div>
          <div className="border-x border-slate-100 dark:border-slate-700">
            <div className="text-xl font-black text-slate-800 dark:text-white">{applications.length}</div>
            <div className="text-[10px] text-slate-400 mt-1">申请</div>
          </div>
          <div>
            <div className="text-xl font-black text-primary">88</div>
            <div className="text-[10px] text-slate-400 mt-1">勋章</div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 pb-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-black text-slate-800 dark:text-white">领养申请进度</h2>
            <span className="text-xs text-slate-400 font-bold">查看全部</span>
          </div>
          
          {applications.length > 0 ? (
            <div className="space-y-3">
              {applications.map(app => (
                <div key={app.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-slate-50 dark:border-slate-700">
                  <img src={app.petImage} className="w-14 h-14 rounded-xl object-cover" alt={app.petName} />
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white">{app.petName}</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">申请日期：{app.date}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                    app.status === '审核中' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                    app.status === '已通过' ? 'bg-green-50 text-green-600 border border-green-100' :
                    'bg-slate-50 text-slate-400'
                  }`}>
                    {app.status}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl text-center text-slate-300">
              <span className="material-icons-round text-4xl mb-2">assignment_late</span>
              <p className="text-xs">暂无申请记录</p>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden mb-6">
          <button className="w-full flex items-center p-4 border-b border-slate-50 dark:border-slate-700/50">
            <span className="material-icons-round text-primary/60">volunteer_activism</span>
            <span className="ml-3 flex-1 text-left text-sm font-bold text-slate-700 dark:text-slate-200">志愿者勋章</span>
            <span className="material-icons-round text-slate-300">chevron_right</span>
          </button>
          <button className="w-full flex items-center p-4 border-b border-slate-50 dark:border-slate-700/50">
            <span className="material-icons-round text-blue-400">help_outline</span>
            <span className="ml-3 flex-1 text-left text-sm font-bold text-slate-700 dark:text-slate-200">领养流程指南</span>
            <span className="material-icons-round text-slate-300">chevron_right</span>
          </button>
          <button className="w-full flex items-center p-4 border-b border-slate-50 dark:border-slate-700/50">
            <span className="material-icons-round text-slate-400">settings</span>
            <span className="ml-3 flex-1 text-left text-sm font-bold text-slate-700 dark:text-slate-200">个人设置</span>
            <span className="material-icons-round text-slate-300">chevron_right</span>
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center p-4 text-red-500"
          >
            <span className="material-icons-round text-red-500">logout</span>
            <span className="ml-3 flex-1 text-left text-sm font-bold">退出登录</span>
            <span className="material-icons-round text-slate-300">chevron_right</span>
          </button>
        </div>
      </div>

      <BottomNav activeTab="profile" onTabChange={onTabChange} />
    </div>
  );
};

export default ProfileScreen;
