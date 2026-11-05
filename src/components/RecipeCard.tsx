import React from 'react';
import { Clock, Users, Heart, Share2, Sparkles, ChefHat } from 'lucide-react';
import { Recipe } from '../types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onShare: (recipe: Recipe, e: React.MouseEvent) => void;
  isCompact?: boolean;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onSelect,
  onToggleFavorite,
  onShare,
  isCompact = false,
}) => {
  const totalMinutes = recipe.prepTimeMinutes + recipe.cookTimeMinutes;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const timeFormatted = hours > 0 ? `${hours}h ${minutes > 0 ? `${minutes}m` : ''}` : `${minutes}m`;

  return (
    <div
      onClick={() => onSelect(recipe)}
      className="group bg-white rounded-2xl border border-pink-100 shadow-xs hover:shadow-md hover:border-pink-200 transition-all cursor-pointer overflow-hidden flex flex-col active:scale-[0.99]"
    >
      {/* Image container with quiet metadata overlay */}
      <div className={`relative w-full overflow-hidden bg-pink-50 ${isCompact ? 'h-36' : 'h-48'}`}>
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-950/70 via-transparent to-black/20 pointer-events-none" />

        {/* Top Floating Actions: Favorite & Share */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
          <button
            type="button"
            onClick={(e) => onShare(recipe, e)}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-purple-800 hover:bg-white flex items-center justify-center shadow-xs transition-colors"
            title="Share Recipe with Family"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => onToggleFavorite(recipe.id, e)}
            className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center shadow-xs transition-colors ${
              recipe.isFavorite
                ? 'bg-pink-500 text-white shadow-pink-300/60'
                : 'bg-white/90 text-purple-700 hover:bg-white'
            }`}
            title={recipe.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-3.5 h-3.5 ${recipe.isFavorite ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Bottom Metadata on Image: Passed down by */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg">
            <ChefHat className="w-3 h-3 text-pink-300" />
            <span className="font-medium text-[11px] truncate max-w-[140px]">
              {recipe.passedDownBy} {recipe.passedDownYear ? `· ${recipe.passedDownYear}` : ''}
            </span>
          </div>

          {recipe.difficulty === 'Heirloom Secret' && (
            <span className="bg-pink-500/90 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
              Heirloom
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Quiet Text */}
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-pink-600 mb-1">
            <span>{recipe.category}</span>
            {recipe.originLocation && (
              <>
                <span className="text-purple-300" aria-hidden="true">·</span>
                <span className="text-purple-600 truncate">{recipe.originLocation}</span>
              </>
            )}
          </div>

          {/* Title */}
          <h3 className="font-serif-recipe text-base font-bold text-purple-950 line-clamp-1 group-hover:text-pink-600 transition-colors">
            {recipe.title}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-purple-800/70 mt-1 line-clamp-2 leading-relaxed">
            {recipe.description}
          </p>
        </div>

        {/* Bottom Details Row */}
        <div className="pt-3 mt-2 border-t border-purple-50 flex items-center justify-between text-xs text-purple-700">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              <span className="tabular-nums">{timeFormatted}</span>
            </span>
            <span className="flex items-center gap-1 font-medium">
              <Users className="w-3.5 h-3.5 text-purple-400" />
              <span className="tabular-nums">{recipe.servings} serv</span>
            </span>
          </div>

          <span className="text-[11px] font-semibold text-pink-500 group-hover:translate-x-0.5 transition-transform">
            View Recipe →
          </span>
        </div>
      </div>
    </div>
  );
};
