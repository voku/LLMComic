export type ActionVerb = 'Inspect' | 'Analyze' | 'Interrogate';

export interface Hotspot {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  interactions: Partial<Record<ActionVerb, string>>;
}

export interface ComicPanel {
  id: string;
  type?: 'comic' | 'interactive';
  title?: string;
  textBlocks: string[];
  imageSeed?: string;
  imagePrompt?: string;
  imageAlt: string;
  hotspots?: Hotspot[];
}

/**
 * A single full-width comic page backed by one of the uploaded PNG images.
 * `panels` are the story panels whose narrative belongs on this page.
 */
export interface ComicPage {
  /** ID that maps to a 'comic-page-N' key in generatedImages */
  id: string;
  /** Accessible alt text for the page image */
  imageAlt: string;
  /** Panels whose story content is shown on this page */
  panels: ComicPanel[];
  /** Natural width of the source image in pixels (used for viewBox scaling) */
  imageWidth: number;
  /** Natural height of the source image in pixels (used for viewBox scaling) */
  imageHeight: number;
}

/**
 * Maps the 8 uploaded comic-style PNG images to story panels.
 * The images are displayed in a single column; interactive panels carry
 * scaling SVG image-map hotspots so click targets stay proportional at
 * any viewport width.
 */
export const comicPages: ComicPage[] = [];

// Art-direction reference used to keep the shipped comic imagery stylistically consistent
export const characterConfig = {
  name: "Danny Krüger",
  appearance: "A weary, cynical software engineer in his 30s. Messy dark hair, slight stubble, wearing a dark trench coat over a faded tech startup t-shirt. He has a glowing, subtle cybernetic implant around his left eye. He looks exhausted but sharp.",
  style: "Dark noir comic book style, high contrast black and white ink with stark shadows, dramatic lighting, gritty cyberpunk undertones, graphic novel aesthetic."
};

