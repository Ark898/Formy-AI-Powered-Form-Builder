
import { GoogleGenAI } from "@google/genai";

function getHttpStatus(error: unknown): number | undefined {
  if (!error || typeof error !== "object") return undefined;

  const { status, statusCode } = error as {
    status?: unknown;
    statusCode?: unknown;
  };

  const value = statusCode ?? status;

  const parsedStatus =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : NaN;

  return Number.isInteger(parsedStatus) ? parsedStatus : undefined;
}

function isTimeout(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.name === "AbortError" || error.name === "TimeoutError")
  );
}

function shouldUseFallback(error: unknown): boolean {
  const status = getHttpStatus(error);

  return (
    isTimeout(error) ||
    status === 404 ||
    status === 408 ||
    status === 429 ||
    (status !== undefined && status >= 500)
  );
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown error";
}

export async function generateGeminiResponse(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Gemini API key is missing. Set GEMINI_API_KEY in your environment."
    );
  }

  const genAI = new GoogleGenAI({
    apiKey,
    httpOptions: {
      timeout: 60_000,
    },
  });

  const models = [
    "gemini-3.5-flash-lite",
    "gemini-3.8-flash",
  ];

  let lastError: unknown;

  for (const [index, model] of models.entries()) {
    try {
      console.log(`Trying Gemini model: ${model}`);

      const response = await genAI.models.generateContent({
        model,
        contents: prompt,
        config: {
          maxOutputTokens: 8192,
          responseMimeType: "application/json",
        },
      });

      if (!response.text) {
        throw new Error("Gemini returned an empty response.");
      }

      console.log(`Gemini response generated using ${model}`);

      return response.text;
    } catch (error) {
      lastError = error;

      const status = getHttpStatus(error);

      console.error("Gemini model request failed:", {
        model,
        status,
        message: getErrorMessage(error),
      });

      const hasFallback = index < models.length - 1;

      if (hasFallback && shouldUseFallback(error)) {
        console.log("Switching to fallback Gemini model...");

        await new Promise((resolve) => setTimeout(resolve, 1000));

        continue;
      }

      break;
    }
  }

  const status = getHttpStatus(lastError);

  if (isTimeout(lastError) || status === 408 || status === 504) {
    throw new Error(
      "Gemini request timed out. Please try again."
    );
  }

  if (
    status === 429 ||
    status === 503 ||
    (status !== undefined && status >= 500)
  ) {
    throw new Error(
      "Gemini is temporarily unavailable. Please try again in a minute."
    );
  }

  if (status === 404) {
    throw new Error(
      "Gemini model is unavailable. Check your configured model names and API access."
    );
  }

  throw new Error(
    `AI generation failed: ${getErrorMessage(lastError)}`
  );
}
