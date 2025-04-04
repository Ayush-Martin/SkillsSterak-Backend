import {
  GenerationConfig,
  GoogleGenerativeAI,
  ModelParams,
} from "@google/generative-ai";
import envConfig from "./env";

const googleAI = new GoogleGenerativeAI(envConfig.GEMINI_API_KEY);

const geminiConfig: GenerationConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 4096,
};

const options: ModelParams = {
  model: "gemini-1.5-flash",
  ...geminiConfig,
};

const geminiModel = googleAI.getGenerativeModel(options);

export default geminiModel;
