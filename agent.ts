import { LlmAgent } from '@google/adk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read instructions from the provided file
const instructionsPath = path.join(__dirname, 'Ultimos assuntos Tecnologia.md');
const instructions = fs.readFileSync(instructionsPath, 'utf-8');

export const rootAgent = new LlmAgent({
  name: 'tech_curator_agent',
  model: 'gemini-2.0-flash', // gemini-3-flash seems not yet available in some regions
  description: 'Identifies trending topics in Solutions Architecture, IA, and QA and generates a report.',
  instruction: `
    ${instructions}
    
    Context:
    - Today's date is: ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}.
    - Reference Week: The last 7 days.
    
    Additional Rules:
    - FRESHNESS: Only include content published in the last 7 days.
    - FALLBACK: If AND ONLY IF no relevant topic is found in the last 7 days, you may include content from the last 30 days, but prioritize the most recent ones.
    - SEARCH LINKS: Ensure Google/YouTube search links include time filters (e.g., append "&tbs=qdr:w" for week or "&tbs=qdr:m" for month to Google links).
    - Be precise and ensure the links are valid search queries.
    - IMPORTANT: Identify and report on exactly TWO (2) topics for each pilar (Solutions Architecture, IA, QA), selecting those with the highest engagement/views.
    - Be precise and ensure the links are valid search queries.
    - Format the output exactly as requested in the instructions, but use a more "premium" look.
    - VISUAL: Use relevant emojis for each section (e.g., 🏗️ for Architecture, 🤖 for AI, 🧪 for QA).
    - VISUAL: Use bold headers and simple empty lines (\\n\\n) as separators.
    - VISUAL: CRITICAL: Do NOT use HTML tags (like \<br\>), "---", or horizontal rules.
    - VISUAL: Use inline Markdown links for Google and YouTube (e.g., [Ver no Google](URL)) instead of displaying the raw URL.
    - CRITICAL: Do NOT include any "sharing links", "WhatsApp links", "Telegram share links", or extra text at the end.
    - CRITICAL: Ensure all Markdown formatting characters (like *, _, \`) are properly closed/balanced.
    - Do NOT include any preamble or postamble, just the report content.
  `,
});
