
import React, { useEffect, useState } from 'react';
import { Pet, Shelter } from '../types';
import { petApi, userApi } from '../apiService';

interface PetDetailScreenProps {
  pet: Pet;
  userId: string; // 添加userId参数
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBack: () => void;
  onApply: () => void;
}

const PetDetailScreen: React.FC<PetDetailScreenProps> = ({ pet, userId, isFavorite, onToggleFavorite, onBack, onApply }) => {
  const [shelter, setShelter] = useState<Shelter | null>(null);
  const [localIsFavorite, setLocalIsFavorite] = useState(isFavorite);
  const [isProcessing, setIsProcessing] = useState(false);

  // 同步父组件传来的收藏状态
  useEffect(() => {
    setLocalIsFavorite(isFavorite);
  }, [isFavorite]);

  const handleToggleFavorite = async () => {
    if (isProcessing) return; // 防止重复点击
    
    setIsProcessing(true);
    const previousState = localIsFavorite;
    
    // 立即更新本地UI状态以提供即时反馈
    setLocalIsFavorite(!previousState);
    
    try {
      // 调用父组件的处理函数
      await onToggleFavorite();
    } catch (error) {
      // 如果失败，恢复之前的状态
      setLocalIsFavorite(previousState);
      console.error('Failed to toggle favorite:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // 如果需要获取收容所信息，可以在这里调用API
  useEffect(() => {
    // 示例：获取与宠物相关的收容所信息
    // const fetchShelter = async () => {
    //   try {
    //     // 这里需要后端支持根据pet_id获取shelter信息
    //   } catch (error) {
    //     console.error('Failed to fetch shelter:', error);
    //   }
    // };
    // 暂时使用默认值，实际应用中应从API获取
    setShelter({
      id: 'default-shelter',
      name: '爱心救助站 - 王阿姨',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvrRH6G5Sb0CtIWvJtqan829hzEYHU-TGjt0BkP0FwrzLkfqTE2MLcBzRVQSpL5BNmKsTA_kX1vVKmSR-JzjQ7EiqIg9Z96sFwqdPDMhphXOC1WEHy1dcILPKtlfEBaEIIz7xJimQ6ht8tldnYEEpbnL7rt8Zcq1PFZMFwJxwzUlq5Ga9IHEOd9YksSIBsMpxgI8FhIRB32D2DQzShCIjp2jKB4VobQHoDl_1DPEZK6G-w5wlwyRmurvvTyePOPPghlE8wB7iSazs',
      publishedCount: 12,
    });
  }, [pet.id]);
  return (
    <div className="bg-background-light dark:bg-background-dark font-chinese text-slate-800 dark:text-slate-100 antialiased min-h-screen relative pb-32 overflow-x-hidden">
      {/* Top Navigation Overlay */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-6 pt-12">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/30 backdrop-blur-md border border-white/30 text-white shadow-lg">
          <span className="material-icons-round text-xl">arrow_back_ios_new</span>
        </button>
        <div className="flex gap-3">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/30 backdrop-blur-md border border-white/30 text-white shadow-lg">
            <span className="material-icons-round text-xl">ios_share</span>
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-[48vh] w-full bg-slate-100">
        <img alt={pet.name} className="w-full h-full object-cover" src={pet.image} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent"></div>
      </div>

      {/* Content Card */}
      <div className="relative -mt-12 bg-white dark:bg-slate-900 rounded-t-[40px] px-8 pt-10 pb-6 shadow-2xl z-10 min-h-[60vh]">
        <div className="w-12 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mx-auto mb-8"></div>
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">{pet.name}</h1>
              <span className={`material-icons-round text-lg ${pet.gender === 'male' ? 'text-blue-500' : 'text-pink-500'}`}>
                {pet.gender === 'male' ? 'male' : 'female'}
              </span>
            </div>
            <p className="text-slate-400 text-xs flex items-center gap-1 font-bold">
              <span className="material-icons-round text-sm">location_on</span>
              {pet.location} · {pet.distance}
            </p>
          </div>
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black tracking-widest border border-primary/20">
            待领养
          </div>
        </div>

        <div className="flex gap-2 mb-8">
          {pet.tags.map(tag => (
            <span key={tag} className="text-[10px] font-black text-slate-500 bg-slate-50 dark:bg-slate-800 dark:text-slate-400 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700/50">
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-3 mb-8">
           {[
             { label: '性别', value: pet.gender === 'male' ? '公' : '母', icon: 'pets', color: 'orange' },
             { label: '年龄', value: pet.age, icon: 'cake', color: 'orange' },
             { label: '疫苗', value: pet.vaccinated ? '已接种' : '未接种', icon: 'verified', color: 'green' },
             { label: '绝育', value: pet.neutered ? '已绝育' : '未绝育', icon: 'medical_services', color: 'blue' }
           ].map((item, idx) => (
             <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-3 flex flex-col items-center justify-center border border-slate-100 dark:border-slate-800">
               <span className={`material-icons-round text-${item.color}-500 text-lg mb-1`}>{item.icon}</span>
               <span className="text-[9px] text-slate-400 font-bold">{item.label}</span>
               <span className="text-[10px] text-slate-700 dark:text-slate-200 font-black mt-0.5">{item.value}</span>
             </div>
           ))}
        </div>

        <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl mb-10">
          <img 
            alt={shelter?.name || 'Shelter'} 
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" 
            src={shelter?.avatar || 'https://placehold.co/48x48?text= shelter'} 
          />
          <div className="flex-1">
            <h3 className="font-bold text-sm text-slate-800 dark:text-white">{shelter?.name || '收容所'}</h3>
            <p className="text-[10px] text-slate-400 font-bold">查看Ta发布的全部伙伴</p>
          </div>
          <button className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm text-slate-400">
            <span className="material-icons-round text-xl">chat_bubble_outline</span>
          </button>
        </div>

        <div className="mb-10">
          <h2 className="text-lg font-black text-slate-900 dark:text-white mb-4">关于我</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm text-justify">
            {pet.description}
          </p>
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 z-50 max-w-md mx-auto">
        <div className="flex gap-4">
          <button 
            onClick={handleToggleFavorite}
            disabled={isProcessing}
            className={`w-14 h-14 flex flex-col items-center justify-center rounded-2xl transition-all duration-300 ${
              localIsFavorite ? 'bg-red-50 text-red-500' : 'bg-slate-50 dark:bg-slate-800 text-slate-300'
            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="material-icons-round text-2xl">{localIsFavorite ? 'favorite' : 'favorite_border'}</span>
            <span className="text-[10px] font-black mt-0.5">收藏</span>
          </button>
          <button 
            onClick={onApply}
            className="flex-1 h-14 bg-primary hover:bg-primary-dark text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            立即申请领养
          </button>
        </div>
        <div className="h-4"></div>
      </div>
    </div>
  );
};

export default PetDetailScreen;
