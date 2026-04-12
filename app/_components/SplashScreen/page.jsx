"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const toRoman = (num) => ({ 1: "I", 2: "II", 3: "III", 4: "IV", 5: "V" })[num] || num;

const formatEnchant = (key, level) =>
  `${key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} ${toRoman(level)}`;

const Page = () => {
  const { loading, error, result } = useSelector((state) => state.enchantment);
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    if (!loading && result) {
      setShowSplash(true);
    }
  }, [loading, result]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-[90%] max-w-lg shadow-2xl text-slate-100">
          <div className="text-lg font-semibold mb-4">Loading enchantment plan</div>
          <div className="space-y-3">
            <div className="h-3 bg-slate-800 rounded-full w-[80%]"></div>
            <div className="h-3 bg-slate-800 rounded-full w-[60%]"></div>
            <div className="h-3 bg-slate-800 rounded-full w-[70%]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (result && showSplash) {
    const steps = Array.isArray(result) ? result : result.steps ?? [];
    const totalXp = Array.isArray(result) ? null : result.totalXp ?? null;
    const finalEnchants =
      steps.length > 0 && typeof steps[steps.length - 1] === "object"
        ? steps[steps.length - 1].result
        : null;

    return (
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 overflow-auto p-4">
        <div className="bg-slate-900 border border-slate-700 rounded-[32px] shadow-[0_30px_80px_-30px_rgba(15,23,42,0.9)] w-full max-w-2xl max-h-[calc(100vh-2rem)] overflow-y-auto p-6 text-slate-100">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <div className="text-xl font-semibold tracking-tight">Enchantment Plan</div>
              <div className="mt-1 text-sm text-slate-400">
                Review the required steps and final enchantment result.
              </div>
            </div>
            <button
              onClick={() => setShowSplash(false)}
              className="rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700 hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="grid gap-4">
            {steps.map((entry, index) => {
              if (typeof entry === "string") {
                return (
                  <div key={index} className="rounded-3xl border border-slate-700 bg-slate-950/70 p-4 shadow-sm">
                    <div className="text-sm text-slate-300">{entry}</div>
                  </div>
                );
              }

              const stepCost = entry.levelCost ?? entry.cost ?? "-";
              const stepResult = entry.result
                ? Object.entries(entry.result)
                    .map(([key, value]) => formatEnchant(key, value))
                    .join(", ")
                : entry.details ?? "Unknown result";

              return (
                <div key={index} className="rounded-3xl border border-slate-700 bg-slate-950/70 p-4 shadow-sm">
                  <div className="space-y-2">
                    <div className="text-sm uppercase tracking-[0.18em] text-slate-400">
                      Step {index + 1}
                    </div>
                    <div className="text-base font-medium text-slate-100">{entry.desc}</div>
                    <div className="flex flex-wrap gap-3 text-sm text-slate-300">
                      <span className="rounded-full bg-slate-800/90 px-3 py-1">
                        Cost: {stepCost}
                      </span>
                      <span className="rounded-full bg-slate-800/90 px-3 py-1">
                        Result: {stepResult}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {finalEnchants && (
              <div className="rounded-3xl border border-slate-700 bg-slate-950/80 p-4">
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400 mb-3">
                  Final Enchantments
                </div>
                <div className="grid gap-2 text-sm text-slate-200">
                  {Object.entries(finalEnchants).map(([key, level]) => (
                    <div key={key} className="flex items-center justify-between rounded-2xl bg-slate-900 px-4 py-2">
                      <span>{key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</span>
                      <span className="font-semibold text-slate-100">{toRoman(level)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {steps.length > 0 && (
              <div className="rounded-3xl border border-slate-700 bg-slate-950/80 p-4">
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400 mb-2">
                  Total Levels Required
                </div>
                <div className="text-base font-medium text-slate-100">
                  {steps
                    .filter((entry) => typeof entry === "object" && entry.levelCost != null)
                    .reduce((sum, entry) => sum + (parseInt(entry.levelCost, 10) || 0), 0)} levels
                </div>
              </div>
            )}

            {totalXp !== null && (
              <div className="rounded-3xl border border-slate-700 bg-slate-950/80 p-4">
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400 mb-2">
                  Total XP
                </div>
                <div className="text-base font-medium text-slate-100">
                  {totalXp.toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error("Error:", error);
  }

  return null;
};

export default Page;
