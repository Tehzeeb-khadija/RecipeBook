import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Camera,
  Image as ImageIcon,
  Plus,
  Trash2,
  Sparkles,
  Utensils,
  BookOpen,
  Check
} from 'lucide-react';
import { Recipe, RecipeCategory, Ingredient, InstructionStep } from '../types/recipe';

interface AddRecipeModalProps {
  onClose: () => void;
  onSaveRecipe: (recipe: Recipe) => void;
  defaultAuthorName?: string;
}

const PRESET_PHOTOS = [
  { name: 'Heirloom Lasagna', url: '/src/assets/images/recipe_lasagna_heirloom_1793898158537.jpg' },
  { name: 'Apple Pie', url: '/src/assets/images/recipe_apple_pie_grandma_1793898159138.jpg' },
  { name: 'Chicken Biryani', url: '/src/assets/images/recipe_chicken_biryani_1793898160064.jpg' },
  { name: 'Rosemary Focaccia', url: '/src/assets/images/recipe_sourdough_focaccia_1793898160466.jpg' },
];

export const AddRecipeModal: React.FC<AddRecipeModalProps> = ({
  onClose,
  onSaveRecipe,
  defaultAuthorName = 'Me',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<RecipeCategory>('Quick Family Dinners');
  const [imageUrl, setImageUrl] = useState(PRESET_PHOTOS[0].url);
  const [prepTime, setPrepTime] = useState(20);
  const [cookTime, setCookTime] = useState(30);
  const [servings, setServings] = useState(4);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Moderate' | 'Heirloom Secret'>('Easy');
  const [secretTips, setSecretTips] = useState('');
  const [tagsStr, setTagsStr] = useState('Dinner, Homemade');

  // Ingredients
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: '1', amount: '2', unit: 'cups', name: 'Flour' },
    { id: '2', amount: '1', unit: 'tsp', name: 'Salt' },
  ]);

  // Steps (without timer mins)
  const [instructions, setInstructions] = useState<InstructionStep[]>([
    { id: '1', stepNumber: 1, text: 'Prep and combine the main ingredients in a mixing bowl.' },
    { id: '2', stepNumber: 2, text: 'Cook over medium heat until tender and golden brown.' },
  ]);

  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle Photo File Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select an image file (PNG, JPG, WebP).');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result as string);
      setIsUploading(false);
    };
    reader.onerror = () => {
      setErrorMsg('Failed to load image.');
      setIsUploading(false);
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

  // Add / Remove Step (No timer mins)
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

  // Quick Sample Fill
  const handleAutoFillSampleRecipe = () => {
    setTitle("Creamy Garlic Parmesan Pasta");
    setDescription("Quick, rich, and comforting weeknight pasta coated in a velvety garlic and cream sauce.");
    setCategory('Quick Family Dinners');
    setPrepTime(15);
    setCookTime(15);
    setServings(4);
    setDifficulty('Easy');
    setSecretTips("Reserve 1/2 cup of hot pasta water to make the sauce extra glossy!");
    setTagsStr('Pasta, Quick, Garlic, Comfort');
    setIngredients([
      { id: '1', amount: '1', unit: 'lb', name: 'Fettuccine or spaghetti' },
      { id: '2', amount: '4', unit: 'cloves', name: 'Garlic, minced' },
      { id: '3', amount: '1', unit: 'cup', name: 'Heavy cream' },
      { id: '4', amount: '1', unit: 'cup', name: 'Parmesan cheese, freshly grated' },
      { id: '5', amount: '3', unit: 'tbsp', name: 'Unsalted butter' },
    ]);
    setInstructions([
      { id: '1', stepNumber: 1, text: 'Boil pasta in salted water until al dente. Reserve 1/2 cup pasta water and drain.' },
      { id: '2', stepNumber: 2, text: 'Melt butter in a large skillet over medium heat. Sauté garlic for 1 minute until fragrant.' },
      { id: '3', stepNumber: 3, text: 'Pour in heavy cream and bring to a gentle simmer. Whisk in grated Parmesan until melted and smooth.' },
      { id: '4', stepNumber: 4, text: 'Toss pasta in the sauce, adding pasta water if needed to coat. Season with black pepper and serve.' },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please enter a recipe title.');
      return;
    }

    const newRecipe: Recipe = {
      id: 'rec_' + Date.now(),
      title: title.trim(),
      description: description.trim() || 'Delicious homemade recipe.',
      imageUrl: imageUrl,
      category,
      prepTimeMinutes: Number(prepTime),
      cookTimeMinutes: Number(cookTime),
      servings: Number(servings),
      difficulty,
      passedDownBy: defaultAuthorName || 'Me',
      secretTips: secretTips.trim() || undefined,
      tags: tagsStr.split(',').map((t) => t.trim()).filter(Boolean),
      ingredients: ingredients.filter((i) => i.name.trim() !== ''),
      instructions: instructions.filter((s) => s.text.trim() !== ''),
      isFavorite: false,
      sharedWith: [],
      createdAt: new Date().toISOString(),
      authorId: 'usr_current',
    };

    onSaveRecipe(newRecipe);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full sm:max-w-xl bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-pink-200">
        {/* Modal Top Header */}
        <div className="p-4 bg-linear-to-r from-pink-100 via-pink-50 to-purple-100 border-b border-pink-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pink-500 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-recipe text-lg font-bold text-purple-950">
                Add Recipe
              </h2>
              <p className="text-[11px] text-purple-600">
                Upload photo, enter ingredients, and save step-by-step instructions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAutoFillSampleRecipe}
              className="text-[11px] font-semibold text-pink-700 bg-pink-100 hover:bg-pink-200 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 border border-pink-200"
              title="Auto-fill sample recipe"
            >
              <Sparkles className="w-3 h-3 text-pink-500" />
              <span>Sample Fill</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-purple-800 flex items-center justify-center shadow-xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-purple-950 bg-[#fdf2f8]/40">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium">
              {errorMsg}
            </div>
          )}

          {/* PHOTO UPLOAD SECTION */}
          <div>
            <label className="block text-xs font-bold text-purple-900 mb-1.5">
              Recipe Photo <span className="text-pink-500">*</span>
            </label>

            {/* Photo Preview & Upload Dropzone */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-pink-300 bg-pink-50/50 p-3 text-center">
              {imageUrl ? (
                <div className="relative h-44 w-full rounded-xl overflow-hidden bg-black/5">
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
              ) : (
                <div className="py-6 flex flex-col items-center justify-center">
                  <Upload className="w-8 h-8 text-pink-400 mb-2" />
                  <p className="text-xs font-semibold text-purple-900">
                    Upload from Camera or Gallery
                  </p>
                  <p className="text-[10px] text-purple-500 mt-0.5">
                    PNG, JPG, WebP supported
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-3 px-3 py-1.5 bg-pink-500 hover:bg-pink-600 text-white rounded-lg text-xs font-semibold shadow-xs"
                  >
                    Select Photo
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>

            {/* Quick Presets Picker */}
            <div className="mt-2">
              <span className="text-[11px] text-purple-500 font-medium mr-2">Or pick preset photo:</span>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                {PRESET_PHOTOS.map((p, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setImageUrl(p.url)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium shrink-0 border transition-all ${
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
                placeholder="e.g. Creamy Tuscan Garlic Chicken"
                className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-pink-300 font-semibold text-purple-950 placeholder:text-purple-300"
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
                Short Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of why this recipe is delicious..."
                className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs text-purple-950 placeholder:text-purple-300 focus:outline-hidden"
              />
            </div>
          </div>

          {/* TIMES & SERVINGS */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-bold text-purple-900 mb-1">
                Prep Time (mins)
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
                Cook Time (mins)
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
                    placeholder="2"
                    className="w-14 px-2 py-1.5 bg-white border border-purple-200 rounded-lg text-xs font-medium text-center"
                  />
                  <input
                    type="text"
                    value={ing.unit}
                    onChange={(e) => handleUpdateIngredient(ing.id, 'unit', e.target.value)}
                    placeholder="cups"
                    className="w-20 px-2 py-1.5 bg-white border border-purple-200 rounded-lg text-xs font-medium text-center"
                  />
                  <input
                    type="text"
                    value={ing.name}
                    onChange={(e) => handleUpdateIngredient(ing.id, 'name', e.target.value)}
                    placeholder="Ingredient name"
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

          {/* INSTRUCTIONS STEPS (WITHOUT TIMER MINS) */}
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
                    placeholder="Describe what to do in this step..."
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
              placeholder="e.g. Add a pinch of sea salt at the very end"
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
              <span>Save Recipe</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
