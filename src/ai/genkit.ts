import {genkit} from 'genkit';
import type {GenkitOptions, GenkitPlugin} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const plugins: GenkitPlugin[] = [];
const options: GenkitOptions = {plugins};

if (process.env.GOOGLE_API_KEY) {
  plugins.push(googleAI());
  // Use a vision-capable model for document analysis.
  options.model = 'googleai/gemini-1.5-flash-latest';
} else {
  console.warn(`
    !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    !!!                                                                      !!!
    !!! WARNING: The GOOGLE_API_KEY environment variable is not set.         !!!
    !!!                                                                      !!!
    !!! AI features will not work. To enable them, please add your Google    !!!
    !!! API key to a .env file in the root of your project:                  !!!
    !!!                                                                      !!!
    !!! GOOGLE_API_KEY=your_api_key_here                                     !!!
    !!!                                                                      !!!
    !!! You can get a key from Google AI Studio: https://aistudio.google.com/  !!!
    !!!                                                                      !!!
    !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  `);
}

export const ai = genkit(options);
