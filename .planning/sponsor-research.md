# AI Engineer Hackathon – Sponsor & Judge Research

---

### 📊 Ranked Prize Targets & Rationale

| Rank | Prize Track | Why It’s High‑Value | Effort to Win |
|------|-------------|---------------------|---------------|
| **S1** | **Overall 1st/2nd/3rd** (Cash + AIE ticket + OpenAI + Cloudflare) | Largest cash purse, prestigious ticket, massive Cloudflare/OpenAI credits that can be reused beyond the hackathon. Winning overall signals broad excellence. | High – needs a polished, end‑to‑end demo that impresses generalist judges and hits multiple sponsor tracks. |
| **S2** | **Gemini – Best Gen Media Track** / **Best Voice Agent Track** ($2.5k Gemini credits each) | Gemini credits are valuable for prototyping; the tracks are focused, making it easier to align a narrow idea with judge expectations. | Medium – requires deep use of Lyria/Veo 3 (media) or Gemini flash‑3.1‑live (voice). |
| **S3** | **OpenAI/Codex – Best use of GPT‑5.5 or GPT‑Image 2** (1‑year ChatGPT Pro/Codex) | Direct access to the frontier models; winning gives you a year of Pro tier (worth >$200). Judges are likely OpenAI‑aligned engineers. | Medium – must showcase a non‑trivial, novel use of the latest model (not just a wrapper). |
| **S4** | **Fal – Best use of Fal** ($1,000 credits) | Simple API for generative media; good if your project needs image/video generation and you want quick credits. | Low‑Medium – Fal is easy to integrate; credits are modest but useful. |
| **S5** | **Convex – Best use of Convex** ($500 gift cards ×2) | Convex is a compelling backend; winning shows you can build a real‑time, data‑driven app. | Low‑Medium – requires authentic use of Convex queries/mutations, not just a passthrough. |
| **S6** | **Cursor – Best use of Cursor SDK** (Cursor Ultra for 1 yr) | Cursor Ultra is a premium AI‑powered editor; valuable for continued development. | Low – best if your hack involves building a dev‑tool or agent that extends Cursor. |
| **S7** | **Adaption Labs** (Cash + credits) | Cash prizes are attractive, but the sponsor is less known; may have niche judge focus. | Low‑Medium – depends on understanding Adaption Labs’ product (likely an AI dev platform). |
| **S8** | **Daytona / Hyperspell / ElevenLabs / Vercel** (Participant credits) | These are participation‑level credits; not a track prize but can reduce build costs. | None – just sign up and claim. |

**Takeaway:** Aim for **Overall 1st** if you can build a broadly impressive demo; otherwise, **Gemini Media/Voice** or **OpenAI Track** offer the best prize‑to‑effort ratio.

---

### 🧠 Sponsor/Judge Thesis (3‑5 Bullets)

- **Sponsors want to see their tech as an *enabler*, not just a wrapper.** Demos that merely call an API without custom logic, fine‑tuning, or creative chaining will be deprioritized.
- **Judges (likely sponsor engineers + AI community leaders) value:**
  - *Technical depth*: novel use of the latest models (GPT‑5.5, Gemini Flash‑3.1‑live, Lyria/Veo 3) or clever integration of backend/services (Convex, Cursor SDK, Fal).
  - *Demo impact*: a clear, repeatable “wow” moment that can be explained in <30 seconds.
  - *Utility*: something that solves a tangible problem (even if toy‑sized) rather than a pure art piece unless it’s in the Gemini Media track.
- **Cloudflare & Vercel** will favor apps that are *deployed* on their platforms (Workers/Pages, Vercel Edge) and showcase performance/scalability.
- **ElevenLabs & Gemini Voice** tracks reward *audio quality* and *latency*—think real‑time voice agents or expressive narration.
- **OpenAI/Codex** judges will look for *agentic* behavior, tool use, or creative prompting that goes beyond basic completion.

---

### 🛠️ Tool Choices That Help Win (Not Just What’s Available)

