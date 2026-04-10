// app/api/generate-enchantment/route.js
import { NextResponse } from "next/server";
import { calculateEnchantmentPlan } from "../enchantment-calculate";

export async function POST(request) {
  try {
    const { selected_items: selectedItems, selected_enchants: selectedEnchants } =
      await request.json();

    if (
      !Array.isArray(selectedItems) ||
      selectedItems.length === 0 ||
      !Array.isArray(selectedEnchants)
    ) {
      return NextResponse.json(
        { error: "Invalid input format. Expect base item and enchantment list." },
        { status: 400 }
      );
    }

    const baseItemName = selectedItems[0];
    if (!baseItemName || typeof baseItemName !== "string") {
      return NextResponse.json(
        { error: "The base item selection is invalid." },
        { status: 400 }
      );
    }

    try {
      const plan = calculateEnchantmentPlan(baseItemName, selectedEnchants);
      const result = [...plan.steps, `Total Levels required: ${plan.totalLevels}`];
      return NextResponse.json({ result });
    } catch (calculateError) {
      return NextResponse.json(
        { error: calculateError.message || "Invalid enchantment plan." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error in enchantment route:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error." },
      { status: 500 }
    );
  }
}
