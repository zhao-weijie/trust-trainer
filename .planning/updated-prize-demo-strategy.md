# Updated Prize And Demo Strategy

## New Intro Guidance

- More unhinged is better, as long as the product remains legible.
- Polish matters. Seven hours is enough time for AI-assisted builders to ship something that looks finished.
- Demo hook must land in the first 5-10 seconds.
- After the hook, show only the secret sauce. Avoid feature touring.
- Make judging easy: pick only relevant tracks, explain the project in one line, show a working path, keep the demo tight.

## Prize Tracks From Intro

### Main Prizes

- Overall 1st: 3,000 SGD, AI Engineer ticket, 15k OpenAI API credits, 2.5k Cursor credits, 5,000 Daytona credits, 100k Cloudflare credits.
- Overall 2nd: 2,000 SGD, AI Engineer ticket, 10k OpenAI API credits, 1.5k Cursor credits, 5,000 Daytona credits, 50k Cloudflare credits.
- Overall 3rd: 1,000 SGD, AI Engineer ticket, 5k OpenAI API credits, 1k Cursor credits, 5,000 Daytona credits, 25k Cloudflare credits.

### OpenAI / Codex

- Best use of GPT-5.5 and Codex.
- Best use of GPT Realtime 2 or GPT Realtime Translate.
- Best use of GPT Image 2.
- Prize: 1-year ChatGPT Pro/Codex for top 2 teams in each OpenAI track.

### Adaption Labs

- 1st: US$1,500 cash + 1.5k credits.
- 2nd: US$1,000 cash + 1k credits.
- 3rd: US$500 cash + 500 credits.

### Other Sponsor Tracks Visible In Slides

- Best use of Cursor SDK: 3 winners, 1 year of Cursor Ultra each.
- Fal: US$1,000 in Fal credits.
- One slide mentions US$500 gift cards for 1st and 2nd place teams, but the track label is not readable from the photo.
- One slide mentions a remarkable tablet for the winner, but the track label is not readable from the photo.
- One slide mentions US$1,000 credits for the project with the most used connectors, likely a connector-heavy sponsor track; label is partly unreadable.

## Revised Strategy For SecondLook

Primary target: Overall winner.

The idea is socially useful, but that alone will not win. The demo must feel slightly deranged in the first seconds: a live feed of absurdly confident AI-internet claims, scammy screenshots, fake studies, miracle health advice, finance bait, and synthetic breaking news. SecondLook stamps the risky parts in-place before the user shares them.

Backup target: OpenAI / Codex.

OpenAI must be in the core loop:

- GPT-5.5 classifies warning categories and writes plain-language explanations.
- Codex is used to generate/repair site-specific extractors or warning rules during the demo or build story.
- GPT Image 2 can be used only if image/screenshot caution is a visible demo pillar. Do not bolt it on.

Secondary backup: Adaption Labs.

Adaption only makes sense if the feedback loop is visible:

```text
warning fired -> user marks helpful/false alarm -> structured feedback row -> cleaned training example -> next classifier version
```

If that loop is not demo-visible, do not list Adaption as a target. Judges explicitly said to pick tracks where the tool is meaningfully part of the demo.

## Demo Arc

### 0:00-0:10 Hook

"This is your parent's internet now."

Show a fake social feed with a share button. The user is about to share a post:

"Doctors confirm this fruit lowers blood pressure by 60% in two weeks. Big Pharma hates this."

SecondLook instantly stamps it:

- Needs a source
- Medical claim
- Specific number
- Pause before sharing

This must happen visually, not verbally.

### 0:10-0:45 Secret Sauce

Show the warning card:

- What triggered it
- Why it matters
- What the user should do
- Confidence phrased as caution, not fake certainty

Then trigger 2-3 more examples fast:

- Fake screenshot from a public figure
- "Experts say" claim with no named expert
- AI-generated breaking-news image with no provenance

### 0:45-1:30 Sponsor Loop

Show the system path:

```text
visible page content -> warning classifier -> plain-language caution -> user feedback -> private collaborative signal -> cleaned training row
```

This is the secret sauce. Not "we call an LLM." The secret is warning classification plus judgment training plus data improvement.

### 1:30-End Prestige

"SecondLook is not a truth oracle. It is the common-sense layer your browser needs for the AI internet."

Show final dashboard:

- 12 risky claims seen
- 5 warnings accepted as helpful
- 2 repeated claims seen across pages
- 1 cleaned training batch ready

## Build Priorities

1. Polished fake-feed page with extension overlay.
2. Three warning categories: source-free serious claim, vague authority, image/screenshot caution.
3. One-click feedback.
4. Convex or local simulated signal store.
5. Training-data export view for Adaption.
6. Optional Codex angle: show generated rule/extractor or repo working path.

## Cut List

- Real fact checking.
- Real browser-store extension packaging.
- Full multi-site support.
- Account system.
- Complex settings.
- Real retraining.
- Any sponsor integration not shown on screen.

## Brutal Assessment

SecondLook can win if it becomes a memorable anti-slop browser layer. It will lose if it presents as a careful civic-tech essay. Make the first screen ridiculous, make the overlay beautiful, then make the data loop credible.
