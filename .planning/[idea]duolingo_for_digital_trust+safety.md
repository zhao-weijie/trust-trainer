````markdown
# Trust Trainer — Turn Suspicious Content Into Safety Drills

## Elevator Pitch

**Trust Trainer turns suspicious digital content - emails, WhatsApp messages, webpages, social posts, screenshots, AI images, videos, ads, and viral claims - into safe, anonymized practice drills for everyone else.**

Instead of building a hand-authored phishing quiz, Trust Trainer creates a living challenge library from real-world suspicious content:

```text
submit suspicious content
-> redact private details
-> generate a safe challenge
-> family/friends practice
-> mistakes reveal weak skills
-> feedback improves future drills
```

The goal is not to tell users what is true or false.

The goal is to train the judgment to know what to do next.

---

## The Problem

AI has made convincing fake digital content cheap.

Many non-AI-native users do not yet know how to judge:

- whether a message, webpage, ad, listing, or post is a scam
- whether an image or video may be AI-generated
- whether a screenshot could be fabricated
- whether a confident claim is hallucinated
- whether a link is safe to click
- whether a post should be shared
- whether they should verify through an official source

Today, many people rely on workarounds:

- Googling the claim
- waiting for comments or Community Notes
- asking ChatGPT
- reverse-image searching
- ignoring everything
- forwarding it to a trusted human and asking, “Does this look real?”

That last behavior is the product wedge, but the product should not stop at direct messages.

People are already forwarding suspicious content to trusted relatives, taking screenshots of posts, pasting links into chats, and asking “does this look real?” Trust Trainer captures that behavior and turns any suspicious digital artifact into a privacy-conscious training flywheel.

---

## The Insight

The right training question is not:

> “Is this real or fake?”

The better question is:

> **“What should you do next?”**

In real life, the best answer is often not “fake.” It might be:

- do not click the link
- open the official website directly
- check the source
- ask a trusted person
- reverse-image search
- look for the original post
- do not forward yet
- treat it as an opinion, not a fact

Trust Trainer trains these practical decisions through short drills generated from the suspicious content people actually encounter across the web.

---

## Product Concept

Trust Trainer is a web-based companion game and challenge generator for AI-era media literacy.

Users can:

- paste, forward, upload, or link suspicious content
- get a plain-language red-flag analysis
- turn it into a safe family challenge
- send the challenge to a parent, friend, or group chat
- see which skills people missed
- contribute anonymized examples to a growing challenge library

Challenges cover formats people already encounter:

- SMS
- WhatsApp-style messages
- emails
- social posts
- webpages
- search results
- marketplace listings
- ads
- comments
- screenshots
- AI chatbot answers
- images
- short-form video
- voice-note scenarios

Each drill asks:

> **“What would you do?”**

Then Trust Trainer reveals the red flags, explains the safest next step in plain language, and tags the skill being trained.

---

## Example Challenge

```text
Forwarded by a user:

“Your package is on hold. Pay $1.99 redelivery fee within 2 hours:
parcel-update-sg.com”

What should you do?

A. Pay the fee
B. Click the link to check
C. Open the delivery company’s official app or website directly
D. Forward it to family
```

**Correct answer: C**

Why:

* It creates urgency.
* It asks for a small unexpected payment.
* The link is not clearly an official delivery company domain.
* In real life, open the official app or website directly.

Lesson:

> **Small payment + urgency + unfamiliar link = pause.**

The original artifact is redacted and converted into a reusable safe drill. It is mixed with legitimate examples so users learn contrastively instead of assuming everything is fake.

---

## Why This Is Different

Trust Trainer is not an AI detector and not a traditional phishing quiz.

It is **trust-but-verify practice for the modern internet**.

| Existing approach      | Limitation                                   | Trust Trainer                    |
| ---------------------- | -------------------------------------------- | ------------------------------------- |
| AI detectors           | Focus on whether content is AI-generated     | Trains what action to take            |
| Phishing simulations   | Mostly email-focused and enterprise-oriented | Consumer-friendly and multimodal      |
| Media literacy guides  | Educational but not interactive              | Practice-based and habit-forming      |
| Fact-checking sites    | Useful after suspicion exists                | Teaches when to become suspicious     |
| Asking a trusted human | Works, but does not scale                    | Converts forwarded examples into practice |

---

## Core Modes

### 1. Daily Trust Drills

Short 1–3 minute practice rounds that teach one skill at a time:

* spot fake urgency
* inspect a link
* identify vague authority
* check for original source
* avoid forwarding unverified claims
* recognize screenshot risk
* notice AI-image warning signs

### 2. Content-To-Drill

Users paste, upload, link, screenshot, or forward suspicious digital content. Trust Trainer converts it into:

* a redacted scenario
* multiple-choice next actions
* red-flag labels
* a plain-language explanation
* skill tags
* difficulty level

### 3. Family Challenge

Users can send the generated safe challenge to a parent, friend, or loved one.

Example:

> “Can you beat this 3-minute online safety challenge?”

This turns the common behavior of asking a trusted person into a shared learning loop.

### 4. Practice Mode

