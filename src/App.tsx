import React, { useState, useEffect } from 'react';
import { MobileFrame } from './components/MobileFrame';
import { TopBar } from './components/TopBar';
import { BottomNav, TabType } from './components/BottomNav';
import { RecipeList } from './components/RecipeList';
import { RecipeDetailModal } from './components/RecipeDetailModal';
import { EditRecipeModal } from './components/EditRecipeModal';
import { AddRecipeModal } from './components/AddRecipeModal';
import { ShareModal } from './components/ShareModal';
import { FamilyCircleView } from './components/FamilyCircleView';
import { AccountProfileView } from './components/AccountProfileView';
import { AuthScreen } from './components/AuthScreen';
import { Recipe, UserAccount, FamilyMember } from './types/recipe';
import { INITIAL_RECIPES, INITIAL_FAMILY_MEMBERS } from './data/initialRecipes';

export default function App() {
  // Start page should be Login and Sign up if not signed in
  const [user, setUser] = useState<UserAccount | null>(() => {
    try {
      const stored = localStorage.getItem('recipebook_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Recipes State
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    try {
      const stored = localStorage.getItem('recipebook_recipes');
      return stored ? JSON.parse(stored) : INITIAL_RECIPES;
    } catch {
      return INITIAL_RECIPES;
    }
  });

  // Family Members State
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(() => {
    try {
      const stored = localStorage.getItem('recipebook_family_members');
      return stored ? JSON.parse(stored) : INITIAL_FAMILY_MEMBERS;
    } catch {
      return INITIAL_FAMILY_MEMBERS;
    }
  });

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<TabType>('recipes');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [shareRecipe, setShareRecipe] = useState<Recipe | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Sync recipes with backend API on mount
  useEffect(() => {
    async function fetchBackendRecipes() {
      try {
        const res = await fetch('/api/recipes');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.recipes) && data.recipes.length > 0) {
            setRecipes(data.recipes);
            localStorage.setItem('recipebook_recipes', JSON.stringify(data.recipes));
          }
        }
      } catch (err) {
        console.warn('Backend API sync skipped, using local offline storage:', err);
      }
    }
    fetchBackendRecipes();
  }, []);

  // Sync local storage on recipes state change
  const saveRecipes = (updatedList: Recipe[]) => {
    setRecipes(updatedList);
    try {
      localStorage.setItem('recipebook_recipes', JSON.stringify(updatedList));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  };

  // Toggle Favorite
  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recipes.map((r) =>
      r.id === id ? { ...r, isFavorite: !r.isFavorite } : r
    );
    saveRecipes(updated);

    if (selectedRecipe && selectedRecipe.id === id) {
      setSelectedRecipe((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }

    const target = updated.find((r) => r.id === id);
    if (target) {
      fetch(`/api/recipes/${id}/favorite`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: target.isFavorite }),
      }).catch(() => {});
    }
  };

  // Add Recipe
  const handleSaveNewRecipe = async (newRecipe: Recipe) => {
    const updated = [newRecipe, ...recipes];
    saveRecipes(updated);

    try {
      await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecipe),
      });
    } catch (err) {
      console.warn('Could not post to /api/recipes:', err);
    }
  };

  // Update Recipe (Edit)
  const handleUpdateRecipe = async (updatedRecipe: Recipe) => {
    const updated = recipes.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r));
    saveRecipes(updated);
    if (selectedRecipe?.id === updatedRecipe.id) {
      setSelectedRecipe(updatedRecipe);
    }

    try {
      await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRecipe),
      });
    } catch (err) {
      console.warn('Could not update recipe on backend:', err);
    }
  };

  // Delete Recipe
  const handleDeleteRecipe = async (id: string) => {
    const updated = recipes.filter((r) => r.id !== id);
    saveRecipes(updated);
    if (selectedRecipe?.id === id) {
      setSelectedRecipe(null);
    }

    try {
      await fetch(`/api/recipes/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Could not delete from /api/recipes:', err);
    }
  };

  // Add Family Member
  const handleAddFamilyMember = (newMember: FamilyMember) => {
    const updated = [...familyMembers, newMember];
    setFamilyMembers(updated);
    try {
      localStorage.setItem('recipebook_family_members', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  };

  // Update user profile
  const handleUpdateUser = (updatedUser: UserAccount) => {
    setUser(updatedUser);
    localStorage.setItem('recipebook_user', JSON.stringify(updatedUser));
  };

  // Logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('recipebook_user');
  };

  const favoriteCount = recipes.filter((r) => r.isFavorite).length;

  return (
    <MobileFrame activeTabTitle="RecipeBook">
      {/* START PAGE: If user is not logged in, show Login and Sign Up screen with food photos */}
      {!user ? (
        <div className="flex-1 flex flex-col justify-center bg-[#fdf2f8] overflow-y-auto">
          <AuthScreen
            currentUser={null}
            onLoginSuccess={(loggedInUser) => {
              setUser(loggedInUser);
            }}
            isStartScreen={true}
          />
        </div>
      ) : (
        /* MAIN APPLICATION (When signed in or in guest mode) */
        <>
          {/* Top Application Bar */}
          <TopBar
            user={user}
            onOpenAccount={() => setActiveTab('account')}
            onOpenQuickAdd={() => setIsAddModalOpen(true)}
            recipeCount={recipes.length}
          />

          {/* Primary Tab Screens */}
          <main className="flex-1 flex flex-col bg-[#fdf2f8]">
            {activeTab === 'recipes' && (
              <RecipeList
                recipes={recipes}
                onSelectRecipe={(r) => setSelectedRecipe(r)}
                onToggleFavorite={handleToggleFavorite}
                onShareRecipe={(r, e) => {
                  e.stopPropagation();
                  setShareRecipe(r);
                }}
                onOpenAddModal={() => setIsAddModalOpen(true)}
                filterFavoritesOnly={false}
              />
            )}

            {activeTab === 'favorites' && (
              <RecipeList
                recipes={recipes}
                onSelectRecipe={(r) => setSelectedRecipe(r)}
                onToggleFavorite={handleToggleFavorite}
                onShareRecipe={(r, e) => {
                  e.stopPropagation();
                  setShareRecipe(r);
                }}
                onOpenAddModal={() => setIsAddModalOpen(true)}
                filterFavoritesOnly={true}
              />
            )}

            {activeTab === 'family' && (
              <FamilyCircleView
                members={familyMembers}
                recipes={recipes}
                onSelectMemberRecipes={() => setActiveTab('recipes')}
                onAddMember={handleAddFamilyMember}
              />
            )}

            {activeTab === 'account' && (
              <AccountProfileView
                user={user}
                recipes={recipes}
                onOpenAuth={() => setIsAuthModalOpen(true)}
                onLogout={handleLogout}
                onUpdateUser={handleUpdateUser}
              />
            )}
          </main>

          {/* Bottom Touch Navigation */}
          <BottomNav
            activeTab={activeTab}
            onSelectTab={(tab) => setActiveTab(tab)}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            favoritesCount={favoriteCount}
          />
        </>
      )}

      {/* Modal: Recipe Details */}
      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onToggleFavorite={handleToggleFavorite}
          onShare={(r) => {
            setSelectedRecipe(null);
            setShareRecipe(r);
          }}
          onEditRecipe={(r) => {
            setSelectedRecipe(null);
            setEditingRecipe(r);
          }}
          onDeleteRecipe={handleDeleteRecipe}
        />
      )}

      {/* Modal: Edit Recipe */}
      {editingRecipe && (
        <EditRecipeModal
          recipe={editingRecipe}
          onClose={() => setEditingRecipe(null)}
          onUpdateRecipe={handleUpdateRecipe}
        />
      )}

      {/* Modal: Add Recipe */}
      {isAddModalOpen && (
        <AddRecipeModal
          onClose={() => setIsAddModalOpen(false)}
          onSaveRecipe={handleSaveNewRecipe}
          defaultAuthorName={user?.name || 'Me'}
        />
      )}

      {/* Modal: Share Recipe */}
      {shareRecipe && (
        <ShareModal
          recipe={shareRecipe}
          onClose={() => setShareRecipe(null)}
          familyMembers={familyMembers}
        />
      )}

      {/* Modal: Switch Account or Register */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-[#fdf2f8] rounded-3xl shadow-2xl overflow-hidden border border-pink-200 max-h-[92vh] overflow-y-auto">
            <AuthScreen
              currentUser={user}
              onLoginSuccess={(loggedInUser) => {
                setUser(loggedInUser);
                setIsAuthModalOpen(false);
              }}
              onClose={() => setIsAuthModalOpen(false)}
            />
          </div>
        </div>
      )}
    </MobileFrame>
  );
}
