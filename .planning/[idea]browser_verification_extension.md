 ````markdown
# Trust Trainer — A Warning Classifier for the AI Internet

## Elevator Pitch

**Trust Trainer is an open-source browser extension that helps non-AI-native users know when to pause before believing or sharing online content.**

As AI-generated text, fake images, synthetic screenshots, and hallucinated claims become common across social media and the web, many everyday users do not yet have the instincts to spot what deserves skepticism. They may not know what “hallucination” means, how realistic AI images can look, or how easily a confident post can invent studies, sources, or quotes.

Trust Trainer does not try to be the final judge of truth. Instead, it acts as a **warning classifier**: it flags posts, images, screenshots, and claims that deserve a second look.

Its purpose is simple:

> **Help people gradually build their "dubious assertion detector radar” while they browse.**

---

## The Problem

The internet is becoming synthetic faster than ordinary users can adapt.

Many non-AI-native users, including older adults and less technical users, struggle to quickly judge whether online content is:

- real or AI-generated
- factual or hallucinated
- sourced or made up
- a personal opinion or a serious claim
- safe to trust, share, buy, or act on

Today, verification is too much work. Users may need to open new tabs, search for sources, reverse-image search, check dates, compare articles, ask ChatGPT, wait for Community Notes, or ask a more AI-native person they trust.

For example, many people already rely on a workaround like:

> “I’ll ask my child / friend / colleague whether this looks real.”

That is a real signal of unmet need. If someone has to ask a trusted human every time they are unsure, the browser itself is missing a basic safety layer.

Most users will not verify everything. Many do not even know when verification is needed.

---

## The Insight

The product should not ask:

> “Is this true or false?”

That is too hard, too brittle, and often requires external evidence.

Instead, the product should ask:

> **“Would a normal user benefit from a warning here?”**

Trust Trainer helps users notice the moments where they should pause:

- a health claim with no source
- a financial claim with a specific number
- a screenshot that may be fabricated
- an image with no provenance
- a post saying “experts say” without naming experts
- a breaking-news image that may be out of context
- a confident AI-style explanation with no citation

The goal is not to replace judgment.

The goal is to train judgment.

---

## Product Concept

Trust Trainer runs as a lightweight browser extension.

As users browse Reddit, X, Facebook, WhatsApp Web, Substack, news sites, blogs, or search results, it quietly scans visible content and highlights risky moments in plain language.

Example warnings:

> **Needs a source**  
> This post makes a health claim with a specific number, but no source is shown.

> **Image caution**  
> No verified origin was found for this image. Because the caption describes breaking news, check a trusted source before sharing.

> **Screenshot caution**  
> Screenshots are easy to fake. Look for the original post or official source.

> **Vague authority**  
> This says “experts say” but does not name or link to the experts.

Trust Trainer avoids technical jargon. It does not say:

> “Synthetic probability: 78%.”

It says:

> **“Pause before sharing.”**

---

## Why This Is Different

Most AI detection tools try to classify content as AI-generated or human-written.

Trust Trainer is different.

It is not just an AI detector.

It is a **user judgment trainer**.

| Existing tools | Trust Trainer |
|---|---|
| Detect AI-generated content | Detect moments that deserve caution |
| Give binary labels | Give plain-language warnings |
| Focus on authorship | Focus on user risk |
| Often cloud-based | Local-first where possible |
| Built for experts, teachers, or moderators | Built for everyday internet users |
| Says “AI” or “not AI” | Says “pause, check, or ignore” |

Trust Trainer is not trying to win an argument about whether something is AI-generated.

It is helping the user build better instincts.

---

## Current Alternatives, Substitutes, and Workarounds

There are many tools that solve pieces of this problem, but few are designed for non-AI-native users who do not yet know what to be skeptical of.

### 1. AI Text Detectors

Tools like GPTZero, Copyleaks, Pangram, and other AI detectors try to determine whether text was written by AI.

These are useful in some contexts, but they focus on authorship rather than user risk. A human-written post can still be false, and an AI-assisted post can still be accurate.

Trust Trainer focuses on:

> “Does this deserve caution?”

not:

> “Was this written by AI?”

### 2. AI Image Detectors

Some tools try to detect whether an image was AI-generated.

This is useful, but it can be unreliable and lacks context. An AI-generated fantasy image is harmless. An AI-generated image attached to breaking news, politics, scams, or medical advice is much more important.

Trust Trainer looks at both the image and the surrounding context.

### 3. Provenance and Content Credential Tools

Tools based on Content Credentials or C2PA can help users inspect whether an image has signed provenance metadata.

These are valuable, but coverage is uneven. Many images online have no provenance information, and most everyday users do not know how to interpret metadata.

Trust Trainer can use provenance as one signal, but translates it into plain-language guidance.

### 4. Community Notes and Platform Labels

Platforms like X and Meta use community notes or labels to add context to misleading posts.

These can be helpful, but they are platform-specific, often arrive late, and only cover a fraction of content.

