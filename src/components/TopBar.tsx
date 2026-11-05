import React from 'react';
import { BookHeart, User, Sparkles } from 'lucide-react';
import { UserAccount } from '../types/recipe';

interface TopBarProps {
  user: UserAccount | null;
  onOpenAccount: () => void;
  onOpenQuickAdd?: () => void;
  recipeCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  user,
  onOpenAccount,
  onOpenQuickAdd,
  recipeCount,
}) => {
  return (
    <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-pink-100 px-4 py-2.5 flex items-center justify-between shadow-xs">
      {/* Brand Zone */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-pink-400 to-purple-400 text-white flex items-center justify-center shadow-xs shadow-pink-300/40">
          <BookHeart className="w-4 h-4" />
        </div>
        <div>
          <h1 className="font-serif-recipe text-lg font-bold tracking-tight text-purple-950 leading-none">
            RecipeBook
          </h1>
          <p className="text-[10px] text-purple-600/80 font-medium tracking-wide">
            {user?.familyBookTitle ? user.familyBookTitle.slice(0, 24) + '...' : 'My Recipe Vault'}
          </p>
        </div>
      </div>

      {/* Right Action: Quick Add / Profile Avatar */}
      <div className="flex items-center gap-2">
        {onOpenQuickAdd && (
          <button
            onClick={onOpenQuickAdd}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-pink-50 text-pink-700 hover:bg-pink-100/90 text-xs font-semibold transition-colors border border-pink-200"
            title="Add New Recipe"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span className="hidden xs:inline">New</span>
          </button>
        )}

        <button
          onClick={onOpenAccount}
          className="relative flex items-center justify-center w-9 h-9 rounded-full ring-2 ring-purple-300 hover:ring-pink-400 transition-all overflow-hidden focus:outline-hidden"
          title={user ? `Signed in as ${user.name}` : 'Sign In / Register'}
        >
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-purple-100 text-purple-600 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
          )}
          {recipeCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-linear-to-r from-pink-500 to-purple-500 text-white text-[9px] font-bold px-1 rounded-full border border-white">
              {recipeCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
