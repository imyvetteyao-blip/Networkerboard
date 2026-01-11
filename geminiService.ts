
import { GoogleGenAI, Type } from "@google/genai";
import { Contact, ReviewPeriod } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getReviewInsights = async (contacts: Contact[], period: ReviewPeriod) => {
  // PRUNING: Only send essential data to Gemini to reduce latency and token usage
  const prunedContacts = contacts.map(c => ({
    status: c.status,
    company: c.company,
    pos: c.position,
    edu: c.education,
    loc: c.location,
    common: c.commonalities,
    ints: c.interactions.map(i => ({ date: i.date, score: i.score, note: i.notes, alt: i.altruismRecord })),
    events: c.oneOffEvents.length
  }));

  const periodMap = {
    'W': 'Weekly (7 days)',
    'M': 'Monthly (30 days)',
    'Q': 'Quarterly (90 days)',
    'Y': 'Yearly (365 days)'
  };

  const prompt = `
    Networking Audit Period: ${periodMap[period]}.
    Dataset: ${JSON.stringify(prunedContacts)}
    
    TASK: 
    1. Calculate Conversion Funnel (Sent vs Responded vs Coffee).
    2. Identify "Success Persona" (traits of people who responded/did coffee) vs "Failure Persona".
    3. Calculate "Feature Hit Rates": % of successful interactions sharing specific traits (Alumni, Location, etc).
    4. Extract keyword trends and altruism momentum.
    
    Constraint: Be precise, data-driven, and brief.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        // Thinking budget 0 for absolute lowest latency on Flash models
        thinkingConfig: { thinkingBudget: 0 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            funnel: {
              type: Type.OBJECT,
              properties: {
                sent: { type: Type.INTEGER },
                responded: { type: Type.INTEGER },
                coffee: { type: Type.INTEGER },
                responseRate: {
                  type: Type.OBJECT,
                  properties: {
                    currentValue: { type: Type.NUMBER },
                    comparisonValue: { type: Type.STRING },
                    isPositive: { type: Type.BOOLEAN }
                  },
                  required: ["currentValue", "comparisonValue", "isPositive"]
                },
                coffeeRate: {
                  type: Type.OBJECT,
                  properties: {
                    currentValue: { type: Type.NUMBER },
                    comparisonValue: { type: Type.STRING },
                    isPositive: { type: Type.BOOLEAN }
                  },
                  required: ["currentValue", "comparisonValue", "isPositive"]
                }
              },
              required: ["sent", "responded", "coffee", "responseRate", "coffeeRate"]
            },
            personas: {
              type: Type.OBJECT,
              properties: {
                success: {
                  type: Type.OBJECT,
                  properties: {
                    traits: { type: Type.ARRAY, items: { type: Type.STRING } },
                    background: { type: Type.STRING },
                    seniority: { type: Type.STRING },
                    summary: { type: Type.STRING }
                  }
                },
                failure: {
                  type: Type.OBJECT,
                  properties: {
                    traits: { type: Type.ARRAY, items: { type: Type.STRING } },
                    background: { type: Type.STRING },
                    seniority: { type: Type.STRING },
                    summary: { type: Type.STRING }
                  }
                },
                driftAnalysis: { type: Type.STRING }
              }
            },
            featureHitRates: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  percentage: { type: Type.NUMBER },
                  description: { type: Type.STRING }
                }
              }
            },
            keywords: {
              type: Type.OBJECT,
              properties: {
                myThoughts: { type: Type.ARRAY, items: { type: Type.STRING } },
                theirInfo: { type: Type.ARRAY, items: { type: Type.STRING } },
                evolutionNotes: { type: Type.STRING }
              }
            },
            altruism: {
              type: Type.OBJECT,
              properties: {
                helpCount: { type: Type.INTEGER },
                momentumScore: { type: Type.INTEGER },
                summary: { type: Type.STRING },
                topRecipientCategories: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          },
          required: ["funnel", "personas", "featureHitRates", "keywords", "altruism"]
        }
      }
    });

    if (!response.text) throw new Error("Empty response from AI");
    return JSON.parse(response.text);
  } catch (error: any) {
    console.error("Gemini Audit Error:", error);
    throw new Error(error.message || "Unknown API error during audit.");
  }
};
