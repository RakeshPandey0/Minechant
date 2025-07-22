// app/api/generate-enchantment/route.js
import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  try {
    const { selected_items, selected_enchants } = await request.json();

    if (!selected_items || !Array.isArray(selected_enchants)) {
      return NextResponse.json(
        { error: 'Invalid input format.' },
        { status: 400 }
      );
    }

    const prompt = `
You are a Minecraft enchantment optimizer.

Your job is to determine the optimal XP order for combining a base item and enchantment books using an anvil.

🛠️ Rules:
- Only two items can be combined at a time (e.g. Book + Book, or Item + Book).
- Combine enchantment books first when possible.
- Then combine books with the base item.
- Prioritize the lowest total XP cost.
- Do not check for enchantment compatibility — assume all can be combined.
- Assume each enchantment is on its own enchanted book.
- Use realistic Minecraft anvil XP costs and prior work penalty.

📥 Input:
selected_item: ${selected_items}
selected_enchants: ${selected_enchants}

📤 Output:
Return ONLY a JSON array in this exact format:
[
  "Book1 + Book2 -> XP: 1",
  "Book3 + (Book1 + Book2) -> XP: 2",
  "Diamond Sword + (Book3 + Book1 + Book2) -> XP: 5",
  "Total XP required: 8"
]

❌ Do NOT include any explanation, markdown, labels like “response:”, or any other text.
✅ Only return the array. No extra words.
✅ Follow Minecraft anvil rules: combine only two things at a time.

`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-8b-8192',
    });

    let raw = chatCompletion.choices?.[0]?.message?.content?.trim();

    if (!raw) {
      throw new Error('Empty response from model.');
    }

    // ✂️ Clean up any unwanted characters or formatting
    raw = raw.replace(/[“”]/g, '"').replace(/[\r\n]+/g, '').trim();

    // 🧠 Extract only the first JSON array
    const match = raw.match(/\[[^\]]*\]/s); // simple match for array structure
    if (!match) {
      throw new Error('Could not find valid array in model output.');
    }

    const arrayText = match[0];

    let parsed;
    try {
      parsed = JSON.parse(arrayText);
    } catch (err) {
      console.error('Failed to parse JSON from model:', err);
      return NextResponse.json(
        { error: 'Invalid JSON response from model.' },
        { status: 500 }
      );
    }

    // ✅ Final structure check
    if (
      !Array.isArray(parsed) ||
      parsed.length === 0 ||
      !parsed[parsed.length - 1].startsWith('Total XP required')
    ) {
      return NextResponse.json(
        { error: 'Malformed result: missing Total XP line.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ result: parsed });
  } catch (err) {
    console.error('Error in enchantment route:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
