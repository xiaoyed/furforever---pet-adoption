
import React, { useState, useEffect } from 'react';
import { Pet } from '../types';
import { petApi } from '../apiService';
import BottomNav from './BottomNav';

interface DiscoveryScreenProps {
  onSelectPet: (pet: Pet) => void;
  onTabChange: (tab: string) => void;
}

const DiscoveryScreen: React.FC<DiscoveryScreenProps> = ({ onSelectPet, onTabChange }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'dog' | 'cat' | 'other'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [pets, setPets] = useState<Pet[]>([]);

  const categories = [
    { id: 'all', label: '全部', icon: 'pets' },
    { id: 'dog', label: '狗狗', icon: '🐶' },
    { id: 'cat', label: '猫咪', icon: '🐱' },
    { id: 'other', label: '其他', icon: '🐰' },
  ];

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const data = await petApi.getPets();
        setPets(data);
      } catch (error) {
        console.error('Failed to fetch pets:', error);
      }
    };

    fetchPets();
  }, []);

  const filteredPets = pets.filter(pet => {
    const matchesCategory = activeCategory === 'all' || pet.category === activeCategory;
    const matchesSearch = pet.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pet.breed.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pb-24 bg-white dark:bg-background-dark min-h-screen font-chinese">
      <header className="pt-12 px-5 pb-2 bg-white dark:bg-background-dark sticky top-0 z-40">
        {/* Location UI based on sketch */}
        <div className="flex flex-col mb-4">
          <div className="flex items-center text-primary mb-1">
             <span className="material-icons-round text-sm">location_on</span>
             <span className="text-xs font-bold ml-1">北京市 · 朝阳区</span>
             <span className="material-icons-round text-xs ml-0.5">expand_more</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">寻找伙伴</h1>
              <p className="text-[10px] text-slate-400 mt-0.5">为你匹配最暖心的TA</p>
            </div>
            <button className="relative p-2 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <span className="material-icons-round text-[20px]">notifications_none</span>
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-white dark:border-slate-800"></span>
            </button>
          </div>
        </div>

        <div className="relative group">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <span className="material-icons-round text-[18px]">search</span>
          </span>
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white pl-10 pr-4 py-2.5 rounded-xl border-none focus:ring-1 focus:ring-primary/30 text-xs font-medium placeholder-slate-400" 
            placeholder="搜索品种、名字..." 
            type="text"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-primary">
            <span className="material-icons-round text-[18px]">tune</span>
          </button>
        </div>
      </header>

      {/* Category Section - Adjusted for Grid layout to fit all items perfectly without overflow */}
      <div className="sticky top-[144px] z-30 bg-white/95 dark:bg-background-dark/95 backdrop-blur-sm py-4 px-5">
        <div className="grid grid-cols-4 gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`flex items-center justify-center gap-1.5 px-1 py-2.5 rounded-full transition-all border ${
                activeCategory === cat.id 
                  ? 'bg-primary text-white border-primary shadow-md shadow-primary/20' 
                  : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              <span className="flex-shrink-0">
                 {cat.id === 'all' ? (
                   <span className={`material-icons-round text-sm leading-none ${activeCategory === cat.id ? 'text-white' : 'text-primary'}`}>{cat.icon}</span>
                 ) : (
                   <span className="text-sm leading-none">{cat.icon}</span>
                 )}
              </span>
              <span className={`text-[11px] whitespace-nowrap ${activeCategory === cat.id ? 'font-bold' : 'font-medium'}`}>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      <main className="px-5 pt-2 space-y-4">
        {filteredPets.map(pet => (
          <div 
            key={pet.id} 
            onClick={() => onSelectPet(pet)}
            className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-slate-50 dark:border-slate-700/50 flex gap-4 cursor-pointer active:scale-[0.98] transition-all"
          >
            <div className="relative w-28 h-28 flex-shrink-0">
              <img alt={pet.name} className="w-full h-full object-cover rounded-xl" src={pet.image} />
              <div className="absolute top-1.5 right-1.5 bg-white/90 dark:bg-black/50 backdrop-blur-md px-1.5 py-0.5 rounded-lg">
                <span className={`material-icons-round text-[10px] ${pet.gender === 'male' ? 'text-blue-500' : 'text-pink-500'}`}>
                  {pet.gender === 'male' ? 'male' : 'female'}
                </span>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-between py-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">{pet.name}</h3>
                  <div className="flex gap-2 text-[10px] font-bold">
                    <span className="px-2 py-0.5 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-md border border-orange-100 dark:border-orange-800/30">{pet.breed}</span>
                    <span className="px-2 py-0.5 bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 rounded-md">{pet.age}</span>
                  </div>
                </div>
                <span className="material-icons-round text-slate-200">favorite_border</span>
              </div>
              <div className="flex items-end justify-between">
                <div className="flex items-center text-slate-400 text-[10px]">
                  <span className="material-icons-round text-xs mr-1 text-slate-300">location_on</span>
                  {pet.location}
                </div>
                <div className="text-primary font-bold text-[10px] bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
                  {pet.distance}
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>

      <BottomNav activeTab="home" onTabChange={onTabChange} />
    </div>
  );
};

export default DiscoveryScreen;
