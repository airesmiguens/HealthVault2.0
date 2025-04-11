import OpenAI from 'openai';
import { HealthData } from '@/types/health';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ANALYSIS_PROMPT = `
Analyze the following medical document text and extract structured health information.
Focus on identifying:
1. Medical conditions/diagnoses
2. Medications (including dosage if available)
3. Vaccines/immunizations
4. Important dates (appointments, procedures, prescriptions)
5. Allergies
6. Vital signs

Format the response as a JSON object with the following structure:
{
  "conditions": [{ "name": string, "date": string (optional), "details": string (optional), "confidence": number }],
  "medications": [{ "name": string, "date": string (optional), "details": string (optional), "confidence": number }],
  "vaccines": [{ "name": string, "date": string (optional), "details": string (optional), "confidence": number }],
  "dates": [{ "date": string, "context": string, "type": string }],
  "allergies": [{ "name": string, "details": string (optional), "confidence": number }],
  "vitals": [{ "type": string, "value": string, "unit": string, "date": string (optional) }]
}

Text to analyze:
`;

export async function analyzeHealthData(text: string): Promise<HealthData> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a medical data extraction assistant. Extract structured health information from medical documents accurately and consistently."
        },
        {
          role: "user",
          content: ANALYSIS_PROMPT + text
        }
      ],
      temperature: 0.1, // Low temperature for more consistent results
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response) as HealthData;
  } catch (error) {
    console.error('Error analyzing health data:', error);
    throw new Error('Failed to analyze health data');
  }
} 