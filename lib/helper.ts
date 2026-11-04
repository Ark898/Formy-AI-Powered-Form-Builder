import { v4 as uuidv4 } from "uuid";

export const MAX_AI_PROMPT_LENGTH = 4000;

export function generateUniqueId() {
  return uuidv4().replace(/-/g, "").substring(0, 25);
}
