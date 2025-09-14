
import { GoogleGenAI, Type } from "@google/genai";
import type { AIResult, AnalysisResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to convert File to Gemini-compatible format
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const analyzeImage = async (
  imageFile: File,
  updateLoadingMessage: (messageKey: string) => void
): Promise<AnalysisResult> => {
  const imagePart = await fileToGenerativePart(imageFile);

  // Step 1: Species Guard
  updateLoadingMessage("analyzing");
  const speciesResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [imagePart, { text: "Is this image of a cow/bull (Bos taurus/indicus) or a water buffalo (Bubalus bubalis)? Respond with only 'COW', 'BUFFALO', or 'OTHER'." }] },
  });
  
  const species = speciesResponse.text.trim().toUpperCase();
  if (species !== 'COW' && species !== 'BUFFALO') {
    throw new Error('Image is not a cow or buffalo.');
  }

  // Step 2: Breed Identification
  updateLoadingMessage("identifying");
  const breedIdResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      parts: [
        imagePart,
        { text: `Analyze this image of a ${species.toLowerCase()}. Identify the single most likely breed, which could be an Indian breed or a common foreign breed found in India (like Jersey or Holstein Friesian). Provide its name, a confidence level ('High', 'Medium', or 'Low'), and details about it: locations where it is found (as an array of strings), its milk capacity (e.g., '1500-2500 kg per lactation'), milk quality (fat and protein percentage as strings), and an overall rating out of 5 (as an integer).` }
      ],
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: 'Name of the breed' },
          confidence: { type: Type.STRING, description: "Confidence level: 'High', 'Medium', or 'Low'" },
          locations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Primary regions or states where the breed is found."
          },
          milkCapacity: {
            type: Type.STRING,
            description: "Typical milk yield, e.g., '1500-2500 kg per lactation'."
          },
          milkQuality: {
            type: Type.OBJECT,
            properties: {
              fat: { type: Type.STRING, description: "Fat percentage, e.g., '4.0-5.0%'." },
              protein: { type: Type.STRING, description: "Protein percentage, e.g., '3.2-3.5%'." }
            },
            required: ['fat', 'protein']
          },
          rating: {
            type: Type.INTEGER,
            description: "Overall breed quality rating from 1 to 5."
          }
        },
        required: ['name', 'confidence', 'locations', 'milkCapacity', 'milkQuality', 'rating'],
      },
    },
  });

  const aiResult: AIResult = JSON.parse(breedIdResponse.text);

  return { aiResult, species };
};