export const panels: ComicPanel[] = [
  {
    id: "intro",
    type: "comic",
    title: "The Case of Danny Krüger",
    textBlocks: [
      "A small crime in the age of AI coding.",
      "The story begins with a crime.",
      "Not a dramatic one. No alarms. No crashes. No corrupted databases.",
      "Just a system that slowly stopped behaving correctly."
    ],
    imagePrompt: `Scene: A dark, messy server room with blinking lights. ${characterConfig.name} (${characterConfig.appearance}) is standing in the center, looking at a glowing holographic screen showing corrupted code. Style: ${characterConfig.style}`,
    imageAlt: "Danny Krüger in a dark server room looking at corrupted code"
  },
  {
    id: "symptoms",
    type: "comic",
    textBlocks: [
      "Search results looked strange.",
      "Some products appeared twice. Others disappeared entirely.",
      "Orders still worked. The application compiled. Tests were green.",
      "Everything looked correct. Which is exactly why nobody noticed the crime at first."
    ],
    imagePrompt: `Scene: Close up on a glowing computer monitor showing a magnifying glass hovering over lines of code. The code looks clean but slightly distorted. ${characterConfig.name}'s reflection is visible in the screen, looking puzzled. Style: ${characterConfig.style}`,
    imageAlt: "A magnifying glass over clean code"
  },
  {
    id: "new-engineer",
    type: "comic",
    title: "The new engineer",
    textBlocks: [
      "Danny Krüger had joined the team a few months earlier.",
      "Danny was productive. Very productive.",
      "While other engineers slowly implemented features, Danny shipped entire modules in a day.",
      "Management loved it. Velocity charts went up."
    ],
    imagePrompt: `Scene: ${characterConfig.name} (${characterConfig.appearance}) sitting at a desk in a dimly lit open-plan office. He is typing incredibly fast. Holographic code snippets are flying around him. He looks relaxed, almost bored. Style: ${characterConfig.style}`,
    imageAlt: "A developer looking relaxed while code flies across the screen"
  },
  {
    id: "the-tools",
    type: "comic",
    textBlocks: [
      "Danny had discovered the new tools. Large language models.",
      "He could describe a feature, generate the code, adjust a few lines, and move on.",
      "Controllers. Services. Tests. Documentation.",
      "A few prompts later and 80% of the code existed. For a while it looked like magic."
    ],
    imagePrompt: `Scene: A glowing, ethereal magic wand made of digital light hovering over a mechanical keyboard. ${characterConfig.name}'s hands are resting near the keys. The screen emits a bright, magical glow. Style: ${characterConfig.style}`,
    imageAlt: "A glowing wand over a keyboard"
  },
  {
    id: "cheap-part",
    type: "comic",
    title: "The cheap part",
    textBlocks: [
      "For years, building software had been slow. You needed developers. Infrastructure. Time.",
      "Now that barrier had almost disappeared.",
      "Anyone could describe an application and watch it appear on their screen.",
      "Coding had suddenly become cheap."
    ],
    imagePrompt: `Scene: A massive, dark industrial factory assembly line. Instead of physical goods, the conveyor belts are carrying identical, glowing holographic application windows. Style: ${characterConfig.style}`,
    imageAlt: "A factory line of identical apps"
  },
  {
    id: "the-catch",
    type: "comic",
    textBlocks: [
      "But something strange followed.",
      "Despite millions of generated apps, the world had not seen a wave of remarkable new software.",
      "Plenty of applications existed.",
      "Very few changed how people actually worked."
    ],
    imagePrompt: `Scene: A vast, sprawling cyberpunk city where all the identical buildings are dark and unlit, and the empty streets have a single, flickering neon sign that reads 'AI-Generated'. Style: ${characterConfig.style}`,
    imageAlt: "A vast city of identical, empty buildings"
  },
  {
    id: "first-clue",
    type: "interactive",
    title: "The first clue",
    textBlocks: [
      "The investigation started in the search system. Use your tools to examine the evidence."
    ],
    imagePrompt: `Scene: A pristine, glowing glass surface representing a search index. There is a tiny, spiderweb-like crack in the center of the glass, glowing with a sinister red light. Style: ${characterConfig.style}`,
    imageAlt: "A tiny crack in a pristine glass surface",
    hotspots: [
      {
        id: "code",
        x: 15, y: 20, width: 25, height: 50,
        label: "Source Code",
        interactions: {
          Inspect: "The code looked clean. Interfaces matched. Architecture followed familiar patterns.",
          Analyze: "Repository classes. DTOs. Dependency injection. Exactly what a well-structured backend should look like.",
          Interrogate: "The code remains silent. It looks too perfect. It was believed, not understood."
        }
      },
      {
        id: "search-index",
        x: 55, y: 35, width: 30, height: 40,
        label: "Search Index",
        interactions: {
          Inspect: "Something subtle is wrong here.",
          Analyze: "The search index sometimes contained inconsistent data. Not broken. Just slightly incorrect.",
          Interrogate: "Why are you returning duplicate products? ...No answer."
        }
      },
      {
        id: "tests",
        x: 40, y: 75, width: 20, height: 15,
        label: "Test Suite",
        interactions: {
          Inspect: "All tests are green.",
          Analyze: "The tests only check the happy path. They don't cover the edge cases causing the inconsistency.",
          Interrogate: "The tests proudly declare everything is fine. They believed the happy path too."
        }
      }
    ]
  },
  {
    id: "workflow",
    type: "comic",
    title: "Danny’s workflow",
    textBlocks: [
      "When the team asked Danny how he implemented the search integration, his process sounded simple.",
      "He described the feature. The model generated the code. He read it briefly.",
      "If it looked correct, he believed it was.",
      "He didn't know the code. He just believed it. Which is the root of the problem."
    ],
    imagePrompt: `Scene: ${characterConfig.name} (${characterConfig.appearance}) standing in front of a massive wall of monitors. He is nodding approvingly at the screens, which are filled with dense, scrolling code. He has a cup of coffee in his hand. Style: ${characterConfig.style}`,
    imageAlt: "A person nodding at a screen filled with AI-generated code"
  },
  {
    id: "pattern-mirrors",
    type: "comic",
    title: "Pattern mirrors",
    textBlocks: [
      "LLMs do not invent software. They recombine patterns from existing code.",
      "When someone describes a new feature, the model reflects patterns from things it has already seen.",
      "The result often looks convincing. Sometimes it even works.",
      "But the system is not reasoning about your architecture. It is producing something that resembles a solution."
    ],
    imagePrompt: `Scene: A surreal hall of mirrors. The mirrors are reflecting glowing lines of code instead of people. The reflections stretch into infinity, becoming slightly distorted the further back they go. Style: ${characterConfig.style}`,
    imageAlt: "A hall of mirrors reflecting code snippets"
  },
  {
    id: "happy-path",
    type: "comic",
    title: "The happy path",
    textBlocks: [
      "The generated code worked perfectly under normal conditions. Clean data. Predictable workflows.",
      "But production systems rarely behave that way.",
      "Real systems live in messy territory: historical constraints, incomplete migrations, infrastructure quirks.",
      "Those things rarely appear in training data. Which means the model reproduces the happy path."
    ],
    imagePrompt: `Scene: A pristine, glowing digital path that abruptly ends at the edge of a dark, chaotic, tangled jungle of wires, old servers, and glitching holograms. Style: ${characterConfig.style}`,
    imageAlt: "A pristine path leading into a chaotic, tangled jungle"
  },
  {
    id: "eighty-eighty",
    type: "comic",
    title: "The 80/80 effect",
    textBlocks: [
      "Danny often described his workflow with pride: 'AI already writes 80% of the code.'",
      "He was right. But that wasn't the expensive part.",
      "The remaining 20% — domain logic, edge cases, real-world constraints — consumed 80% of the total engineering time.",
      "AI made the cheap part cheaper. The expensive part stayed expensive."
    ],
    imagePrompt: `Scene: A massive digital iceberg floating in a dark sea. The top 20% above the water is bright, clean code labeled '80% generated fast'. The 80% below the water is a massive, complex, tangled mess of architecture and domain knowledge labeled '80% of the time'. Style: ${characterConfig.style}`,
    imageAlt: "An iceberg: the small visible tip is generated code (80% generated fast), the vast hidden mass is domain knowledge and edge cases (the remaining 20% that takes 80% of the total time)"
  },
  {
    id: "slow-decay",
    type: "comic",
    title: "The slow decay",
    textBlocks: [
      "As Danny’s project grew, prompts became longer. More context was required to keep the system coherent.",
      "And slowly something strange happened. Parts of the system began to fade from the model’s attention.",
      "Rules disappeared between features. Edge cases vanished between instructions.",
      "The code still compiled. But the architecture became fragile. Context rot."
    ],
    imagePrompt: `Scene: A beautiful, futuristic skyscraper. However, at the very bottom, the foundation blocks are slowly dissolving into digital dust and glitching out. Style: ${characterConfig.style}`,
    imageAlt: "A beautiful building slowly crumbling at the foundations"
  },
  {
    id: "missing-knowledge",
    type: "interactive",
    title: "The missing knowledge",
    textBlocks: [
      "During the investigation someone tried to run the system in a fresh environment. Find out what's missing."
    ],
    imagePrompt: `Scene: A detailed, glowing blue architectural blueprint of a complex machine spread out on a dark table. The blueprint is perfect, but there are no tools or materials around to actually build it. Style: ${characterConfig.style}`,
    imageAlt: "A detailed blueprint of a factory, but no workers or materials",
    hotspots: [
      {
        id: "repo",
        x: 10, y: 20, width: 30, height: 50,
        label: "The Repository",
        interactions: {
          Inspect: "The repository looked complete. Thousands of files. Controllers. Services. Infrastructure code.",
          Analyze: "Everything appeared ready. But after a few hours the team realized something obvious. They had no idea how to run it.",
          Interrogate: "It's just a blueprint. It doesn't know how to build itself."
        }
      },
      {
        id: "elastic",
        x: 50, y: 30, width: 20, height: 20,
        label: "Elasticsearch Config",
        interactions: {
          Inspect: "There are references to an Elasticsearch cluster.",
          Analyze: "Which Elasticsearch cluster did the system expect? The knowledge lives somewhere else.",
          Interrogate: "Connection refused."
        }
      },
      {
        id: "pipeline",
        x: 70, y: 60, width: 20, height: 30,
        label: "Data Pipeline",
        interactions: {
          Inspect: "The search index needs data.",
          Analyze: "Where did the product catalog originate? How was the search index built? Which background jobs populated the data?",
          Interrogate: "The code describes the structure. The knowledge of the system lived in the heads of engineers."
        }
      }
    ]
  },
  {
    id: "quiet-witness",
    type: "interactive",
    title: "The quiet witness",
    textBlocks: [
      "The final clue came from an unexpected place. Consult the quiet witness."
    ],
    imagePrompt: `Scene: A menacing, hovering robotic eye scanning a wall of code with a red laser. Where the laser hits the code, bright red warning symbols appear. Style: ${characterConfig.style}`,
    imageAlt: "A robotic eye scanning code and highlighting a red warning",
    hotspots: [
      {
        id: "static-analysis",
        x: 15, y: 10, width: 35, height: 40,
        label: "Static Analysis Tool",
        interactions: {
          Inspect: "Static analysis does not trust appearances. It does not care whether code looks professional.",
          Analyze: "The tools began raising small warnings. Type mismatches. Unexpected nullability. Inconsistent data structures.",
          Interrogate: "It checks constraints. And constraints are where systems reveal the truth."
        }
      },
      {
        id: "type-system",
        x: 55, y: 15, width: 35, height: 35,
        label: "Type System",
        interactions: {
          Inspect: "The type system records every promise a developer made about the shape of data.",
          Analyze: "These types were generated to match the happy path. They didn't account for nullable fields the real data source actually produced.",
          Interrogate: "When did the type mismatch start? ... 'From the beginning. The model assumed the clean version.'"
        }
      },
      {
        id: "dependency-graph",
        x: 25, y: 60, width: 50, height: 30,
        label: "Dependency Graph",
        interactions: {
          Inspect: "The import graph reveals which modules the search system actually depended on.",
          Analyze: "Several core modules pulled in infrastructure clients that didn't exist in staging. The generated code assumed a production environment it had never seen.",
          Interrogate: "Why does this compile locally but fail in staging? ... 'Because the model generated plausible imports. No one verified where they led.'"
        }
      }
    ]
  },
  {
    id: "danny-kruger-effect",
    type: "interactive",
    title: "The Danny Krüger Effect",
    textBlocks: [
      "The Dunning-Kruger effect is when you lack the competence to know you're wrong.",
      "The Danny Krüger effect is different: The AI generates code so plausible, you substitute believing for knowing.",
      "Investigate the illusion."
    ],
    imagePrompt: `Scene: A perfectly painted, realistic facade of a modern house. Behind the facade, it is held up by flimsy, splintering wooden props. ${characterConfig.name} is standing in front of it, looking fooled. Style: ${characterConfig.style}`,
    imageAlt: "A perfectly painted facade of a house supported by flimsy wooden props",
    hotspots: [
      {
        id: "facade",
        x: 20, y: 30, width: 30, height: 40,
        label: "Plausible Correctness",
        interactions: {
          Inspect: "The code compiles. The patterns look familiar. The naming feels professional.",
          Analyze: "It's a facade. It resembles good engineering, but resemblance is not evidence.",
          Interrogate: "Are you correct? ... 'I am statistically probable. That is not the same as correct.'"
        }
      },
      {
        id: "gap",
        x: 60, y: 50, width: 20, height: 30,
        label: "The Knowledge Gap",
        interactions: {
          Inspect: "There are gaps in the domain logic.",
          Analyze: "Without domain knowledge, the model fills gaps with probability. And probability often looks convincing.",
          Interrogate: "Who fills the gaps? ... 'Danny used to. Now the model does. And Danny just believes it.'"
        }
      },
      {
        id: "belief",
        x: 40, y: 70, width: 20, height: 20,
        label: "Danny's Belief",
        interactions: {
          Inspect: "Danny didn't make a malicious mistake.",
          Analyze: "He made a human one. He looked at the output and chose to believe rather than to know.",
          Interrogate: "Why did you ship it? ... 'It looked right. I believed it.'"
        }
      }
    ]
  },
  {
    id: "real-shift",
    type: "comic",
    title: "The real shift",
    textBlocks: [
      "AI did not suddenly make software easy. It made one part of it cheap. Syntax.",
      "Which means the bottleneck moved.",
      "From: Who can write code?",
      "To: Who actually *knows* how the system works, instead of just believing the generated output?"
    ],
    imagePrompt: `Scene: ${characterConfig.name} (${characterConfig.appearance}) looking thoughtfully at a massive, complex web of interconnected glowing nodes. He is holding a physical notebook and pen, trying to map it out. Style: ${characterConfig.style}`,
    imageAlt: "A person looking thoughtfully at a complex web of interconnected nodes"
  },
  {
    id: "closing-case",
    type: "comic",
    title: "Closing the case",
    textBlocks: [
      "Danny still uses LLMs. Most engineers do.",
      "But he changed one habit. He stopped believing the code.",
      "Now he interrogates it. With tests. With static analysis. With domain validation.",
      "Because in the age of AI, the greatest risk isn't that the code is wrong. It's that it looks so right you stop trying to know."
    ],
    imagePrompt: `Scene: A classic detective's desk under a single hanging lightbulb. The desk is covered in printouts of code, a red pen, a magnifying glass, and a half-empty coffee mug. ${characterConfig.name} is leaning over the desk, scrutinizing the code. Style: ${characterConfig.style}`,
    imageAlt: "A detective's desk with code printouts, a red pen, and a coffee mug"
  }
];

