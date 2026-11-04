"use server";

import { generateGeminiResponse } from "@/lib/gemini";
import { generateFormQuestionPrompt } from "@/lib/prompts";
import { checkAiRateLimit } from "@/lib/rate-limit";
import { FormBlockInstance } from "@/@types/form-block.type";
import { MAX_AI_PROMPT_LENGTH } from "@/lib/helper";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const MAX_BLOCK_PAYLOAD_LENGTH = 100_000;

export async function generateAIPrompt(
  userRequest: string,
  formTitle: string,
  formDescription: string,
  currentBlocks: FormBlockInstance[]
) {
  try {
    const session = getKindeServerSession();
    const user = await session.getUser();

    if (!user) {
      return {
        success: false,
        message: "Unauthorized to use this resource",
      };
    }

    if (typeof userRequest !== "string" || userRequest.trim().length === 0) {
      return {
        success: false,
        message: "Describe the form you want to generate.",
      };
    }

    if (userRequest.length > MAX_AI_PROMPT_LENGTH) {
      return {
        success: false,
        message: `Your request must be ${MAX_AI_PROMPT_LENGTH} characters or fewer.`,
      };
    }

    const blocks = Array.isArray(currentBlocks) ? currentBlocks : [];
    const serializedBlocks = JSON.stringify(blocks);
    if (serializedBlocks.length > MAX_BLOCK_PAYLOAD_LENGTH) {
      return {
        success: false,
        message: "This form is too large for AI editing. Try a shorter form.",
      };
    }

    const prompt = generateFormQuestionPrompt(
      userRequest.trim(),
      typeof formTitle === "string" ? formTitle.slice(0, 200) : "",
      typeof formDescription === "string"
        ? formDescription.slice(0, 2_000)
        : "",
      blocks
    );

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
