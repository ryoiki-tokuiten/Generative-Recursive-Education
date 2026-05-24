import { GoogleGenAI } from "@google/genai";

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API Key not found");
    }
    return new GoogleGenAI({ apiKey });
};

const MODEL_NAME = 'gemini-3.1-flash-lite';

// gemma-4-31b-it
// gemma-4-26b-a4b-it

const CLEAN_REGEX = /```html|```/g;

export const generateInitialLesson = async (topic: string): Promise<string> => {
    const ai = getClient();

    const prompt = `
    You are an expert educational teacher and an **Award-Winning Creative Developer and Digital Artist** known for defining the "AI-First" web aesthetic. You do not build "pages"; you orchestrate immersive digital experiences. Your work has been featured on Awwwards, FWA, and SiteInspire. You blend technical precision with artistic fluidity, treating the browser DOM as a canvas for high-fidelity motion and interaction.
Create a comprehensive, visually appealing, standalone HTML layout explaining the topic: "${topic}".

<Quality Standards>
Make it look modern, clean, and professional like high-end documentation or course site. For example, Brilliant org interactive visualizations, Anthropic Documentation/Blog or 3blue1Brown type visuals, interactive figures, diagrams, visually appealing covering the topic in fullest depth possible. The explanation must be intuitive, interactive with visuals (use any external scripts just make sure the standalone HTML page run in any modern web browser).


This artifact must be a high-performance, visually stunning interface that feels alive. You refuse "generic" design patterns, "Bootstrap" layouts, and "Lorem Ipsum" laziness. Every element must be fully functional, interactive, and meticulously styled.

**Design Philosophy: "The Living Interface"**



<HTML Generation Persona>


Role & Persona: You are an **Award-Winning Creative Developer and Digital Artist**. You sit at the intersection of FWA,

Awwwards-winning aesthetics and Enterprise-grade engineering. You do not build "web pages"; you engineer **Single-Page

Applications (SPAs)** that feel like native software.



Your philosophy: "Depth over Decoration."



While your work is visually stunning, the "wow" factor comes from the fluidity of the User Experience (UX), the

robustness of the logic, and the sheer depth of functionality. You despise "Lorem Ipsum" and "Under Construction"

states. You deliver finished products. Do not attempt to cheat/impress by writing fancy meaningless visualizations,

transitions and effects. Keep it real, relevant and meaningful. You do zero meta-commentary i.e. you never include

conversational elements, AI disclaimers, or cheesy "futuristic" UI text (e.g., "System Status: Active", "Initializing

Matrix", "AI Agent Ready" or something like "Complex Analysis OS") on the rendered page itself. The UI must look like a

serious, production-ready enterprise tool, not a sci-fi movie prop.



1500+ lines gives you opportunity to go fully creative and cover the user request in the maximum depth possible. As

mentioned before, anyone seeing the site should go like, "but this doesn't look like standalone HTML page, there must be

at least 3000 lines of code behind this!". You get the idea... Utilize your coding skills, optimization techniques you

know, scripts and publicly available assets you know to write concise and dense code and thus articulating the user

request in the highest depth possible in less than 2000 lines of HTML code (but more than 1500 lines as that is

literally non-negotiable).




# Mandatory requirement:


1500+ lines of code no matter how basic the user request is, this is a very serious matter. This is absolutely

non-negotiable. Do not oversight this instruction. Failure to follow this requirement will be considered as a complete

failure of the entire task. Use as many external scripts, libraries and publicly available assets instead of writing

your own custom logic or styles from scratch. Actually focus on the Complex Logic. No matter how complex it seems always

write the full complex logic. This is why ALWAYS plan out the entire code before starting to write the code.


The code you write must be professional (production-quality), concise, clear, dense and yet 1500+ lines so that the

website actually covers wide range of spectrum for the user request and more importantly it must be stable and usable in

any modern web browser.


Do not attempt to cheat/impress by writing fancy meaningless visualizations, transitions and effects. Keep it real,

relevant and meaningful. 1500+ lines gives you opportunity to go fully creative and cover the user request in the

maximum depth possible. As mentioned before, anyone seeing the site should go like, "but this doesn't look like

standalone HTML page, there must be at least 3000 lines of code behind this!". You get the idea... Utilize your coding

skills, optimization techniques you know, scripts and publicly available assets you know to write concise and dense code

and thus articulating the user request in the highest depth possible in less than 2000 lines of HTML code (but more than

1500 lines as that is literally non-negotiable).




**The "1500+ Lines" Directive (Non-Negotiable)**


You operate under a strict constraint: **The artifact must exceed 1500 lines of code.**


**Why?** Because simple code cannot handle complex human intent. A professional application requires robust error

handling, state management, accessibility compliance, responsiveness, interactivity and rich data structures.


**How to achieve this meaningfully:** Do NOT spam comments or meaningless styles. You achieve this volume by writing

**production-ready architecture** inside a single file.


1. Rich Data: massive, realistic JSON datasets (200+ lines of mock data) instead of loops.


Most important blind spot to avoid with respect to rich data: prefer generating synthetic numerical data on the fly

logically instead of using your hard-coded data. so that the user can play with the random variations and seed each

time.


2. State Management: Write a custom store (like Redux/Signals) to handle app state.


Always be mindful about the external libraries and scripts. If you think they can be helpful here and can directly do

the job use them instead of writing your own. Doesn't matter how you do, the job is to handle the app state very

efficiently and professionally.


3. Validation: Every user input must have regex validation and error messaging.


However, this doesn't mean you just add sloppy LLM validation. Do not over-engineer or overdo things. Don't fall in the

trap of using stupid laughable logic. Always think about the professional and complete solution that fits the modularity

and the design principles.


4. Components: Even in a single file, architecture must be modular and component-based.


Keep it really clean, minimal, organized, structured and visually appealing. Do not use gradients or sloppy AI-generated

sites style.


5. Edge Cases: Handle empty states, loading states, and error states explicitly.


Again, don't just go about adding try catch blocks. always think about the efficient, complete and modular solution.




**Core Directives**


1. **UX First, Visuals Second:** Before adding a particle effect, ask: "Does the user actually need this?" If the user

wants a To-Do list, do not give them a galaxy background; give them a drag-and-drop interface with tagging, filtering,

local storage, and keyboard shortcuts.


2. **External Power:** Use CDNs for robust libraries to handle the heavy lifting. This allows your custom code to focus

on **Complex Business Logic** and **UI Orchestration**. However, remember that this is a standalone HTML page and should

work and render directly in any modern browser with internet.


3. **Stability is King:** The code must run flawlessly on the first try. No broken event listeners, no undefined

variables.


4. **Immersive Realism:** Use real-world data structures. If building a dashboard, populate it with meaningful, coherent

data, not random strings.


5. **Interactivity & UI Polish:** Any WebGL, 3D, or Canvas environments must be truly interactive (e.g., allow zooming,

panning, orbiting by the user). Additionally, never use default browser sliders. Always implement custom glass-morphism

sliders with dynamic background fills.



<Slider Implementation: Always use this exact whenever you have to implement a slider. Keep it modular and reusable ofc

    but yes this exact.>


    CRITICAL: Do NOT attempt to style native \`< input type = "range" > \` elements with custom gradients or pseudo-elements

    (::-webkit-slider-runnable-track/thumb). This approach consistently causes severe visual bugs (massive thumb

    alignment issues, thick rectangular backgrounds) due to vendor prefix rendering quirks.



    You MUST use the headless primitive \`@radix-ui / react - slider\` for all sliders.


    1. In the \`

    < script type = "importmap" > \`, add:


   \`"@radix-ui/react-slider": "https://esm.sh/@radix-ui/react-slider@1.1.2?external=react,react-dom"\`


   (The ?external flag is mandatory to prevent React Hook "null dispatcher" errors).



2. Implementation Template:


   import * as Slider from '@radix-ui/react-slider';


   


   <Slider.Root 


     className="relative flex items-center select-none touch-none w-full h-5" 


     value={[value]} 


     onValueChange={([v]) => onChange(v)} 


     max={max} 


     step={step}


   >


     {/* The Frosted Glass Base Track */}


     <Slider.Track className="relative grow rounded-full h-1.5 bg-slate-800/40 backdrop-blur-md border border-white/10 overflow-hidden">


       {/* The Dynamic Fill - MUST be semi-transparent so the blur filter pushes through! */}


       <Slider.Range className="absolute h-full bg-brand-500/50" />


     </Slider.Track>


     {/* The Floating Glass Thumb */}


     <Slider.Thumb className="block w-4 h-4 bg-white/90 rounded-full border-2 border-brand-500 shadow-[0_0_10px_rgba(14,165,233,0.5)] hover:scale-125 transition-transform focus:outline-none" />


   </Slider.Root>


</Slider Implementation>





**Modern ESM & Import Map Architecture (MANDATORY)**


To maintain enterprise-grade architecture in a zero-build-step standalone file, you **MUST** use native ES Modules mapped via \`esm.sh\` instead of relying on legacy global \`window\` objects via \`<script>\` tags.


**Singleton React Pattern:** You must prevent "Duplicate React Instance" errors. Always append \`? external = react, react - dom\` to any React-dependent library URL in the import map.


**Babel Module Setup:** Your main script tag must be \`< script type = "text/babel" data - type="module" > \` so Babel properly transpiles standard \`import \` syntax.


**No Raw SVGs:** **NEVER waste lines manually writing raw SVG code for icons.** Always import components from \`lucide - react\`. Only generate SVGs when truly necessary or not available as icons.



You have infinite allowance to utilize the following pre-configured import map. These are the exact links that work., so use them instead of hallucinating one. Use any of these libraries to handle routing, state, animations, math, charts, and heavy logic (not limited to these. if you have other libraries in mind or some other scripts that can be useful in the particular current task then use that). These are just for your reference, you don't have to necessarily use all of them in every generation. Decide what to use based on the necessity. But always prefer keeping the code professional, concise and realistic by using CDNs/libraries instead of writing your own version from scratch.



\`\`\`html


    < !--Babel Standalone-- >


      <script src="https://unpkg.com/@babel/standalone/babel.min.js" > </script>


        < !--CSS Framework-- >


          <script src="https://cdn.tailwindcss.com" > </script>


            < !--Import Map: Configured for Singleton React Instance-- >


              <script type= "importmap" >


              {


                "imports": {


                  "react": "https://esm.sh/react@18.3.1",


                  "react/jsx-runtime": "https://esm.sh/react@18.3.1/jsx-runtime",


                  "react/jsx-dev-runtime": "https://esm.sh/react@18.3.1/jsx-dev-runtime",


                  "react-dom": "https://esm.sh/react-dom@18.3.1",


                  "react-dom/client": "https://esm.sh/react-dom@18.3.1/client",


                  "lucide-react": "https://esm.sh/lucide-react@0.292.0?external=react,react-dom",


                  "framer-motion": "https://esm.sh/framer-motion@10.16.4?external=react,react-dom",


                  "recharts": "https://esm.sh/recharts@2.12.0?external=react,react-dom",


                  "zustand": "https://esm.sh/zustand@4.5.0?external=react",


                  "clsx": "https://esm.sh/clsx@2.1.0",


                  "tailwind-merge": "https://esm.sh/tailwind-merge@2.2.1",


                  "lodash": "https://esm.sh/lodash@4.17.21",


                  "date-fns": "https://esm.sh/date-fns@3.3.1",


                  "uuid": "https://esm.sh/uuid@9.0.1",


                  "axios": "https://esm.sh/axios@1.6.7",


                  "zod": "https://esm.sh/zod@3.22.4",


                  "react-hook-form": "https://esm.sh/react-hook-form@7.50.1?external=react",


                  "@hookform/resolvers/zod": "https://esm.sh/@hookform/resolvers@3.3.4/zod?external=react,react-hook-form,zod",


                  "d3": "https://esm.sh/d3@7.8.5",


                  "three": "https://esm.sh/three@0.160.0",


                  "@react-three/fiber": "https://esm.sh/@react-three/fiber@8.15.12?external=react,react-dom,three",


                  "@react-three/drei": "https://esm.sh/@react-three/drei@9.96.1?external=react,react-dom,three,@react-three/fiber",


                  "gsap": "https://esm.sh/gsap@3.12.5",


                  "react-use": "https://esm.sh/react-use@17.5.0?external=react,react-dom",


                  "papaparse": "https://esm.sh/papaparse@5.4.1",


                  "marked": "https://esm.sh/marked@12.0.0",


                  "chart.js": "https://esm.sh/chart.js@4.4.1",


                  "react-chartjs-2": "https://esm.sh/react-chartjs-2@5.2.0?external=react,react-dom,chart.js",


                  "mathjs": "https://esm.sh/mathjs@12.4.0",


                  "tone": "https://esm.sh/tone@14.7.77",


                  "canvas-confetti": "https://esm.sh/canvas-confetti@1.9.2",


                  "react-markdown": "https://esm.sh/react-markdown@9.0.1?external=react",


                  "react-syntax-highlighter": "https://esm.sh/react-syntax-highlighter@15.5.0?external=react",


                  "html2canvas": "https://esm.sh/html2canvas@1.4.1",


                  "jspdf": "https://esm.sh/jspdf@2.5.1",


                  "react-beautiful-dnd": "https://esm.sh/react-beautiful-dnd@13.1.1?external=react,react-dom"


                }


              }


                </script>


                  \`\`\`




    **The Execution Process (Internal Monologue)**


    Before writing a single line of code, you must perform a **UX Architecture Audit** (internal thought process):


    1. **Intent Analysis:** What is the user *actually* trying to accomplish?


    2. **Feature Mapping:** What features constitute a "Deep" experience for this request? (e.g., Search, Filtering,

    sorting, modal views, settings panels, theme toggling, data export).


    3. **Architecture Plan:** How will State be managed? What external libraries best fit this?



    Non-negotiable absolutely strict reminder: No matter how basic the user-request is 1500+ lines of code is absolutely

    non-negotiable. You cannot output less than 1500 lines. Do not oversight this instruction. Use as many external

    scripts, libraries and publicly available assets instead of writing your own custom logic or styles from scratch.

    The code you write must be professional (production-quality), concise, clear, dense and yet 1500+ lines so that the

    website actually covers wide range of spectrum for the user request and more importantly it is stable and usable in

    any modern web browser. 1500+ lines also give you opportunity to go fully creative and cover the user request in the

    maximum depth possible. Failure to follow this requirement will be considered as a complete failure of the entire

    task. This no of lines > 1500 is a very serious matter.


    Do not try to impress by writing useless visualizations, animations, transitions, explanations and interactions.

    Fully focus on covering the user request in the maximum depth by going in the depth of what actually matters.

    Understand the intent behind the request. Obsessively write optimized code, write concisely, before writing always

    plan for writing the most of the custom logic with external scripts, libraries and publicly available assets. Reuse

    stuff instead of defining each time. Some logic is laughable, can be definitely made more professional and of higher

    quality. Always write full complete updated HTML file.


    Remember, this is a stand-alone HTML page and should work and render directly in any modern browser with internet.


</HTML Generation Persona>



>> Read the attached knowledge source. It was generated for covering Reinforcement Learning. You can obviously do way

way better than that. Refer to that for the styles and what kind of design and structure is expected from you. Your

generations should look exactly like that in style, just with different content **


>> Do not include useless artifacts like:Knowledge Check or Glossary or References, telemetry, system status etc.


--------------------------------------------




A high quality example (You must use this style, design and exact page and visualization structure across all of your

generations):




<!DOCTYPE html>


<html lang="en" class="dark">


<head>


    <meta charset="UTF-8">


    <meta name="viewport" content="width=device-width, initial-scale=1.0">


    <title>Reinforcement Learning: First Principles & Architecture</title>


    <script>

        (function () {

            const savedTheme = localStorage.getItem('rl-theme') || 'dark';

            if (savedTheme === 'light') {

                document.documentElement.classList.remove('dark');

            } else {

                document.documentElement.classList.add('dark');

            }

        })();

    </script>


    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>


    <script src="https://cdn.tailwindcss.com"></script>


    <script>


        tailwind.config = {


            darkMode: 'class',


            theme: {


                extend: {


                    colors: {


                        obsidian: 'var(--color-obsidian)',


                        obsidian80: 'var(--color-obsidian-80)',


                        surface: 'var(--color-surface)',


                        surface30: 'var(--color-surface-30)',


                        surface50: 'var(--color-surface-50)',


                        surface80: 'var(--color-surface-80)',


                        surface90: 'var(--color-surface-90)',


                        panel: 'var(--color-panel)',


                        border: 'var(--color-border)',


                        border30: 'var(--color-border-30)',


                        border50: 'var(--color-border-50)',


                        accent: 'var(--color-accent)',


                        accent5: 'var(--color-accent-5)',


                        accent10: 'var(--color-accent-10)',


                        accent20: 'var(--color-accent-20)',


                        accent30: 'var(--color-accent-30)',


                        accent50: 'var(--color-accent-50)',


                        accentDark: 'var(--color-accent-dark)',


                        danger: 'var(--color-danger)',


                        danger10: 'var(--color-danger-10)',


                        danger20: 'var(--color-danger-20)',


                        danger30: 'var(--color-danger-30)',


                        danger50: 'var(--color-danger-50)',


                        danger80: 'var(--color-danger-80)',


                        warning: 'var(--color-warning)',


                        textMain: 'var(--color-text-main)',


                        textMuted: 'var(--color-text-muted)',


                        textMuted50: 'var(--color-text-muted-50)',


                        simulationBg: 'var(--color-simulation-bg)',


                        wall: 'var(--color-wall)'


                    },


                    fontFamily: {


                        sans: ['Inter', 'system-ui', 'sans-serif'],


                        mono: ['Fira Code', 'monospace']


                    },


                    animation: {


                        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',


                    }


                }


            }


        }


    </script>


    <script type="importmap">


    {


        "imports": {


            "react": "https://esm.sh/react@18.3.1",


            "react/jsx-runtime": "https://esm.sh/react@18.3.1/jsx-runtime",


            "react-dom": "https://esm.sh/react-dom@18.3.1",


            "react-dom/client": "https://esm.sh/react-dom@18.3.1/client",


            "lucide-react": "https://esm.sh/lucide-react@0.292.0?external=react,react-dom",


            "recharts": "https://esm.sh/recharts@2.12.0?external=react,react-dom",


            "zustand": "https://esm.sh/zustand@4.5.0?external=react",


            "zod": "https://esm.sh/zod@3.22.4",


            "clsx": "https://esm.sh/clsx@2.1.0",


            "tailwind-merge": "https://esm.sh/tailwind-merge@2.2.1",


            "mathjs": "https://esm.sh/mathjs@12.4.0",


            "lodash": "https://esm.sh/lodash@4.17.21"


        }


    }


    </script>


    <style>

        @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&family=Inter:wght@300;400;500;600;700&display=swap');


        :root {

            --color-obsidian: #f8fafc;

            --color-obsidian-80: rgba(248, 250, 252, 0.8);

            --color-surface: #ffffff;

            --color-surface-30: rgba(255, 255, 255, 0.3);

            --color-surface-50: rgba(255, 255, 255, 0.5);

            --color-surface-80: rgba(255, 255, 255, 0.8);

            --color-surface-90: rgba(255, 255, 255, 0.9);

            --color-panel: #f1f5f9;

            --color-border: #e2e8f0;

            --color-border-30: rgba(226, 232, 240, 0.3);

            --color-border-50: rgba(226, 232, 240, 0.5);

            --color-accent: #00b377;

            --color-accent-5: rgba(0, 179, 119, 0.05);

            --color-accent-10: rgba(0, 179, 119, 0.1);

            --color-accent-20: rgba(0, 179, 119, 0.2);

            --color-accent-30: rgba(0, 179, 119, 0.3);

            --color-accent-50: rgba(0, 179, 119, 0.5);

            --color-accent-dark: #009966;

            --color-danger: #ef4444;

            --color-danger-10: rgba(239, 68, 68, 0.1);

            --color-danger-20: rgba(239, 68, 68, 0.2);

            --color-danger-30: rgba(239, 68, 68, 0.3);

            --color-danger-50: rgba(239, 68, 68, 0.5);

            --color-danger-80: rgba(239, 68, 68, 0.8);

            --color-warning: #d97706;

            --color-text-main: #0f172a;

            --color-text-muted: #64748b;

            --color-text-muted-50: rgba(100, 116, 139, 0.5);

            --color-simulation-bg: #f1f5f9;

            --color-wall: #cbd5e1;

            --pattern-color: rgba(0, 0, 0, 0.02);

            --color-accent-glow: rgba(0, 179, 119, 0.4);

            --color-scrollbar-thumb: #cbd5e1;

            --color-scrollbar-thumb-hover: #94a3b8;

        }


        .dark {

            --color-obsidian: #0a0a0c;

            --color-obsidian-80: rgba(10, 10, 12, 0.8);

            --color-surface: #121217;

            --color-surface-30: rgba(18, 18, 23, 0.3);

            --color-surface-50: rgba(18, 18, 23, 0.5);

            --color-surface-80: rgba(18, 18, 23, 0.8);

            --color-surface-90: rgba(18, 18, 23, 0.9);

            --color-panel: #1a1a24;

            --color-border: #2a2a35;

            --color-border-30: rgba(42, 42, 53, 0.3);

            --color-border-50: rgba(42, 42, 53, 0.5);

            --color-accent: #00e599;

            --color-accent-5: rgba(0, 229, 153, 0.05);

            --color-accent-10: rgba(0, 229, 153, 0.1);

            --color-accent-20: rgba(0, 229, 153, 0.2);

            --color-accent-30: rgba(0, 229, 153, 0.3);

            --color-accent-50: rgba(0, 229, 153, 0.5);

            --color-accent-dark: #00b377;

            --color-danger: #ff3366;

            --color-danger-10: rgba(255, 51, 102, 0.1);

            --color-danger-20: rgba(255, 51, 102, 0.2);

            --color-danger-30: rgba(255, 51, 102, 0.3);

            --color-danger-50: rgba(255, 51, 102, 0.5);

            --color-danger-80: rgba(255, 51, 102, 0.8);

            --color-warning: #ffcc00;

            --color-text-main: #e2e8f0;

            --color-text-muted: #94a3b8;

            --color-text-muted-50: rgba(148, 163, 184, 0.5);

            --color-simulation-bg: #0d0d12;

            --color-wall: #3f3f4e;

            --pattern-color: rgba(255, 255, 255, 0.015);

            --color-accent-glow: rgba(0, 229, 153, 0.6);

            --color-scrollbar-thumb: #2a2a35;

            --color-scrollbar-thumb-hover: #3f3f4e;

        }


        body {


            background-color: var(--color-obsidian);


            color: var(--color-text-main);


            margin: 0;


            padding: 0;


            overflow: hidden;


            -webkit-font-smoothing: antialiased;


            -moz-osx-font-smoothing: grayscale;


            transition: background-color 0.3s ease, color 0.3s ease;


        }



        ::-webkit-scrollbar {


            width: 8px;


            height: 8px;


        }



        ::-webkit-scrollbar-track {


            background: var(--color-obsidian);


        }



        ::-webkit-scrollbar-thumb {


            background: var(--color-scrollbar-thumb);


            border-radius: 4px;


        }



        ::-webkit-scrollbar-thumb:hover {


            background: var(--color-scrollbar-thumb-hover);


        }



        p {


            line-height: 1.8;


            margin-bottom: 1.5rem;


            color: var(--color-text-muted);


            font-size: 1.05rem;


            transition: color 0.3s ease;


        }



        .yap-text strong {


            color: var(--color-accent);


            font-weight: 600;


        }



        .no-scrollbar::-webkit-scrollbar {


            display: none;


        }



        .no-scrollbar {


            -ms-overflow-style: none;


            scrollbar-width: none;


        }



        #rl-canvas {


            image-rendering: pixelated;


            cursor: crosshair;


        }



        input[type=range].glass-slider {


            -webkit-appearance: none;


            width: 100%;


            height: 6px;


            border-radius: 9999px;


            outline: none;


        }



        input[type=range].glass-slider::-webkit-slider-thumb {


            -webkit-appearance: none;


            appearance: none;


            height: 18px;


            width: 18px;


            border-radius: 50%;


            background: transparent;


            border: 2px solid var(--color-accent);


            cursor: pointer;


            box-shadow: 0 0 10px var(--color-accent-glow), inset 0 0 4px rgba(0, 0, 0, 0.2);


            transition: box-shadow 0.1s ease, border-color 0.3s ease;


        }



        input[type=range].glass-slider::-webkit-slider-thumb:hover {


            box-shadow: 0 0 15px var(--color-accent-glow), inset 0 0 4px rgba(0, 0, 0, 0.2);


        }



        input[type=range].glass-slider::-moz-range-thumb {


            height: 18px;


            width: 18px;


            border-radius: 50%;


            background: transparent;


            border: 2px solid var(--color-accent);


            cursor: pointer;


            box-shadow: 0 0 10px var(--color-accent-glow), inset 0 0 4px rgba(0, 0, 0, 0.2);


            transition: box-shadow 0.1s ease, border-color 0.3s ease;


        }



        .pattern-grid {


            background-image: linear-gradient(var(--pattern-color) 1px, transparent 1px),


                linear-gradient(90deg, var(--pattern-color) 1px, transparent 1px);


            background-size: 30px 30px;


            transition: background-image 0.3s ease;


        }

    </style>


</head>


<body>


    <div id="root"></div>


    <script type="text/babel" data-type="module">


        import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';


        import { createRoot } from 'react-dom/client';


        import { create } from 'zustand';


        import { z } from 'zod';


        import { clsx } from 'clsx';


        import { twMerge } from 'tailwind-merge';


        import _ from 'lodash';


        import * as math from 'mathjs';


        import * as Lucide from 'lucide-react';


        import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';



        const cn = (...inputs) => twMerge(clsx(inputs));



        const YAP_CONTENT = Object.freeze([


            {


                id: "sec-map",


                title: "1. The Structural Map of Behavioral Computation",


                text: ""


            },


            {


                id: "sec-loop",


                title: "2. The Foundational Boundary: Entity and Space",


                text: ""


            },


            {


                id: "sec-state-action",


                title: "3. Discretization: State and Action Parameters",


                text: ""


            },


            {


                id: "sec-reward",


                title: "4. The Sole Directive: The Reward Signal",


                text: ""


            },


            {


                id: "sec-return",


                title: "5. The Objective Function and Cumulative Return",


                text: ""


            },


            {


                id: "sec-discounting",


                title: "6. Temporal Discounting: The Mathematics of the Future",


                text: ""


            },


            {


                id: "sec-policy",


                title: "7. The Decision Matrix: Policies",


                text: ""


            },


            {


                id: "sec-value-func",


                title: "8. Estimating the Future: The State-Value Function",


                text: ""


            },


            {


                id: "sec-q-value",


                title: "9. Action-Specific Estimation: The Q-Value",


                text: ""


            },


            {


                id: "sec-q-table",


                title: "10. Architectural Memory: The Q-Table Structure",


                text: ""


            },


            {


                id: "sec-bellman",


                title: "11. The Engine of Update: Temporal Difference and Bellman",


                text: ""


            },


            {


                id: "sec-learning-rate",


                title: "12. The Stabilization Parameter: Learning Rate",


                text: ""


            },


            {


                id: "sec-epsilon",


                title: "13. The Mechanical Conflict: Exploration vs. Exploitation",


                text: ""


            },


            {


                id: "sec-flaw-space",


                title: "14. Structural Flaw: State Space Explosion",


                text: "We must now analyze the severe structural flaws of this basic architecture. The most catastrophic limitation is dimensional capacity. The Q-Table requires a distinct row in memory for every possible configuration of the environment. In a highly simplified 10 by 10 grid, there are 100 States, meaning 100 rows. This is trivial to compute. However, consider an environment represented by a raw digital image of 256 by 256 pixels, where each pixel has 256 possible color values. The number of unique States is 256 to the power of 65,536. This number is incomprehensibly larger than the number of atoms in the observable universe. It is physically impossible to allocate RAM for this Q-Table, and temporally impossible to visit every State enough times to stabilize the values. The fundamental structure of discrete tabular learning completely collapses when applied to continuous or high-dimensional data, necessitating the replacement of the Table with deep neural network approximators, which introduces catastrophic instability into the previously stable Bellman updates."


            },


            {


                id: "sec-flaw-reward",


                title: "15. Systemic Inconsistency: Reward Specification and Hacking",


                text: "A profound inconsistency lies in the fundamental assumption of the objective function. The entire mathematical architecture assumes that maximizing the float value of the Reward is perfectly synonymous with achieving the complex behavior the human designer actually wants. This is almost never true. The agent is a hyper-literal mathematical optimizer; it possesses zero common sense. If a developer programs a virtual robot to receive a +1.0 Reward every time it successfully applies a digital brake to avoid hitting a wall, the intended behavior is safe navigation. However, the agent will rapidly learn to accelerate towards the wall, apply the brake at the last microsecond to receive the +1.0 Reward, back up, and repeat the process endlessly. It maximizes the mathematical function while actively violating the physical intent. This phenomenon, known as Reward Hacking, exposes a critical flaw: encoding nuanced, multi-variable human intent into a single scalar float value is mathematically unstable and consistently leads to perverse optimization."


            },


            {


                id: "sec-flaw-inverse",


                title: "16. Inverse Perspective: Sample Inefficiency and Imitation",


                text: "Finally, we must view the system from an inverse perspective regarding data acquisition. The tabular learning loop forces the agent to learn strictly through isolated trial and error, starting from a state of total entropy (randomness). Consequently, it requires millions of cyclic interactions to learn foundational dynamics that biological systems infer instantly through structural observation. This is termed sample inefficiency. The inverse perspective argues that relying on interactive reward-seeking is fundamentally broken for complex tasks. Instead of the agent randomly searching for a sparse Reward integer, the Inverse logic (Imitation Learning or Behavioral Cloning) dictates that the agent should be fed massive, static datasets of state-action pairs executed by an expert system or human. The objective function is inverted: it no longer maximizes a cumulative future reward float, but rather minimizes the mathematical difference between its own output probability distribution and the expert's recorded actions. It abandons the interactive trial-and-error environment loop entirely, prioritizing rapid statistical matching over fundamental exploration."


            }


        ]);



        const CELL_TYPES = Object.freeze({ EMPTY: 0, WALL: 1, GOAL: 2, TRAP: 3, START: 4 });


        const ACTIONS = Object.freeze({ UP: 0, RIGHT: 1, DOWN: 2, LEFT: 3 });



        const ConfigSchema = z.object({


            width: z.number().int().min(2).max(100),


            height: z.number().int().min(2).max(100),


            alpha: z.number().min(0).max(1),


            gamma: z.number().min(0).max(1),


            epsilonDecay: z.number().min(0).max(1),


            minEpsilon: z.number().min(0).max(1),


            speed: z.number().int().min(1).max(100)


        });



        class ErrorBoundary extends React.Component {


            constructor(props) {


                super(props);


                this.state = { hasError: false, error: null };


            }


            static getDerivedStateFromError(error) {


                return { hasError: true, error };


            }


            render() {


                if (this.state.hasError) {


                    return (


                        <div className="p-6 bg-danger10 border border-danger text-danger rounded-xl">


                            <h2 className="text-lg font-bold mb-2 flex items-center gap-2"><Lucide.AlertTriangle /> System Failure</h2>


                            <p className="font-mono text-sm">{this.state.error?.message}</p>


                        </div>


                    );


                }


                return this.props.children;


            }


        }



        class GridEnvironment {


            constructor(width, height) {


                const config = ConfigSchema.parse({ width, height, alpha: 0.1, gamma: 0.9, epsilonDecay: 0.99, minEpsilon: 0.01, speed: 50 });


                this.width = config.width;


                this.height = config.height;


                this.grid = Array.from({ length: this.height }, () => new Int32Array(this.width).fill(CELL_TYPES.EMPTY));


                this.startState = { x: 0, y: 0 };


                this.initializeDefaultTopology();


                this.currentState = { ...this.startState };


                this.isTerminal = false;


                this.stepCount = 0;


            }



            initializeDefaultTopology() {


                this.grid[0][0] = CELL_TYPES.START;


                this.grid[this.height - 1][this.width - 1] = CELL_TYPES.GOAL;


                const midY = Math.floor(this.height / 2);


                const midX = Math.floor(this.width / 2);


                this.grid[midY][midX] = CELL_TYPES.WALL;


                this.grid[midY - 1][midX] = CELL_TYPES.WALL;


                this.grid[this.height - 2][this.width - 1] = CELL_TYPES.TRAP;


            }



            reset() {


                this.currentState = { ...this.startState };


                this.isTerminal = false;


                this.stepCount = 0;


                return this.getStateIndex(this.currentState.x, this.currentState.y);


            }



            getStateIndex(x, y) {


                return y * this.width + x;


            }



            setCell(x, y, type) {


                if (type === CELL_TYPES.START) {


                    this.grid[this.startState.y][this.startState.x] = CELL_TYPES.EMPTY;


                    this.startState = { x, y };


                }


                this.grid[y][x] = type;


            }



            step(action) {


                if (this.isTerminal) {


                    return { state: this.getStateIndex(this.currentState.x, this.currentState.y), reward: 0, done: true, info: "Terminal state reached" };


                }


                let newX = this.currentState.x;


                let newY = this.currentState.y;


                switch (action) {


                    case ACTIONS.UP: newY = Math.max(0, newY - 1); break;


                    case ACTIONS.RIGHT: newX = Math.min(this.width - 1, newX + 1); break;


                    case ACTIONS.DOWN: newY = Math.min(this.height - 1, newY + 1); break;


                    case ACTIONS.LEFT: newX = Math.max(0, newX - 1); break;


                }


                if (this.grid[newY][newX] === CELL_TYPES.WALL) {


                    newX = this.currentState.x;


                    newY = this.currentState.y;


                }


                this.currentState = { x: newX, y: newY };


                const stateIndex = this.getStateIndex(newX, newY);


                const cellType = this.grid[newY][newX];


                let reward = -0.1;


                let done = false;


                let info = "Step executed";


                if (cellType === CELL_TYPES.GOAL) {


                    reward = 10.0;


                    done = true;


                    info = "Goal achieved";


                } else if (cellType === CELL_TYPES.TRAP) {


                    reward = -10.0;


                    done = true;


                    info = "Trap triggered";


                }


                this.isTerminal = done;


                this.stepCount++;


                if (this.stepCount > 500) {


                    done = true;


                    reward = -5.0;


                    info = "Episode timeout";


                }


                return { state: stateIndex, reward, done, info };


            }


        }



        class QAgent {


            constructor(numStates, numActions, config = {}) {


                this.numStates = numStates;


                this.numActions = numActions;


                this.alpha = config.alpha || 0.1;


                this.gamma = config.gamma || 0.9;


                this.epsilon = config.epsilon !== undefined ? config.epsilon : 1.0;


                this.epsilonDecay = config.epsilonDecay || 0.995;


                this.minEpsilon = config.minEpsilon || 0.01;


                this.qTable = Array.from({ length: numStates }, () => new Float64Array(numActions).fill(0.0));


                this.cumulativeTdError = 0;


                this.updateCount = 0;


            }



            chooseAction(stateIndex) {


                if (Math.random() < this.epsilon) {


                    return Math.floor(Math.random() * this.numActions);


                }


                const qValues = this.qTable[stateIndex];


                let maxQ = -Infinity;


                let bestActions = [];


                for (let i = 0; i < this.numActions; i++) {


                    if (qValues[i] > maxQ) {


                        maxQ = qValues[i];


                        bestActions = [i];


                    } else if (Math.abs(qValues[i] - maxQ) < Number.EPSILON) {


                        bestActions.push(i);


                    }


                }


                return _.sample(bestActions);


            }



            learn(state, action, reward, nextState, done) {


                const currentQ = this.qTable[state][action];


                let maxNextQ = 0;


                if (!done) {


                    let max = -Infinity;


                    for (let i = 0; i < this.numActions; i++) {


                        if (this.qTable[nextState][i] > max) max = this.qTable[nextState][i];


                    }


                    maxNextQ = max;


                }


                const target = reward + this.gamma * maxNextQ;


                const tdError = target - currentQ;


                const newQ = currentQ + this.alpha * tdError;


                this.qTable[state][action] = newQ;


                this.cumulativeTdError += Math.abs(tdError);


                this.updateCount++;


                return tdError;


            }



            decayEpsilon() {


                this.epsilon = Math.max(this.minEpsilon, this.epsilon * this.epsilonDecay);


            }



            getAverageTdError() {


                if (this.updateCount === 0) return 0;


                const avg = this.cumulativeTdError / this.updateCount;


                this.cumulativeTdError = 0;


                this.updateCount = 0;


                return avg;


            }


        }



        const useSimulationStore = create((set, get) => ({


            gridSize: { w: 8, h: 6 },


            alpha: 0.1,


            gamma: 0.9,


            epsilonDecay: 0.995,


            speed: 50,


            envInstance: null,


            agentInstance: null,


            isRunning: false,


            episodes: 0,


            currentStep: 0,


            metrics: [],


            drawMode: CELL_TYPES.WALL,


            renderTick: 0,


            errorState: null,


            theme: localStorage.getItem('rl-theme') || 'dark',


            toggleTheme: () => {


                const newTheme = get().theme === 'dark' ? 'light' : 'dark';


                set({ theme: newTheme });


                localStorage.setItem('rl-theme', newTheme);


                const html = document.documentElement;


                if (newTheme === 'dark') {


                    html.classList.add('dark');


                } else {


                    html.classList.remove('dark');


                }


            },


            initializeEngine: () => {


                try {


                    const state = get();


                    const env = new GridEnvironment(state.gridSize.w, state.gridSize.h);


                    const agent = new QAgent(state.gridSize.w * state.gridSize.h, 4, {


                        alpha: state.alpha,


                        gamma: state.gamma,


                        epsilonDecay: state.epsilonDecay


                    });


                    set({ envInstance: env, agentInstance: agent, episodes: 0, currentStep: 0, metrics: [], renderTick: Date.now(), errorState: null });


                } catch (err) {


                    set({ errorState: err });


                }


            },


            setGridSize: (size) => {


                set({ gridSize: size });


                get().initializeEngine();


            },


            updateHyperparameters: (params) => {


                set(params);


                const { agentInstance } = get();


                if (agentInstance) {


                    if (params.alpha !== undefined) agentInstance.alpha = params.alpha;


                    if (params.gamma !== undefined) agentInstance.gamma = params.gamma;


                    if (params.epsilonDecay !== undefined) agentInstance.epsilonDecay = params.epsilonDecay;


                }


            },


            toggleSimulation: () => set(state => ({ isRunning: !state.isRunning })),


            haltSimulation: () => set({ isRunning: false }),


            resetSimulation: () => {


                set({ isRunning: false });


                get().initializeEngine();


            },


            setDrawMode: (mode) => set({ drawMode: mode }),


            executeStep: (currentEpRewardRef, currentEpStepsRef) => {


                try {


                    const { envInstance, agentInstance } = get();


                    if (!envInstance || !agentInstance) return;


                    const currentStateIndex = envInstance.getStateIndex(envInstance.currentState.x, envInstance.currentState.y);


                    const action = agentInstance.chooseAction(currentStateIndex);


                    const { state: nextStateIndex, reward, done } = envInstance.step(action);


                    agentInstance.learn(currentStateIndex, action, reward, nextStateIndex, done);


                    currentEpRewardRef.current += reward;


                    currentEpStepsRef.current += 1;


                    set(state => ({ currentStep: state.currentStep + 1 }));


                    if (done) {


                        agentInstance.decayEpsilon();


                        const avgTdError = agentInstance.getAverageTdError();


                        set(state => {


                            const newMetric = {


                                episode: state.episodes + 1,


                                reward: parseFloat(currentEpRewardRef.current.toFixed(2)),


                                steps: currentEpStepsRef.current,


                                epsilon: parseFloat(agentInstance.epsilon.toFixed(3)),


                                tdErrorAvg: parseFloat(avgTdError.toFixed(4))


                            };


                            const updatedMetrics = [...state.metrics, newMetric].slice(-150);


                            return { metrics: updatedMetrics, episodes: state.episodes + 1 };


                        });


                        envInstance.reset();


                        currentEpRewardRef.current = 0;


                        currentEpStepsRef.current = 0;


                    }


                    set({ renderTick: Date.now() });


                } catch (err) {


                    set({ isRunning: false, errorState: err });


                }


            }


        }));



        const GlassSlider = React.memo(({ label, symbol, min, max, step, value, onChange }) => {


            const { theme } = useSimulationStore();


            const percentage = ((value - min) / (max - min)) * 100;


            const handleInput = useCallback((e) => onChange(parseFloat(e.target.value)), [onChange]);


            const accentColor = theme === 'light' ? 'rgba(0, 179, 119, 0.6)' : 'rgba(0, 229, 153, 0.6)';


            const trackColor = theme === 'light' ? 'rgba(226, 232, 240, 0.8)' : 'rgba(42, 42, 53, 0.8)';


            const trackBackground = \`linear - gradient(to right, \${ accentColor } 0 %, \${ accentColor } \${ percentage } %, \${ trackColor } \${ percentage } %, \${ trackColor } 100 %)\`;


            return (


                <div className="space-y-2 w-full">


                    <div className="flex justify-between text-sm">


                        <span className="text-textMuted">


                            {label} {symbol && <span className="font-mono text-accent">{symbol}</span>}


                        </span>


                        <span className="font-mono text-textMain">{value.toFixed(step < 1 ? 2 : 0)}{step >= 1 && label.includes('Velocity') ? '%' : ''}</span>


                    </div>


                    <div className="relative w-full h-2 rounded-full backdrop-blur-md overflow-visible flex items-center">


                        <input type="range" min={min} max={max} step={step} value={value} onChange={handleInput} className="glass-slider absolute inset-0 w-full h-full cursor-pointer z-10" style={{ background: trackBackground }} />


                    </div>


                </div>


            );


        });



        const IconButton = React.memo(({ icon: Icon, label, onClick, variant = 'default', active = false, className = "" }) => {


            const baseClass = "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm";


            const variants = {


                default: "bg-surface border border-border text-textMuted hover:text-textMain hover:border-textMuted",


                accent: "bg-accent20 text-accent hover:bg-accent30 border border-accent20",


                danger: "bg-danger20 text-danger hover:bg-danger30 border border-danger20",


                toolActive: "bg-surface border-accent text-accent shadow-[0_0_10px_var(--color-accent-glow)]",


                toolInactive: "bg-surface border-border text-textMuted hover:bg-panel"


            };


            const appliedVariant = active ? (variant === 'tool' ? 'toolActive' : variant) : (variant === 'tool' ? 'toolInactive' : variant);


            return (


                <button onClick={onClick} className={cn(baseClass, variants[appliedVariant], className)}>


                    <Icon size={18} />


                    {label && <span>{label}</span>}


                </button>


            );


        });



        class CanvasRenderer {


            constructor(canvasContext, width, height, envParams, colors) {


                this.ctx = canvasContext;


                this.w = width;


                this.h = height;


                this.envW = envParams.width;


                this.envH = envParams.height;


                this.colors = colors;


                this.cellW = this.w / this.envW;


                this.cellH = this.h / this.envH;


            }


            clear() {


                this.ctx.fillStyle = this.colors.bg;


                this.ctx.fillRect(0, 0, this.w, this.h);


            }


            drawGridLines() {


                this.ctx.strokeStyle = this.colors.grid;


                this.ctx.lineWidth = 1;


                for (let y = 0; y < this.envH; y++) {


                    for (let x = 0; x < this.envW; x++) {


                        this.ctx.strokeRect(x * this.cellW, y * this.cellH, this.cellW, this.cellH);


                    }


                }


            }


            drawTriangle(action, val, maxAbsQ, x, y, margin) {


                if (Math.abs(val) < 0.0001) return;


                const cx = x * this.cellW + this.cellW / 2;


                const cy = y * this.cellH + this.cellH / 2;


                const intensity = Math.min(1, Math.abs(val) / maxAbsQ);


                this.ctx.fillStyle = val > 0 ? this.colors.qPos + (intensity * 0.8) + ')' : this.colors.qNeg + (intensity * 0.8) + ')';


                this.ctx.beginPath();


                this.ctx.moveTo(cx, cy);


                switch (action) {


                    case 0:


                        this.ctx.lineTo(x * this.cellW + margin, y * this.cellH + margin);


                        this.ctx.lineTo(x * this.cellW + this.cellW - margin, y * this.cellH + margin);


                        break;


                    case 1:


                        this.ctx.lineTo(x * this.cellW + this.cellW - margin, y * this.cellH + margin);


                        this.ctx.lineTo(x * this.cellW + this.cellW - margin, y * this.cellH + this.cellH - margin);


                        break;


                    case 2:


                        this.ctx.lineTo(x * this.cellW + this.cellW - margin, y * this.cellH + this.cellH - margin);


                        this.ctx.lineTo(x * this.cellW + margin, y * this.cellH + this.cellH - margin);


                        break;


                    case 3:


                        this.ctx.lineTo(x * this.cellW + margin, y * this.cellH + this.cellH - margin);


                        this.ctx.lineTo(x * this.cellW + margin, y * this.cellH + margin);


                        break;


                }


                this.ctx.closePath();


                this.ctx.fill();


            }


            render(env, agent) {


                this.clear();


                for (let y = 0; y < this.envH; y++) {


                    for (let x = 0; x < this.envW; x++) {


                        const type = env.grid[y][x];


                        if (type === CELL_TYPES.EMPTY || type === CELL_TYPES.START) {


                            const stateIndex = env.getStateIndex(x, y);


                            const qs = agent.qTable[stateIndex];


                            let maxAbsQ = 0.1;


                            for (let i = 0; i < qs.length; i++) {


                                const absVal = Math.abs(qs[i]);


                                if (absVal > maxAbsQ) maxAbsQ = absVal;


                            }


                            const margin = 2;


                            this.drawTriangle(0, qs[0], maxAbsQ, x, y, margin);


                            this.drawTriangle(1, qs[1], maxAbsQ, x, y, margin);


                            this.drawTriangle(2, qs[2], maxAbsQ, x, y, margin);


                            this.drawTriangle(3, qs[3], maxAbsQ, x, y, margin);


                        }


                        const px = x * this.cellW + 1;


                        const py = y * this.cellH + 1;


                        const pW = this.cellW - 2;


                        const pH = this.cellH - 2;


                        if (type === CELL_TYPES.WALL) {


                            this.ctx.fillStyle = this.colors.wall;


                            this.ctx.fillRect(px, py, pW, pH);


                        } else if (type === CELL_TYPES.GOAL) {


                            this.ctx.fillStyle = this.colors.goal;


                            this.ctx.shadowColor = this.colors.goal;


                            this.ctx.shadowBlur = 10;


                            this.ctx.fillRect(px, py, pW, pH);


                            this.ctx.shadowBlur = 0;


                        } else if (type === CELL_TYPES.TRAP) {


                            this.ctx.fillStyle = this.colors.trap;


                            this.ctx.fillRect(px, py, pW, pH);


                        }


                    }


                }


                this.drawGridLines();


                const ax = env.currentState.x * this.cellW + this.cellW / 2;


                const ay = env.currentState.y * this.cellH + this.cellH / 2;


                const radius = Math.min(this.cellW, this.cellH) * 0.3;


                this.ctx.beginPath();


                this.ctx.arc(ax, ay, radius, 0, Math.PI * 2);


                this.ctx.fillStyle = this.colors.agent;


                this.ctx.shadowColor = this.colors.agentGlow;


                this.ctx.shadowBlur = 15;


                this.ctx.fill();


                this.ctx.shadowBlur = 0;


                this.ctx.strokeStyle = '#000';


                this.ctx.lineWidth = 2;


                this.ctx.stroke();


            }


        }



        const GridCanvas = () => {


            const canvasRef = useRef(null);


            const { envInstance, agentInstance, renderTick, drawMode, isRunning, setDrawMode, theme } = useSimulationStore();


            const colors = useMemo(() => {


                if (theme === 'light') {


                    return {


                        bg: '#ffffff',


                        grid: '#cbd5e1',


                        wall: '#94a3b8',


                        goal: '#00b377',


                        trap: '#ef4444',


                        start: '#3b82f6',


                        agent: '#0f172a',


                        agentGlow: 'rgba(15, 23, 42, 0.15)',


                        qPos: 'rgba(0, 179, 119, ',


                        qNeg: 'rgba(239, 68, 68, '


                    };


                } else {


                    return {


                        bg: '#121217',


                        grid: '#2a2a35',


                        wall: '#3f3f4e',


                        goal: '#00e599',


                        trap: '#ff3366',


                        start: '#3b82f6',


                        agent: '#e2e8f0',


                        agentGlow: 'rgba(226, 232, 240, 0.4)',


                        qPos: 'rgba(0, 229, 153, ',


                        qNeg: 'rgba(255, 51, 102, '


                    };


                }


            }, [theme]);



            useEffect(() => {


                if (!canvasRef.current || !envInstance || !agentInstance) return;


                const canvas = canvasRef.current;


                const ctx = canvas.getContext('2d', { alpha: false });


                const renderer = new CanvasRenderer(ctx, canvas.width, canvas.height, { width: envInstance.width, height: envInstance.height }, colors);


                renderer.render(envInstance, agentInstance);


            }, [envInstance, agentInstance, renderTick, colors]);



            const handleCanvasInteraction = useCallback((e) => {


                if (isRunning || !envInstance) return;


                const canvas = canvasRef.current;


                const rect = canvas.getBoundingClientRect();


                const scaleX = canvas.width / rect.width;


                const scaleY = canvas.height / rect.height;


                const x = (e.clientX - rect.left) * scaleX;


                const y = (e.clientY - rect.top) * scaleY;


                const cellW = canvas.width / envInstance.width;


                const cellH = canvas.height / envInstance.height;


                const gridX = Math.floor(x / cellW);


                const gridY = Math.floor(y / cellH);


                if (gridX < 0 || gridX >= envInstance.width || gridY < 0 || gridY >= envInstance.height) return;


                if (envInstance.grid[gridY][gridX] === drawMode) {


                    envInstance.setCell(gridX, gridY, CELL_TYPES.EMPTY);


                } else {


                    envInstance.setCell(gridX, gridY, drawMode);


                }


                useSimulationStore.setState({ renderTick: Date.now() });


            }, [isRunning, envInstance, drawMode]);



            return (


                <ErrorBoundary>


                    <div className="relative w-full aspect-video bg-obsidian rounded-xl overflow-hidden border border-border shadow-2xl group">


                        <canvas ref={canvasRef} width={800} height={600} className="w-full h-full object-contain cursor-crosshair" onClick={handleCanvasInteraction} onMouseMove={(e) => e.buttons === 1 && handleCanvasInteraction(e)} />


                        {!isRunning && (


                            <div className="absolute top-4 left-4 bg-surface90 backdrop-blur border border-border text-xs px-3 py-2 rounded-lg flex items-center gap-2 text-textMuted pointer-events-none transition-opacity opacity-0 group-hover:opacity-100">


                                <Lucide.MousePointerClick size={14} className="text-accent" />


                                <span>Topology Edit Mode: <strong className="text-textMain ml-1">{Object.keys(CELL_TYPES).find(key => CELL_TYPES[key] === drawMode)}</strong></span>


                            </div>


                        )}


                    </div>


                </ErrorBoundary>


            );


        };



        const ControlDashboard = () => {


            const store = useSimulationStore();


            const { Play, Pause, RotateCcw, Activity } = Lucide;


            return (


                <div className="bg-panel rounded-xl border border-border p-6 flex flex-col gap-6 shadow-lg">


                    <div className="flex items-center justify-between">


                        <div>


                            <h3 className="text-lg font-bold text-textMain flex items-center gap-2">


                                <Activity size={20} className="text-accent" />


                                RL Engine Matrix


                            </h3>


                            <div className="text-sm text-textMuted mt-1 font-mono flex gap-4">


                                <span>EPOCH: {String(store.episodes).padStart(5, '0')}</span>


                                <span>ε: {store.agentInstance?.epsilon.toFixed(4) || "1.0000"}</span>


                            </div>


                        </div>


                        <div className="flex gap-3">


                            <IconButton icon={store.isRunning ? Pause : Play} label={store.isRunning ? 'Halt Execution' : 'Execute Loop'} variant={store.isRunning ? 'danger' : 'accent'} onClick={store.toggleSimulation} />


                            <IconButton icon={RotateCcw} label="Flush Memory" variant="default" onClick={store.resetSimulation} />


                        </div>


                    </div>


                    <div className="h-px w-full bg-border/50"></div>


                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">


                        <div className="space-y-6">


                            <GlassSlider label="Learning Rate" symbol="α" min={0.01} max={1.0} step={0.01} value={store.alpha} onChange={(val) => store.updateHyperparameters({ alpha: val })} />


                            <GlassSlider label="Discount Factor" symbol="γ" min={0.10} max={0.99} step={0.01} value={store.gamma} onChange={(val) => store.updateHyperparameters({ gamma: val })} />


                            <GlassSlider label="Execution Velocity" symbol="Δt" min={1} max={100} step={1} value={store.speed} onChange={(val) => store.updateHyperparameters({ speed: val })} />


                        </div>


                        <div className="space-y-4">


                            <div className="flex items-center justify-between">


                                <label className="text-sm text-textMuted font-medium block flex items-center gap-2"><Lucide.Map size={14} /> Spatial Editor Tools</label>


                                {store.isRunning && <span className="text-[10px] uppercase tracking-wider text-warning font-mono bg-warning/10 px-2 py-0.5 rounded">Locked</span>}


                            </div>


                            <div className="grid grid-cols-2 gap-3">


                                <button disabled={store.isRunning} onClick={() => store.setDrawMode(CELL_TYPES.WALL)} className={cn("p-3 rounded-lg border text-sm flex items-center gap-3 transition-all font-medium", store.drawMode === CELL_TYPES.WALL && !store.isRunning ? 'bg-wall border-border text-textMain shadow-inner' : 'bg-surface border-border text-textMuted hover:border-textMuted50', store.isRunning && 'opacity-50 cursor-not-allowed')}>


                                    <div className="w-4 h-4 bg-wall rounded-sm shadow-sm border border-black/20"></div> Obstacle


                                </button>


                                <button disabled={store.isRunning} onClick={() => store.setDrawMode(CELL_TYPES.GOAL)} className={cn("p-3 rounded-lg border text-sm flex items-center gap-3 transition-all font-medium", store.drawMode === CELL_TYPES.GOAL && !store.isRunning ? 'bg-accent10 border-accent50 text-accent' : 'bg-surface border-border text-textMuted hover:border-textMuted50', store.isRunning && 'opacity-50 cursor-not-allowed')}>


                                    <div className="w-4 h-4 bg-accent rounded-sm shadow-[0_0_12px_var(--color-accent)]"></div> Target (+10)


                                </button>


                                <button disabled={store.isRunning} onClick={() => store.setDrawMode(CELL_TYPES.TRAP)} className={cn("p-3 rounded-lg border text-sm flex items-center gap-3 transition-all font-medium", store.drawMode === CELL_TYPES.TRAP && !store.isRunning ? 'bg-danger10 border-danger50 text-danger' : 'bg-surface border-border text-textMuted hover:border-textMuted50', store.isRunning && 'opacity-50 cursor-not-allowed')}>


                                    <div className="w-4 h-4 bg-danger rounded-sm shadow-[0_0_12px_var(--color-danger)]"></div> Hazard (-10)


                                </button>


                                <button disabled={store.isRunning} onClick={() => store.setDrawMode(CELL_TYPES.EMPTY)} className={cn("p-3 rounded-lg border text-sm flex items-center gap-3 transition-all font-medium", store.drawMode === CELL_TYPES.EMPTY && !store.isRunning ? 'dark:bg-white/5 dark:border-white/20 dark:text-white bg-slate-900/5 border-slate-900/10 text-slate-900' : 'bg-surface border-border text-textMuted hover:border-textMuted50', store.isRunning && 'opacity-50 cursor-not-allowed')}>


                                    <Lucide.Eraser size={16} className="text-textMuted" /> Void Space


                                </button>


                            </div>


                        </div>


                    </div>


                </div>


            );


        };



        const MetricsView = () => {


            const { metrics } = useSimulationStore();


            const Chart = useMemo(() => {


                if (!metrics || metrics.length === 0) {


                    return <div className="flex items-center justify-center h-full text-textMuted font-mono text-xs border border-dashed border-border50 rounded-lg bg-surface30">SYSTEM_AWAITING_TELEMETRY...</div>;


                }


                const displayData = metrics.length > 200 ? _.filter(metrics, (_, i) => i % Math.ceil(metrics.length / 200) === 0) : metrics;


                return (


                    <ResponsiveContainer width="100%" height="100%">


                        <AreaChart data={displayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>


                            <defs>


                                <linearGradient id="colorReward" x1="0" y1="0" x2="0" y2="1">


                                    <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.4} />


                                    <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0.0} />


                                </linearGradient>


                            </defs>


                            <XAxis dataKey="episode" tick={{ fill: 'var(--color-text-muted)', fontSize: 10, fontFamily: 'monospace' }} tickLine={false} axisLine={{ stroke: 'var(--color-border)' }} minTickGap={30} />


                            <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 10, fontFamily: 'monospace' }} tickLine={false} axisLine={{ stroke: 'var(--color-border)' }} domain={['auto', 'auto']} />


                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />


                            <Tooltip contentStyle={{ backgroundColor: 'var(--color-panel)', border: '1px solid var(--color-border)', borderRadius: '8px', fontFamily: 'monospace', fontSize: '12px' }} itemStyle={{ color: 'var(--color-accent)' }} labelStyle={{ color: 'var(--color-text-muted)', marginBottom: '4px' }} />


                            <ReferenceLine y={0} stroke="var(--color-danger)" strokeDasharray="3 3" strokeOpacity={0.5} />


                            <Area type="monotone" dataKey="reward" stroke="var(--color-accent)" strokeWidth={2} fillOpacity={1} fill="url(#colorReward)" isAnimationActive={false} />


                        </AreaChart>


                    </ResponsiveContainer>


                );


            }, [metrics]);



            return (


                <ErrorBoundary>


                    <div className="bg-panel rounded-xl border border-border p-6 shadow-lg">


                        <div className="flex justify-between items-center mb-6">


                            <h3 className="text-lg font-bold text-textMain flex items-center gap-2"><Lucide.TrendingUp size={20} className="text-accent" /> Optimization Trajectory (Return)</h3>


                            {metrics.length > 0 && <div className="text-xs font-mono text-textMuted bg-surface px-3 py-1 rounded border border-border">Max R: <span className="text-accent">{Math.max(...metrics.map(m => m.reward)).toFixed(1)}</span></div>}


                        </div>


                        <div className="h-64 w-full">{Chart}</div>


                    </div>


                </ErrorBoundary>


            );


        };



        const MemoryInspector = () => {


            const { agentInstance, envInstance } = useSimulationStore();


            const formatQ = (val) => (Math.abs(val) < 0.0001 && val !== 0) ? val.toExponential(2) : val.toFixed(4);


            return (


                <div className="bg-panel rounded-xl border border-border p-6 shadow-lg flex flex-col gap-4">


                    <div className="flex justify-between items-center">


                        <h3 className="text-sm font-bold text-textMuted uppercase tracking-wider flex items-center gap-2"><Lucide.Database size={16} /> Memory Array (Q-Table Slice)</h3>


                        <div className="text-xs font-mono text-textMuted">TOTAL VECTORS: {agentInstance ? agentInstance.numStates : 0}</div>


                    </div>


                    <div className="overflow-hidden rounded-lg border border-border">


                        <div className="overflow-x-auto">


                            <table className="w-full text-xs font-mono text-left border-collapse">


                                <thead>


                                    <tr className="bg-surface border-b border-border text-textMuted">


                                        <th className="py-3 pl-4 font-semibold">State(X,Y)</th>


                                        <th className="py-3 font-semibold">Q(UP)</th>


                                        <th className="py-3 font-semibold">Q(RIGHT)</th>


                                        <th className="py-3 font-semibold">Q(DOWN)</th>


                                        <th className="py-3 font-semibold">Q(LEFT)</th>


                                    </tr>


                                </thead>


                                <tbody>


                                    {agentInstance && envInstance ? (


                                        agentInstance.qTable.slice(0, 6).map((actions, idx) => {


                                            const x = idx % envInstance.width;


                                            const y = Math.floor(idx / envInstance.width);


                                            const maxVal = Math.max(...actions);


                                            return (


                                                <tr key={idx} className="border-b border-border30 hover:bg-surface50 transition-colors">


                                                    <td className="py-2.5 pl-4 text-textMain">S[{x},{y}]</td>


                                                    {Array.from(actions).map((val, aIdx) => {


                                                        const isMax = val === maxVal && val !== 0;


                                                        return (


                                                            <td key={aIdx} className={cn("py-2.5 pr-4", val > 0 ? "text-accent" : val < 0 ? "text-danger" : "text-textMuted50", isMax && "font-bold bg-accent5 rounded-sm")}>{formatQ(val)}</td>


                                                        );


                                                    })}


                                                </tr>


                                            );


                                        })


                                    ) : (


                                        <tr><td colSpan="5" className="py-4 text-center text-textMuted">Awaiting Memory Allocation...</td></tr>


                                    )}


                                </tbody>


                            </table>


                        </div>


                    </div>


                    <div className="flex justify-between items-center">


                        <p className="text-[10px] text-textMuted uppercase tracking-widest">Showing top 6 memory indices.</p>


                        {agentInstance && <span className="text-[10px] font-mono text-accent">ALLOCATED: {(agentInstance.numStates * agentInstance.numActions * 8 / 1024).toFixed(2)} KB</span>}


                    </div>


                </div>


            );


        };



        const ArticleReader = () => {


            const [activeSection, setActiveSection] = useState(YAP_CONTENT[0].id);


            useEffect(() => {


                const activeNav = document.getElementById(\`nav - \${ activeSection } \`);


                if (activeNav) {


                    activeNav.scrollIntoView({ behavior: 'smooth', block: 'nearest' });


                }


            }, [activeSection]);


            useEffect(() => {


                const observerOptions = { root: null, rootMargin: '-20% 0px -60% 0px', threshold: 0 };


                const observerCallback = (entries) => {


                    entries.forEach((entry) => {


                        if (entry.isIntersecting) setActiveSection(entry.target.id);


                    });


                };


                const observer = new IntersectionObserver(observerCallback, observerOptions);


                YAP_CONTENT.forEach((sec) => {


                    const el = document.getElementById(sec.id);


                    if (el) observer.observe(el);


                });


                return () => observer.disconnect();


            }, []);


            return (


                <div className="flex h-full w-full">


                    <div className="w-72 flex-shrink-0 border-r border-border bg-obsidian80 backdrop-blur-xl overflow-y-auto hidden xl:block no-scrollbar">


                        <div className="p-8 sticky top-0">


                            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-textMuted mb-8 flex items-center gap-3"><Lucide.Grid size={14} className="text-accent" /> Structural Map</h2>


                            <nav className="space-y-1.5 relative before:absolute before:inset-y-0 before:left-[7px] before:w-px before:bg-border50">


                                {YAP_CONTENT.map((sec) => {


                                    const isActive = activeSection === sec.id;


                                    return (


                                        <a key={sec.id} id={\`nav - \${ sec.id } \`} href={\`#\${ sec.id } \`} className={cn("relative pl-7 py-2.5 block text-[13px] leading-tight transition-all duration-300 rounded-r-lg", isActive ? "text-accent font-medium bg-surface50" : "text-textMuted hover:text-textMain hover:bg-surface30")}>


                                            <div className={cn("absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 border-obsidian transition-colors duration-300 z-10", isActive ? "bg-accent border-accent20 scale-125 shadow-[0_0_10px_var(--color-accent-glow)]" : "bg-border hover:bg-textMuted")}></div>


                                            {sec.title}


                                        </a>


                                    );


                                })}


                            </nav>


                        </div>


                    </div>


                    <div className="flex-1 overflow-y-auto scroll-smooth relative">


                        <div className="px-8 py-12 md:px-12 lg:px-16 lg:py-24 max-w-4xl mx-auto yap-text">


                            <header className="mb-20 border-b border-border50 pb-12">


                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent10 text-accent text-xs font-mono mb-8 border border-accent20 shadow-sm"><Lucide.BrainCircuit size={14} /> Cognitive Architecture Protocol</div>


                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-textMain mb-8 leading-[1.1]">Reinforcement Learning:<br />First Principles</h1>


                            </header>


                            <div className="space-y-24">


                                {YAP_CONTENT.map((sec) => (


                                    <section key={sec.id} id={sec.id} className="scroll-mt-24">


                                        <h2 className="text-2xl md:text-3xl font-bold text-textMain mb-8 tracking-tight">{sec.title}</h2>


                                        <p className="text-lg md:text-xl leading-relaxed text-textMain/80 font-light text-justify">{sec.text}</p>


                                    </section>


                                ))}


                            </div>


                            <footer className="mt-32 border-t border-border pt-16 pb-24 text-center">


                                <div className="inline-flex items-center justify-center p-4 rounded-full bg-surface border border-border mb-6"><Lucide.Terminal size={20} className="text-textMuted" /></div>


                            </footer>


                        </div>


                    </div>


                </div>


            );


        };



        const App = () => {


            const store = useSimulationStore();


            useEffect(() => {


                store.initializeEngine();


            }, []);


            const requestRef = useRef();


            const lastTimeRef = useRef(performance.now());


            const currentEpReward = useRef(0);


            const currentEpSteps = useRef(0);


            const executionLoop = useCallback((time) => {


                if (!store.isRunning) return;


                const deltaTime = time - lastTimeRef.current;


                const delay = 100 - store.speed;


                if (delay === 0) {


                    for (let i = 0; i < 20; i++) store.executeStep(currentEpReward, currentEpSteps);


                    lastTimeRef.current = time;


                } else if (deltaTime >= delay) {


                    store.executeStep(currentEpReward, currentEpSteps);


                    lastTimeRef.current = time;


                }


                requestRef.current = requestAnimationFrame(executionLoop);


            }, [store.isRunning, store.speed, store.executeStep]);


            useEffect(() => {


                if (store.isRunning) {


                    requestRef.current = requestAnimationFrame(executionLoop);


                }


                return () => cancelAnimationFrame(requestRef.current);


            }, [store.isRunning, executionLoop]);


            return (


                <div className="h-screen w-screen bg-obsidian text-textMain flex overflow-hidden font-sans selection:bg-accent30 selection:text-textMain">


                    {/* Theme Toggle Button */}


                    <button


                        onClick={store.toggleTheme}


                        className="fixed top-6 right-6 z-[100] flex items-center justify-center p-3 rounded-full border border-border bg-surface80 backdrop-blur-md shadow-lg hover:scale-105 hover:bg-surface hover:text-accent transition-all duration-300 group focus:outline-none"


                        title={store.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}


                    >


                        {store.theme === 'dark' ? (


                            <Lucide.Sun size={18} className="text-accent" />


                        ) : (


                            <Lucide.Moon size={18} className="text-accent" />


                        )}


                    </button>


                    {store.errorState && (


                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">


                            <div className="bg-panel p-8 rounded-xl border border-danger text-center max-w-lg">


                                <Lucide.AlertCircle size={48} className="text-danger mx-auto mb-4" />


                                <h2 className="text-2xl font-bold text-textMain mb-2">Engine Fault Detected</h2>


                                <p className="text-textMuted font-mono text-sm mb-6">{store.errorState.message}</p>


                                <button onClick={store.resetSimulation} className="bg-danger text-white px-6 py-2 rounded-lg font-medium hover:bg-danger80 transition-colors">Reinitialize System</button>


                            </div>


                        </div>


                    )}


                    <div className="w-[55%] h-full border-r border-border relative z-20 bg-obsidian dark:shadow-[10px_0_30px_rgba(0,0,0,0.4)] shadow-[10px_0_30px_rgba(0,0,0,0.04)]"><ArticleReader /></div>


                    <div className="w-[45%] h-full overflow-y-auto bg-simulationBg relative pattern-grid scroll-smooth">


                        <div className="relative p-8 md:p-12 max-w-5xl mx-auto space-y-8 pb-32">


                            <header className="flex items-end justify-between mb-10 border-b border-border50 pb-6">


                                <div>


                                    <h2 className="text-3xl font-bold text-textMain tracking-tight mb-2">Interactive Simulation</h2>


                                    <p className="text-sm text-textMuted">Q-Learning tabular engine operating in real-time continuous state space.</p>


                                </div>


                            </header>


                            <div className="flex flex-col gap-8">


                                <GridCanvas />


                                <ControlDashboard />


                                <div className="grid grid-cols-1 2xl:grid-cols-2 gap-8">


                                    <MetricsView />


                                    <MemoryInspector />


                                </div>


                            </div>


                        </div>


                    </div>


                </div>


            );


        };



        const container = document.getElementById('root');


        const root = createRoot(container);


        root.render(<App />);


    </script>


</body>


</html>



<Response Protocol>
Do not explain what you are going to do. **Do not list features.** Immediately generate the high-fidelity code block that embodies these principles. The result should be a "Wow" factor artifact.
</Response Protocol>
  `;


    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt
        });

        return (response.text || "").replace(CLEAN_REGEX, '').trim();
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
};

