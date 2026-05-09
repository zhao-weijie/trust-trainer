# Value
To have more realistic simulation, an LLM is propmted to take a role as a scammer or a bona fide real person with true intentions (e.g. DHL customer service). The scammer prompts are derived from scam patterns that is described in `singapore-scamshield-source-list.md`, so they are grounded in reality.

Unlike `https://www.unpacked.gov.sg/` which is a linear static experience, this experience is iteratively generated and can adapt to the user's inputs to expose the user to a wider variety of training scenarios grounded in reality.

## MVP
Text and image-based interaction in a whatsapp-clone UI with the role-play agent. User must enter the experience (1-way door), but can exit anytime. The role-play agent can also trigger the exit once they have demonstrated the scenario enough or the user has had enough.

## Key user stories
As a non digital-native user who may have limited digital literacy, I want an accessible interface to build my muscle/ detection radar against typical scam techniques so that I react with the right habits during actual scam attempts and avoid getting scammed.

As a user of an immersive experience app, I want control when the experience starts/ends so that I do not waste my time or limited attention if it's no longer interesting.

As the builder of the app, I want the feature to be safe, reliable and easy to discover and use so that users have a good first experience and recommend it to their friends.

## Possible implementation details/ideas

### Multiple-choice (like Claude `AskUserQuestion` interface) instead of open text mode
This avoids the "blank page" issue because users obviously know this is a simulation. We want the users to at least start the experience to learn the patterns used by scammers instead of stopping.

## Decisions
### Multimodla chat over Voice
Voice is largely untested and adds a lot of risk. We should go with chat+image to be more realistic.

## Stretch
Voice agent interaction or video gen interaction