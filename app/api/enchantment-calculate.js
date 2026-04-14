import enchantments from "../assets/enchants.json";

const ENCHANTMENT_REGISTRY = enchantments.reduce((map, enchant) => {
  const multiplierOverride = ["mending", "infinity", "silk_touch"].includes(
    enchant.name
  )
    ? 4
    : 1;

  map[enchant.name] = {
    max: enchant.levelMax,
    multiplier: multiplierOverride,
  };

  return map;
}, {});

const romanToInt = (roman) => {
  const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  let prev = 0;
  for (let i = roman.length - 1; i >= 0; i--) {
    const value = map[roman[i].toUpperCase()] || 0;
    total = value < prev ? total - value : total + value;
    prev = value;
  }
  return total || 1;
};

const normalizeEnchantString = (rawString) => {
  if (!rawString || typeof rawString !== "string") return null;
  const parsed = rawString.trim().match(/^(.+?)(?:\s+([IVXLCDM]+))?$/i);
  if (!parsed) return null;
  const name = parsed[1].trim().toLowerCase().replaceAll(" ", "_");
  const level = parsed[2] ? romanToInt(parsed[2].toUpperCase()) : 1;
  return { name, level };
};

const normalizeItemName = (itemName) => {
  if (!itemName || typeof itemName !== "string") return "Item";
  return itemName
    .trim()
    .replaceAll("_", " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const xpForLevels = (levels) => {
  if (levels <= 0) return 0;
  if (levels <= 16) {
    return levels * levels + 6 * levels;
  }
  if (levels <= 31) {
    return 2.5 * levels * levels - 40.5 * levels + 360;
  }
  return 4.5 * levels * levels - 162.5 * levels + 2220;
};

const penalty = (workCount) => Math.pow(2, workCount) - 1;

const formatEnchantLabel = (name, level) => {
  const displayName = name
    .replaceAll("_", " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  if (level <= 1) return displayName;
  const roman = ["I", "II", "III", "IV", "V"];
  return `${displayName} ${roman[level - 1] || level}`;
};

const buildBook = ({ name, level }) => {
  const display = formatEnchantLabel(name, level);
  return {
    id: `book-${name}-${level}-${Math.random().toString(36).slice(2, 7)}`,
    type: "book",
    label: `Book: ${display}`,
    enchantments: { [name]: level },
    work_count: 0,
    total_xp: 0,
    history: {
      type: "book",
      label: `Book: ${display}`,
      enchantments: { [name]: level },
    },
  };
};

const buildBaseItem = (itemName) => ({
  id: `item-${itemName}-${Math.random().toString(36).slice(2, 7)}`,
  type: "item",
  label: normalizeItemName(itemName),
  enchantments: {},
  work_count: 0,
  total_xp: 0,
  history: {
    type: "item",
    label: normalizeItemName(itemName),
    enchantments: {},
  },
});

const nodeSignature = (node) => {
  const enchantPairs = Object.entries(node.enchantments)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join(",");

  return `${node.type}:${node.label}:${node.work_count}:${enchantPairs}`;
};

const stateKey = (nodes) =>
  nodes
    .map((node) => nodeSignature(node))
    .sort()
    .join("||");

const formatNodeDisplay = (node) => {
  if (node.type === "item") return node.label;
  if (node.type === "book") return node.label;
  return node.label || "Result";
};

const combineNodes = (target, sacrifice) => {
  const targetEnchantments = { ...target.enchantments };
  const targetWork = target.work_count;
  const sacrificeWork = sacrifice.work_count;
  const basePenalty = penalty(targetWork) + penalty(sacrificeWork);

  let enchantmentCost = 0;
  const mergedEnchantments = { ...targetEnchantments };

  for (const [name, level] of Object.entries(sacrifice.enchantments)) {
    const existing = targetEnchantments[name] || 0;
    if (level > existing) {
      const multiplier = ENCHANTMENT_REGISTRY[name]?.multiplier || 1;
      enchantmentCost += level * multiplier;
      mergedEnchantments[name] = Math.max(existing, level);
    }
  }

  const opLevels = basePenalty + enchantmentCost;
  if (opLevels > 39) {
    return null;
  }

  const opRawXp = xpForLevels(opLevels);
  return {
    id: `merge-${target.id}-${sacrifice.id}-${Math.random().toString(36).slice(2, 7)}`,
    type: "result",
    label: `Result of ${formatNodeDisplay(target)} + ${formatNodeDisplay(sacrifice)}`,
    enchantments: mergedEnchantments,
    work_count: Math.max(targetWork, sacrificeWork) + 1,
    total_xp: target.total_xp + sacrifice.total_xp + opRawXp,
    opLevels,
    opRawXp,
    history: {
      type: "merge",
      left: target.history,
      right: sacrifice.history,
      costLevels: opLevels,
      costRawXp: opRawXp,
      resultEnchantments: mergedEnchantments,
    },
  };
};

const choosePairs = (nodes) => {
  const equalW = [];
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      if (nodes[i].work_count === nodes[j].work_count) {
        equalW.push([i, j]);
      }
    }
  }
  if (equalW.length > 0) return equalW;

  const allPairs = [];
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      allPairs.push([i, j]);
    }
  }
  return allPairs;
};