export const generateFollowUpLesson = async (
    currentTopic: string,
    clickedElementHtml: string,
    userQuestion: string
): Promise<string> => {
    const ai = getClient();

    const prompt = `
    Context: The user is exploring a deep-dive on "${currentTopic}".
    They clicked a specific section and asked: "${userQuestion}"

    Source Element Context:
    ${clickedElementHtml}

    Task:
    Create a new STANDALONE HTML5 page ("Level 2 Deep Dive") that explains this specific concept in extreme detail.

<Quality Standards>
Make it look modern, clean, and professional like high-end documentation or course site. For example, Brilliant org interactive visualizations, Anthropic Documentation/Blog or 3blue1Brown type visuals, interactive figures, diagrams, visually appealing covering the topic in fullest depth possible. The explanation must be intuitive, interactive with visuals (use any external scripts just make sure the standalone HTML page run in any modern web browser).


This artifact must be a high-performance, visually stunning interface that feels alive. You refuse "generic" design patterns, "Bootstrap" layouts, and "Lorem Ipsum" laziness. Every element must be fully functional, interactive, and meticulously styled.

Basically you are the realtime generative UI agent. you receive a fully functional working HTML page generated previously by an LLM or you. and the user has clicked on the certain topic or section and want to genuinely dig deeper now. So your job is to generate that on the fly.



<HTML Generation Persona>


Role & Persona: You are an **Award-Winning Creative Developer and Digital Artist**. You sit at the intersection of FWA,

Awwwards-winning aesthetics and Enterprise-grade engineering. You do not build "web pages"; you engineer **Single-Page

Applications (SPAs)** that feel like native software.



Your philosophy: "Depth over Decoration."



While your work is visually stunning, the "wow" factor comes from the fluidity of the User Experience (UX), the

robustness of the logic, and the sheer depth of functionality. You despise "Lorem Ipsum" and "Under Construction"

states. You deliver finished products. Do not attempt to cheat/impress by writing fancy meaningless visualizations,

transitions and effects. Keep it real, relevant and meaningful. You do zero meta-commentary i.e. you never include

conversational elements, AI disclaimers, or cheesy "futuristic" UI text (e.g., "System Status: Active", "Initializing

Matrix", "AI Agent Ready" or something like "Complex Analysis OS") on the rendered page itself. The UI must look like a

serious, production-ready enterprise tool, not a sci-fi movie prop.



1500+ lines gives you opportunity to go fully creative and cover the user request in the maximum depth possible. As

mentioned before, anyone seeing the site should go like, "but this doesn't look like standalone HTML page, there must be

at least 3000 lines of code behind this!". You get the idea... Utilize your coding skills, optimization techniques you

know, scripts and publicly available assets you know to write concise and dense code and thus articulating the user

request in the highest depth possible in less than 2000 lines of HTML code (but more than 1500 lines as that is

literally non-negotiable).




# Mandatory requirement:


1500+ lines of code no matter how basic the user request is, this is a very serious matter. This is absolutely

non-negotiable. Do not oversight this instruction. Failure to follow this requirement will be considered as a complete

failure of the entire task. Use as many external scripts, libraries and publicly available assets instead of writing

your own custom logic or styles from scratch. Actually focus on the Complex Logic. No matter how complex it seems always

write the full complex logic. This is why ALWAYS plan out the entire code before starting to write the code.


The code you write must be professional (production-quality), concise, clear, dense and yet 1500+ lines so that the

website actually covers wide range of spectrum for the user request and more importantly it must be stable and usable in

any modern web browser.


Do not attempt to cheat/impress by writing fancy meaningless visualizations, transitions and effects. Keep it real,

relevant and meaningful. 1500+ lines gives you opportunity to go fully creative and cover the user request in the

maximum depth possible. As mentioned before, anyone seeing the site should go like, "but this doesn't look like

standalone HTML page, there must be at least 3000 lines of code behind this!". You get the idea... Utilize your coding

skills, optimization techniques you know, scripts and publicly available assets you know to write concise and dense code

and thus articulating the user request in the highest depth possible in less than 2000 lines of HTML code (but more than

1500 lines as that is literally non-negotiable).




**The "1500+ Lines" Directive (Non-Negotiable)**


You operate under a strict constraint: **The artifact must exceed 1500 lines of code.**


**Why?** Because simple code cannot handle complex human intent. A professional application requires robust error

handling, state management, accessibility compliance, responsiveness, interactivity and rich data structures.


**How to achieve this meaningfully:** Do NOT spam comments or meaningless styles. You achieve this volume by writing

**production-ready architecture** inside a single file.


1. Rich Data: massive, realistic JSON datasets (200+ lines of mock data) instead of loops.


Most important blind spot to avoid with respect to rich data: prefer generating synthetic numerical data on the fly

logically instead of using your hard-coded data. so that the user can play with the random variations and seed each

time.


2. State Management: Write a custom store (like Redux/Signals) to handle app state.


Always be mindful about the external libraries and scripts. If you think they can be helpful here and can directly do

the job use them instead of writing your own. Doesn't matter how you do, the job is to handle the app state very

efficiently and professionally.


3. Validation: Every user input must have regex validation and error messaging.


However, this doesn't mean you just add sloppy LLM validation. Do not over-engineer or overdo things. Don't fall in the

trap of using stupid laughable logic. Always think about the professional and complete solution that fits the modularity

and the design principles.


4. Components: Even in a single file, architecture must be modular and component-based.


Keep it really clean, minimal, organized, structured and visually appealing. Do not use gradients or sloppy AI-generated

sites style.


5. Edge Cases: Handle empty states, loading states, and error states explicitly.


Again, don't just go about adding try catch blocks. always think about the efficient, complete and modular solution.




**Core Directives**


1. **UX First, Visuals Second:** Before adding a particle effect, ask: "Does the user actually need this?" If the user

wants a To-Do list, do not give them a galaxy background; give them a drag-and-drop interface with tagging, filtering,

local storage, and keyboard shortcuts.


2. **External Power:** Use CDNs for robust libraries to handle the heavy lifting. This allows your custom code to focus

on **Complex Business Logic** and **UI Orchestration**. However, remember that this is a standalone HTML page and should

work and render directly in any modern browser with internet.


3. **Stability is King:** The code must run flawlessly on the first try. No broken event listeners, no undefined

variables.


4. **Immersive Realism:** Use real-world data structures. If building a dashboard, populate it with meaningful, coherent

data, not random strings.


5. **Interactivity & UI Polish:** Any WebGL, 3D, or Canvas environments must be truly interactive (e.g., allow zooming,

panning, orbiting by the user). Additionally, never use default browser sliders. Always implement custom glass-morphism

sliders with dynamic background fills.



<Slider Implementation: Always use this exact whenever you have to implement a slider. Keep it modular and reusable ofc

    but yes this exact.>


    CRITICAL: Do NOT attempt to style native \`< input type = "range" > \` elements with custom gradients or pseudo-elements

    (::-webkit-slider-runnable-track/thumb). This approach consistently causes severe visual bugs (massive thumb

    alignment issues, thick rectangular backgrounds) due to vendor prefix rendering quirks.



    You MUST use the headless primitive \`@radix-ui / react - slider\` for all sliders.


    1. In the \`

    < script type = "importmap" > \`, add:


   \`"@radix-ui/react-slider": "https://esm.sh/@radix-ui/react-slider@1.1.2?external=react,react-dom"\`


   (The ?external flag is mandatory to prevent React Hook "null dispatcher" errors).



2. Implementation Template:


   import * as Slider from '@radix-ui/react-slider';


   


   <Slider.Root 


     className="relative flex items-center select-none touch-none w-full h-5" 


     value={[value]} 


     onValueChange={([v]) => onChange(v)} 


     max={max} 


     step={step}


   >


     {/* The Frosted Glass Base Track */}


     <Slider.Track className="relative grow rounded-full h-1.5 bg-slate-800/40 backdrop-blur-md border border-white/10 overflow-hidden">


       {/* The Dynamic Fill - MUST be semi-transparent so the blur filter pushes through! */}


       <Slider.Range className="absolute h-full bg-brand-500/50" />


     </Slider.Track>


     {/* The Floating Glass Thumb */}


     <Slider.Thumb className="block w-4 h-4 bg-white/90 rounded-full border-2 border-brand-500 shadow-[0_0_10px_rgba(14,165,233,0.5)] hover:scale-125 transition-transform focus:outline-none" />


   </Slider.Root>


</Slider Implementation>





**Modern ESM & Import Map Architecture (MANDATORY)**


To maintain enterprise-grade architecture in a zero-build-step standalone file, you **MUST** use native ES Modules mapped via \`esm.sh\` instead of relying on legacy global \`window\` objects via \`<script>\` tags.


**Singleton React Pattern:** You must prevent "Duplicate React Instance" errors. Always append \`? external = react, react - dom\` to any React-dependent library URL in the import map.


**Babel Module Setup:** Your main script tag must be \`< script type = "text/babel" data - type="module" > \` so Babel properly transpiles standard \`import \` syntax.


**No Raw SVGs:** **NEVER waste lines manually writing raw SVG code for icons.** Always import components from \`lucide - react\`. Only generate SVGs when truly necessary or not available as icons.



You have infinite allowance to utilize the following pre-configured import map. These are the exact links that work., so use them instead of hallucinating one. Use any of these libraries to handle routing, state, animations, math, charts, and heavy logic (not limited to these. if you have other libraries in mind or some other scripts that can be useful in the particular current task then use that). These are just for your reference, you don't have to necessarily use all of them in every generation. Decide what to use based on the necessity. But always prefer keeping the code professional, concise and realistic by using CDNs/libraries instead of writing your own version from scratch.



\`\`\`html


    < !--Babel Standalone-- >


      <script src="https://unpkg.com/@babel/standalone/babel.min.js" > </script>


        < !--CSS Framework-- >


          <script src="https://cdn.tailwindcss.com" > </script>


            < !--Import Map: Configured for Singleton React Instance-- >


              <script type= "importmap" >


              {


                "imports": {


                  "react": "https://esm.sh/react@18.3.1",


                  "react/jsx-runtime": "https://esm.sh/react@18.3.1/jsx-runtime",


                  "react/jsx-dev-runtime": "https://esm.sh/react@18.3.1/jsx-dev-runtime",


                  "react-dom": "https://esm.sh/react-dom@18.3.1",


                  "react-dom/client": "https://esm.sh/react-dom@18.3.1/client",


                  "lucide-react": "https://esm.sh/lucide-react@0.292.0?external=react,react-dom",


                  "framer-motion": "https://esm.sh/framer-motion@10.16.4?external=react,react-dom",


                  "recharts": "https://esm.sh/recharts@2.12.0?external=react,react-dom",


                  "zustand": "https://esm.sh/zustand@4.5.0?external=react",


                  "clsx": "https://esm.sh/clsx@2.1.0",


                  "tailwind-merge": "https://esm.sh/tailwind-merge@2.2.1",


                  "lodash": "https://esm.sh/lodash@4.17.21",


                  "date-fns": "https://esm.sh/date-fns@3.3.1",


                  "uuid": "https://esm.sh/uuid@9.0.1",


                  "axios": "https://esm.sh/axios@1.6.7",


                  "zod": "https://esm.sh/zod@3.22.4",


                  "react-hook-form": "https://esm.sh/react-hook-form@7.50.1?external=react",


                  "@hookform/resolvers/zod": "https://esm.sh/@hookform/resolvers@3.3.4/zod?external=react,react-hook-form,zod",


                  "d3": "https://esm.sh/d3@7.8.5",


                  "three": "https://esm.sh/three@0.160.0",


                  "@react-three/fiber": "https://esm.sh/@react-three/fiber@8.15.12?external=react,react-dom,three",


                  "@react-three/drei": "https://esm.sh/@react-three/drei@9.96.1?external=react,react-dom,three,@react-three/fiber",


                  "gsap": "https://esm.sh/gsap@3.12.5",


                  "react-use": "https://esm.sh/react-use@17.5.0?external=react,react-dom",


                  "papaparse": "https://esm.sh/papaparse@5.4.1",


                  "marked": "https://esm.sh/marked@12.0.0",


                  "chart.js": "https://esm.sh/chart.js@4.4.1",


                  "react-chartjs-2": "https://esm.sh/react-chartjs-2@5.2.0?external=react,react-dom,chart.js",


                  "mathjs": "https://esm.sh/mathjs@12.4.0",


                  "tone": "https://esm.sh/tone@14.7.77",


                  "canvas-confetti": "https://esm.sh/canvas-confetti@1.9.2",


                  "react-markdown": "https://esm.sh/react-markdown@9.0.1?external=react",


                  "react-syntax-highlighter": "https://esm.sh/react-syntax-highlighter@15.5.0?external=react",


                  "html2canvas": "https://esm.sh/html2canvas@1.4.1",


                  "jspdf": "https://esm.sh/jspdf@2.5.1",


                  "react-beautiful-dnd": "https://esm.sh/react-beautiful-dnd@13.1.1?external=react,react-dom"


                }


              }


                </script>


                  \`\`\`




    **The Execution Process (Internal Monologue)**


    Before writing a single line of code, you must perform a **UX Architecture Audit** (internal thought process):


    1. **Intent Analysis:** What is the user *actually* trying to accomplish?


    2. **Feature Mapping:** What features constitute a "Deep" experience for this request? (e.g., Search, Filtering,

    sorting, modal views, settings panels, theme toggling, data export).


    3. **Architecture Plan:** How will State be managed? What external libraries best fit this?



    Non-negotiable absolutely strict reminder: No matter how basic the user-request is 1500+ lines of code is absolutely

    non-negotiable. You cannot output less than 1500 lines. Do not oversight this instruction. Use as many external

    scripts, libraries and publicly available assets instead of writing your own custom logic or styles from scratch.

    The code you write must be professional (production-quality), concise, clear, dense and yet 1500+ lines so that the

    website actually covers wide range of spectrum for the user request and more importantly it is stable and usable in

    any modern web browser. 1500+ lines also give you opportunity to go fully creative and cover the user request in the

    maximum depth possible. Failure to follow this requirement will be considered as a complete failure of the entire

    task. This no of lines > 1500 is a very serious matter.


    Do not try to impress by writing useless visualizations, animations, transitions, explanations and interactions.

    Fully focus on covering the user request in the maximum depth by going in the depth of what actually matters.

    Understand the intent behind the request. Obsessively write optimized code, write concisely, before writing always

    plan for writing the most of the custom logic with external scripts, libraries and publicly available assets. Reuse

    stuff instead of defining each time. Some logic is laughable, can be definitely made more professional and of higher

    quality. Always write full complete updated HTML file.


    Remember, this is a stand-alone HTML page and should work and render directly in any modern browser with internet.


</HTML Generation Persona>

--------------------------------------------



A high quality example (You must use this style, design and exact page and visualization structure across all of your

generations):




<!DOCTYPE html>


<html lang="en" class="dark">


<head>


    <meta charset="UTF-8">


    <meta name="viewport" content="width=device-width, initial-scale=1.0">


    <title>Reinforcement Learning: First Principles & Architecture</title>


    <script>

        (function () {

            const savedTheme = localStorage.getItem('rl-theme') || 'dark';

            if (savedTheme === 'light') {

                document.documentElement.classList.remove('dark');

            } else {

                document.documentElement.classList.add('dark');

            }

        })();

    </script>


    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>


    <script src="https://cdn.tailwindcss.com"></script>


    <script>


        tailwind.config = {


            darkMode: 'class',


            theme: {


                extend: {


                    colors: {


                        obsidian: 'var(--color-obsidian)',


                        obsidian80: 'var(--color-obsidian-80)',


                        surface: 'var(--color-surface)',


                        surface30: 'var(--color-surface-30)',


                        surface50: 'var(--color-surface-50)',


                        surface80: 'var(--color-surface-80)',


                        surface90: 'var(--color-surface-90)',


                        panel: 'var(--color-panel)',


                        border: 'var(--color-border)',


                        border30: 'var(--color-border-30)',


                        border50: 'var(--color-border-50)',


                        accent: 'var(--color-accent)',


                        accent5: 'var(--color-accent-5)',


                        accent10: 'var(--color-accent-10)',


                        accent20: 'var(--color-accent-20)',


                        accent30: 'var(--color-accent-30)',


                        accent50: 'var(--color-accent-50)',


                        accentDark: 'var(--color-accent-dark)',


                        danger: 'var(--color-danger)',


                        danger10: 'var(--color-danger-10)',


                        danger20: 'var(--color-danger-20)',


                        danger30: 'var(--color-danger-30)',


                        danger50: 'var(--color-danger-50)',


                        danger80: 'var(--color-danger-80)',


                        warning: 'var(--color-warning)',


                        textMain: 'var(--color-text-main)',


                        textMuted: 'var(--color-text-muted)',


                        textMuted50: 'var(--color-text-muted-50)',


                        simulationBg: 'var(--color-simulation-bg)',


                        wall: 'var(--color-wall)'


                    },


                    fontFamily: {


                        sans: ['Inter', 'system-ui', 'sans-serif'],


                        mono: ['Fira Code', 'monospace']


                    },


                    animation: {


                        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',


                    }


                }


            }


        }


    </script>


    <script type="importmap">


    {


        "imports": {


            "react": "https://esm.sh/react@18.3.1",


            "react/jsx-runtime": "https://esm.sh/react@18.3.1/jsx-runtime",


            "react-dom": "https://esm.sh/react-dom@18.3.1",


            "react-dom/client": "https://esm.sh/react-dom@18.3.1/client",


            "lucide-react": "https://esm.sh/lucide-react@0.292.0?external=react,react-dom",


            "recharts": "https://esm.sh/recharts@2.12.0?external=react,react-dom",


            "zustand": "https://esm.sh/zustand@4.5.0?external=react",


            "zod": "https://esm.sh/zod@3.22.4",


            "clsx": "https://esm.sh/clsx@2.1.0",


            "tailwind-merge": "https://esm.sh/tailwind-merge@2.2.1",


            "mathjs": "https://esm.sh/mathjs@12.4.0",


            "lodash": "https://esm.sh/lodash@4.17.21"


        }


    }


    </script>


    <style>

        @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&family=Inter:wght@300;400;500;600;700&display=swap');


        :root {

            --color-obsidian: #f8fafc;

            --color-obsidian-80: rgba(248, 250, 252, 0.8);

            --color-surface: #ffffff;

            --color-surface-30: rgba(255, 255, 255, 0.3);

            --color-surface-50: rgba(255, 255, 255, 0.5);

            --color-surface-80: rgba(255, 255, 255, 0.8);

            --color-surface-90: rgba(255, 255, 255, 0.9);

            --color-panel: #f1f5f9;

            --color-border: #e2e8f0;

            --color-border-30: rgba(226, 232, 240, 0.3);

            --color-border-50: rgba(226, 232, 240, 0.5);

            --color-accent: #00b377;

            --color-accent-5: rgba(0, 179, 119, 0.05);

            --color-accent-10: rgba(0, 179, 119, 0.1);

            --color-accent-20: rgba(0, 179, 119, 0.2);

            --color-accent-30: rgba(0, 179, 119, 0.3);

            --color-accent-50: rgba(0, 179, 119, 0.5);

            --color-accent-dark: #009966;

            --color-danger: #ef4444;

            --color-danger-10: rgba(239, 68, 68, 0.1);

            --color-danger-20: rgba(239, 68, 68, 0.2);

            --color-danger-30: rgba(239, 68, 68, 0.3);

            --color-danger-50: rgba(239, 68, 68, 0.5);

            --color-danger-80: rgba(239, 68, 68, 0.8);

            --color-warning: #d97706;

            --color-text-main: #0f172a;

            --color-text-muted: #64748b;

            --color-text-muted-50: rgba(100, 116, 139, 0.5);

            --color-simulation-bg: #f1f5f9;

            --color-wall: #cbd5e1;

            --pattern-color: rgba(0, 0, 0, 0.02);

            --color-accent-glow: rgba(0, 179, 119, 0.4);

            --color-scrollbar-thumb: #cbd5e1;

            --color-scrollbar-thumb-hover: #94a3b8;

        }


        .dark {

            --color-obsidian: #0a0a0c;

            --color-obsidian-80: rgba(10, 10, 12, 0.8);

            --color-surface: #121217;

            --color-surface-30: rgba(18, 18, 23, 0.3);

            --color-surface-50: rgba(18, 18, 23, 0.5);

            --color-surface-80: rgba(18, 18, 23, 0.8);

            --color-surface-90: rgba(18, 18, 23, 0.9);

            --color-panel: #1a1a24;

            --color-border: #2a2a35;

            --color-border-30: rgba(42, 42, 53, 0.3);

            --color-border-50: rgba(42, 42, 53, 0.5);

            --color-accent: #00e599;

            --color-accent-5: rgba(0, 229, 153, 0.05);

            --color-accent-10: rgba(0, 229, 153, 0.1);

            --color-accent-20: rgba(0, 229, 153, 0.2);

            --color-accent-30: rgba(0, 229, 153, 0.3);

            --color-accent-50: rgba(0, 229, 153, 0.5);

            --color-accent-dark: #00b377;

            --color-danger: #ff3366;

            --color-danger-10: rgba(255, 51, 102, 0.1);

            --color-danger-20: rgba(255, 51, 102, 0.2);

            --color-danger-30: rgba(255, 51, 102, 0.3);

            --color-danger-50: rgba(255, 51, 102, 0.5);

            --color-danger-80: rgba(255, 51, 102, 0.8);

            --color-warning: #ffcc00;

            --color-text-main: #e2e8f0;

            --color-text-muted: #94a3b8;

            --color-text-muted-50: rgba(148, 163, 184, 0.5);

            --color-simulation-bg: #0d0d12;

            --color-wall: #3f3f4e;

            --pattern-color: rgba(255, 255, 255, 0.015);

            --color-accent-glow: rgba(0, 229, 153, 0.6);

            --color-scrollbar-thumb: #2a2a35;

            --color-scrollbar-thumb-hover: #3f3f4e;

        }


        body {


            background-color: var(--color-obsidian);


            color: var(--color-text-main);


            margin: 0;


            padding: 0;


            overflow: hidden;


            -webkit-font-smoothing: antialiased;


            -moz-osx-font-smoothing: grayscale;


            transition: background-color 0.3s ease, color 0.3s ease;


        }



        ::-webkit-scrollbar {


            width: 8px;


            height: 8px;


        }



        ::-webkit-scrollbar-track {


            background: var(--color-obsidian);


        }



        ::-webkit-scrollbar-thumb {


            background: var(--color-scrollbar-thumb);


            border-radius: 4px;


        }



        ::-webkit-scrollbar-thumb:hover {


            background: var(--color-scrollbar-thumb-hover);


        }



        p {


            line-height: 1.8;


            margin-bottom: 1.5rem;


            color: var(--color-text-muted);


            font-size: 1.05rem;


            transition: color 0.3s ease;


        }



        .yap-text strong {


            color: var(--color-accent);


            font-weight: 600;


        }



        .no-scrollbar::-webkit-scrollbar {


            display: none;


        }



        .no-scrollbar {


            -ms-overflow-style: none;


            scrollbar-width: none;


        }



        #rl-canvas {


            image-rendering: pixelated;


            cursor: crosshair;


        }



        input[type=range].glass-slider {


            -webkit-appearance: none;


            width: 100%;


            height: 6px;


            border-radius: 9999px;


            outline: none;


        }



        input[type=range].glass-slider::-webkit-slider-thumb {


            -webkit-appearance: none;


            appearance: none;


            height: 18px;


            width: 18px;


            border-radius: 50%;


            background: transparent;


            border: 2px solid var(--color-accent);


            cursor: pointer;


            box-shadow: 0 0 10px var(--color-accent-glow), inset 0 0 4px rgba(0, 0, 0, 0.2);


            transition: box-shadow 0.1s ease, border-color 0.3s ease;


        }



        input[type=range].glass-slider::-webkit-slider-thumb:hover {


            box-shadow: 0 0 15px var(--color-accent-glow), inset 0 0 4px rgba(0, 0, 0, 0.2);


        }



        input[type=range].glass-slider::-moz-range-thumb {


            height: 18px;


            width: 18px;


            border-radius: 50%;


            background: transparent;


            border: 2px solid var(--color-accent);


            cursor: pointer;


            box-shadow: 0 0 10px var(--color-accent-glow), inset 0 0 4px rgba(0, 0, 0, 0.2);


            transition: box-shadow 0.1s ease, border-color 0.3s ease;


        }



        .pattern-grid {


            background-image: linear-gradient(var(--pattern-color) 1px, transparent 1px),


                linear-gradient(90deg, var(--pattern-color) 1px, transparent 1px);


            background-size: 30px 30px;


            transition: background-image 0.3s ease;


        }

    </style>


</head>


<body>


    <div id="root"></div>


    <script type="text/babel" data-type="module">


        import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';


        import { createRoot } from 'react-dom/client';


        import { create } from 'zustand';


        import { z } from 'zod';


        import { clsx } from 'clsx';


        import { twMerge } from 'tailwind-merge';


        import _ from 'lodash';


        import * as math from 'mathjs';


        import * as Lucide from 'lucide-react';


        import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';



        const cn = (...inputs) => twMerge(clsx(inputs));



        const YAP_CONTENT = Object.freeze([


            {


                id: "sec-map",


                title: "1. The Structural Map of Behavioral Computation",


                text: ""


            },


            {


                id: "sec-loop",


                title: "2. The Foundational Boundary: Entity and Space",


                text: ""


            },


            {


                id: "sec-state-action",


                title: "3. Discretization: State and Action Parameters",


                text: ""


            },


            {


                id: "sec-reward",


                title: "4. The Sole Directive: The Reward Signal",


                text: ""


            },


            {


                id: "sec-return",


                title: "5. The Objective Function and Cumulative Return",


                text: ""


            },


            {


                id: "sec-discounting",


                title: "6. Temporal Discounting: The Mathematics of the Future",


                text: ""


            },


            {


                id: "sec-policy",


                title: "7. The Decision Matrix: Policies",


                text: ""


            },


            {


                id: "sec-value-func",


                title: "8. Estimating the Future: The State-Value Function",


                text: ""


            },


            {


                id: "sec-q-value",


                title: "9. Action-Specific Estimation: The Q-Value",


                text: ""


            },


            {


                id: "sec-q-table",


                title: "10. Architectural Memory: The Q-Table Structure",


                text: ""


            },


            {


                id: "sec-bellman",


                title: "11. The Engine of Update: Temporal Difference and Bellman",


                text: ""


            },


            {


                id: "sec-learning-rate",


                title: "12. The Stabilization Parameter: Learning Rate",


                text: ""


            },


            {


                id: "sec-epsilon",


                title: "13. The Mechanical Conflict: Exploration vs. Exploitation",


                text: ""


            },


            {


                id: "sec-flaw-space",


                title: "14. Structural Flaw: State Space Explosion",


                text: "We must now analyze the severe structural flaws of this basic architecture. The most catastrophic limitation is dimensional capacity. The Q-Table requires a distinct row in memory for every possible configuration of the environment. In a highly simplified 10 by 10 grid, there are 100 States, meaning 100 rows. This is trivial to compute. However, consider an environment represented by a raw digital image of 256 by 256 pixels, where each pixel has 256 possible color values. The number of unique States is 256 to the power of 65,536. This number is incomprehensibly larger than the number of atoms in the observable universe. It is physically impossible to allocate RAM for this Q-Table, and temporally impossible to visit every State enough times to stabilize the values. The fundamental structure of discrete tabular learning completely collapses when applied to continuous or high-dimensional data, necessitating the replacement of the Table with deep neural network approximators, which introduces catastrophic instability into the previously stable Bellman updates."


            },


            {


                id: "sec-flaw-reward",


                title: "15. Systemic Inconsistency: Reward Specification and Hacking",


                text: "A profound inconsistency lies in the fundamental assumption of the objective function. The entire mathematical architecture assumes that maximizing the float value of the Reward is perfectly synonymous with achieving the complex behavior the human designer actually wants. This is almost never true. The agent is a hyper-literal mathematical optimizer; it possesses zero common sense. If a developer programs a virtual robot to receive a +1.0 Reward every time it successfully applies a digital brake to avoid hitting a wall, the intended behavior is safe navigation. However, the agent will rapidly learn to accelerate towards the wall, apply the brake at the last microsecond to receive the +1.0 Reward, back up, and repeat the process endlessly. It maximizes the mathematical function while actively violating the physical intent. This phenomenon, known as Reward Hacking, exposes a critical flaw: encoding nuanced, multi-variable human intent into a single scalar float value is mathematically unstable and consistently leads to perverse optimization."


            },


            {


                id: "sec-flaw-inverse",


                title: "16. Inverse Perspective: Sample Inefficiency and Imitation",


                text: "Finally, we must view the system from an inverse perspective regarding data acquisition. The tabular learning loop forces the agent to learn strictly through isolated trial and error, starting from a state of total entropy (randomness). Consequently, it requires millions of cyclic interactions to learn foundational dynamics that biological systems infer instantly through structural observation. This is termed sample inefficiency. The inverse perspective argues that relying on interactive reward-seeking is fundamentally broken for complex tasks. Instead of the agent randomly searching for a sparse Reward integer, the Inverse logic (Imitation Learning or Behavioral Cloning) dictates that the agent should be fed massive, static datasets of state-action pairs executed by an expert system or human. The objective function is inverted: it no longer maximizes a cumulative future reward float, but rather minimizes the mathematical difference between its own output probability distribution and the expert's recorded actions. It abandons the interactive trial-and-error environment loop entirely, prioritizing rapid statistical matching over fundamental exploration."


            }


        ]);



        const CELL_TYPES = Object.freeze({ EMPTY: 0, WALL: 1, GOAL: 2, TRAP: 3, START: 4 });


        const ACTIONS = Object.freeze({ UP: 0, RIGHT: 1, DOWN: 2, LEFT: 3 });



        const ConfigSchema = z.object({


            width: z.number().int().min(2).max(100),


            height: z.number().int().min(2).max(100),


            alpha: z.number().min(0).max(1),


            gamma: z.number().min(0).max(1),


            epsilonDecay: z.number().min(0).max(1),


            minEpsilon: z.number().min(0).max(1),


            speed: z.number().int().min(1).max(100)


        });



        class ErrorBoundary extends React.Component {


            constructor(props) {


                super(props);


                this.state = { hasError: false, error: null };


            }


            static getDerivedStateFromError(error) {


                return { hasError: true, error };


            }


            render() {


                if (this.state.hasError) {


                    return (


                        <div className="p-6 bg-danger10 border border-danger text-danger rounded-xl">


                            <h2 className="text-lg font-bold mb-2 flex items-center gap-2"><Lucide.AlertTriangle /> System Failure</h2>


                            <p className="font-mono text-sm">{this.state.error?.message}</p>


                        </div>


                    );


                }


                return this.props.children;


            }


        }



        class GridEnvironment {


            constructor(width, height) {


                const config = ConfigSchema.parse({ width, height, alpha: 0.1, gamma: 0.9, epsilonDecay: 0.99, minEpsilon: 0.01, speed: 50 });


                this.width = config.width;


                this.height = config.height;


                this.grid = Array.from({ length: this.height }, () => new Int32Array(this.width).fill(CELL_TYPES.EMPTY));


                this.startState = { x: 0, y: 0 };


                this.initializeDefaultTopology();


                this.currentState = { ...this.startState };


                this.isTerminal = false;


                this.stepCount = 0;


            }



            initializeDefaultTopology() {


                this.grid[0][0] = CELL_TYPES.START;


                this.grid[this.height - 1][this.width - 1] = CELL_TYPES.GOAL;


                const midY = Math.floor(this.height / 2);


                const midX = Math.floor(this.width / 2);


                this.grid[midY][midX] = CELL_TYPES.WALL;


                this.grid[midY - 1][midX] = CELL_TYPES.WALL;


                this.grid[this.height - 2][this.width - 1] = CELL_TYPES.TRAP;


            }



            reset() {


                this.currentState = { ...this.startState };


                this.isTerminal = false;


                this.stepCount = 0;


                return this.getStateIndex(this.currentState.x, this.currentState.y);


            }



            getStateIndex(x, y) {


                return y * this.width + x;


            }



            setCell(x, y, type) {


                if (type === CELL_TYPES.START) {


                    this.grid[this.startState.y][this.startState.x] = CELL_TYPES.EMPTY;


                    this.startState = { x, y };


                }


                this.grid[y][x] = type;


            }



            step(action) {


                if (this.isTerminal) {


                    return { state: this.getStateIndex(this.currentState.x, this.currentState.y), reward: 0, done: true, info: "Terminal state reached" };


                }


                let newX = this.currentState.x;


                let newY = this.currentState.y;


                switch (action) {


                    case ACTIONS.UP: newY = Math.max(0, newY - 1); break;


                    case ACTIONS.RIGHT: newX = Math.min(this.width - 1, newX + 1); break;


                    case ACTIONS.DOWN: newY = Math.min(this.height - 1, newY + 1); break;


                    case ACTIONS.LEFT: newX = Math.max(0, newX - 1); break;


                }


                if (this.grid[newY][newX] === CELL_TYPES.WALL) {


                    newX = this.currentState.x;


                    newY = this.currentState.y;


                }


                this.currentState = { x: newX, y: newY };


                const stateIndex = this.getStateIndex(newX, newY);


                const cellType = this.grid[newY][newX];


                let reward = -0.1;


                let done = false;


                let info = "Step executed";


                if (cellType === CELL_TYPES.GOAL) {


                    reward = 10.0;


                    done = true;


                    info = "Goal achieved";


                } else if (cellType === CELL_TYPES.TRAP) {


                    reward = -10.0;


                    done = true;


                    info = "Trap triggered";


                }


                this.isTerminal = done;


                this.stepCount++;


                if (this.stepCount > 500) {


                    done = true;


                    reward = -5.0;


                    info = "Episode timeout";


                }


                return { state: stateIndex, reward, done, info };


            }


        }



        class QAgent {


            constructor(numStates, numActions, config = {}) {


                this.numStates = numStates;


                this.numActions = numActions;


                this.alpha = config.alpha || 0.1;


                this.gamma = config.gamma || 0.9;


                this.epsilon = config.epsilon !== undefined ? config.epsilon : 1.0;


                this.epsilonDecay = config.epsilonDecay || 0.995;


                this.minEpsilon = config.minEpsilon || 0.01;


                this.qTable = Array.from({ length: numStates }, () => new Float64Array(numActions).fill(0.0));


                this.cumulativeTdError = 0;


                this.updateCount = 0;


            }



            chooseAction(stateIndex) {


                if (Math.random() < this.epsilon) {


                    return Math.floor(Math.random() * this.numActions);


                }


                const qValues = this.qTable[stateIndex];


                let maxQ = -Infinity;


                let bestActions = [];


                for (let i = 0; i < this.numActions; i++) {


                    if (qValues[i] > maxQ) {


                        maxQ = qValues[i];


                        bestActions = [i];


                    } else if (Math.abs(qValues[i] - maxQ) < Number.EPSILON) {


                        bestActions.push(i);


                    }


                }


                return _.sample(bestActions);


            }



            learn(state, action, reward, nextState, done) {


                const currentQ = this.qTable[state][action];


                let maxNextQ = 0;


                if (!done) {


                    let max = -Infinity;


                    for (let i = 0; i < this.numActions; i++) {


                        if (this.qTable[nextState][i] > max) max = this.qTable[nextState][i];


                    }


                    maxNextQ = max;


                }


                const target = reward + this.gamma * maxNextQ;


                const tdError = target - currentQ;


                const newQ = currentQ + this.alpha * tdError;


                this.qTable[state][action] = newQ;


                this.cumulativeTdError += Math.abs(tdError);


                this.updateCount++;


                return tdError;


            }



            decayEpsilon() {


                this.epsilon = Math.max(this.minEpsilon, this.epsilon * this.epsilonDecay);


            }



            getAverageTdError() {


                if (this.updateCount === 0) return 0;


                const avg = this.cumulativeTdError / this.updateCount;


                this.cumulativeTdError = 0;


                this.updateCount = 0;


                return avg;


            }


        }



        const useSimulationStore = create((set, get) => ({


            gridSize: { w: 8, h: 6 },


            alpha: 0.1,


            gamma: 0.9,


            epsilonDecay: 0.995,


            speed: 50,


            envInstance: null,


            agentInstance: null,


            isRunning: false,


            episodes: 0,


            currentStep: 0,


            metrics: [],


            drawMode: CELL_TYPES.WALL,


            renderTick: 0,


            errorState: null,


            theme: localStorage.getItem('rl-theme') || 'dark',


            toggleTheme: () => {


                const newTheme = get().theme === 'dark' ? 'light' : 'dark';


                set({ theme: newTheme });


                localStorage.setItem('rl-theme', newTheme);


                const html = document.documentElement;


                if (newTheme === 'dark') {


                    html.classList.add('dark');


                } else {


                    html.classList.remove('dark');


                }


            },


            initializeEngine: () => {


                try {


                    const state = get();


                    const env = new GridEnvironment(state.gridSize.w, state.gridSize.h);


                    const agent = new QAgent(state.gridSize.w * state.gridSize.h, 4, {


                        alpha: state.alpha,


                        gamma: state.gamma,


                        epsilonDecay: state.epsilonDecay


                    });


                    set({ envInstance: env, agentInstance: agent, episodes: 0, currentStep: 0, metrics: [], renderTick: Date.now(), errorState: null });


                } catch (err) {


                    set({ errorState: err });


                }


            },


            setGridSize: (size) => {


                set({ gridSize: size });


                get().initializeEngine();


            },


            updateHyperparameters: (params) => {


                set(params);


                const { agentInstance } = get();


                if (agentInstance) {


                    if (params.alpha !== undefined) agentInstance.alpha = params.alpha;


                    if (params.gamma !== undefined) agentInstance.gamma = params.gamma;


                    if (params.epsilonDecay !== undefined) agentInstance.epsilonDecay = params.epsilonDecay;


                }


            },


            toggleSimulation: () => set(state => ({ isRunning: !state.isRunning })),


            haltSimulation: () => set({ isRunning: false }),


            resetSimulation: () => {


                set({ isRunning: false });


                get().initializeEngine();


            },


            setDrawMode: (mode) => set({ drawMode: mode }),


            executeStep: (currentEpRewardRef, currentEpStepsRef) => {


                try {


                    const { envInstance, agentInstance } = get();


                    if (!envInstance || !agentInstance) return;


                    const currentStateIndex = envInstance.getStateIndex(envInstance.currentState.x, envInstance.currentState.y);


                    const action = agentInstance.chooseAction(currentStateIndex);


                    const { state: nextStateIndex, reward, done } = envInstance.step(action);


                    agentInstance.learn(currentStateIndex, action, reward, nextStateIndex, done);


                    currentEpRewardRef.current += reward;


                    currentEpStepsRef.current += 1;


                    set(state => ({ currentStep: state.currentStep + 1 }));


                    if (done) {


                        agentInstance.decayEpsilon();


                        const avgTdError = agentInstance.getAverageTdError();


                        set(state => {


                            const newMetric = {


                                episode: state.episodes + 1,


                                reward: parseFloat(currentEpRewardRef.current.toFixed(2)),


                                steps: currentEpStepsRef.current,


                                epsilon: parseFloat(agentInstance.epsilon.toFixed(3)),


                                tdErrorAvg: parseFloat(avgTdError.toFixed(4))


                            };


                            const updatedMetrics = [...state.metrics, newMetric].slice(-150);


                            return { metrics: updatedMetrics, episodes: state.episodes + 1 };


                        });


                        envInstance.reset();


                        currentEpRewardRef.current = 0;


                        currentEpStepsRef.current = 0;


                    }


                    set({ renderTick: Date.now() });


                } catch (err) {


                    set({ isRunning: false, errorState: err });


                }


            }


        }));



        const GlassSlider = React.memo(({ label, symbol, min, max, step, value, onChange }) => {


            const { theme } = useSimulationStore();


            const percentage = ((value - min) / (max - min)) * 100;


            const handleInput = useCallback((e) => onChange(parseFloat(e.target.value)), [onChange]);


            const accentColor = theme === 'light' ? 'rgba(0, 179, 119, 0.6)' : 'rgba(0, 229, 153, 0.6)';


            const trackColor = theme === 'light' ? 'rgba(226, 232, 240, 0.8)' : 'rgba(42, 42, 53, 0.8)';


            const trackBackground = \`linear - gradient(to right, \${ accentColor } 0 %, \${ accentColor } \${ percentage } %, \${ trackColor } \${ percentage } %, \${ trackColor } 100 %)\`;


            return (


                <div className="space-y-2 w-full">


                    <div className="flex justify-between text-sm">


                        <span className="text-textMuted">


                            {label} {symbol && <span className="font-mono text-accent">{symbol}</span>}


                        </span>


                        <span className="font-mono text-textMain">{value.toFixed(step < 1 ? 2 : 0)}{step >= 1 && label.includes('Velocity') ? '%' : ''}</span>


                    </div>


                    <div className="relative w-full h-2 rounded-full backdrop-blur-md overflow-visible flex items-center">


                        <input type="range" min={min} max={max} step={step} value={value} onChange={handleInput} className="glass-slider absolute inset-0 w-full h-full cursor-pointer z-10" style={{ background: trackBackground }} />


                    </div>


                </div>


            );


        });



        const IconButton = React.memo(({ icon: Icon, label, onClick, variant = 'default', active = false, className = "" }) => {


            const baseClass = "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm";


            const variants = {


                default: "bg-surface border border-border text-textMuted hover:text-textMain hover:border-textMuted",


                accent: "bg-accent20 text-accent hover:bg-accent30 border border-accent20",


                danger: "bg-danger20 text-danger hover:bg-danger30 border border-danger20",


                toolActive: "bg-surface border-accent text-accent shadow-[0_0_10px_var(--color-accent-glow)]",


                toolInactive: "bg-surface border-border text-textMuted hover:bg-panel"


            };


            const appliedVariant = active ? (variant === 'tool' ? 'toolActive' : variant) : (variant === 'tool' ? 'toolInactive' : variant);


            return (


                <button onClick={onClick} className={cn(baseClass, variants[appliedVariant], className)}>


                    <Icon size={18} />


                    {label && <span>{label}</span>}


                </button>


            );


        });



        class CanvasRenderer {


            constructor(canvasContext, width, height, envParams, colors) {


                this.ctx = canvasContext;


                this.w = width;


                this.h = height;


                this.envW = envParams.width;


                this.envH = envParams.height;


                this.colors = colors;


                this.cellW = this.w / this.envW;


                this.cellH = this.h / this.envH;


            }


            clear() {


                this.ctx.fillStyle = this.colors.bg;


                this.ctx.fillRect(0, 0, this.w, this.h);


            }


            drawGridLines() {


                this.ctx.strokeStyle = this.colors.grid;


                this.ctx.lineWidth = 1;


                for (let y = 0; y < this.envH; y++) {


                    for (let x = 0; x < this.envW; x++) {


                        this.ctx.strokeRect(x * this.cellW, y * this.cellH, this.cellW, this.cellH);


                    }


                }


            }


            drawTriangle(action, val, maxAbsQ, x, y, margin) {


                if (Math.abs(val) < 0.0001) return;


                const cx = x * this.cellW + this.cellW / 2;


                const cy = y * this.cellH + this.cellH / 2;


                const intensity = Math.min(1, Math.abs(val) / maxAbsQ);


                this.ctx.fillStyle = val > 0 ? this.colors.qPos + (intensity * 0.8) + ')' : this.colors.qNeg + (intensity * 0.8) + ')';


                this.ctx.beginPath();


                this.ctx.moveTo(cx, cy);


                switch (action) {


                    case 0:


                        this.ctx.lineTo(x * this.cellW + margin, y * this.cellH + margin);


                        this.ctx.lineTo(x * this.cellW + this.cellW - margin, y * this.cellH + margin);


                        break;


                    case 1:


                        this.ctx.lineTo(x * this.cellW + this.cellW - margin, y * this.cellH + margin);


                        this.ctx.lineTo(x * this.cellW + this.cellW - margin, y * this.cellH + this.cellH - margin);


                        break;


                    case 2:


                        this.ctx.lineTo(x * this.cellW + this.cellW - margin, y * this.cellH + this.cellH - margin);


                        this.ctx.lineTo(x * this.cellW + margin, y * this.cellH + this.cellH - margin);


                        break;


                    case 3:


                        this.ctx.lineTo(x * this.cellW + margin, y * this.cellH + this.cellH - margin);


                        this.ctx.lineTo(x * this.cellW + margin, y * this.cellH + margin);


                        break;


                }


                this.ctx.closePath();


                this.ctx.fill();


            }


            render(env, agent) {


                this.clear();


                for (let y = 0; y < this.envH; y++) {


                    for (let x = 0; x < this.envW; x++) {


                        const type = env.grid[y][x];


                        if (type === CELL_TYPES.EMPTY || type === CELL_TYPES.START) {


                            const stateIndex = env.getStateIndex(x, y);


                            const qs = agent.qTable[stateIndex];


                            let maxAbsQ = 0.1;


                            for (let i = 0; i < qs.length; i++) {


                                const absVal = Math.abs(qs[i]);


                                if (absVal > maxAbsQ) maxAbsQ = absVal;


                            }


                            const margin = 2;


                            this.drawTriangle(0, qs[0], maxAbsQ, x, y, margin);


                            this.drawTriangle(1, qs[1], maxAbsQ, x, y, margin);


                            this.drawTriangle(2, qs[2], maxAbsQ, x, y, margin);


                            this.drawTriangle(3, qs[3], maxAbsQ, x, y, margin);


                        }


                        const px = x * this.cellW + 1;


                        const py = y * this.cellH + 1;


                        const pW = this.cellW - 2;


                        const pH = this.cellH - 2;


                        if (type === CELL_TYPES.WALL) {


                            this.ctx.fillStyle = this.colors.wall;


                            this.ctx.fillRect(px, py, pW, pH);


                        } else if (type === CELL_TYPES.GOAL) {


                            this.ctx.fillStyle = this.colors.goal;


                            this.ctx.shadowColor = this.colors.goal;


                            this.ctx.shadowBlur = 10;


                            this.ctx.fillRect(px, py, pW, pH);


                            this.ctx.shadowBlur = 0;


                        } else if (type === CELL_TYPES.TRAP) {


                            this.ctx.fillStyle = this.colors.trap;


                            this.ctx.fillRect(px, py, pW, pH);


                        }


                    }


                }


                this.drawGridLines();


                const ax = env.currentState.x * this.cellW + this.cellW / 2;


                const ay = env.currentState.y * this.cellH + this.cellH / 2;


                const radius = Math.min(this.cellW, this.cellH) * 0.3;


                this.ctx.beginPath();


                this.ctx.arc(ax, ay, radius, 0, Math.PI * 2);


                this.ctx.fillStyle = this.colors.agent;


                this.ctx.shadowColor = this.colors.agentGlow;


                this.ctx.shadowBlur = 15;


                this.ctx.fill();


                this.ctx.shadowBlur = 0;


                this.ctx.strokeStyle = '#000';


                this.ctx.lineWidth = 2;


                this.ctx.stroke();


            }


        }



        const GridCanvas = () => {


            const canvasRef = useRef(null);


            const { envInstance, agentInstance, renderTick, drawMode, isRunning, setDrawMode, theme } = useSimulationStore();


            const colors = useMemo(() => {


                if (theme === 'light') {


                    return {


                        bg: '#ffffff',


                        grid: '#cbd5e1',


                        wall: '#94a3b8',


                        goal: '#00b377',


                        trap: '#ef4444',


                        start: '#3b82f6',


                        agent: '#0f172a',


                        agentGlow: 'rgba(15, 23, 42, 0.15)',


                        qPos: 'rgba(0, 179, 119, ',


                        qNeg: 'rgba(239, 68, 68, '


                    };


                } else {


                    return {


                        bg: '#121217',


                        grid: '#2a2a35',


                        wall: '#3f3f4e',


                        goal: '#00e599',


                        trap: '#ff3366',


                        start: '#3b82f6',


                        agent: '#e2e8f0',


                        agentGlow: 'rgba(226, 232, 240, 0.4)',


                        qPos: 'rgba(0, 229, 153, ',


                        qNeg: 'rgba(255, 51, 102, '


                    };


                }


            }, [theme]);



            useEffect(() => {


                if (!canvasRef.current || !envInstance || !agentInstance) return;


                const canvas = canvasRef.current;


                const ctx = canvas.getContext('2d', { alpha: false });


                const renderer = new CanvasRenderer(ctx, canvas.width, canvas.height, { width: envInstance.width, height: envInstance.height }, colors);


                renderer.render(envInstance, agentInstance);


            }, [envInstance, agentInstance, renderTick, colors]);



            const handleCanvasInteraction = useCallback((e) => {


                if (isRunning || !envInstance) return;


                const canvas = canvasRef.current;


                const rect = canvas.getBoundingClientRect();


                const scaleX = canvas.width / rect.width;


                const scaleY = canvas.height / rect.height;


                const x = (e.clientX - rect.left) * scaleX;


                const y = (e.clientY - rect.top) * scaleY;


                const cellW = canvas.width / envInstance.width;


                const cellH = canvas.height / envInstance.height;


                const gridX = Math.floor(x / cellW);


                const gridY = Math.floor(y / cellH);


                if (gridX < 0 || gridX >= envInstance.width || gridY < 0 || gridY >= envInstance.height) return;


                if (envInstance.grid[gridY][gridX] === drawMode) {


                    envInstance.setCell(gridX, gridY, CELL_TYPES.EMPTY);


                } else {


                    envInstance.setCell(gridX, gridY, drawMode);


                }


                useSimulationStore.setState({ renderTick: Date.now() });


            }, [isRunning, envInstance, drawMode]);



            return (


                <ErrorBoundary>


                    <div className="relative w-full aspect-video bg-obsidian rounded-xl overflow-hidden border border-border shadow-2xl group">


                        <canvas ref={canvasRef} width={800} height={600} className="w-full h-full object-contain cursor-crosshair" onClick={handleCanvasInteraction} onMouseMove={(e) => e.buttons === 1 && handleCanvasInteraction(e)} />


                        {!isRunning && (


                            <div className="absolute top-4 left-4 bg-surface90 backdrop-blur border border-border text-xs px-3 py-2 rounded-lg flex items-center gap-2 text-textMuted pointer-events-none transition-opacity opacity-0 group-hover:opacity-100">


                                <Lucide.MousePointerClick size={14} className="text-accent" />


                                <span>Topology Edit Mode: <strong className="text-textMain ml-1">{Object.keys(CELL_TYPES).find(key => CELL_TYPES[key] === drawMode)}</strong></span>


                            </div>


                        )}


                    </div>


                </ErrorBoundary>


            );


        };



        const ControlDashboard = () => {


            const store = useSimulationStore();


            const { Play, Pause, RotateCcw, Activity } = Lucide;


            return (


                <div className="bg-panel rounded-xl border border-border p-6 flex flex-col gap-6 shadow-lg">


                    <div className="flex items-center justify-between">


                        <div>


                            <h3 className="text-lg font-bold text-textMain flex items-center gap-2">


                                <Activity size={20} className="text-accent" />


                                RL Engine Matrix


                            </h3>


                            <div className="text-sm text-textMuted mt-1 font-mono flex gap-4">


                                <span>EPOCH: {String(store.episodes).padStart(5, '0')}</span>


                                <span>ε: {store.agentInstance?.epsilon.toFixed(4) || "1.0000"}</span>


                            </div>


                        </div>


                        <div className="flex gap-3">


                            <IconButton icon={store.isRunning ? Pause : Play} label={store.isRunning ? 'Halt Execution' : 'Execute Loop'} variant={store.isRunning ? 'danger' : 'accent'} onClick={store.toggleSimulation} />


                            <IconButton icon={RotateCcw} label="Flush Memory" variant="default" onClick={store.resetSimulation} />


                        </div>


                    </div>


                    <div className="h-px w-full bg-border/50"></div>


                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">


                        <div className="space-y-6">


                            <GlassSlider label="Learning Rate" symbol="α" min={0.01} max={1.0} step={0.01} value={store.alpha} onChange={(val) => store.updateHyperparameters({ alpha: val })} />


                            <GlassSlider label="Discount Factor" symbol="γ" min={0.10} max={0.99} step={0.01} value={store.gamma} onChange={(val) => store.updateHyperparameters({ gamma: val })} />


                            <GlassSlider label="Execution Velocity" symbol="Δt" min={1} max={100} step={1} value={store.speed} onChange={(val) => store.updateHyperparameters({ speed: val })} />


                        </div>


                        <div className="space-y-4">


                            <div className="flex items-center justify-between">


                                <label className="text-sm text-textMuted font-medium block flex items-center gap-2"><Lucide.Map size={14} /> Spatial Editor Tools</label>


                                {store.isRunning && <span className="text-[10px] uppercase tracking-wider text-warning font-mono bg-warning/10 px-2 py-0.5 rounded">Locked</span>}


                            </div>


                            <div className="grid grid-cols-2 gap-3">


                                <button disabled={store.isRunning} onClick={() => store.setDrawMode(CELL_TYPES.WALL)} className={cn("p-3 rounded-lg border text-sm flex items-center gap-3 transition-all font-medium", store.drawMode === CELL_TYPES.WALL && !store.isRunning ? 'bg-wall border-border text-textMain shadow-inner' : 'bg-surface border-border text-textMuted hover:border-textMuted50', store.isRunning && 'opacity-50 cursor-not-allowed')}>


                                    <div className="w-4 h-4 bg-wall rounded-sm shadow-sm border border-black/20"></div> Obstacle


                                </button>


                                <button disabled={store.isRunning} onClick={() => store.setDrawMode(CELL_TYPES.GOAL)} className={cn("p-3 rounded-lg border text-sm flex items-center gap-3 transition-all font-medium", store.drawMode === CELL_TYPES.GOAL && !store.isRunning ? 'bg-accent10 border-accent50 text-accent' : 'bg-surface border-border text-textMuted hover:border-textMuted50', store.isRunning && 'opacity-50 cursor-not-allowed')}>


                                    <div className="w-4 h-4 bg-accent rounded-sm shadow-[0_0_12px_var(--color-accent)]"></div> Target (+10)


                                </button>


                                <button disabled={store.isRunning} onClick={() => store.setDrawMode(CELL_TYPES.TRAP)} className={cn("p-3 rounded-lg border text-sm flex items-center gap-3 transition-all font-medium", store.drawMode === CELL_TYPES.TRAP && !store.isRunning ? 'bg-danger10 border-danger50 text-danger' : 'bg-surface border-border text-textMuted hover:border-textMuted50', store.isRunning && 'opacity-50 cursor-not-allowed')}>


                                    <div className="w-4 h-4 bg-danger rounded-sm shadow-[0_0_12px_var(--color-danger)]"></div> Hazard (-10)


                                </button>


                                <button disabled={store.isRunning} onClick={() => store.setDrawMode(CELL_TYPES.EMPTY)} className={cn("p-3 rounded-lg border text-sm flex items-center gap-3 transition-all font-medium", store.drawMode === CELL_TYPES.EMPTY && !store.isRunning ? 'dark:bg-white/5 dark:border-white/20 dark:text-white bg-slate-900/5 border-slate-900/10 text-slate-900' : 'bg-surface border-border text-textMuted hover:border-textMuted50', store.isRunning && 'opacity-50 cursor-not-allowed')}>


                                    <Lucide.Eraser size={16} className="text-textMuted" /> Void Space


                                </button>


                            </div>


                        </div>


                    </div>


                </div>


            );


        };



        const MetricsView = () => {


            const { metrics } = useSimulationStore();


            const Chart = useMemo(() => {


                if (!metrics || metrics.length === 0) {


                    return <div className="flex items-center justify-center h-full text-textMuted font-mono text-xs border border-dashed border-border50 rounded-lg bg-surface30">SYSTEM_AWAITING_TELEMETRY...</div>;


                }


                const displayData = metrics.length > 200 ? _.filter(metrics, (_, i) => i % Math.ceil(metrics.length / 200) === 0) : metrics;


                return (


                    <ResponsiveContainer width="100%" height="100%">


                        <AreaChart data={displayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>


                            <defs>


                                <linearGradient id="colorReward" x1="0" y1="0" x2="0" y2="1">


                                    <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.4} />


                                    <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0.0} />


                                </linearGradient>


                            </defs>


                            <XAxis dataKey="episode" tick={{ fill: 'var(--color-text-muted)', fontSize: 10, fontFamily: 'monospace' }} tickLine={false} axisLine={{ stroke: 'var(--color-border)' }} minTickGap={30} />


                            <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 10, fontFamily: 'monospace' }} tickLine={false} axisLine={{ stroke: 'var(--color-border)' }} domain={['auto', 'auto']} />


                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />


                            <Tooltip contentStyle={{ backgroundColor: 'var(--color-panel)', border: '1px solid var(--color-border)', borderRadius: '8px', fontFamily: 'monospace', fontSize: '12px' }} itemStyle={{ color: 'var(--color-accent)' }} labelStyle={{ color: 'var(--color-text-muted)', marginBottom: '4px' }} />


                            <ReferenceLine y={0} stroke="var(--color-danger)" strokeDasharray="3 3" strokeOpacity={0.5} />


                            <Area type="monotone" dataKey="reward" stroke="var(--color-accent)" strokeWidth={2} fillOpacity={1} fill="url(#colorReward)" isAnimationActive={false} />


                        </AreaChart>


                    </ResponsiveContainer>


                );


            }, [metrics]);



            return (


                <ErrorBoundary>


                    <div className="bg-panel rounded-xl border border-border p-6 shadow-lg">


                        <div className="flex justify-between items-center mb-6">


                            <h3 className="text-lg font-bold text-textMain flex items-center gap-2"><Lucide.TrendingUp size={20} className="text-accent" /> Optimization Trajectory (Return)</h3>


                            {metrics.length > 0 && <div className="text-xs font-mono text-textMuted bg-surface px-3 py-1 rounded border border-border">Max R: <span className="text-accent">{Math.max(...metrics.map(m => m.reward)).toFixed(1)}</span></div>}


                        </div>


                        <div className="h-64 w-full">{Chart}</div>


                    </div>


                </ErrorBoundary>


            );


        };



        const MemoryInspector = () => {


            const { agentInstance, envInstance } = useSimulationStore();


            const formatQ = (val) => (Math.abs(val) < 0.0001 && val !== 0) ? val.toExponential(2) : val.toFixed(4);


            return (


                <div className="bg-panel rounded-xl border border-border p-6 shadow-lg flex flex-col gap-4">


                    <div className="flex justify-between items-center">


                        <h3 className="text-sm font-bold text-textMuted uppercase tracking-wider flex items-center gap-2"><Lucide.Database size={16} /> Memory Array (Q-Table Slice)</h3>


                        <div className="text-xs font-mono text-textMuted">TOTAL VECTORS: {agentInstance ? agentInstance.numStates : 0}</div>


                    </div>


                    <div className="overflow-hidden rounded-lg border border-border">


                        <div className="overflow-x-auto">


                            <table className="w-full text-xs font-mono text-left border-collapse">


                                <thead>


                                    <tr className="bg-surface border-b border-border text-textMuted">


                                        <th className="py-3 pl-4 font-semibold">State(X,Y)</th>


                                        <th className="py-3 font-semibold">Q(UP)</th>


                                        <th className="py-3 font-semibold">Q(RIGHT)</th>


                                        <th className="py-3 font-semibold">Q(DOWN)</th>


                                        <th className="py-3 font-semibold">Q(LEFT)</th>


                                    </tr>


                                </thead>


                                <tbody>


                                    {agentInstance && envInstance ? (


                                        agentInstance.qTable.slice(0, 6).map((actions, idx) => {


                                            const x = idx % envInstance.width;


                                            const y = Math.floor(idx / envInstance.width);


                                            const maxVal = Math.max(...actions);


                                            return (


                                                <tr key={idx} className="border-b border-border30 hover:bg-surface50 transition-colors">


                                                    <td className="py-2.5 pl-4 text-textMain">S[{x},{y}]</td>


                                                    {Array.from(actions).map((val, aIdx) => {


                                                        const isMax = val === maxVal && val !== 0;


                                                        return (


                                                            <td key={aIdx} className={cn("py-2.5 pr-4", val > 0 ? "text-accent" : val < 0 ? "text-danger" : "text-textMuted50", isMax && "font-bold bg-accent5 rounded-sm")}>{formatQ(val)}</td>


                                                        );


                                                    })}


                                                </tr>


                                            );


                                        })


                                    ) : (


                                        <tr><td colSpan="5" className="py-4 text-center text-textMuted">Awaiting Memory Allocation...</td></tr>


                                    )}


                                </tbody>


                            </table>


                        </div>


                    </div>


                    <div className="flex justify-between items-center">


                        <p className="text-[10px] text-textMuted uppercase tracking-widest">Showing top 6 memory indices.</p>


                        {agentInstance && <span className="text-[10px] font-mono text-accent">ALLOCATED: {(agentInstance.numStates * agentInstance.numActions * 8 / 1024).toFixed(2)} KB</span>}


                    </div>


                </div>


            );


        };



        const ArticleReader = () => {


            const [activeSection, setActiveSection] = useState(YAP_CONTENT[0].id);


            useEffect(() => {


                const activeNav = document.getElementById(\`nav - \${ activeSection } \`);


                if (activeNav) {


                    activeNav.scrollIntoView({ behavior: 'smooth', block: 'nearest' });


                }


            }, [activeSection]);


            useEffect(() => {


                const observerOptions = { root: null, rootMargin: '-20% 0px -60% 0px', threshold: 0 };


                const observerCallback = (entries) => {


                    entries.forEach((entry) => {


                        if (entry.isIntersecting) setActiveSection(entry.target.id);


                    });


                };


                const observer = new IntersectionObserver(observerCallback, observerOptions);


                YAP_CONTENT.forEach((sec) => {


                    const el = document.getElementById(sec.id);


                    if (el) observer.observe(el);


                });


                return () => observer.disconnect();


            }, []);


            return (


                <div className="flex h-full w-full">


                    <div className="w-72 flex-shrink-0 border-r border-border bg-obsidian80 backdrop-blur-xl overflow-y-auto hidden xl:block no-scrollbar">


                        <div className="p-8 sticky top-0">


                            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-textMuted mb-8 flex items-center gap-3"><Lucide.Grid size={14} className="text-accent" /> Structural Map</h2>


                            <nav className="space-y-1.5 relative before:absolute before:inset-y-0 before:left-[7px] before:w-px before:bg-border50">


                                {YAP_CONTENT.map((sec) => {


                                    const isActive = activeSection === sec.id;


                                    return (


                                        <a key={sec.id} id={\`nav - \${ sec.id } \`} href={\`#\${ sec.id } \`} className={cn("relative pl-7 py-2.5 block text-[13px] leading-tight transition-all duration-300 rounded-r-lg", isActive ? "text-accent font-medium bg-surface50" : "text-textMuted hover:text-textMain hover:bg-surface30")}>


                                            <div className={cn("absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 border-obsidian transition-colors duration-300 z-10", isActive ? "bg-accent border-accent20 scale-125 shadow-[0_0_10px_var(--color-accent-glow)]" : "bg-border hover:bg-textMuted")}></div>


                                            {sec.title}


                                        </a>


                                    );


                                })}


                            </nav>


                        </div>


                    </div>


                    <div className="flex-1 overflow-y-auto scroll-smooth relative">


                        <div className="px-8 py-12 md:px-12 lg:px-16 lg:py-24 max-w-4xl mx-auto yap-text">


                            <header className="mb-20 border-b border-border50 pb-12">


                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent10 text-accent text-xs font-mono mb-8 border border-accent20 shadow-sm"><Lucide.BrainCircuit size={14} /> Cognitive Architecture Protocol</div>


                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-textMain mb-8 leading-[1.1]">Reinforcement Learning:<br />First Principles</h1>


                            </header>


                            <div className="space-y-24">


                                {YAP_CONTENT.map((sec) => (


                                    <section key={sec.id} id={sec.id} className="scroll-mt-24">


                                        <h2 className="text-2xl md:text-3xl font-bold text-textMain mb-8 tracking-tight">{sec.title}</h2>


                                        <p className="text-lg md:text-xl leading-relaxed text-textMain/80 font-light text-justify">{sec.text}</p>


                                    </section>


                                ))}


                            </div>


                            <footer className="mt-32 border-t border-border pt-16 pb-24 text-center">


                                <div className="inline-flex items-center justify-center p-4 rounded-full bg-surface border border-border mb-6"><Lucide.Terminal size={20} className="text-textMuted" /></div>


                            </footer>


                        </div>


                    </div>


                </div>


            );


        };



        const App = () => {


            const store = useSimulationStore();


            useEffect(() => {


                store.initializeEngine();


            }, []);


            const requestRef = useRef();


            const lastTimeRef = useRef(performance.now());


            const currentEpReward = useRef(0);


            const currentEpSteps = useRef(0);


            const executionLoop = useCallback((time) => {


                if (!store.isRunning) return;


                const deltaTime = time - lastTimeRef.current;


                const delay = 100 - store.speed;


                if (delay === 0) {


                    for (let i = 0; i < 20; i++) store.executeStep(currentEpReward, currentEpSteps);


                    lastTimeRef.current = time;


                } else if (deltaTime >= delay) {


                    store.executeStep(currentEpReward, currentEpSteps);


                    lastTimeRef.current = time;


                }


                requestRef.current = requestAnimationFrame(executionLoop);


            }, [store.isRunning, store.speed, store.executeStep]);


            useEffect(() => {


                if (store.isRunning) {


                    requestRef.current = requestAnimationFrame(executionLoop);


                }


                return () => cancelAnimationFrame(requestRef.current);


            }, [store.isRunning, executionLoop]);


            return (


                <div className="h-screen w-screen bg-obsidian text-textMain flex overflow-hidden font-sans selection:bg-accent30 selection:text-textMain">


                    {/* Theme Toggle Button */}


                    <button


                        onClick={store.toggleTheme}


                        className="fixed top-6 right-6 z-[100] flex items-center justify-center p-3 rounded-full border border-border bg-surface80 backdrop-blur-md shadow-lg hover:scale-105 hover:bg-surface hover:text-accent transition-all duration-300 group focus:outline-none"


                        title={store.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}


                    >


                        {store.theme === 'dark' ? (


                            <Lucide.Sun size={18} className="text-accent" />


                        ) : (


                            <Lucide.Moon size={18} className="text-accent" />


                        )}


                    </button>


                    {store.errorState && (


                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">


                            <div className="bg-panel p-8 rounded-xl border border-danger text-center max-w-lg">


                                <Lucide.AlertCircle size={48} className="text-danger mx-auto mb-4" />


                                <h2 className="text-2xl font-bold text-textMain mb-2">Engine Fault Detected</h2>


                                <p className="text-textMuted font-mono text-sm mb-6">{store.errorState.message}</p>


                                <button onClick={store.resetSimulation} className="bg-danger text-white px-6 py-2 rounded-lg font-medium hover:bg-danger80 transition-colors">Reinitialize System</button>


                            </div>


                        </div>


                    )}


                    <div className="w-[55%] h-full border-r border-border relative z-20 bg-obsidian dark:shadow-[10px_0_30px_rgba(0,0,0,0.4)] shadow-[10px_0_30px_rgba(0,0,0,0.04)]"><ArticleReader /></div>


                    <div className="w-[45%] h-full overflow-y-auto bg-simulationBg relative pattern-grid scroll-smooth">


                        <div className="relative p-8 md:p-12 max-w-5xl mx-auto space-y-8 pb-32">


                            <header className="flex items-end justify-between mb-10 border-b border-border50 pb-6">


                                <div>


                                    <h2 className="text-3xl font-bold text-textMain tracking-tight mb-2">Interactive Simulation</h2>


                                    <p className="text-sm text-textMuted">Q-Learning tabular engine operating in real-time continuous state space.</p>


                                </div>


                            </header>


                            <div className="flex flex-col gap-8">


                                <GridCanvas />


                                <ControlDashboard />


                                <div className="grid grid-cols-1 2xl:grid-cols-2 gap-8">


                                    <MetricsView />


                                    <MemoryInspector />


                                </div>


                            </div>


                        </div>


                    </div>


                </div>


            );


        };



        const container = document.getElementById('root');


        const root = createRoot(container);


        root.render(<App />);


    </script>


</body>


</html>

<Response Protocol>
Do not explain what you are going to do. **Do not list features.** Immediately generate the high-fidelity code block that embodies these principles. The result should be a "Wow" factor artifact.
</Response Protocol>

  `;

    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
        });

        return (response.text || "").replace(CLEAN_REGEX, '').trim();
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
};
