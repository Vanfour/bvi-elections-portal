# Missing Pages — BVI Elections Portal
> Analysis based on navigation items, CTAs, and button labels found across all 26 existing screens.

---

## Project Structure (After Reorganization)

```
stitch_remix_of_bvi_v2/
├── design-system/docs/       ← DESIGN.md (Sovereign Ledger system)
├── candidates/               ← 14 screens
├── voters/                   ← 10 screens
└── poll-workers/             ← 2 screens
```

---

## Global Navigation (appears on every page)

| Nav Item | Existing Page | Status |
|---|---|---|
| For Voters | `voters/upcoming-events-v1` | ✅ Exists |
| For Candidates | `candidates/upcoming-elections` | ✅ Exists |
| For Poll Workers | `poll-workers/layout-1` | ✅ Exists |
| Important Dates | — | ❌ **Missing** |
| Election Results | `voters/election-results` + `candidates/election-results` | ⚠️ Role-specific only, no global hub |
| News & Policies | — | ❌ **Missing** |

---

## 🌐 GLOBAL — Missing Pages (not role-specific)

### 1. Home / Landing Page
**Priority: CRITICAL**
No entry point exists. Every existing page assumes the user is already inside a section. A public-facing homepage is needed that:
- Welcomes the public
- Routes visitors to: For Voters / For Candidates / For Poll Workers
- Shows current election status (upcoming / active / no election)
- Links to Important Dates, News, and Election Results

---

### 2. Important Dates
**Priority: HIGH**
Appears in the top nav on **every single page** but has no target. Should be a standalone calendar/timeline page showing all key electoral dates (Nomination Day, Campaign Period, Election Day, Result Certification).

---

### 3. News & Policies (Global Hub)
**Priority: HIGH**
Top nav item on every page. Individual role sections have news feeds, but there is no global news/policies hub. This page should aggregate all announcements, policy documents, and notices across all user groups.

---

### 4. Global Election Results Hub
**Priority: HIGH**
"Election Results" appears in the top nav. Role-specific results pages exist for voters and candidates, but no global results hub exists with full district-by-district breakdown, candidate vote counts, and historical results.

---

### 5. Contact Us
**Priority: MEDIUM**
Present in the footer of **every page** as a link. No contact page has been designed (address, phone, email, office hours, map).

---

### 6. Login / Authentication Screen
**Priority: HIGH**
Poll workers have a "Login to Portal" button but there is no login screen designed. Candidates may also need a login for their portal/dashboard.

---

### 7. Search Results Page
**Priority: MEDIUM**
A "SEARCH WEBSITE" element is referenced in the compact mobile screen. No search results page exists.

---

### 8. Accessibility Statement
**Priority: LOW**
Linked in every footer. No page exists.

---

### 9. Sitemap / 404 Error Page
**Priority: LOW**
Both are linked in footers but not designed.

---

## 🗳️ FOR VOTERS — Missing Pages

### 10. Voter Registration Form
**Priority: CRITICAL**
"Register to Vote" is the #1 CTA on voter screens (appears prominently on all voter states). There is no registration form or flow:
- Eligibility check step
- Personal information entry
- Confirmation / success state

---

### 11. Voter Registration Status Check
**Priority: HIGH**
Buttons labeled **"Check My Status"** and **"Check Status"** appear across multiple voter screens. No lookup/result page exists where a voter can verify their registration.

---

### 12. Find My Polling Station
**Priority: HIGH**
**"Find My Polling Place"** and **"Find Polling Station"** are major CTAs on voting day screens. No map, search, or lookup page exists. Should show the voter's assigned polling location with address and hours.

---

### 13. Advance Poll Application
**Priority: MEDIUM**
An **"Apply for Advance Poll"** button appears on voting day screens for voters who cannot vote on election day. No application form or confirmation page exists.

---

### 14. Voter FAQs
**Priority: MEDIUM**
A FAQs section with questions like *"How do I register?"* and *"Am I eligible?"* appears on voter screens, but there is **no dedicated Voter FAQs page**. The FAQ hub only exists for Candidates.

---

