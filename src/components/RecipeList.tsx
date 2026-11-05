import React, { useState, useMemo } from 'react';
import { Search, X, SlidersHorizontal, Sparkles, BookHeart, Plus, ChefHat } from 'lucide-react';
import { Recipe, RecipeCategory } from '../types/recipe';
import { RecipeCard } from './RecipeCard';

interface RecipeListProps {
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onShareRecipe: (recipe: Recipe, e: React.MouseEvent) => void;
  onOpenAddModal: () => void;
  filterFavoritesOnly?: boolean;
}

const CATEGORIES: RecipeCategory[] = [
  'All',
  'Heirloom Classics',
  'Holiday Feasts',
  "Grandma's Secrets",
  'Breads & Baking',
  'Desserts & Sweets',
];

const POPULAR_KEYWORDS = ['Lasagna', 'Apples', 'Biryani', 'Focaccia', 'Garlic', 'Saffron', 'Baking'];

export const RecipeList: React.FC<RecipeListProps> = ({
  recipes,
  onSelectRecipe,
  onToggleFavorite,
  onShareRecipe,
  onOpenAddModal,
  filterFavoritesOnly = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'quickest' | 'alphabetical'>('newest');

  // Real-time keyword filtering across title, ingredients, tags, description, contributor
  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      // Favorite filter
      if (filterFavoritesOnly && !recipe.isFavorite) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && recipe.category !== selectedCategory) {
        return false;
      }

      // Keyword search
      if (!searchQuery.trim()) {
        return true;
      }

      const q = searchQuery.toLowerCase().trim();
      const titleMatch = recipe.title.toLowerCase().includes(q);
      const descMatch = recipe.description.toLowerCase().includes(q);
      const authorMatch = recipe.passedDownBy.toLowerCase().includes(q);
      const originMatch = (recipe.originLocation || '').toLowerCase().includes(q);
      const tagMatch = recipe.tags.some((t) => t.toLowerCase().includes(q));
      const ingredientMatch = recipe.ingredients.some((ing) =>
        ing.name.toLowerCase().includes(q)
      );

      return titleMatch || descMatch || authorMatch || originMatch || tagMatch || ingredientMatch;
    }).sort((a, b) => {
      if (sortBy === 'quickest') {
        return (a.prepTimeMinutes + a.cookTimeMinutes) - (b.prepTimeMinutes + b.cookTimeMinutes);
      }
      if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [recipes, searchQuery, selectedCategory, sortBy, filterFavoritesOnly]);

  return (
    <div className="flex-1 flex flex-col p-4 pb-20">
      {/* Search Header Banner */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <h2 className="font-serif-recipe text-xl font-bold text-purple-950">
            {filterFavoritesOnly ? 'My Favorite Recipes' : 'My Recipes'}
          </h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700">
            {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'}
          </span>
        </div>
        <p className="text-xs text-purple-700/80">
          Search, cook, and organize your personal recipe collection.
        </p>
      </div>

      {/* REAL-TIME SEARCH BAR */}
      <div className="relative mb-3">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-purple-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search title, ingredients (e.g. saffron, apples)..."
            className="w-full pl-9 pr-9 py-2.5 bg-white border border-purple-200 rounded-xl text-xs sm:text-sm placeholder:text-purple-300 text-purple-950 focus:outline-hidden focus:ring-2 focus:ring-pink-300 focus:border-pink-400 shadow-xs transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 p-0.5 rounded-full hover:bg-purple-100 text-purple-400 hover:text-purple-700 transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Keyword Pills for Instant Real-Time Search */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 pb-0.5 text-[11px]">
          <span className="text-[10px] text-purple-400 font-semibold shrink-0 uppercase tracking-wider">
            Quick:
          </span>
          {POPULAR_KEYWORDS.map((kw) => (
            <button
              key={kw}
              type="button"
              onClick={() => setSearchQuery(kw)}
              className={`px-2 py-0.5 rounded-md font-medium shrink-0 transition-colors ${
                searchQuery.toLowerCase() === kw.toLowerCase()
                  ? 'bg-pink-500 text-white shadow-xs'
                  : 'bg-purple-100/70 text-purple-700 hover:bg-pink-100 hover:text-pink-800'
              }`}
            >
              {kw}
            </button>
          ))}
        </div>
      </div>

      {/* CATEGORY TABS & SORT */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-linear-to-r from-pink-500 to-purple-600 text-white shadow-xs shadow-pink-300/40'
                  : 'bg-white border border-purple-100 text-purple-800 hover:bg-purple-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort and Filters bar */}
        <div className="flex items-center justify-between text-xs text-purple-700 pt-1">
          <div className="flex items-center gap-1 font-medium">
            <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-semibold text-purple-950 focus:outline-hidden cursor-pointer hover:text-pink-600"
            >
              <option value="newest">Latest Added</option>
              <option value="quickest">Quickest Cook Time</option>
              <option value="alphabetical">Name (A-Z)</option>
            </select>
          </div>

          {(searchQuery || selectedCategory !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="text-pink-600 font-semibold text-[11px] hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* RECIPES LIST GRID */}
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onSelect={onSelectRecipe}
              onToggleFavorite={onToggleFavorite}
              onShare={onShareRecipe}
            />
          ))}
        </div>
      ) : (
        /* Empty Search Results State */
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white/70 backdrop-blur-md rounded-2xl border border-dashed border-pink-200 my-6">
          <div className="w-12 h-12 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-serif-recipe text-lg font-bold text-purple-950">
            No recipes matched "{searchQuery}"
          </h3>
          <p className="text-xs text-purple-700/80 mt-1 max-w-xs">
            Try searching for another ingredient like <span className="font-semibold text-pink-600">apples, pasta, saffron, or garlic</span>, or add this new recipe to your RecipeBook!
          </p>

          <div className="flex items-center gap-2 mt-4">
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="px-3.5 py-1.5 rounded-xl border border-purple-200 text-xs font-semibold text-purple-800 hover:bg-purple-50"
            >
              Clear Search
            </button>
            <button
              type="button"
              onClick={onOpenAddModal}
              className="px-3.5 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add This Recipe</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
