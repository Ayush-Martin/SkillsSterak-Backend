import {
  GenerationConfig,
  GoogleGenerativeAI,
  ModelParams,
} from "@google/generative-ai";
import envConfig from "./env";

const googleAI = new GoogleGenerativeAI(envConfig.GEMINI_API_KEY);

// Configuration for generation behavior
const geminiConfig: GenerationConfig = {
  temperature: 0.9, // Controls randomness: higher = more creative
  topP: 1, // Controls diversity via nucleus sampling
  topK: 1, // Limits possible tokens to top-K likely options
  maxOutputTokens: 4096, // Maximum number of tokens in the output
};

// Model parameters including model ID and generation config
const options: ModelParams = {
  model: "gemini-1.5-flash", // Specify Gemini model variant
  ...geminiConfig,
};


const geminiModel = googleAI.getGenerativeModel(options);

export default geminiModel;
