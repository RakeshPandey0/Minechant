import Groq from "groq-sdk";

// Initialize Groq with the API key
const groq = new Groq({
  apiKey: process.env["GROQ_API_KEY"],
});
// Function to generate a combined element
export const GenerateCombinedElement = async ({
  selected_item,
  selected_enchants,
}) => {
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

  try {
    // Get chat completion from Groq
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-8b-8192",
    });

    // console.log("response", chatCompletion);
    return chatCompletion;
    // Parse the returned content
    // return { enchantmentOrder };
  } catch (error) {
    console.error("Error generating combined element:", error);
    throw new Error("Please try again");
  }
};
