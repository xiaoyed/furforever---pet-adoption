
import React, { useEffect, useState } from 'react';
import { Pet } from '../types';
import { petApi, userApi } from '../apiService';
import BottomNav from './BottomNav';

interface FavoritesScreenProps {
  userId: string;
  favorites: string[];
  pets: Pet[];
  onSelectPet: (pet: Pet) => void;
  onTabChange: (tab: string) => void;
}

const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ userId, favorites, pets, onSelectPet, onTabChange }) => {
  const [loading, setLoading] = useState(false);

  const favoritePets = pets.filter(pet => favorites.includes(pet.id));
  return (
    <div className="pb-24 bg-white dark:bg-background-dark min-h-screen font-chinese">
      <header className="pt-16 px-6 pb-6">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">我的收藏</h1>
        <p className="text-sm text-slate-400 mt-1">记录你心仪的每一个毛孩子</p>
      </header>

      <main className="px-5 space-y-4">
        {favoritePets.length > 0 ? (
          favoritePets.map(pet => (
            <div 
              key={pet.id} 
              onClick={() => onSelectPet(pet)}
              className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-slate-50 dark:border-slate-700/50 flex gap-4 cursor-pointer active:scale-[0.98] transition-all"
            >
              <img alt={pet.name} className="w-24 h-24 object-cover rounded-xl" src={pet.image} />
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">{pet.name}</h3>
                  <p className="text-xs text-slate-400">{pet.breed} · {pet.age}</p>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-primary font-bold text-xs bg-primary/5 px-2 py-0.5 rounded-full">{pet.distance}</span>
                   <span className="material-icons-round text-primary text-xl">favorite</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 opacity-30">
            <span className="material-icons-round text-6xl mb-4">favorite_border</span>
            <p className="text-sm font-bold">暂无收藏</p>
            <p className="text-xs mt-1">去首页看看有没有心动的TA吧</p>
          </div>
        )}
      </main>

      <BottomNav activeTab="favorites" onTabChange={onTabChange} />
    </div>
  );
};

export default FavoritesScreen;
