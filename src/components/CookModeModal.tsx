import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, ChevronLeft, ChevronRight, CheckCircle2, Clock, Volume2, Sparkles } from 'lucide-react';
import { Recipe } from '../types/recipe';
import { playKitchenChime } from '../utils/audio';

interface CookModeModalProps {
  recipe: Recipe;
  onClose: () => void;
}

export const CookModeModal: React.FC<CookModeModalProps> = ({ recipe, onClose }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const steps = recipe.instructions;
  const currentStep = steps[currentStepIndex];

  // Kitchen countdown timer state
  const defaultSeconds = (currentStep?.timerMinutes || 5) * 60;
  const [timerSeconds, setTimerSeconds] = useState(defaultSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerFinished, setTimerFinished] = useState(false);

  // Update timer whenever step changes
  useEffect(() => {
    const sec = (currentStep?.timerMinutes || 5) * 60;
    setTimerSeconds(sec);
    setIsTimerRunning(false);
    setTimerFinished(false);
  }, [currentStepIndex]);

  // Countdown effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setTimerFinished(true);
      playKitchenChime();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const isLastStep = currentStepIndex === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 bg-purple-950/95 backdrop-blur-md flex flex-col justify-between text-white p-4 sm:p-6 animate-fadeIn">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-purple-800/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-400 animate-pulse" />
          <div>
            <h2 className="font-serif-recipe text-sm sm:text-base font-bold text-white truncate max-w-[220px] sm:max-w-md">
              {recipe.title}
            </h2>
            <p className="text-[11px] text-pink-300 font-medium">
              Interactive Cook Mode · Hands-Free View
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-purple-900/80 hover:bg-purple-800 text-purple-200 hover:text-white flex items-center justify-center transition-colors"
          title="Exit Cook Mode"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Step Body */}
      <div className="flex-1 flex flex-col justify-center max-w-xl mx-auto w-full py-4 space-y-6">
        {/* Step Progress Dots */}
        <div className="flex items-center justify-center gap-1.5">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all ${
                idx === currentStepIndex
                  ? 'w-8 bg-pink-400'
                  : idx < currentStepIndex
                  ? 'w-3 bg-purple-600'
                  : 'w-2 bg-purple-900'
              }`}
            />
          ))}
        </div>

        {/* Big Step Number and Instruction */}
        <div className="text-center space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 text-xs font-bold uppercase tracking-wider">
            Step {currentStepIndex + 1} of {steps.length}
          </span>

          <p className="text-lg sm:text-2xl font-medium leading-relaxed text-stone-100 max-w-lg mx-auto">
            {currentStep?.text}
          </p>

          {currentStep?.tip && (
            <div className="p-3 bg-pink-950/60 border border-pink-500/30 rounded-2xl max-w-md mx-auto text-xs text-pink-200">
              <span className="font-bold text-pink-400 mr-1">Grandma's Advice:</span>
              {currentStep.tip}
            </div>
          )}
        </div>

        {/* Built-in Kitchen Timer Box */}
        <div className="bg-purple-900/60 border border-purple-700/60 rounded-3xl p-4 sm:p-5 max-w-sm mx-auto w-full text-center shadow-lg">
          <div className="flex items-center justify-center gap-1.5 text-xs text-pink-300 font-semibold mb-1">
            <Clock className="w-3.5 h-3.5 text-pink-400" />
            <span>Kitchen Timer</span>
          </div>

          <div
            className={`font-mono text-4xl sm:text-5xl font-bold tracking-tight my-2 tabular-nums ${
              timerFinished ? 'text-pink-400 animate-bounce' : 'text-white'
            }`}
          >
            {formatTimer(timerSeconds)}
          </div>

          {timerFinished && (
            <div className="flex items-center justify-center gap-1 text-xs text-pink-300 font-bold mb-2">
              <Volume2 className="w-4 h-4 text-pink-400" />
              <span>Step timer complete! Chime played.</span>
            </div>
          )}

          {/* Timer Controls */}
          <div className="flex items-center justify-center gap-2 pt-1">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-pink-500/30 active:scale-95 transition-all"
            >
              {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isTimerRunning ? 'Pause' : 'Start'}</span>
            </button>

            <button
              onClick={() => {
                setIsTimerRunning(false);
                setTimerSeconds((currentStep?.timerMinutes || 5) * 60);
                setTimerFinished(false);
              }}
              className="p-2 rounded-xl bg-purple-800 hover:bg-purple-700 text-purple-200 transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setTimerSeconds((prev) => prev + 60)}
              className="px-2.5 py-2 rounded-xl bg-purple-800 hover:bg-purple-700 text-[11px] font-semibold text-purple-200"
            >
              +1m
            </button>
            <button
              onClick={() => setTimerSeconds((prev) => prev + 300)}
              className="px-2.5 py-2 rounded-xl bg-purple-800 hover:bg-purple-700 text-[11px] font-semibold text-purple-200"
            >
              +5m
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Step Navigation Bar */}
      <div className="border-t border-purple-800/60 pt-3 flex items-center justify-between max-w-xl mx-auto w-full">
        <button
          onClick={handlePrev}
          disabled={currentStepIndex === 0}
          className={`flex items-center gap-1 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            currentStepIndex === 0
              ? 'opacity-30 cursor-not-allowed text-purple-400'
              : 'bg-purple-900/80 hover:bg-purple-800 text-white'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {isLastStep ? (
          <button
            onClick={() => {
              playKitchenChime();
              onClose();
            }}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs shadow-lg active:scale-95 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Finish Cooking &amp; Enjoy!</span>
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-pink-500/30 active:scale-95 transition-all"
          >
            <span>Next Step</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
