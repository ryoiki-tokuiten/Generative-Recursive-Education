import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");
  return new GoogleGenAI({ apiKey });
};

const MODEL_NAME = 'gemini-3.1-flash-lite-preview';
const CLEAN_REGEX = /```html|```/g;

const OS_AGENT_SYSTEM = `You are an expert UI/UX developer and interface designer for a generative desktop OS platform. Your role is to generate the "next logical screen" for a desktop application based on user interaction.

CRITICAL RULES:
1. This is NOT an educational page, presentation, or blog post. It is a DESKTOP APPLICATION SCREEN.
2. Match the visual design language of the provided app screen exactly (dark theme with #0d1117/#161b22/#21262d backgrounds, accent colors matching the app).
3. Generate realistic, functional-looking UI states:
   - Clicking "New Note" → show a note editor with a fresh document
   - Clicking a file → show a file preview panel
   - Clicking a contact → show contact detail view
   - Clicking a music track → show the now-playing screen
   - Any button/link → show the next logical app state
4. The app should look like REAL production software: tables, panels, sidebars, modals, forms as appropriate.
5. All interactive elements (buttons, inputs, tabs, toggles) should work with JavaScript.
6. NO placeholder lorem ipsum content. Use realistic, coherent fake data.
7. Typography: Use Inter or JetBrains Mono from Google Fonts CDN.
8. Keep the same app structural pattern: same sidebar layout, same header, same color scheme.
9. The page must be completely self-contained standalone HTML — no external dependencies except Google Fonts CDN.
10. OUTPUT: Return ONLY the HTML code for the complete page. No markdown fences, no explanations.

DESIGN LANGUAGE:
- Background: #0d1117 (darkest), #161b22 (cards), #21262d (hover states)
- Borders: #21262d, #30363d
- Text: #e6edf3 (primary), #8b949e (secondary), #484f58 (muted)
- Accent: match the original app's accent color
- Border radius: 8px for cards, 6px for buttons, 100px for pills
- Transitions: 0.15s ease for all interactive elements`;

/**
 * Generates the next logical UI screen for an OS application
 * (used for all apps except "learn")
 */
export const generateOSFollowUp = async (
  appName: string,
  currentHtml: string,
  clickedElementHtml: string,
  userPrompt: string
): Promise<string> => {
  const ai = getClient();

  const prompt = `${OS_AGENT_SYSTEM}

CURRENT APP: ${appName}

CURRENT SCREEN HTML (first 3000 chars for context):
${currentHtml.slice(0, 3000)}

USER CLICKED THIS ELEMENT:
${clickedElementHtml.slice(0, 1000)}

USER'S REQUEST / WHAT TO SHOW NEXT:
"${userPrompt}"

Generate the next complete, standalone HTML screen for the ${appName} application. It should be a natural progression from the current state based on the user's request. The visual style and overall structure must remain consistent.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        thinkingLevel: "high"
      }
    });
    return (response.text || "").replace(CLEAN_REGEX, '').trim();
  } catch (error) {
    console.error("OS Agent Error:", error);
    throw error;
  }
};

/**
 * Generates an initial AI-enhanced screen for an app
 * (used when user wants AI to transform the initial seed HTML)
 */
export const generateOSInitialScreen = async (
  appName: string,
  baseHtml: string,
  userPrompt: string
): Promise<string> => {
  const ai = getClient();

  const prompt = `${OS_AGENT_SYSTEM}

CURRENT APP: ${appName}

BASE APP HTML:
${baseHtml.slice(0, 2000)}

USER REQUEST:
"${userPrompt}"

Based on this request, generate a new version or state of the ${appName} application screen that fulfills what the user is asking for. Keep the same visual design language.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return (response.text || "").replace(CLEAN_REGEX, '').trim();
  } catch (error) {
    console.error("OS Agent Error:", error);
    throw error;
  }
};
