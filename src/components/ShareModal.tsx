import React, { useState, useMemo } from 'react';
import {
  X,
  Copy,
  Check,
  QrCode,
  Share2,
  Users,
  Printer,
  Sparkles,
  MessageCircle,
  Mail,
  Heart
} from 'lucide-react';
import { Recipe, FamilyMember } from '../types/recipe';
import { generateQRMatrix } from '../utils/qrCode';

interface ShareModalProps {
  recipe: Recipe;
  onClose: () => void;
  familyMembers: FamilyMember[];
}

export const ShareModal: React.FC<ShareModalProps> = ({
  recipe,
  onClose,
  familyMembers,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [sharedMemberIds, setSharedMemberIds] = useState<string[]>(
    recipe.sharedWith || []
  );
  const [notice, setNotice] = useState('');

  // Share URL
  const shareUrl = `${window.location.origin}/#recipe-${recipe.id}`;

  // SVG QR matrix
  const qrMatrix = useMemo(() => {
    return generateQRMatrix(shareUrl, 25);
  }, [shareUrl]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setNotice('Recipe link copied to clipboard!');
    setTimeout(() => {
      setCopiedLink(false);
      setNotice('');
    }, 2000);
  };

  const handleCopyWhatsAppText = () => {
    const ingList = recipe.ingredients
      .map((i) => `• ${i.amount} ${i.unit} ${i.name}`)
      .join('\n');
    const stepsList = recipe.instructions
      .map((s) => `${s.stepNumber}. ${s.text}`)
      .join('\n');

    const formatted = `📖 *${recipe.title}*\nFrom our Family RecipeBook (passed down by ${recipe.passedDownBy})\n\n🕒 Prep: ${recipe.prepTimeMinutes}m | Cook: ${recipe.cookTimeMinutes}m | Servings: ${recipe.servings}\n\n🛒 *Ingredients:*\n${ingList}\n\n👩‍🍳 *Directions:*\n${stepsList}\n\n💡 *Grandma's Secret:* ${recipe.secretTips || 'Cook with love!'}\n\n✨ Shared via RecipeBook: ${shareUrl}`;

    navigator.clipboard.writeText(formatted);
    setCopiedText(true);
    setNotice('Full recipe text copied for WhatsApp / SMS!');
    setTimeout(() => {
      setCopiedText(false);
      setNotice('');
    }, 2500);
  };

  const toggleShareMember = (member: FamilyMember) => {
    setSharedMemberIds((prev) => {
      const exists = prev.includes(member.name) || prev.includes(member.id);
      if (exists) {
        setNotice(`Removed ${member.name} from shared circle.`);
        return prev.filter((id) => id !== member.name && id !== member.id);
      } else {
        setNotice(`Recipe shared with ${member.name}!`);
        return [...prev, member.name];
      }
    });
    setTimeout(() => setNotice(''), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-pink-100">
        {/* Header */}
        <div className="p-4 bg-pastel-gradient border-b border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pink-500 text-white flex items-center justify-center shadow-xs">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-recipe text-base font-bold text-purple-950">
                Share Heirloom Recipe
              </h2>
              <p className="text-[11px] text-purple-600 truncate max-w-[200px]">
                {recipe.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-purple-800 flex items-center justify-center shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-purple-950">
          {notice && (
            <div className="p-2.5 bg-pink-50 border border-pink-200 rounded-xl text-xs font-semibold text-pink-800 text-center animate-fadeIn">
              {notice}
            </div>
          )}

          {/* KITCHEN QR CODE */}
          <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 flex flex-col items-center text-center">
            <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider mb-2 flex items-center gap-1">
              <QrCode className="w-3.5 h-3.5 text-pink-500" />
              <span>Scan to Open on Family Phone</span>
            </span>

            {/* Sharp vector SVG QR code */}
            <div className="p-2.5 bg-white rounded-2xl shadow-xs border border-purple-200 inline-block">
              <svg
                viewBox={`0 0 ${qrMatrix.length} ${qrMatrix.length}`}
                className="w-36 h-36"
                shapeRendering="crispEdges"
              >
                {qrMatrix.map((row, rIdx) =>
                  row.map((cell, cIdx) =>
                    cell ? (
                      <rect
                        key={`${rIdx}-${cIdx}`}
                        x={cIdx}
                        y={rIdx}
                        width="1"
                        height="1"
                        fill="#3b0764"
                      />
                    ) : null
                  )
                )}
              </svg>
            </div>
            <p className="text-[10px] text-purple-500 mt-2">
              Relatives can scan this from the kitchen counter to view the full recipe
            </p>
          </div>

          {/* COPY LINK & TEXT ACTIONS */}
          <div className="space-y-2">
            <button
              onClick={handleCopyLink}
              className="w-full py-2.5 px-3 rounded-xl border border-purple-200 hover:border-pink-300 bg-white hover:bg-pink-50/50 flex items-center justify-between text-xs font-semibold text-purple-950 transition-colors"
            >
              <div className="flex items-center gap-2">
                {copiedLink ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4 text-purple-400" />
                )}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Recipe Link'}</span>
              </div>
              <span className="text-[11px] text-pink-600 font-bold">Copy</span>
            </button>

            <button
              onClick={handleCopyWhatsAppText}
              className="w-full py-2.5 px-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white flex items-center justify-between text-xs font-semibold shadow-xs transition-colors"
            >
              <div className="flex items-center gap-2">
                {copiedText ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <MessageCircle className="w-4 h-4 text-pink-200" />
                )}
                <span>{copiedText ? 'Copied Recipe Card!' : 'Copy WhatsApp / Message Format'}</span>
              </div>
              <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-md">
                Formatted Text
              </span>
            </button>
          </div>

          {/* SHARE TO FAMILY CIRCLE MEMBERS */}
          <div className="space-y-2 pt-2 border-t border-purple-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-pink-500" />
                <span>Family Circle Sharing</span>
              </span>
              <span className="text-[11px] text-purple-500">
                Tap to give access
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {familyMembers.map((member) => {
                const isShared =
                  sharedMemberIds.includes(member.name) ||
                  sharedMemberIds.includes(member.id);
                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => toggleShareMember(member)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                      isShared
                        ? 'bg-pink-50 border-pink-300 text-pink-900 shadow-2xs'
                        : 'bg-white border-purple-100 text-purple-800 hover:bg-purple-50'
                    }`}
                  >
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-7 h-7 rounded-full object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="truncate flex-1">
                      <div className="text-xs font-bold truncate leading-tight">
                        {member.name}
                      </div>
                      <div className="text-[10px] text-purple-500 truncate">
                        {member.relationship}
                      </div>
                    </div>
                    {isShared && (
                      <Check className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Print Recipe Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handlePrint}
              className="w-full py-2 px-3 rounded-xl border border-purple-200 text-xs font-semibold text-purple-700 hover:bg-purple-50 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-purple-500" />
              <span>Print Heirloom Recipe Card</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
