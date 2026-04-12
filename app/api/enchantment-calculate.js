import { readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── 1. REGISTRY & DATA STRUCTURES ──────────────────────────────────────────
// Use Sets for O(1) lookups instead of .includes() calls in loops.
const rawEnchants = JSON.parse(
  readFileSync(resolve(__dirname, "../assets/enchants.json"), "utf-8"),
);

const ENCHANTMENT_REGISTRY = {};
rawEnchants.forEach((e) => {
  ENCHANTMENT_REGISTRY[e.name] = {
    max: e.levelMax,
    multiplier: e.weight,
    incompatible: new Set(e.incompatible || []),
    items: new Set(e.items || []),
  };
});

// ─── 2. MATHEMATICAL HELPERS ────────────────────────────────────────────────
const xpForLevels = (levels) => {
  if (levels <= 0) return 0;
  if (levels <= 16) return levels ** 2 + 6 * levels;
  if (levels <= 31) return 2.5 * levels ** 2 - 40.5 * levels + 360;
  return 4.5 * levels ** 2 - 162.5 * levels + 2220;
};

const getPenalty = (workCount) => Math.pow(2, workCount) - 1;

// ─── 3. CORE MERGE ENGINE ───────────────────────────────────────────────────
/**
 * Calculates the result of merging target + sacrifice.
 * Handles: Directional cost, Incompatibilities, Item-eligibility, and 39-level cap.
 */
const merge = (target, sacrifice) => {
  // A book cannot receive an item as a sacrifice.
  if (target.type === "book" && sacrifice.type === "item") return null;

  const targetItemType = target.type === "item" ? target.item_name : "book";
  const resultEnchants = { ...target.enchantments };
  let enchantCost = 0;
  let hasChanges = false;

  for (const [name, sacLevel] of Object.entries(sacrifice.enchantments)) {
    const data = ENCHANTMENT_REGISTRY[name];
    if (!data) continue;

    const isIncompatible = Object.keys(target.enchantments).some((t) =>
      data.incompatible.has(t),
    );
    const isEligible =
      targetItemType === "book" || data.items.has(targetItemType);

    if (isIncompatible || !isEligible) {
      enchantCost += 1; // Minecraft penalty for incompatible sacrifice enchants
      continue;
    }

    const tarLevel = target.enchantments[name] || 0;
    const finalLevel =
      tarLevel === sacLevel && tarLevel < data.max
        ? tarLevel + 1
        : Math.max(tarLevel, sacLevel);

    if (finalLevel > tarLevel) {
      enchantCost += finalLevel * data.multiplier;
      hasChanges = true;
      resultEnchants[name] = finalLevel;
    } else {
      enchantCost += sacLevel * data.multiplier;
    }
  }

  // If nothing was added/upgraded, it's a wasted operation unless merging two books
  if (!hasChanges && target.type === sacrifice.type) return null;

  const penaltyCost =
    getPenalty(target.work_count) + getPenalty(sacrifice.work_count);
  const totalLevels = enchantCost + penaltyCost;

  if (totalLevels > 39) return null; // Hard cap for Survival Mode

  return {
    ...target,
    id: `m-${Math.random().toString(36).slice(2, 5)}`,
    enchantments: resultEnchants,
    work_count: Math.max(target.work_count, sacrifice.work_count) + 1,
    total_xp: target.total_xp + sacrifice.total_xp + xpForLevels(totalLevels),
    history: {
      left: target,
      right: sacrifice,
      cost: totalLevels,
      enchantCost,
      penaltyCost,
    },
  };
};

// ─── 4. RECURSIVE SOLVER WITH MEMOIZATION ───────────────────────────────────
const memo = new Map();

const solve = (nodes) => {
  if (nodes.length === 1) return nodes[0];

  // Generate a stable hash of the current state
  const hash = nodes
    .map(
      (n) =>
        `${n.type}:${n.work_count}:${Object.entries(n.enchantments).sort().join()}`,
    )
    .sort()
    .join("|");

  if (memo.has(hash)) return memo.get(hash);

  let bestNode = null;

  // Exhaustive search: try every combination in both directions
  for (let i = 0; i < nodes.length; i++) {
    for (let j = 0; j < nodes.length; j++) {
      if (i === j) continue;

      const merged = merge(nodes[i], nodes[j]);
      if (!merged) continue;

      const remaining = nodes.filter((_, idx) => idx !== i && idx !== j);
      const result = solve([...remaining, merged]);

      if (result && (!bestNode || result.total_xp < bestNode.total_xp)) {
        bestNode = result;
      }
    }
  }

  memo.set(hash, bestNode);
  return bestNode;
};

// ─── 5. PUBLIC API & FORMATTER ──────────────────────────────────────────────
export const calculateEnchantmentPlan = (baseItemName, selectedEnchants) => {
  memo.clear(); // Important: Clear cache between different requests

  const baseItem = {
    type: "item",
    item_name: baseItemName,
    label: baseItemName.replace(/_/g, " "),
    enchantments: {},
    work_count: 0,
    total_xp: 0,
  };

  const books = selectedEnchants.map((se) => ({
    type: "book",
    label: `Book: ${se.name.replace(/_/g, " ")} ${se.level}`,
    enchantments: { [se.name]: se.level },
    work_count: 0,
    total_xp: 0,
  }));

  const finalNode = solve([baseItem, ...books]);
  if (!finalNode) return { error: "No valid plan possible under 40 levels." };

  // Flatten the recursive history into a linear step-by-step list
  const steps = [];
  const trace = (node) => {
    if (!node.history) return;
    trace(node.history.left);
    trace(node.history.right);
    steps.push({
      desc: `Combine [${node.history.left.label}] + [${node.history.right.label}]`,
      levelCost: node.history.cost,
      xpCost: Math.round(xpForLevels(node.history.cost)),
      details: `(Enchant: ${node.history.enchantCost}, Penalty: ${node.history.penaltyCost})`,
    });
  };

  trace(finalNode);

  return {
    totalXp: Math.round(finalNode.total_xp),
    totalLevels: steps.reduce((sum, s) => sum + s.levelCost, 0),
    steps,
  };
};
