import React, { useState } from 'react';
import {
  X,
  Heart,
  Share2,
  Clock,
  Users,
  Utensils,
  CheckCircle2,
  Minus,
  Plus,
  Trash2,
  Edit3,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { Recipe } from '../types/recipe';

interface RecipeDetailModalProps {
  recipe: Recipe;
  onClose: () => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onShare: (recipe: Recipe) => void;
  onEditRecipe: (recipe: Recipe) => void;
  onDeleteRecipe?: (id: string) => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  onClose,
  onToggleFavorite,
  onShare,
  onEditRecipe,
  onDeleteRecipe,
}) => {
  const [servingsMultiplier, setServingsMultiplier] = useState(1);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const scaledServings = Math.max(1, Math.round(recipe.servings * servingsMultiplier));

  const toggleIngredientCheck = (id: string) => {
    setCheckedIngredients((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleStepCheck = (id: string) => {
    setCompletedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Helper to scale ingredient amounts
  const formatScaledAmount = (amountStr: string) => {
    const num = parseFloat(amountStr);
    if (isNaN(num)) return amountStr;
    const scaled = num * servingsMultiplier;
    return scaled % 1 === 0 ? scaled.toString() : scaled.toFixed(1).replace(/\.0$/, '');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full sm:max-w-lg bg-[#fdf2f8] rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-pink-200">
        {/* Top Header with Image */}
        <div className="relative h-60 w-full shrink-0 bg-pink-100">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-950/85 via-purple-950/20 to-black/30 pointer-events-none" />

          {/* Close, Share, Favorite */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-md text-purple-900 hover:bg-white flex items-center justify-center shadow-xs transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onShare(recipe)}
                className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-md text-purple-900 hover:bg-white flex items-center justify-center shadow-xs transition-colors"
                title="Share Recipe"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => onToggleFavorite(recipe.id, e)}
                className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center shadow-xs transition-colors ${
                  recipe.isFavorite
                    ? 'bg-pink-500 text-white'
                    : 'bg-white/80 text-purple-900 hover:bg-white'
                }`}
                title="Favorite"
              >
                <Heart className={`w-4 h-4 ${recipe.isFavorite ? 'fill-white' : ''}`} />
              </button>
            </div>
          </div>

          {/* Title on Image */}
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <span className="text-xs font-semibold text-pink-200 block mb-0.5">
              {recipe.category}
            </span>
            <h2 className="font-serif-recipe text-xl sm:text-2xl font-bold leading-tight drop-shadow-xs">
              {recipe.title}
            </h2>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-purple-950">
          {/* Metrics Strip */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 bg-white rounded-2xl border border-pink-100 shadow-2xs">
              <span className="text-[10px] text-purple-500 font-medium">Prep Time</span>
              <p className="text-sm font-bold text-purple-950 mt-0.5">{recipe.prepTimeMinutes} mins</p>
            </div>
            <div className="p-2.5 bg-white rounded-2xl border border-pink-100 shadow-2xs">
              <span className="text-[10px] text-purple-500 font-medium">Cook Time</span>
              <p className="text-sm font-bold text-purple-950 mt-0.5">{recipe.cookTimeMinutes} mins</p>
            </div>
            <div className="p-2.5 bg-white rounded-2xl border border-pink-100 shadow-2xs">
              <span className="text-[10px] text-purple-500 font-medium">Difficulty</span>
              <p className="text-sm font-bold text-pink-600 mt-0.5">{recipe.difficulty}</p>
            </div>
          </div>

          {/* EDIT RECIPE BUTTON (Replaced interactive cook mode) */}
          <button
            onClick={() => {
              onClose();
              onEditRecipe(recipe);
            }}
            className="w-full py-3 px-4 rounded-2xl bg-linear-to-r from-pink-500 via-pink-600 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-pink-300/40 active:scale-[0.99] transition-all"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Recipe</span>
          </button>

          {/* Recipe Description */}
          {recipe.description && (
            <div className="p-3.5 bg-white rounded-2xl border border-pink-100 shadow-2xs text-xs text-purple-900/85 leading-relaxed">
              {recipe.description}
            </div>
          )}

          {/* Chef Tip / Secret Touch */}
          {recipe.secretTips && (
            <div className="p-3 bg-pink-100/70 border border-pink-200 rounded-2xl">
              <div className="flex items-center gap-1.5 text-xs font-bold text-pink-800 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                <span>Chef's Secret Tip</span>
              </div>
              <p className="text-xs text-purple-950 leading-relaxed">
                {recipe.secretTips}
              </p>
            </div>
          )}

          {/* Ingredients Section with Servings Scaler */}
          <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-pink-50">
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-pink-500" />
                <h3 className="font-serif-recipe text-base font-bold text-purple-950">
                  Ingredients
                </h3>
              </div>

              {/* Servings Scaler */}
              <div className="flex items-center gap-2 bg-pink-50 px-2.5 py-1 rounded-xl border border-pink-200">
                <button
                  onClick={() => setServingsMultiplier((prev) => Math.max(0.5, prev - 0.5))}
                  className="w-5 h-5 rounded-md bg-white text-purple-900 flex items-center justify-center hover:bg-pink-100 font-bold"
                  title="Fewer servings"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-xs font-bold text-purple-950 tabular-nums">
                  {scaledServings} serv
                </span>
                <button
                  onClick={() => setServingsMultiplier((prev) => prev + 0.5)}
                  className="w-5 h-5 rounded-md bg-white text-purple-900 flex items-center justify-center hover:bg-pink-100 font-bold"
                  title="More servings"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              {recipe.ingredients.map((ing) => {
                const isChecked = !!checkedIngredients[ing.id];
                return (
                  <label
                    key={ing.id}
                    onClick={() => toggleIngredientCheck(ing.id)}
                    className={`flex items-start gap-2.5 p-2 rounded-xl cursor-pointer transition-colors ${
                      isChecked ? 'bg-pink-50/50 text-purple-400 line-through' : 'hover:bg-pink-50/60 text-purple-950'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="mt-0.5 w-4 h-4 rounded-md accent-pink-500 border-pink-300"
                    />
                    <div className="text-xs flex-1">
                      <span className="font-bold text-pink-700 mr-1.5 tabular-nums">
                        {formatScaledAmount(ing.amount)} {ing.unit}
                      </span>
                      <span className="font-medium">{ing.name}</span>
                      {ing.notes && <span className="text-purple-500 italic ml-1">({ing.notes})</span>}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Instructions Steps (Clean, no timer mins) */}
          <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-2xs space-y-3">
            <h3 className="font-serif-recipe text-base font-bold text-purple-950 pb-2 border-b border-pink-50">
              Directions &amp; Steps
            </h3>

            <div className="space-y-2.5">
              {recipe.instructions.map((step) => {
                const isDone = !!completedSteps[step.id];
                return (
                  <div
                    key={step.id}
                    onClick={() => toggleStepCheck(step.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isDone
                        ? 'bg-pink-50/50 border-pink-200 text-purple-400'
                        : 'bg-white border-pink-100 hover:border-pink-300 text-purple-950'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          isDone
                            ? 'bg-pink-500 text-white'
                            : 'bg-pink-100 text-pink-700'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.stepNumber}
                      </span>
                      <p className={`text-xs leading-relaxed flex-1 ${isDone ? 'line-through text-purple-400' : ''}`}>
                        {step.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delete Action */}
          {onDeleteRecipe && (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Delete this recipe from your RecipeBook?')) {
                    onDeleteRecipe(recipe.id);
                    onClose();
                  }
                }}
                className="text-xs text-rose-500 hover:text-rose-700 font-semibold flex items-center justify-center gap-1 mx-auto py-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Recipe</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
