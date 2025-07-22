// app/api/generate-enchantment/route.js
import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
    try {
        const { selected_items, selected_enchants } = await request.json();

        if (!selected_items || !Array.isArray(selected_enchants)) {
            return NextResponse.json(
                { error: "Invalid input format." },
                { status: 400 }
            );
        }

        const prompt = `
You are a Minecraft anvil XP optimizer.

Your task is to calculate the most efficient order for combining enchantment books with a base item using Minecraft's anvil mechanics.

🧱 Rules:
- Only two items can be combined at a time (e.g. Book + Book or Item + Book).
- Combine books first to reduce XP cost, then apply to item.
- Show realistic Minecraft anvil XP costs and prior work penalty.
- Assume enchantments are always compatible.
- Each enchantment is on its own book (e.g. Sharpness V).
- Always capitalize the first letter of each enchantment and item name.
- Use the exact book/enchantment names when combining.
- Do NOT include any explanations or extra text.
- Do not prefix "Book: " before the enchantment name.
- Capitalize the first letter of each enchantment and item name.
- Search for enchantment order logic in Minecraft anvil mechanics, donot

📥 Input:
Base item: ${selected_items}
Books: ${selected_enchants.map((e) => `Book: ${e}`).join(", ")}

📤 Output (JSON array only):
[
  "Book: Sharpness V + Book: Looting III -> XP: 3",
  "Book: Unbreaking III + (Sharpness V + Looting III) -> XP: 5",
  "Diamond Sword + (Unbreaking III + Sharpness V + Looting III) -> XP: 8",
  "Total XP required: 16"
]

Return ONLY the JSON array as shown above. No extra text.
        `;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama3-70b-8192",
            temperature: 0.2,
        });

        let raw = chatCompletion.choices?.[0]?.message?.content?.trim();

        if (!raw) throw new Error("Empty response from model.");

        // Clean and extract JSON-like content
        raw = raw.replace(/[“”]/g, '"').trim();

        const match = raw.match(/\[\s*("[^"]+"\s*(,\s*"[^"]+"\s*)*)\]/s);
        if (!match) {
            throw new Error("Could not find valid JSON array in model output.");
        }

        const arrayText = match[0];

        let parsed;
        try {
            parsed = JSON.parse(arrayText);
        } catch (err) {
            console.error("Failed to parse JSON from model:", err);
            return NextResponse.json(
                { error: "Invalid JSON format from model." },
                { status: 500 }
            );
        }

        if (
            !Array.isArray(parsed) ||
            parsed.length === 0 ||
            !parsed[parsed.length - 1].startsWith("Total XP required")
        ) {
            return NextResponse.json(
                { error: "Malformed result: Missing 'Total XP required'." },
                { status: 500 }
            );
        }

        return NextResponse.json({ result: parsed });
    } catch (err) {
        console.error("Error in enchantment route:", err);
        return NextResponse.json(
            { error: err.message || "Internal server error." },
            { status: 500 }
        );
    }
}
