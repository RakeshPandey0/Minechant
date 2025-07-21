// app/api/generate-enchantment/route.js
import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  try {
    const { selected_item, selected_enchants } = await request.json();

    const prompt = `
      I want you to give me the best enchantment order for input in the format:
      selected_item: [carved_pimpkin]
      selected_enchants: [mending, unbreaking III, sharpness II],

      give me output as:

      [
          "Carved Pumpkin  + Sharpness III -> XP:2",
          "Unbreaking III + Mending -> XP: 2",
          "Carved Pumpkin + (Unbreaking + Mending) -> XP: 8",
          "Total XP required: 12"
      ]
      the item and enchants are:
      selected_item: ${selected_item}
      selected_enchants: ${selected_enchants}

      return answer in this specified list format only don't go beyond that.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-8b-8192',
    });

    const content = chatCompletion.choices[0]?.message?.content;

    return NextResponse.json({ result: content });
  } catch (error) {
    console.error('Error from Groq:', error);
    return NextResponse.json(
      { error: 'Failed to generate enchantment order.' },
      { status: 500 }
    );
  }
}