const searchBestTree = (nodes, memo) => {
  if (nodes.length === 1) {
    return {
      finalNode: nodes[0],
      steps: [],
      totalRawXp: nodes[0].total_xp,
      totalLevels: 0,
    };
  }

  const key = stateKey(nodes);
  if (memo.has(key)) return memo.get(key);

  const pairs = choosePairs(nodes);
  let best = null;

  for (const [i, j] of pairs) {
    const a = nodes[i];
    const b = nodes[j];
    const merged = combineNodes(a, b);
    if (!merged) continue;

    const nextNodes = nodes.filter((_, idx) => idx !== i && idx !== j);
    nextNodes.push(merged);

    const childResult = searchBestTree(nextNodes, memo);
    if (!childResult) continue;

    const currentStep = `Anvil: ${formatNodeDisplay(a)} + ${formatNodeDisplay(b)} -> Cost: ${merged.opLevels} Levels (${Math.round(merged.opRawXp)} XP)`;
    const candidate = {
      finalNode: childResult.finalNode,
      steps: [currentStep, ...childResult.steps],
      totalRawXp: childResult.totalRawXp,
      totalLevels: childResult.totalLevels + merged.opLevels,
    };

    if (!best || candidate.totalRawXp < best.totalRawXp) {
      best = candidate;
    }
  }

  memo.set(key, best);
  return best;
};

const pairBooksGreedy = (nodes) => {
  const steps = [];
  let current = [...nodes];
  let totalLevels = 0;

  while (current.length > 1) {
    const pairs = choosePairs(current);
    if (pairs.length === 0) return null;

    const [i, j] = pairs[0];
    const candidate = combineNodes(current[i], current[j]);
    if (!candidate) return null;

    totalLevels += candidate.opLevels;
    steps.push(`Anvil: ${formatNodeDisplay(current[i])} + ${formatNodeDisplay(current[j])} -> Cost: ${candidate.opLevels} Levels (${Math.round(candidate.opRawXp)} XP)`);
    current = current.filter((_, idx) => idx !== i && idx !== j);
    current.push(candidate);
  }

  return {
    finalNode: current[0],
    steps,
    totalRawXp: current[0].total_xp,
    totalLevels,
  };
};

const optimizeEnchantments = (baseItem, books) => {
  const allNodes = [baseItem, ...books];
  const searchLimit = 7;

  if (allNodes.length <= searchLimit) {
    return searchBestTree(allNodes, new Map());
  }

  return pairBooksGreedy(allNodes);
};

export const calculateEnchantmentPlan = (baseItemName, selectedEnchants) => {
  if (!Array.isArray(selectedEnchants)) {
    throw new Error("selectedEnchants must be an array of enchantment strings.");
  }

  const parsedBooks = selectedEnchants
    .filter((item) => typeof item === "string")
    .map(normalizeEnchantString)
    .filter(Boolean);

  if (parsedBooks.length === 0) {
    throw new Error("No valid enchantment books were provided.");
  }

  const books = parsedBooks
    .map(buildBook)
    .sort((a, b) => {
      const aValue = Object.entries(a.enchantments).reduce((sum, [name, level]) => {
        const multiplier = ENCHANTMENT_REGISTRY[name]?.multiplier || 1;
        return sum + level * multiplier;
      }, 0);
      const bValue = Object.entries(b.enchantments).reduce((sum, [name, level]) => {
        const multiplier = ENCHANTMENT_REGISTRY[name]?.multiplier || 1;
        return sum + level * multiplier;
      }, 0);
      return bValue - aValue;
    });

  const baseItem = buildBaseItem(baseItemName);
  const plan = optimizeEnchantments(baseItem, books);

  if (!plan || plan.steps.length === 0) {
    throw new Error("No valid enchantment plan could be generated with the given items.");
  }

  const totalLevels = plan.totalLevels ||
    plan.steps.reduce((sum, step) => {
      const match = step.match(/Cost: (\d+) Levels/);
      return sum + (match ? Number(match[1]) : 0);
    }, 0);

  return {
    steps: plan.steps,
    totalLevels,
  };
};
