import React from 'react';
import { BookOpen, Users, Plus, Heart, User } from 'lucide-react';

export type TabType = 'recipes' | 'family' | 'favorites' | 'account';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenAddModal: () => void;
  favoritesCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenAddModal,
  favoritesCount,
}) => {
  return (
    <nav aria-label="Bottom Navigation" className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-purple-100 px-3 py-1 shadow-md shrink-0">
      <div className="grid grid-cols-5 items-center justify-items-center h-14 max-w-md mx-auto">
        {/* Tab 1: All Recipes */}
        <button
          onClick={() => onSelectTab('recipes')}
          className={`flex flex-col items-center justify-center min-w-[48px] min-h-[48px] px-1 rounded-xl transition-all ${
            activeTab === 'recipes'
              ? 'text-purple-700 font-semibold scale-105'
              : 'text-stone-400 hover:text-purple-600'
          }`}
        >
          <BookOpen className={`w-5 h-5 ${activeTab === 'recipes' ? 'stroke-[2.3]' : 'stroke-2'}`} />
          <span className="text-[10px] tracking-tight mt-0.5">Cookbook</span>
        </button>

        {/* Tab 2: Family Circle */}
        <button
          onClick={() => onSelectTab('family')}
          className={`flex flex-col items-center justify-center min-w-[48px] min-h-[48px] px-1 rounded-xl transition-all ${
            activeTab === 'family'
              ? 'text-purple-700 font-semibold scale-105'
              : 'text-stone-400 hover:text-purple-600'
          }`}
        >
          <Users className={`w-5 h-5 ${activeTab === 'family' ? 'stroke-[2.3]' : 'stroke-2'}`} />
          <span className="text-[10px] tracking-tight mt-0.5">Family</span>
        </button>

        {/* Tab 3: Prominent Add Action (Baby Pink & Lavender gradient button) */}
        <button
          onClick={onOpenAddModal}
          aria-label="Add new recipe"
          className="relative -top-3 w-12 h-12 rounded-full bg-linear-to-tr from-pink-400 via-pink-500 to-purple-500 text-white flex items-center justify-center shadow-lg shadow-pink-300/50 hover:scale-105 active:scale-95 transition-transform"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Tab 4: Favorites */}
        <button
          onClick={() => onSelectTab('favorites')}
          className={`flex flex-col items-center justify-center min-w-[48px] min-h-[48px] px-1 rounded-xl transition-all relative ${
            activeTab === 'favorites'
              ? 'text-pink-600 font-semibold scale-105'
              : 'text-stone-400 hover:text-pink-500'
          }`}
        >
          <div className="relative">
            <Heart
              className={`w-5 h-5 ${
                activeTab === 'favorites' ? 'fill-pink-500 text-pink-500 stroke-[2]' : 'stroke-2'
              }`}
            />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-pink-500 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Favorites</span>
        </button>

        {/* Tab 5: Account Profile */}
        <button
          onClick={() => onSelectTab('account')}
          className={`flex flex-col items-center justify-center min-w-[48px] min-h-[48px] px-1 rounded-xl transition-all ${
            activeTab === 'account'
              ? 'text-purple-700 font-semibold scale-105'
              : 'text-stone-400 hover:text-purple-600'
          }`}
        >
          <User className={`w-5 h-5 ${activeTab === 'account' ? 'stroke-[2.3]' : 'stroke-2'}`} />
          <span className="text-[10px] tracking-tight mt-0.5">Account</span>
        </button>
      </div>
    </nav>
  );
};
