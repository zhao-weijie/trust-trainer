# Trust Trainer Prompt Library

Reusable prompt files for generating reviewed synthetic training artifacts. Generated outputs must still enter admin review before becoming playable drills.

## fal.ai Seed Image Edit Prompts

| ID | Prompt file | Seed image | Model | Purpose |
|---|---|---|---|---|
| singapore-gov-impersonation-singpass-cpf | `prompts/fal-edits/singapore-gov-impersonation-singpass-cpf.txt` | `web/public/fal-seeds/messenger-scam-template.png` | `fal-ai/nano-banana-2/edit` | Singapore government impersonation drill involving Singpass, CPF, and bank verification pressure. |

## Teaching Labels

### singapore-gov-impersonation-singpass-cpf

```yaml
scope_status: in_scope_phishing_or_scam
threat_type: government_impersonation_credential_theft
risk_level: high
red_flags:
  - new account
  - government impersonation
  - urgent suspension threat
  - asks for bank information
  - private-chat verification
safest_action: Do not reply or click links. Open the official Singpass app or type gov.sg manually, then report the account.
skill_tags:
  - official_source_check
  - impersonation
  - credential_safety
  - urgency_trap
```

Suggested quiz:

```yaml
scenario: A fake Singapore government support account claims your Singpass access is tied to suspicious CPF and bank activity, then asks which bank you use before sending a verification step.
answer_choices:
  - id: A
    text: Reply with your bank name so they can confirm whether your account is affected.
  - id: B
    text: Do not reply. Open the Singpass app or official gov.sg site directly and report the account.
  - id: C
    text: Ask the account to send the verification link first, then inspect it.
  - id: D
    text: Forward the chat to family and ask who has the same issue.
correct_answer: B
explanation: A real Singapore government service will not verify Singpass, CPF, or bank access through a random social account or private chat. The safest move is to stop replying and use an official channel directly.
```
