export type RecipeCategory =
  | 'All'
  | 'Heirloom Classics'
  | 'Holiday Feasts'
  | "Grandma's Secrets"
  | 'Breads & Baking'
  | 'Comfort Soups & Stews'
  | 'Quick Family Dinners'
  | 'Desserts & Sweets';

export interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
  notes?: string;
}

export interface InstructionStep {
  id: string;
  stepNumber: number;
  text: string;
  tip?: string;
  timerMinutes?: number;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  avatar: string;
  recipeCount: number;
  favoriteDish: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: RecipeCategory;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: 'Easy' | 'Moderate' | 'Heirloom Secret';
  passedDownBy: string;
  passedDownYear?: string;
  originLocation?: string;
  ingredients: Ingredient[];
  instructions: InstructionStep[];
  familyStory?: string;
  secretTips?: string;
  tags: string[];
  isFavorite: boolean;
  sharedWith: string[]; // member names or IDs
  createdAt: string;
  authorId: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  familyBookTitle: string;
  heirloomSpecialty: string;
  avatarUrl: string;
  joinedDate: string;
  membersCount: number;
  useMetricUnits: boolean;
  keepScreenAwake: boolean;
}
