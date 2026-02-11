
import React, { useState } from 'react';
import { Pet } from '../types';

interface ApplicationFormScreenProps {
  pet: Pet;
  onBack: () => void;
  onSubmit: () => void;
}

const ApplicationFormScreen: React.FC<ApplicationFormScreenProps> = ({ pet, onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    experience: '',
    commitment: '',
    agree: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.agree) {
      alert("申请已提交！审核结果将在3个工作日内通知。");
      onSubmit();
    } else {
      alert("请先同意领养协议。");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen flex flex-col font-chinese">
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 px-4 h-14 flex items-center justify-between">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full text-slate-600 dark:text-slate-300">
          <span className="material-icons-round text-2xl">chevron_left</span>
        </button>
        <h1 className="text-lg font-bold text-slate-800 dark:text-white">领养申请表</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto pb-40">
        <div className="relative h-48 w-full">
          <img alt="Happy dogs running in park" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCg4cd0PDAgssMzZgPB3vP3gDe7MWEbzRcwiZ7PUa-QztQ2u0k8LpTLagrZNXz5cK7wj2wyRchc0TL7_h4phUffsmGocipC1UuvUXK-E25MnruU3TpUlh5vHJ3IAt28Es-AhtAjL9_a2dZoCMeDU-31a_TO8dcvOcQRXBDJO1kffoq7c2QfjGZST1NIywIwYrl-HtmC6SiwHh4A4apm1kGqO9m2pKjn8swfWUVm-Zb1_8ksrLJTA0-ioPgQv1pDEkb_EVg-vSTYp4w" />
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 via-transparent to-transparent"></div>
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full border border-primary/20">步骤 2/3</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white drop-shadow-sm">给{pet.name}一个温暖的家</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">请如实填写信息，我们将尽快审核。</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">个人信息</h3>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">姓名 <span className="text-red-500">*</span></label>
              <input 
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border-transparent focus:border-primary focus:bg-white text-sm" 
                placeholder="请输入您的真实姓名" 
                type="text"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">联系电话 <span className="text-red-500">*</span></label>
              <input 
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border-transparent focus:border-primary focus:bg-white text-sm" 
                placeholder="请输入11位手机号" 
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">居住地址 <span className="text-red-500">*</span></label>
              <div className="relative">
                <span className="material-icons-round absolute left-3 top-3.5 text-gray-400 text-lg">location_on</span>
                <input 
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border-transparent focus:border-primary focus:bg-white text-sm" 
                  placeholder="请输入详细居住地址" 
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-100 dark:border-slate-800" />

          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">是否有养宠经验 <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`cursor-pointer group flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all text-center h-full ${formData.experience === 'no' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800'}`}>
                <input required className="sr-only" name="experience" type="radio" value="no" onChange={e => setFormData({...formData, experience: e.target.value})} />
                <span className={`material-icons-round mb-2 ${formData.experience === 'no' ? 'text-primary' : 'text-gray-400'}`}>pets</span>
                <span className="text-sm font-medium">无经验</span>
                <span className="text-xs opacity-60 mt-1">我是新手家长</span>
              </label>
              <label className={`cursor-pointer group flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all text-center h-full ${formData.experience === 'yes' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800'}`}>
                <input required className="sr-only" name="experience" type="radio" value="yes" onChange={e => setFormData({...formData, experience: e.target.value})} />
                <span className={`material-icons-round mb-2 ${formData.experience === 'yes' ? 'text-primary' : 'text-gray-400'}`}>volunteer_activism</span>
                <span className="text-sm font-medium">有经验</span>
                <span className="text-xs opacity-60 mt-1">我很了解宠物</span>
              </label>
            </div>
          </div>

          <hr className="border-gray-100 dark:border-slate-800" />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">领养初衷与承诺 <span className="text-red-500">*</span></label>
            <div className="relative">
              <textarea 
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border-transparent focus:border-primary focus:bg-white text-sm resize-none" 
                placeholder="请简述您的家庭环境、领养原因以及对宠物的承诺..." 
                rows={5}
                value={formData.commitment}
                onChange={e => setFormData({...formData, commitment: e.target.value})}
              ></textarea>
              <div className="absolute bottom-3 right-3 text-xs text-gray-400 pointer-events-none">{formData.commitment.length}/300</div>
            </div>
          </div>
        </form>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 pb-8 max-w-md mx-auto">
        <div className="flex items-start gap-3 mb-6">
          <input 
            className="w-5 h-5 border-gray-300 rounded text-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-700 cursor-pointer" 
            id="terms" 
            type="checkbox"
            checked={formData.agree}
            onChange={e => setFormData({...formData, agree: e.target.checked})}
          />
          <label className="text-sm text-slate-500 dark:text-slate-400 select-none cursor-pointer leading-tight" htmlFor="terms">
            我已阅读并同意 <a className="text-primary hover:underline font-medium" href="#">《领养协议》</a>，并承诺提供的信息真实有效。
          </label>
        </div>
        <button 
          onClick={(e) => handleSubmit(e as any)}
          className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
        >
          <span>提交审核</span>
          <span className="material-icons-round text-sm opacity-80 group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default ApplicationFormScreen;
