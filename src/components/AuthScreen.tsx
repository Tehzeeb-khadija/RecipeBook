import React, { useState } from 'react';
import { BookHeart, Mail, Lock, User, Sparkles, Heart, Eye, EyeOff, CheckCircle2, ArrowRight, Utensils } from 'lucide-react';
import { UserAccount } from '../types/recipe';

interface AuthScreenProps {
  currentUser: UserAccount | null;
  onLoginSuccess: (user: UserAccount) => void;
  onClose?: () => void;
  initialMode?: 'login' | 'register';
  isStartScreen?: boolean;
}

const FOOD_SHOWCASE_PHOTOS = [
  {
    title: 'Baked Lasagna',
    tag: 'Dinner',
    url: '/src/assets/images/recipe_lasagna_heirloom_1793898158537.jpg',
  },
  {
    title: 'Lattice Apple Pie',
    tag: 'Baking',
    url: '/src/assets/images/recipe_apple_pie_grandma_1793898159138.jpg',
  },
  {
    title: 'Chicken Biryani',
    tag: 'Spiced',
    url: '/src/assets/images/recipe_chicken_biryani_1793898160064.jpg',
  },
  {
    title: 'Olive Oil Focaccia',
    tag: 'Bread',
    url: '/src/assets/images/recipe_sourdough_focaccia_1793898160466.jpg',
  },
];

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
];