| Sponsor | Winning‑Angle Tool Choice | Why It Wins |
|---------|---------------------------|-------------|
| OpenAI/Codex | **Fine‑tune GPT‑5.5 on a niche dataset** *or* **build a multi‑step agent that uses Codex to generate and validate code** | Shows you can push the model beyond prompting; agents demonstrate “reasoning” and “tool use.” |
| Gemini (Media) | **Lyria for custom soundtrack generation + Veo 3 for short‑form video** *combined* with a voice‑over from ElevenLabs | Uses two flagship Gemini models in a cohesive audio‑visual piece—hard to ignore. |
| Gemini (Voice) | **Gemini flash‑3.1‑live for low‑latency, interruptible voice agent** *paired* with a retrieval tool (e.g., Convex or custom API) | Demonstrates real‑time, conversational AI—a hot topic. |
| Cloudflare | **Deploy the frontend/backend on Cloudflare Workers + AI Workers (if available)** *or* **use Cloudflare Stream for media** | Proves you can run at the edge; Workers are a differentiator vs. generic Vercel/Netlify. |
| Vercel | **Use Vercel AI SDK + Edge Config** *and* **preview deployments with GitHub integration** | Shows familiarity with Vercel’s AI‑first tooling; easy for judges to replicate. |
| Convex | **Leverage real‑time subscriptions for live collaborative UI** *or* **use Convex’s built‑in auth + scheduled functions** | Highlights Convex’s strength: instant consistency and backend‑less dev. |
| Cursor | **Build a Cursor extension that uses the SDK to refactor/generate code based on natural language** | Directly showcases the SDK’s power; judges can try it themselves. |
| Fal | **Use Fal’s image/video models for rapid prototyping of creative assets** *then* **pipe those assets into Gemini or ElevenLabs** | Fal’s speed lets you generate high‑quality media on the fly—great for demo polish. |
| ElevenLabs | **Create a multilingual, expressive voice narrator for your demo** *or* **a voice‑controlled agent** | Their voice quality is a clear differentiator if used well. |
| Daytona / Hyperspell | **Use Daytona for instant, reproducible dev environments** (helps team speed) *or* **Hyperspell for semantic search over your data** | Less likely to be a judge focus, but can be credited as “well‑engineered.” |

---

### ⚠️ Red Flags & Sponsor Traps

- **“Generic wrapper” risk:** Simply calling `openai.chat.completions.create` or `gemini.generate_content` with a hard‑coded prompt looks lazy. Add fine‑tuning, tool use, or chain‑of‑thought.
- **Over‑reliance on credits:** Sponsors may scrutinize whether you actually *need* their credits or just grabbed them for the prize. Show a plausible usage plan (e.g., “We’ll use 2k Gemini Veo‑3 seconds to render a 10‑second clip”).
- **Demo fragility:** Avoid reliance on unstable APIs (rate‑limited beta endpoints). Have a fallback mock or cached responses.
- **Ignoring the judge’s time:** Judges see many demos. Your “wow” must appear within the first 30 seconds; burying the novelty kills chances.
- **Mis‑tracking prizes:** Some tracks (e.g., Convex) only award top 2 teams—if you’re not confident you can be top‑tier, consider a different track.
- **License/IP traps:** Double‑check that any generated content (especially with Gemini Veo 3/Lyria) is hackathon‑eligible; some models restrict commercial use.

---

### 💡 Concrete Project Angles That Fit the Room

| Angle | Sponsor Tracks Hit | Core Demo “Wow” | Quick Feasibility Check |
|-------|-------------------|----------------|------------------------|
| **1. Real‑time Multilingual Voice Agent for Live Events** | Gemini Voice, ElevenLabs, Cloudflare (Workers), Convex (state) | Agent listens to stage audio, translates + answers audience questions in <500 ms, with expressive voice. | Use Gemini flash‑3.1‑live + ElevenLabs for translation+voice; Convex for session state; Cloudflare for low‑latency edge. |
| **2. AI‑Generated Micro‑Documentary (60‑sec) from a News Prompt** | Gemini Media (Lyria+Veo 3), Fal (B‑roll), OpenAI (script), ElevenLabs (narration) | Input a headline → AI writes script, generates custom music (Lyria), creates b‑roll video (Veo 3/Fal), assembles with voiceover. | All APIs are generative; stitching can be done client‑side; demo shows end‑to‑end pipeline in <2 min. |
| **3. Collaborative Coding Playground with AI Pair‑Programer** | Cursor SDK, OpenAI Codex, Convex (real‑time sync), Vercel (deployment) | Multiple users edit a notebook; AI suggests next blocks, explains changes via voice (ElevenLabs), and runs code instantly. | Cursor SDK gives you editor hooks; Codex for suggestions; Convex for shared state; Vercel for quick deploy. |
| **4. Personalized AI Comic Strip Generator** | Fal (character generation), Gemini Image 2 (backgrounds), OpenAI (dialogue), ElevenLabs (speech bubbles as audio) | User describes a scenario → AI creates consistent characters, generates panels, adds dialogue, optionally reads aloud. | Fal for consistent characters; Gemini Image 2 for scenes; simple compositing in canvas; strong visual wow. |
| **5. AI‑Powered Local Business Concierge (Voice + Map)** | Gemini Voice, ElevenLabs, Cloudflare Workers (for geo‑lookup), Convex (business data) | User speaks “Find vegan cafés near me with outdoor seating”; agent replies with options, hours, and can call/book via voice. | Shows tool use (API calls) + real‑time voice; integrates location + voice naturally. |

**Recommendation:** Pick **Angle 1** (real‑time voice agent) if you want to hit multiple high‑value sponsors (Gemini Voice, ElevenLabs, Cloudflare, Convex) and deliver a clear, impressive demo. If your team is stronger in generative media, go with **Angle 2** for the Gemini Media track.

---