// Populate comicPages after panels is defined so we can reference panels by index.
// Only the first 4 uploaded PNG images are used here; their artwork clearly matches
// the story beats they illustrate. Pages 5–8 had art that didn't fit their panels,
// so those panels are left out of comicPages and rendered via the SVG strip fallback
// in App.tsx (which shows any panel not already covered by a comicPage).
(function populateComicPages() {
  const p = panels;
  // 4 uploaded PNG images mapped to story narrative groups following the 8-beat arc:
  // Page 1 (1773597875498): intro + new-engineer        - Beat 1+2: The Setup
  // Page 2 (1773597878808): the-tools + cheap-part      - Beat 2+1: The Accelerant
  // Page 3 (1773597883925): pattern-mirrors + the-catch - Beat 1+3: The Pattern
  // Page 4 (1773597887326): symptoms + workflow         - Beat 3+2: The Belief
  const byId = Object.fromEntries(p.map(panel => [panel.id, panel]));
  comicPages.push(
    {
      id: 'comic-page-1',
      imageAlt: 'Comic page 1 – The Setup: a crime in the age of AI and the engineer who caused it',
      imageWidth: 1408, imageHeight: 768,
      panels: [byId['intro'], byId['new-engineer']],
    },
    {
      id: 'comic-page-2',
      imageAlt: 'Comic page 2 – The Accelerant: Danny\'s AI tools and why coding suddenly became cheap',
      imageWidth: 1408, imageHeight: 768,
      panels: [byId['the-tools'], byId['cheap-part']],
    },
    {
      id: 'comic-page-3',
      imageAlt: 'Comic page 3 – The Pattern: LLMs recombine patterns, not designs — and the first sign something is wrong',
      imageWidth: 1408, imageHeight: 768,
      panels: [byId['pattern-mirrors'], byId['the-catch']],
    },
    {
      id: 'comic-page-4',
      imageAlt: 'Comic page 4 – The Belief: strange search results appear, and Danny\'s trust in generated code put them there',
      imageWidth: 1408, imageHeight: 768,
      panels: [byId['symptoms'], byId['workflow']],
    },
  );
}());
