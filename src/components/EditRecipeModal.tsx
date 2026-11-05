import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Camera,
  Image as ImageIcon,
  Plus,
  Trash2,
  Check,
  Edit3
} from 'lucide-react';
import { Recipe, RecipeCategory, Ingredient, InstructionStep } from '../types/recipe';

import lasagnaImg from '../assets/images/recipe_lasagna_heirloom_1793898158537.jpg';
import applePieImg from '../assets/images/recipe_apple_pie_grandma_1793898159138.jpg';
import biryaniImg from '../assets/images/recipe_chicken_biryani_1793898160064.jpg';
import focacciaImg from '../assets/images/recipe_sourdough_focaccia_1793898160466.jpg';

interface EditRecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
  onUpdateRecipe: (updated: Recipe) => void;
}

const PRESET_PHOTOS = [
  { name: 'Lasagna', url: lasagnaImg || '/images/lasagna.jpg' },
  { name: 'Apple Pie', url: applePieImg || '/images/apple_pie.jpg' },
  { name: 'Biryani', url: biryaniImg || '/images/biryani.jpg' },
  { name: 'Focaccia', url: focacciaImg || '/images/focaccia.jpg' },
];

export const EditRecipeModal: React.FC<EditRecipeModalProps> = ({
  recipe,
  onClose,
  onUpdateRecipe,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields initialized with current recipe data
  const [title, setTitle] = useState(recipe.title);
  const [description, setDescription] = useState(recipe.description);
  const [category, setCategory] = useState<RecipeCategory>(recipe.category);
  const [imageUrl, setImageUrl] = useState(recipe.imageUrl);
  const [prepTime, setPrepTime] = useState(recipe.prepTimeMinutes);
  const [cookTime, setCookTime] = useState(recipe.cookTimeMinutes);
  const [servings, setServings] = useState(recipe.servings);
  const [difficulty, setDifficulty] = useState(recipe.difficulty);
  const [secretTips, setSecretTips] = useState(recipe.secretTips || '');

  // Ingredients
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    recipe.ingredients.length > 0
      ? recipe.ingredients
      : [{ id: '1', amount: '1', unit: 'cup', name: '' }]
  );

  // Steps
  const [instructions, setInstructions] = useState<InstructionStep[]>(
    recipe.instructions.length > 0
      ? recipe.instructions
      : [{ id: '1', stepNumber: 1, text: '' }]
  );

  const [errorMsg, setErrorMsg] = useState('');

  // Handle Photo File Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select an image file (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result as string);
    };
    reader.onerror = () => {
      setErrorMsg('Failed to load image.');
    };
    reader.readAsDataURL(file);
  };

  // Add / Remove Ingredient
  const handleAddIngredient = () => {
    setIngredients((prev) => [
      ...prev,
      { id: Date.now().toString(), amount: '1', unit: 'tbsp', name: '' },
    ]);
  };

  const handleUpdateIngredient = (id: string, field: keyof Ingredient, value: string) => {
    setIngredients((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((item) => item.id !== id));
  };

  // Add / Remove Step
  const handleAddStep = () => {
    setInstructions((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        stepNumber: prev.length + 1,
        text: '',
      },
    ]);
  };

  const handleUpdateStep = (id: string, text: string) => {
    setInstructions((prev) =>
      prev.map((step) => (step.id === id ? { ...step, text } : step))
    );
  };

  const handleRemoveStep = (id: string) => {
    setInstructions((prev) =>
      prev
        .filter((step) => step.id !== id)
        .map((step, idx) => ({ ...step, stepNumber: idx + 1 }))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please enter a recipe title.');
      return;
    }

    const updated: Recipe = {
      ...recipe,
      title: title.trim(),
      description: description.trim(),
      imageUrl,
      category,
      prepTimeMinutes: Number(prepTime),
      cookTimeMinutes: Number(cookTime),
      servings: Number(servings),
      difficulty,
      secretTips: secretTips.trim() || undefined,
      ingredients: ingredients.filter((i) => i.name.trim() !== ''),
      instructions: instructions.filter((s) => s.text.trim() !== ''),
    };

    onUpdateRecipe(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full sm:max-w-xl bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-pink-200">
        {/* Modal Top Header */}
        <div className="p-4 bg-linear-to-r from-pink-100 via-pink-50 to-purple-100 border-b border-pink-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pink-500 text-white flex items-center justify-center shadow-xs">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-recipe text-lg font-bold text-purple-950">
                Edit Recipe
              </h2>
              <p className="text-[11px] text-purple-600">
                Update measurements, photo, and instructions.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-purple-800 flex items-center justify-center shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-purple-950 bg-[#fdf2f8]/40">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium">
              {errorMsg}
            </div>
          )}

          {/* PHOTO SECTION */}
          <div>
            <label className="block text-xs font-bold text-purple-900 mb-1.5">
              Recipe Photo
            </label>

            <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-pink-300 bg-pink-50/50 p-2.5 text-center">
              <div className="relative h-40 w-full rounded-xl overflow-hidden bg-black/5">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/25 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-white text-purple-950 rounded-lg text-xs font-semibold shadow-md hover:bg-pink-50 flex items-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5 text-pink-500" />
                    <span>Change Photo</span>
                  </button>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>

            {/* Presets */}
            <div className="mt-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
              <span className="text-[10px] text-purple-500 font-semibold shrink-0">Presets:</span>
              {PRESET_PHOTOS.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setImageUrl(p.url)}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-medium shrink-0 border transition-all ${
                    imageUrl === p.url
                      ? 'border-pink-500 bg-pink-100 text-pink-800'
                      : 'border-purple-200 bg-white text-purple-700 hover:bg-purple-50'
                  }`}
                >
                  <ImageIcon className="w-3 h-3 text-pink-400" />
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* TITLE & CATEGORY */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-purple-900 mb-1">
                Recipe Title <span className="text-pink-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-pink-300 font-semibold text-purple-950"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-purple-900 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as RecipeCategory)}
                  className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs font-semibold text-purple-950 focus:outline-hidden focus:ring-2 focus:ring-pink-300"
                >
                  <option value="Quick Family Dinners">Quick Dinners</option>
                  <option value="Heirloom Classics">Heirloom Classics</option>
                  <option value="Holiday Feasts">Holiday Feasts</option>
                  <option value="Grandma's Secrets">Grandma's Secrets</option>
                  <option value="Breads & Baking">Breads &amp; Baking</option>
                  <option value="Desserts & Sweets">Desserts &amp; Sweets</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-900 mb-1">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs font-semibold text-purple-950 focus:outline-hidden focus:ring-2 focus:ring-pink-300"
                >
                  <option value="Easy">Easy</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Heirloom Secret">Chef Special</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-900 mb-1">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs text-purple-950 focus:outline-hidden"
              />
            </div>
          </div>

          {/* TIMES & SERVINGS */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-bold text-purple-900 mb-1">
                Prep (mins)
              </label>
              <input
                type="number"
                min="1"
                value={prepTime}
                onChange={(e) => setPrepTime(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-white border border-purple-200 rounded-xl text-xs font-semibold text-purple-950 text-center"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-purple-900 mb-1">
                Cook (mins)
              </label>
              <input
                type="number"
                min="0"
                value={cookTime}
                onChange={(e) => setCookTime(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-white border border-purple-200 rounded-xl text-xs font-semibold text-purple-950 text-center"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-purple-900 mb-1">
                Servings
              </label>
              <input
                type="number"
                min="1"
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-white border border-purple-200 rounded-xl text-xs font-semibold text-purple-950 text-center"
              />
            </div>
          </div>

          {/* INGREDIENTS LIST */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-purple-900">
                Ingredients ({ingredients.length})
              </label>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="text-[11px] text-pink-600 font-bold hover:text-pink-700 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Ingredient</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {ingredients.map((ing) => (
                <div key={ing.id} className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={ing.amount}
                    onChange={(e) => handleUpdateIngredient(ing.id, 'amount', e.target.value)}
                    placeholder="1"
                    className="w-14 px-2 py-1.5 bg-white border border-purple-200 rounded-lg text-xs font-medium text-center"
                  />
                  <input
                    type="text"
                    value={ing.unit}
                    onChange={(e) => handleUpdateIngredient(ing.id, 'unit', e.target.value)}
                    placeholder="cup"
                    className="w-20 px-2 py-1.5 bg-white border border-purple-200 rounded-lg text-xs font-medium text-center"
                  />
                  <input
                    type="text"
                    value={ing.name}
                    onChange={(e) => handleUpdateIngredient(ing.id, 'name', e.target.value)}
                    placeholder="Ingredient"
                    className="flex-1 px-2.5 py-1.5 bg-white border border-purple-200 rounded-lg text-xs font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(ing.id)}
                    className="p-1.5 text-purple-300 hover:text-rose-500 rounded-md"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* INSTRUCTIONS STEPS */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-purple-900">
                Directions &amp; Steps ({instructions.length})
              </label>
              <button
                type="button"
                onClick={handleAddStep}
                className="text-[11px] text-pink-600 font-bold hover:text-pink-700 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Step</span>
              </button>
            </div>

            <div className="space-y-2">
              {instructions.map((step) => (
                <div key={step.id} className="p-2.5 bg-white border border-purple-100 rounded-xl space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between text-[11px] font-bold text-pink-700">
                    <span>Step {step.stepNumber}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(step.id)}
                      className="text-purple-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <textarea
                    value={step.text}
                    onChange={(e) => handleUpdateStep(step.id, e.target.value)}
                    rows={2}
                    className="w-full px-2.5 py-1.5 bg-pink-50/30 border border-purple-200 rounded-lg text-xs font-normal text-purple-950 focus:outline-hidden"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* SECRET CHEF TIP */}
          <div className="pt-1">
            <label className="block text-xs font-bold text-purple-900 mb-1">
              Chef Tip or Secret Touch <span className="text-purple-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={secretTips}
              onChange={(e) => setSecretTips(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs text-purple-950 focus:outline-hidden"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-3 border-t border-purple-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-purple-700 hover:text-purple-950"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-pink-300/40 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Update Recipe</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
