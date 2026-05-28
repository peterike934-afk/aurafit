import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY })

export async function analyzeOutfit(images, occasion = "any", bodyType = "any", styleIntent = "") {
  const intentSection = styleIntent.trim()
    ? `The user describes their style intention as: "${styleIntent.trim()}". Factor this into your advice and build on their vision.`
    : "The user has not provided a style intention — give your best professional assessment."

  const prompt = `You are a professional fashion stylist. Analyze the outfit shown in the image(s) and provide:

1. Style Score (out of 10)
2. Fit Assessment
3. Color Coordination rating
4. Occasion suitability ${occasion !== "any" ? `for ${occasion}` : ""}
5. Vibe/Aesthetic (e.g. streetwear, minimalist, smart casual)
6. Top 3 improvement suggestions

${bodyType !== "any" ? `The person has a ${bodyType} body type — factor that into your advice.` : ""}

${intentSection}

Keep the tone encouraging, specific, and professional. Format your response clearly with each section labeled.`

  const imageParts = images.map(img => ({
    inlineData: { mimeType: img.type, data: img.base64 }
  }))

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        parts: [
          { text: prompt },
          ...imageParts
        ]
      }
    ]
  })

  return response.text
}