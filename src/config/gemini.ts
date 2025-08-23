import {
  GenerationConfig,
  GoogleGenerativeAI,
  ModelParams,
} from "@google/generative-ai";
import envConfig from "./env";

/**
 * Initialize Google Gemini AI client using the API key from environment variables.
 */
const googleAI = new GoogleGenerativeAI(envConfig.GEMINI_API_KEY);

/**
 * Configuration for AI generation behavior.
 *
 * - `temperature`: Controls randomness; higher = more creative output.
 * - `topP`: Nucleus sampling, controls diversity of generated tokens.
 * - `topK`: Limits selection to top-K likely tokens per step.
 * - `maxOutputTokens`: Maximum number of tokens in generated output.
 */
const geminiConfig: GenerationConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 4096,
};

/**
 * Model parameters combining Gemini model ID and generation configuration.
 */
const options: ModelParams = {
  model: envConfig.GEMINI_MODEL, // Gemini model variant
  ...geminiConfig,
};

/**
 * Obtain the generative model instance for AI text generation.
 */
const geminiModel = googleAI.getGenerativeModel(options);

export default geminiModel;