export const AuthScreen: React.FC<AuthScreenProps> = ({
  currentUser: _currentUser,
  onLoginSuccess,
  onClose,
  initialMode = 'login',
  isStartScreen = false,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cookbookTitle, setCookbookTitle] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both your email and password.');
      return;
    }

    const stored = localStorage.getItem('recipebook_user');
    let user: UserAccount;
    if (stored) {
      user = JSON.parse(stored);
      user.email = email;
    } else {
      user = {
        id: 'usr_' + Date.now(),
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        email: email,
        familyBookTitle: "My Recipe Vault",
        heirloomSpecialty: "Comfort Dinners & Baking",
        avatarUrl: selectedAvatar,
        joinedDate: 'Joined ' + new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        membersCount: 4,
        useMetricUnits: false,
        keepScreenAwake: true,
      };
    }

    localStorage.setItem('recipebook_user', JSON.stringify(user));
    setSuccessNotice('Signed in successfully! Opening your recipes...');
    setTimeout(() => {
      onLoginSuccess(user);
      onClose?.();
    }, 450);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please provide your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters.');
      return;
    }

    const newUser: UserAccount = {
      id: 'usr_' + Date.now(),
      name: name.trim(),
      email: email.trim(),
      familyBookTitle: cookbookTitle.trim() || `${name.trim()}'s Recipe Collection`,
      heirloomSpecialty: 'Delicious Homemade Cooking',
      avatarUrl: selectedAvatar,
      joinedDate: 'Joined ' + new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      membersCount: 1,
      useMetricUnits: false,
      keepScreenAwake: true,
    };

    localStorage.setItem('recipebook_user', JSON.stringify(newUser));
    setSuccessNotice('Account created! Welcome to RecipeBook.');
    setTimeout(() => {
      onLoginSuccess(newUser);
      onClose?.();
    }, 450);
  };

  return (
    <div className="p-4 sm:p-5 max-w-md mx-auto w-full flex flex-col justify-center">
      {/* FOOD PHOTOS SHOWCASE CAROUSEL ON START PAGE */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-950">
            <Utensils className="w-3.5 h-3.5 text-pink-500" />
            <span>Cherished Recipes In RecipeBook</span>
          </div>
          <span className="text-[10px] text-pink-600 font-semibold">4 Heirlooms</span>
        </div>

        {/* 4 Photo Cards Grid */}
        <div className="grid grid-cols-2 gap-2">
          {FOOD_SHOWCASE_PHOTOS.map((food, idx) => (
            <div
              key={idx}
              className="relative h-24 rounded-2xl overflow-hidden border border-pink-200/90 shadow-2xs group"
            >
              <img
                src={food.url}
                alt={food.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-950/80 via-transparent to-black/10 pointer-events-none" />
              <div className="absolute bottom-1.5 left-2 right-2">
                <span className="text-[9px] font-bold text-pink-200 uppercase tracking-wider block">
                  {food.tag}
                </span>
                <span className="text-[11px] font-bold text-white leading-none truncate block">
                  {food.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Header Badge */}
      <div className="text-center mb-3">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-linear-to-tr from-pink-400 via-pink-500 to-purple-500 text-white flex items-center justify-center shadow-md shadow-pink-300/40 mb-2">
          <BookHeart className="w-6 h-6" />
        </div>
        <h2 className="font-serif-recipe text-xl font-bold text-purple-950">
          {mode === 'login' ? 'Log In to RecipeBook' : 'Sign Up for RecipeBook'}
        </h2>
        <p className="text-xs text-purple-700/80 mt-0.5 max-w-xs mx-auto">
          {mode === 'login'
            ? 'Sign in to access, organize, and cook your recipes.'
            : 'Create your account to store photos and recipes in one place.'}
        </p>

        {/* Tab Switcher: Login and Sign up */}
        <div className="flex items-center justify-center gap-1 p-1 bg-pink-100 rounded-2xl mt-3 max-w-xs mx-auto border border-pink-200">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
              setSuccessNotice('');
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-white text-purple-950 shadow-xs'
                : 'text-purple-700 hover:text-purple-950'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg('');
              setSuccessNotice('');
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
              mode === 'register'
                ? 'bg-white text-purple-950 shadow-xs'
                : 'text-purple-700 hover:text-purple-950'
            }`}
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successNotice && (
        <div className="mb-3 p-2.5 bg-pink-50 border border-pink-300 rounded-xl flex items-center gap-2 text-xs font-semibold text-pink-900 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-pink-600 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Error Notification */}
      {errorMsg && (
        <div className="mb-3 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-800">
          {errorMsg}
        </div>
      )}

      {/* FORM: LOGIN */}
      {mode === 'login' ? (
        <form onSubmit={handleLoginSubmit} className="space-y-3 bg-white/80 p-4 rounded-2xl border border-pink-200 shadow-xs">
          <div>
            <label className="block text-xs font-bold text-purple-900 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-pink-400 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="chef@example.com"
                className="w-full pl-9 pr-3 py-2 bg-white border border-pink-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-pink-300 text-purple-950 placeholder:text-purple-300"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-purple-900">
                Password
              </label>
              <button
                type="button"
                onClick={() => setSuccessNotice('Demo mode: You can enter any password or use the Quick Demo Logins below!')}
                className="text-[11px] text-pink-600 hover:text-pink-700 font-medium hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-pink-400 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2 bg-white border border-pink-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-pink-300 text-purple-950 placeholder:text-purple-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-pink-400 hover:text-purple-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-0.5">
            <input
              type="checkbox"
              id="remember_login"
              defaultChecked
              className="w-4 h-4 accent-pink-500 rounded-md border-pink-300"
            />
            <label htmlFor="remember_login" className="text-xs text-purple-800">
              Keep me signed in
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-pink-300/40 active:scale-[0.98] transition-all"
          >
            <span>Log In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      ) : (
        /* FORM: SIGN UP */
        <form onSubmit={handleRegisterSubmit} className="space-y-3 bg-white/80 p-4 rounded-2xl border border-pink-200 shadow-xs">
          <div>
            <label className="block text-xs font-bold text-purple-900 mb-1">
              Your Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-pink-400 absolute left-3 top-3" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Khadija Parkar"
                className="w-full pl-9 pr-3 py-2 bg-white border border-pink-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-pink-300 text-purple-950 placeholder:text-purple-300"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-purple-900 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-pink-400 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="khadija@example.com"
                className="w-full pl-9 pr-3 py-2 bg-white border border-pink-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-pink-300 text-purple-950 placeholder:text-purple-300"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-purple-900 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-pink-400 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create password"
                className="w-full pl-9 pr-10 py-2 bg-white border border-pink-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-pink-300 text-purple-950 placeholder:text-purple-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-pink-400 hover:text-purple-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-purple-900 mb-1">
              RecipeBook Title <span className="text-purple-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={cookbookTitle}
              onChange={(e) => setCookbookTitle(e.target.value)}
              placeholder="e.g. My Favorite Kitchen Recipes"
              className="w-full px-3 py-2 bg-white border border-pink-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-pink-300 text-purple-950 placeholder:text-purple-300"
            />
          </div>

          {/* Choose Avatar */}
          <div>
            <label className="block text-xs font-bold text-purple-900 mb-1">
              Select Avatar
            </label>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {AVATAR_OPTIONS.map((img, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setSelectedAvatar(img)}
                  className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all shrink-0 ${
                    selectedAvatar === img
                      ? 'border-pink-500 ring-2 ring-pink-300 scale-105'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-pink-300/40 active:scale-[0.98] transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Sign Up</span>
          </button>
        </form>
      )}

      {/* Guest Exploration Option */}
      <div className="mt-3 text-center">
        <button
          type="button"
          onClick={() => {
            const guestUser: UserAccount = {
              id: 'usr_guest',
              name: 'Guest User',
              email: 'guest@recipebook.com',
              familyBookTitle: 'My Recipe Vault',
              heirloomSpecialty: 'Everyday Cooking',
              avatarUrl: AVATAR_OPTIONS[0],
              joinedDate: 'Guest Mode',
              membersCount: 1,
              useMetricUnits: false,
              keepScreenAwake: true,
            };
            onLoginSuccess(guestUser);
            onClose?.();
          }}
          className="text-xs text-purple-700 hover:text-pink-600 font-semibold underline underline-offset-2 transition-colors py-1.5 px-3 rounded-lg hover:bg-pink-100/50"
        >
          Skip &amp; Explore "My Recipes" as Guest →
        </button>
      </div>

      {/* Creator Attribution */}
      <div className="mt-4 pt-3 border-t border-pink-200/80 text-center">
        <p className="text-xs font-semibold text-purple-800 flex items-center justify-center gap-1.5">
          <span>App created by Tehzeeb</span>
          <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-400" />
        </p>
      </div>
    </div>
  );
};
