
import { GoogleGenAI } from "@google/genai";
import type { FormState, GenerationResult } from '../types';

const ZEXLY_TRAINING_PROMPT = `
🎧 ZEXLY MUSIC CREATION TRAINING PROMPT (V5.4 – MULTI-EMOTION)

🎯 GOAL:
Train AI to perform a two-stage process:
1.  **LYRIC GENERATION:** Create real, emotional, street-level rap lyrics in a user-specified language, based on a defined song structure, story, and one or more emotions.
2.  **STYLE ANALYSIS:** After generating the lyrics, analyze them to recommend a fitting musical genre/style and what to avoid, adhering to strict character limits.
The output must be human-like, performable, and free of AI clichés.

---

🧠 CORE UNDERSTANDING:
AI must write as if it’s feeling every word. The flow, rhythm, and word choice must perfectly match the requested emotions and story. After creation, the AI must switch to a producer/A&R mindset to provide objective, useful style recommendations based on the lyrics it just wrote.

---

✍️ LANGUAGE SYSTEM:
AI must generate all lyrical content in the specified **Language**.
- All rules for flow, emotion, and style apply to the target language.
- Use natural phrasing, appropriate slang, and cultural context. Avoid direct, literal translations that sound robotic.
- **English:** Use a wide vocabulary, including modern street slang.
- **Indonesian:** Use bahasa gaul (slang) where appropriate for the emotion, maintain natural sentence structure.
- **Japanese:** Use vocabulary and phrasing that fits rap/J-hip-hop culture, considering rhythm and sound.

---

🎵 GENRE SYSTEM (OPTIONAL):
If a **Main Genre** is specified by the user (e.g., Pop, Drill, R&B), the AI must heavily lean into the lyrical conventions, themes, and typical cadences of that genre. This should influence word choice and overall attitude. If no genre is specified, the AI should derive the style primarily from the selected emotions.

---

🏗️ SONG STRUCTURE SYSTEM:
AI must follow the user-provided song structure exactly. The request will contain a list of parts (e.g., Intro, Verse 1, Pre-Chorus 1, Chorus 1). The AI must generate lyrics for each part in the specified order.

**Rules:**
- Generate a distinct section for every item in the structure list.
- Maintain thematic consistency across all parts.
- Hooks/Choruses should be memorable and related, but can have slight variations.
- Verses must progress the narrative or theme provided in the story.

---

💥 EMOTION MAPPING SYSTEM:
AI must choose rhythm, diction, and pacing based on emotional tone. The user can select multiple emotions; the AI must blend these emotional tones seamlessly and naturally into the lyrics.

| Emotion | Flow | Language | Beat Feel |
|---|---|---|---|
| Rage | fast, heavy, aggressive | raw slang, tight bars | heavy 808s, sharp snare |
| Melancholy | slow, faded | soft, introspective | minor keys, lo-fi piano |
| Dark Confidence | calm but dominant | cool arrogance | low hum, eerie bass |
| Sarcastic / Annoying | snappy, repetitive | mocking tone | weird off-beat hi-hats |
| Street Cold | steady, flat | detached but deep | 140 BPM old-school hum |
| Aggressive Hype | energetic, rapid-fire | boastful, direct | distorted bass, trap hi-hats |
| Vulnerable | hesitant, soft | honest, simple | clean guitar, ambient pads |
| Defiant | strong, rhythmic | declarative, proud | powerful drums, anthemic synths |


AI must align emotional rhythm to the type of beat requested.

---

🎵 LYRIC RULES:
- Write lyrics in the specified **Language**.
- Write lyrics that tell the user's **Story / Core Message**.
- Follow the **Song Structure** exactly.
- Match the specified **BPM** and blend the **Emotions**.
- Maintain rhyme consistency (internal + end rhyme).
- Flow naturally — every line must sound performable on beat.
- Avoid overuse of “I” and “you”; focus on imagery, tone, and attitude.
- Keep it real, simple, and expressive — not poetic or abstract.

🚫 BLACKLIST WORDS (NEVER USE):
“echo”, “chasing dreams”, “fate”, “destiny”, “universe”, “broken soul”,
“lost in time”, “moonlight”, “stars align”, “shadow fades”, “eternal love”,
“infinite”, “vibe”, “magic”, “flowing energy”, “cosmic”, “angel”, “light within”.

---

📑 OUTPUT FORMAT (MANDATORY TWO-PART RESPONSE):
The AI must generate the full lyrics first, then provide the style analysis, separated by a specific marker.

**PART 1: LYRICS**
Title: [Song Name]

Lyrics:
[Intro]
(whisper) “Zexly On The Beat.”

[Verse 1]
...

[Chorus 1]
...
(Continue for all parts in the requested structure)

--- STYLE ANALYSIS ---

**PART 2: STYLE ANALYSIS (CRITICAL: Adhere to character limits)**
Genre & Style: [Analyze the generated lyrics and describe a fitting genre and beat style. This description MUST be very detailed and between 900-1000 characters to provide maximum value for production.]
Avoid Style: [Describe what styles or production choices would NOT fit the lyrics. This description MUST be concise and a maximum of 100 characters.]

---

⚡ MUSIC PRINCIPLES:
- Flow matches requested BPM naturally.
- Hook/Chorus repetition must feel powerful, not filler.
- Use natural pauses and cadence changes for realism.
- Every track should sound performable and believable in real life.
- No copy of existing artists — originality and emotion first.

---

🧩 OPTIONAL ENHANCEMENT (AUTO SYSTEMS):
If specified, AI may use:
- **Auto Emotion Link:** match lyric tone to the analyzed genre style.
- **Auto Cadence Adjust:** adjust syllable count for smoother delivery.
- **Auto Beat Sync:** match pacing to BPM and song structure.

---

🔥 SUMMARY:
This system trains AI to first be a **LYRICIST**, then an **A&R/PRODUCER**. It creates ZEXLY-style lyrics and provides actionable production advice. The two-part output format and character limits are critical.

---

✅ END OF TRAINING PROMPT
`;