Trust Trainer is browser-wide and can warn the user before a community note exists.

### 5. Manual Search and Reverse-Image Search

Motivated users can Google the claim, search the headline, check fact-checking sites, or reverse-image search.

But this requires the user to already suspect something is wrong.

Trust Trainer helps with the earlier moment:

> “Should I check this at all?”

### 6. Asking a Trusted Human

Many non-AI-native users ask someone they trust:

> “Does this look real?”  
> “Is this AI-generated?”  
> “Can I believe this?”  
> “Should I share this?”

This is one of the clearest signs of the problem.

Trust Trainer does not replace trusted humans. It gives users an always-available first layer of guidance, so they can build their own instincts over time.

---

## How It Works

Trust Trainer combines three layers:

### 1. Local Warning Classifier

A small model runs in the browser and classifies visible content into warning categories:

- health claim without source
- financial claim without source
- legal claim without source
- specific statistic without citation
- vague authority claim
- fake urgency
- likely screenshot risk
- image provenance risk
- possible synthetic or slop-like content
- low-risk personal opinion

The model’s job is not to verify truth.

Its job is to decide:

> **Should this user be nudged to pause?**

### 2. Collaborative Signal Layer

A Convex-powered backend can store privacy-preserving signals such as:

- this claim has appeared on many sites
- users found a source for this claim
- users marked this warning as helpful
- users said this was a false alarm
- similar images appeared with different captions

This creates a lightweight community memory without turning the product into a political voting system.

The goal is not mob fact-checking.

The goal is better prioritization and useful context.

### 3. Dataset Improvement Loop

User feedback becomes training data.

Adaption can help clean, reshape, and standardize feedback into better datasets for future small local models.

The loop:

```text
Local model flags risky content
→ user rates warning as helpful / not helpful
→ Convex stores privacy-minimal feedback
→ Adaption turns feedback into clean training data
→ improved local warning classifier
```

Over time, Trust Trainer gets better at knowing when to warn and when to stay quiet.

---

## Privacy and Trust

Trust Trainer is open-source because users should not have to trust a black-box browser extension to protect them from black-box AI content.

The extension is local-first: claims, images, and posts are analyzed in the browser whenever possible.

By default, Trust Trainer does **not** upload:

* browsing history
* full page text
* private messages
* screenshots
* raw images
* full URLs
* personal conversations

For collaborative filtering, Trust Trainer only shares the minimum useful signal, such as:

* hashed claim fingerprints
* coarse warning categories
* domain-level context
* image perceptual hashes
* optional user feedback such as “helpful” or “false alarm”

Users can choose between:

| Mode                      | What happens                                                             |
| ------------------------- | ------------------------------------------------------------------------ |
| **Local Only**            | Nothing leaves the browser                                               |
| **Private Collaborative** | Minimal hashed signals help identify repeated claims and useful warnings |
| **Contribute Evidence**   | User explicitly submits a source, claim, or note to help others          |

The backend is handled by Convex, with a transparent schema and open-source backend logic so people can inspect what is collected, how it is stored, and how collaborative filtering works.

The goal is simple:

> **Help people browse the AI internet more safely without turning their browsing into a dataset.**

---

## Example User Journey

A parent sees a viral post:

> “Doctors confirm this fruit lowers blood pressure by 60% in just two weeks.”

Normally, they might send it to a more AI-native family member and ask:

> “Is this real?”

With Trust Trainer, the browser highlights it and says:

> **Needs a source**
> This is a health claim with a specific number, but no source is shown. Check before believing or sharing.

The user does not need to understand hallucinations, LLMs, or AI image generation.

They just learn:

> “Specific health claim + no source = pause.”

After seeing these cues repeatedly, they gradually build their own radar.

---

## MVP

The first version focuses on three high-value warning types:

### 1. Serious Claims Without Sources

Health, finance, legal, political, or safety claims that lack visible evidence.

### 2. Image and Screenshot Caution

Images, screenshots, or breaking-news visuals with weak provenance or risky context.

### 3. Vague Authority Claims

Phrases like:

* “experts say”
* “a study proves”
* “doctors confirm”
* “research shows”

without a named or linked source.

---

## Why Now

AI has made convincing content cheap.

The next bottleneck is not content creation.

It is trust.

People need lightweight help deciding what deserves attention, skepticism, or verification. This is especially important for users who did not grow up with AI tools and do not yet have an intuitive feel for hallucinations, synthetic media, or generated misinformation.

Trust Trainer gives them that intuition gradually, in context, while they browse.

---

## One-Line Pitch

**Trust Trainer is an open-source browser extension that helps non-AI-native users build their AI detector radar by warning them when online claims, images, or screenshots deserve a second look.**

---

## Tagline Options

* **Pause before you believe.**
* **A second look for the AI internet.**
* **Your browser’s common-sense layer.**
* **Helping everyday users spot what deserves skepticism.**
* **A warning classifier, not a truth oracle.**
* **Browse safely without becoming an AI expert.**