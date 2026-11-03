"use server";

import { generateGeminiResponse } from "@/lib/gemini";
import { checkAiRateLimit } from "@/lib/rate-limit";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const MAX_PROMPT_LENGTH = 4000;

export async function generateAIPrompt(prompt: string) {
  try {
    const session = getKindeServerSession();
    const user = await session.getUser();

    if (!user) {
      return {
        success: false,
        message: "Unauthorized to use this resource",
      };
    }

    if (typeof prompt !== "string" || prompt.trim().length === 0) {
      return {
        success: false,
        message: "Describe the form you want to generate.",
      };
    }

    if (prompt.length > MAX_PROMPT_LENGTH) {
      return {
        success: false,
        message: `Prompt must be ${MAX_PROMPT_LENGTH} characters or fewer.`,
      };
    }

    const rateLimit = await checkAiRateLimit(user.id);
    if (!rateLimit.success) {
      return {
        success: false,
        message: "Rate limit exceeded. Please wait a minute before trying again.",
      };
    }

    const responseText = await generateGeminiResponse(prompt.trim());

    return {
      success: true,
      data: responseText,
    };
  } catch (error) {
    console.error("AI Generation Error:", error);
    return {
      success: false,
      message: "AI generation failed. Please try again.",
    };
  }
}