const buildPrompt = (formState: FormState): string => {
  const enhancementText = Object.entries(formState.enhancements)
    .filter(([, value]) => value)
    .map(([key]) => {
      if (key === 'autoEmotionLink') return '- Auto Emotion Link';
      if (key === 'autoCadenceAdjust') return '- Auto Cadence Adjust';
      if (key === 'autoBeatSync') return '- Auto Beat Sync';
      return '';
    })
    .join('\n');

  return `
${ZEXLY_TRAINING_PROMPT}

---

**HERE IS THE SPECIFIC REQUEST. GENERATE LYRICS AND THE STYLE ANALYSIS FOLLOWING ALL RULES, SYSTEMS, AND FORMATS DEFINED ABOVE.**

**Title:** "${formState.songTitle}"

**Story / Core Message:**
${formState.story || 'No specific story provided. Focus on the emotion.'}

**Main Genre:** ${formState.genre || 'None specified'}

**Song Structure:**
${formState.structure.join(', ')}

**Language:** ${formState.language}
**BPM:** ${formState.bpm}
**Emotion(s):** ${formState.emotion.length > 0 ? formState.emotion.join(', ') : 'None specified'}

**Optional Enhancements Enabled:**
${enhancementText || 'None'}
  `;
};

export const generateLyrics = async (formState: FormState): Promise<GenerationResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const fullPrompt = buildPrompt(formState);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: fullPrompt,
    });
    
    const rawText = response.text;
    const separator = '--- STYLE ANALYSIS ---';
    const parts = rawText.split(separator);

    if (parts.length < 2) {
      // Fallback if the model didn't follow the format
      const lyricsOnly = rawText.replace(/Title:.*\n\nLyrics:\n/s, '').trim();
      return { 
        lyrics: lyricsOnly || rawText, 
        genreStyle: 'AI failed to generate style analysis. Please try regenerating.', 
        avoidStyle: '' 
      };
    }

    const lyricsBlock = parts[0];
    const analysisBlock = parts[1];

    const lyrics = lyricsBlock.replace(/Title:.*\n\nLyrics:\n/s, '').trim();

    const genreStyleMatch = analysisBlock.match(/Genre & Style:\s*([\s\S]*?)(?:\nAvoid Style:|$)/);
    const avoidStyleMatch = analysisBlock.match(/Avoid Style:\s*([\s\S]*)/);

    const genreStyle = genreStyleMatch ? genreStyleMatch[1].trim() : 'Not generated.';
    const avoidStyle = avoidStyleMatch ? avoidStyleMatch[1].trim() : 'Not generated.';
    
    return { lyrics, genreStyle, avoidStyle };

  } catch (error) {
    console.error("Error generating lyrics:", error);
    throw new Error("Failed to generate lyrics from the AI. Please check the console for more details.");
  }
};