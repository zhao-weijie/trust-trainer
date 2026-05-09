# Singapore ScamShield Source List

Accessed: 2026-05-09  
Primary source: ScamShield, Singapore Government. ScamShield pages checked here show "Last Updated 23 Apr 2026."

Use this as a government education taxonomy and source pack for Trust Trainer drills. Do not present these pages as a raw verified incident corpus. They are best used for labels, red flags, safest actions, and locally relevant scenario design.

## Core Scam Types

| Scam type | Official source | Trust Trainer fit |
|---|---|---|
| Government officials impersonation scams | https://www.scamshield.gov.sg/i-want-protection-from-scams/learn-to-recognise-scams/government-officials-impersonation-scams/ | Impersonation, authority pressure, banking credential theft, OTP theft, transfer/asset handover requests. |
| Investment scams | https://www.scamshield.gov.sg/i-want-protection-from-scams/learn-to-recognise-scams/investment-scams/ | High-return/low-risk bait, crypto wallet transfers, fake profit dashboards, withdrawal traps. |
| Job scams | https://www.scamshield.gov.sg/i-want-protection-from-scams/learn-to-recognise-scams/job-scams/ | Task scams, upfront payment, account mule risk, Singpass credential risk. |
| E-commerce scams | https://www.scamshield.gov.sg/i-want-protection-from-scams/learn-to-recognise-scams/e-commerce-scams/ | Fake listings, off-platform payment, fake proof of payment, fake refund/payment links. |
| Phishing scams | https://www.scamshield.gov.sg/i-want-protection-from-scams/learn-to-recognise-scams/phishing-scams/ | Email/SMS/call/ad phishing, spoofed domains, malicious links, OTP/password/card theft. |
| Fake friend call scams | https://www.scamshield.gov.sg/i-want-protection-from-scams/learn-to-recognise-scams/fake-friend-call-scams/ | WhatsApp/call impersonation, "new number" pretext, urgent loan requests, PayNow transfers. |
| Loan scams | https://www.scamshield.gov.sg/loan-scams/ | Unsolicited loan offers, social ads, upfront transfer before loan disbursement, illegal lender impersonation. |

## Trend And Report Sources

| Source | Link | Why it matters |
|---|---|---|
| ScamShield 2025 Scams and Cybercrime Briefs | https://www.scamshield.gov.sg/2025-scams-cybercrime-briefs/ | Annual and mid-year official context for losses, volumes, and priority scam categories. |
| ScamShield 2026 Scams Bulletins | https://www.scamshield.gov.sg/2026-scams-bulletins/ | Monthly examples of current scam education themes, useful for demo freshness. |
| Scam Trends / ScamsExposed | https://www.icanactagainstscams.gov.sg/scam-trends | Public education site for evolving scam trend awareness. |
| Police news releases | https://www.police.gov.sg/media-room/news | Official enforcement/advisory stream for specific scams and public alerts. |

## Official Verification And Safety Sources

| Situation | Source | Link |
|---|---|---|
| General "verify with official sources" guidance | ScamShield | https://www.scamshield.gov.sg/verify-with-official-sources/ |
| Government SMS sender ID checks | gov.sg SMS Sender ID | https://www.sms.gov.sg/ |
| gov.sg SMS sender ID exceptions | gov.sg SMS exceptions | https://www.sms.gov.sg/exceptions |
| Anti-malware/security app recommendations | Cyber Security Agency of Singapore | https://www.csa.gov.sg/resources/tips-and-resources/recommended-security-apps-list/ |
| Investment entity checks | MAS Financial Institutions Directory | https://eservices.mas.gov.sg/fid |
| Financial representative checks | MAS Financial Institution Representatives Register | https://eservices.mas.gov.sg/rr |
| Investment warning list | MAS Investor Alert List | https://www.mas.gov.sg/investor-alert-list |
| Safer e-commerce platform checks | MHA E-commerce Marketplace Transaction Safety Ratings | https://www.mha.gov.sg/e-commerce-marketplace-transaction-safety-ratings |
| Licensed moneylender checks | Ministry of Law Registry of Moneylenders | https://rom.mlaw.gov.sg/ |

## Government-Official Impersonation Article Links From The Source Page

These are linked from the ScamShield government-official impersonation page. The `go.gov.sg` links are official short links; keep them as source references unless resolving them is useful for a specific drill.

| Title | Link | Notes |
|---|---|---|
| 10-second pause saved her from losing five-figure sum to a scam | https://go.gov.sg/straitstimesgoisarticle1 | Public education story linked by ScamShield. |
| Urgent calls from the police or the bank? Learn how to know if it's a scam | https://go.gov.sg/start04 | Public education article linked by ScamShield. |
| More fall victim to scammers posing as local and foreign officials | https://go.gov.sg/start12 | Public education article linked by ScamShield. |
| Received an SMS from the Government? Here's an easy way to tell if it's real | https://go.gov.sg/start19 | Useful for gov.sg SMS sender ID lessons. |
| Why people fall prey to scammers posing as police officers | https://go.gov.sg/start23 | Useful for authority-pressure and social-engineering lessons. |
| The Impersonation Scam That Almost Cost My Mum Her Life Savings | https://www.ricemedia.co/mum-life-savings-impersonation-scam/ | Non-government narrative source linked by ScamShield; useful as anecdotal context only, not as official data. |

## Labeling Notes For Seeds

- Use `scope_status: in_scope_phishing_or_scam` for suspicious drills derived from these scam patterns.
- Use `benign_contrast` only for legitimate government/bank/company communications that are sourced from official channels and do not ask for unsafe actions.
- Do not label generic advertising or nuisance spam as phishing.
- Defang suspicious URLs in any generated examples, for example `hxxps://example[.]com/login`.
- Prefer safest actions that match ScamShield's Add, Check, Tell framing: add protections, check with official/trusted sources, tell/report/block and call the bank/police if money was transferred.
