import React, { useState } from 'react';
import { Users, UserPlus, Heart, BookOpen, ChefHat, Sparkles, X, Mail, Check } from 'lucide-react';
import { FamilyMember, Recipe } from '../types/recipe';

interface FamilyCircleViewProps {
  members: FamilyMember[];
  recipes: Recipe[];
  onSelectMemberRecipes: (memberName: string) => void;
  onAddMember: (member: FamilyMember) => void;
}

export const FamilyCircleView: React.FC<FamilyCircleViewProps> = ({
  members,
  recipes,
  onSelectMemberRecipes,
  onAddMember,
}) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteRelationship, setInviteRelationship] = useState('Aunt');
  const [inviteEmail, setInviteEmail] = useState('');
  const [favoriteDish, setFavoriteDish] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim()) return;

    const newMember: FamilyMember = {
      id: 'fam_' + Date.now(),
      name: inviteName.trim(),
      relationship: inviteRelationship,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      recipeCount: 0,
      favoriteDish: favoriteDish.trim() || 'Sunday Dinner',
    };

    onAddMember(newMember);
    setShowInviteModal(false);
    setInviteName('');
    setInviteEmail('');
    setFavoriteDish('');
    setSuccessToast(`Invitation sent to ${newMember.name}! Added to Family Circle.`);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  return (
    <div className="flex-1 flex flex-col p-4 pb-20 space-y-4">
      {/* Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif-recipe text-xl font-bold text-purple-950">
            Family Circle
          </h2>
          <p className="text-xs text-purple-700/80">
            Connected contributors sharing precious heirloom recipes.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="px-3 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Invite</span>
        </button>
      </div>

      {successToast && (
        <div className="p-3 bg-pink-50 border border-pink-200 rounded-xl text-xs font-medium text-pink-900 flex items-center gap-2">
          <Check className="w-4 h-4 text-pink-600" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Members List Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {members.map((member) => {
          // Count recipes matching passedDownBy or author
          const count = recipes.filter(
            (r) =>
              r.passedDownBy.toLowerCase().includes(member.name.toLowerCase()) ||
              (r.sharedWith && r.sharedWith.includes(member.name))
          ).length;

          return (
            <div
              key={member.id}
              onClick={() => onSelectMemberRecipes(member.name)}
              className="bg-white p-3.5 rounded-2xl border border-purple-100 shadow-xs hover:border-pink-300 transition-all cursor-pointer flex items-center gap-3 group"
            >
              <div className="relative shrink-0">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-200 group-hover:ring-pink-400 transition-all"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center border border-white">
                  <ChefHat className="w-2.5 h-2.5" />
                </span>
              </div>

              <div className="flex-1 truncate">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-purple-950 truncate group-hover:text-pink-600 transition-colors">
                    {member.name}
                  </h3>
                  <span className="text-[10px] font-semibold text-purple-500 bg-purple-50 px-2 py-0.5 rounded-md">
                    {member.relationship}
                  </span>
                </div>

                <p className="text-[11px] text-purple-600/80 truncate mt-0.5">
                  Favorite: <span className="font-medium text-purple-900">{member.favoriteDish}</span>
                </p>

                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-pink-600 mt-1">
                  <BookOpen className="w-3 h-3 text-pink-400" />
                  <span>{count} heirloom {count === 1 ? 'recipe' : 'recipes'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-pink-100 space-y-4">
            <div className="flex items-center justify-between border-b border-purple-100 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-pink-500 text-white flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="font-serif-recipe text-base font-bold text-purple-950">
                  Invite to Family Circle
                </h3>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-purple-400 hover:text-purple-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-purple-900 mb-1">
                  Family Member's Name
                </label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Aunt Maria"
                  className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs font-medium text-purple-950"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-900 mb-1">
                  Relationship
                </label>
                <select
                  value={inviteRelationship}
                  onChange={(e) => setInviteRelationship(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs font-semibold text-purple-950"
                >
                  <option value="Grandmother">Grandmother</option>
                  <option value="Grandfather">Grandfather</option>
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Aunt">Aunt</option>
                  <option value="Uncle">Uncle</option>
                  <option value="Cousin">Cousin</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Family Friend">Family Friend</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-900 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="maria@family.com"
                  className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs font-medium text-purple-950"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-900 mb-1">
                  Their Signature / Favorite Dish
                </label>
                <input
                  type="text"
                  value={favoriteDish}
                  onChange={(e) => setFavoriteDish(e.target.value)}
                  placeholder="e.g. Homemade Tiramisu"
                  className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs font-medium text-purple-950"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-3 py-2 text-xs font-semibold text-purple-700 hover:text-purple-950"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
