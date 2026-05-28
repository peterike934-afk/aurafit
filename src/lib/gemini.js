import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY })

export async function analyzeOutfit(images, occasion = "any", bodyType = "any", styleIntent = "") {
  const intentSection = styleIntent.trim()
    ? `The user describes their style intention as: "${styleIntent.trim()}". Factor this into your advice and build on their vision.`
    : "The user has not provided a style intention — give your best professional assessment."

  const prompt = `You are a professional fashion stylist. Analyze this outfit and respond ONLY in this exact JSON format, nothing else:

{
  "scores": {
    "colorHarmony": 8.5,
    "fitBalance": 7.0,
    "occasionMatch": 9.0,
    "overallStyle": 8.0
  },
  "styleIdentity": "Minimal Streetwear",
  "vibe": "Clean, understated, urban confidence",
  "occasion": "Casual · Smart Casual",
  "suggestions": [
    "Swap white sneakers for clean leather loafers to elevate the look.",
    "Add a minimal silver watch to improve visual balance.",
    "A lightweight overshirt would add layering depth without losing the minimal vibe."
  ],
  "summary": "A well-put-together outfit with strong color discipline and clean silhouette. Minor adjustments in footwear and accessories would push this to an exceptional level."
}

${bodyType !== "any" ? `The person has a ${bodyType} body type — factor that into your advice.` : ""}
${occasion !== "any" ? `Consider occasion suitability for: ${occasion}.` : ""}
${intentSection}

Return ONLY the JSON. No markdown, no explanation, no extra text.`

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

  const text = response.text.replace(/```json|```/g, "").trim()
  return JSON.parse(text)
}