### 15. Voter News & Notices (Dedicated Page)
**Priority: MEDIUM**
Voters see news cards/previews but there is no full voter news listing page (equivalent to `candidates/news-notices`).

---

## 🏛️ FOR CANDIDATES — Missing Pages

### 16. "Prepare to Run" — Candidate Onboarding Flow
**Priority: CRITICAL**
**"Prepare to Run"** is the primary CTA on **every single candidate screen**. It leads to `#` (nowhere). This is the most important missing flow — it should cover:
- Eligibility requirements
- How to register as a candidate
- Step-by-step nomination guide
- Confirmation / next steps

---

### 17. Candidate Requirements Page
**Priority: HIGH**
"Review Candidate Requirements" is listed as a key action in `candidates/key-actions`. No dedicated requirements page exists.

---

### 18. Nomination Submission Form
**Priority: HIGH**
Candidate FAQs include *"How do I submit my nomination?"* and *"Can I edit my nomination after submission?"* — but no nomination form or submission flow is designed.

---

### 19. Campaign Finance Guidance
**Priority: MEDIUM**
"Get Campaign Finance Guidance" is a listed key action. No page exists covering spending limits, reporting requirements, or forms.

---

### 20. Forms & Documents Download
**Priority: MEDIUM**
"Download Forms & Documents" is a listed key action. No page or document library exists.

---

### 21. Post-Election Guidance for Candidates
**Priority: LOW**
A "Post-Election Guidance" button appears on the candidate election results screen. No page exists covering what candidates should do after results are certified (concession process, recounts, etc.).

---

## 👷 FOR POLL WORKERS — Missing Pages

### 22. Become a Poll Worker — Application Form
**Priority: HIGH**
Both poll worker screens have a "Become a Poll Worker" section with a "Learn More" link. No application form or eligibility page exists.

---

### 23. Poll Worker Login Screen
**Priority: HIGH**
"Login to Portal" is the primary CTA on both poll worker screens. No login screen is designed.

---

### 24. Poll Worker Dashboard (Post-Login)
**Priority: HIGH**
After logging in, poll workers need a dashboard showing:
- Their assigned polling station
- Shifts and reporting times
- Training materials / checklist
- Election day instructions

---

### 25. Poll Worker Training Resources
**Priority: MEDIUM**
No training/onboarding resource page is designed for new or returning poll workers.

---

## Summary — Priority Order

| # | Page | Role | Priority |
|---|---|---|---|
| 1 | Home / Landing Page | Global | 🔴 Critical |
| 2 | Voter Registration Form | Voters | 🔴 Critical |
| 3 | "Prepare to Run" Onboarding | Candidates | 🔴 Critical |
| 4 | Login / Authentication | Global | 🟠 High |
| 5 | Important Dates | Global | 🟠 High |
| 6 | News & Policies Hub | Global | 🟠 High |
| 7 | Global Election Results Hub | Global | 🟠 High |
| 8 | Voter Registration Status Check | Voters | 🟠 High |
| 9 | Find My Polling Station | Voters | 🟠 High |
| 10 | Candidate Requirements Page | Candidates | 🟠 High |
| 11 | Nomination Submission Form | Candidates | 🟠 High |
| 12 | Poll Worker Application Form | Poll Workers | 🟠 High |
| 13 | Poll Worker Login Screen | Poll Workers | 🟠 High |
| 14 | Poll Worker Dashboard | Poll Workers | 🟠 High |
| 15 | Advance Poll Application | Voters | 🟡 Medium |
| 16 | Voter FAQs | Voters | 🟡 Medium |
| 17 | Voter News & Notices | Voters | 🟡 Medium |
| 18 | Campaign Finance Guidance | Candidates | 🟡 Medium |
| 19 | Forms & Documents | Candidates | 🟡 Medium |
| 20 | Poll Worker Training Resources | Poll Workers | 🟡 Medium |
| 21 | Contact Us | Global | 🟡 Medium |
| 22 | Search Results | Global | 🟡 Medium |
| 23 | Post-Election Guidance | Candidates | 🟢 Low |
| 24 | Accessibility Statement | Global | 🟢 Low |
| 25 | Sitemap / 404 Page | Global | 🟢 Low |