Users opt into simulated scam-style drills in safe, bounded environments.

Early version: in-app paste/upload/link submission.

Later versions: browser extension capture, email forwarding, SMS, WhatsApp, or other messaging channels where supported.

Practice drills never collect passwords, OTPs, payments, bank details, or sensitive information.

### 5. Check Something Suspicious

Users can paste, forward, link, screenshot, or upload suspicious content to a hosted checker.

Trust Trainer responds with:

* red flags
* recommended next action
* what skill this trains
* whether the user identified it correctly

### 6. Skill Graph

Trust Trainer tracks which instincts users are building:

* urgency traps
* link inspection
* vague authority
* screenshot skepticism
* source checking
* AI-image caution
* safe reporting

The product is not just “you got 8/10.” It says:

> “Your family is good at scam links, weak on fake screenshots.”

---

## Privacy and Trust

Trust Trainer should be open-source and privacy-conscious by design.

Users should be able to verify:

* what data is collected
* what content is stored
* how examples are generated
* how scores are used
* whether submitted content is used for training

Default principles:

* no secret testing of non-consenting people
* no collection of real credentials, OTPs, payment data, or bank details
* no simulated scams sent outside explicit opt-in
* no public sharing of uploaded examples without consent
* user-submitted examples are private by default
* users can delete their submissions and progress
* raw content is redacted before becoming a reusable challenge
* challenge examples store normalized scenarios, not private originals

The goal is to teach trust without asking users to trust another black box.

---

## How It Works

Trust Trainer combines three layers:

### 1. User-Sourced Challenge Library

A growing dataset of realistic examples across scam, misinformation, dark-pattern, and AI-content categories. The best examples come from what users already receive, see, screenshot, paste, link, and forward:

* delivery scam
* bank alert scam
* fake government notice
* investment scam
* fake charity appeal
* fake screenshot
* hallucinated citation
* AI-generated image
* breaking-news rumor
* miracle health claim
* impersonation message
* fake product listing
* deceptive ad
* misleading chart
* suspicious investment page
* AI-generated review

These are interspersed with legitimate examples to keep users on their toes and to teach them how to verify legitimate communication.

### 2. AI Challenge Generator

OpenAI extracts and generates:

* risk category
* safest next action
* wrong-but-plausible answers
* red flags
* skill tags
* plain-language explanation
* synthetic variants for practice

The live demo should show raw suspicious content becoming a playable drill in seconds.

### 3. Convex-Powered Game Backend

Convex handles:

* challenge sessions
* invite links
* answer tracking
* skill progress
* difficulty levels
* family groups
* feedback on challenge quality
* submitted examples for review
* live leaderboard or family skill graph

### 4. Dataset Improvement Loop

User submissions, answers, misses, and feedback become structured training/eval data.

Adaption can help generate variants, normalize labels, redact sensitive information, and create consistent challenge formats across difficulty levels and modalities.

```text
raw submitted artifact
-> PII redaction
-> normalized scenario
-> challenge + answer choices
-> skill labels
-> family performance data
-> better challenge generation
```

---

## MVP

The first version should focus on a simple web game plus a visible content-to-challenge pipeline:

1. **Submit suspicious content**

   * paste text
   * upload screenshot
   * paste URL
   * import webpage snippet
   * choose content type
   * show redaction step

2. **Generate a playable drill**

   * safest next action
   * wrong-but-plausible choices
   * red flags
   * skill tags
   * difficulty level

3. **20–30 seeded realistic challenges**

   * SMS
   * email
   * WhatsApp-style message
   * screenshot
   * image
   * social post
   * AI chatbot answer

4. **Multiple-choice decision flow**

   * click
   * ignore
   * verify
   * ask someone
   * report
   * do not share

5. **Red-flag reveal**

   * what was suspicious
   * what action was safest
   * what rule to remember

6. **Family invite link**

   * no install required
   * short session
   * shareable result summary

7. **Skill graph / flywheel dashboard**

   * submitted examples
   * generated drills
   * most-missed skills
   * cleaned dataset rows

---

## Why Now

AI has made fake content, fake images, fake screenshots, convincing scam messages, deceptive ads, and synthetic webpages easier to produce.

The next bottleneck is not detection.

It is judgment.

People need a safe place to practice the habits that protect them online:

> pause, inspect, verify, and avoid sharing too quickly.

Trust Trainer helps users build those instincts before the stakes are real, using the suspicious content already spreading through inboxes, group chats, feeds, search results, ads, and webpages.

Misinformation, scams, and AI slop spread through every digital surface. To reduce the spread, Trust Trainer turns each suspicious artifact into a training example that improves the next person’s judgment.

---

## One-Line Pitch

**Trust Trainer turns suspicious digital content into safe, anonymized practice drills that teach families when to click, ignore, verify, report, or pause before sharing.**

---

## Tagline Options

* **Submit once. Train everyone.**
* **Turn suspicious content into drills.**
* **Build your AI radar.**
* **Trust, but verify — safely.**
* **Duolingo for digital trust.**
* **Scam drills for the AI internet.**
* **Learn when to pause.**
* **Online street smarts for the AI age.**
