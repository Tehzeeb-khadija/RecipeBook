import React, { useState } from 'react';
import {
  User,
  BookHeart,
  Settings,
  ShieldCheck,
  LogOut,
  Sparkles,
  Heart,
  Users,
  Database,
  Moon,
  ToggleLeft,
  ToggleRight,
  Edit3,
  Check
} from 'lucide-react';
import { UserAccount, Recipe } from '../types/recipe';

interface AccountProfileViewProps {
  user: UserAccount | null;
  recipes: Recipe[];
  onOpenAuth: () => void;
  onLogout: () => void;
  onUpdateUser: (updated: UserAccount) => void;
}

export const AccountProfileView: React.FC<AccountProfileViewProps> = ({
  user,
  recipes,
  onOpenAuth,
  onLogout,
  onUpdateUser,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(user?.familyBookTitle || '');
  const [useMetric, setUseMetric] = useState<boolean>(user?.useMetricUnits ?? false);
  const [keepAwake, setKeepAwake] = useState<boolean>(user?.keepScreenAwake ?? true);
  const [savedNotice, setSavedNotice] = useState('');

  const favoriteCount = recipes.filter((r) => r.isFavorite).length;

  const handleSaveTitle = () => {
    if (user && editedTitle.trim()) {
      const updated = { ...user, familyBookTitle: editedTitle.trim() };
      onUpdateUser(updated);
      setIsEditingTitle(false);
      setSavedNotice('Family RecipeBook title updated!');
      setTimeout(() => setSavedNotice(''), 2000);
    }
  };

  const handleToggleUnits = () => {
    const val = !useMetric;
    setUseMetric(val);
    if (user) {
      onUpdateUser({ ...user, useMetricUnits: val });
    }
  };

  const handleToggleScreen = () => {
    const val = !keepAwake;
    setKeepAwake(val);
    if (user) {
      onUpdateUser({ ...user, keepScreenAwake: val });
    }
  };

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-pink-100 text-pink-500 flex items-center justify-center shadow-inner">
          <BookHeart className="w-8 h-8" />
        </div>
        <h2 className="font-serif-recipe text-xl font-bold text-purple-950">
          Sign In to Your RecipeBook
        </h2>
        <p className="text-xs text-purple-700/80 max-w-xs">
          Sign in or create your family archive to sync recipes across devices and share with your relatives.
        </p>
        <button
          onClick={onOpenAuth}
          className="px-6 py-2.5 rounded-xl bg-linear-to-r from-pink-500 to-purple-600 text-white text-xs font-bold shadow-md shadow-pink-300/40"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-4 pb-20 space-y-4 text-purple-950">
      {/* Header Profile Card */}
      <div className="p-4 bg-pastel-gradient rounded-3xl border border-pink-100 shadow-xs space-y-3">
        <div className="flex items-center gap-3">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-pink-300 shadow-xs"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 truncate">
            <h2 className="font-serif-recipe text-lg font-bold text-purple-950 truncate">
              {user.name}
            </h2>
            <p className="text-xs text-purple-600 truncate">{user.email}</p>
            <span className="inline-block mt-0.5 text-[10px] font-semibold text-pink-700 bg-pink-100 px-2 py-0.5 rounded-md">
              {user.joinedDate}
            </span>
          </div>
        </div>

        {/* Family Book Title */}
        <div className="pt-2 border-t border-purple-100/80">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">
              Family Archive Name
            </span>
            <button
              onClick={() => {
                if (isEditingTitle) handleSaveTitle();
                else setIsEditingTitle(true);
              }}
              className="text-[11px] text-pink-600 font-semibold hover:underline flex items-center gap-1"
            >
              {isEditingTitle ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>Save</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </>
              )}
            </button>
          </div>

          {isEditingTitle ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-pink-300 rounded-lg text-xs font-semibold text-purple-950 focus:outline-hidden"
              autoFocus
            />
          ) : (
            <p className="font-serif-recipe text-sm font-bold text-purple-900">
              "{user.familyBookTitle}"
            </p>
          )}

          {user.heirloomSpecialty && (
            <p className="text-[11px] text-purple-600/90 mt-1 italic">
              Specialty: {user.heirloomSpecialty}
            </p>
          )}
        </div>
      </div>

      {savedNotice && (
        <div className="p-2 bg-pink-50 border border-pink-200 rounded-xl text-xs font-semibold text-pink-800 text-center animate-fadeIn">
          {savedNotice}
        </div>
      )}

      {/* Stats Counter */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-3 bg-white rounded-2xl border border-purple-100 shadow-2xs">
          <BookHeart className="w-4 h-4 text-pink-500 mx-auto mb-1" />
          <div className="text-base font-bold text-purple-950 tabular-nums">
            {recipes.length}
          </div>
          <div className="text-[10px] text-purple-500 font-medium">Recipes</div>
        </div>

        <div className="p-3 bg-white rounded-2xl border border-purple-100 shadow-2xs">
          <Heart className="w-4 h-4 text-rose-500 mx-auto mb-1" />
          <div className="text-base font-bold text-purple-950 tabular-nums">
            {favoriteCount}
          </div>
          <div className="text-[10px] text-purple-500 font-medium">Favorites</div>
        </div>

        <div className="p-3 bg-white rounded-2xl border border-purple-100 shadow-2xs">
          <Users className="w-4 h-4 text-purple-500 mx-auto mb-1" />
          <div className="text-base font-bold text-purple-950 tabular-nums">
            {user.membersCount}
          </div>
          <div className="text-[10px] text-purple-500 font-medium">Members</div>
        </div>
      </div>

      {/* Storage and Database Badge */}
      <div className="p-3 bg-white rounded-2xl border border-purple-100 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-purple-950">
              Cloud SQL Relational Storage
            </div>
            <div className="text-[10px] text-purple-500">
              PostgreSQL instance in asia-southeast1
            </div>
          </div>
        </div>
        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          Connected
        </span>
      </div>

      {/* Cooking App Preferences */}
      <div className="bg-white p-3.5 rounded-2xl border border-purple-100 shadow-2xs space-y-3">
        <div className="text-xs font-bold text-purple-950 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-purple-50">
          <Settings className="w-3.5 h-3.5 text-pink-500" />
          <span>Kitchen Preferences</span>
        </div>

        <div className="flex items-center justify-between text-xs py-1">
          <div>
            <div className="font-semibold text-purple-900">Keep Screen Awake While Cooking</div>
            <div className="text-[10px] text-purple-500">Prevents phone sleep in Cook Mode</div>
          </div>
          <button onClick={handleToggleScreen} className="text-pink-500">
            {keepAwake ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7 text-purple-300" />}
          </button>
        </div>

        <div className="flex items-center justify-between text-xs py-1 border-t border-purple-50 pt-2">
          <div>
            <div className="font-semibold text-purple-900">Measurement Units</div>
            <div className="text-[10px] text-purple-500">
              {useMetric ? 'Metric (g, ml, °C)' : 'Imperial (cups, tbsp, °F)'}
            </div>
          </div>
          <button
            onClick={handleToggleUnits}
            className="px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-200 text-[11px] font-bold text-purple-800"
          >
            {useMetric ? 'Metric' : 'Imperial'}
          </button>
        </div>
      </div>

      {/* Sign Out & Switch Account */}
      <div className="pt-2 space-y-2">
        <button
          onClick={onOpenAuth}
          className="w-full py-2.5 rounded-xl border border-purple-200 text-purple-900 text-xs font-bold hover:bg-purple-50 flex items-center justify-center gap-1.5 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-pink-500" />
          <span>Switch Account or Register New Member</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full py-2.5 rounded-xl border border-rose-100 text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out of RecipeBook</span>
        </button>
      </div>
    </div>
  );
};
