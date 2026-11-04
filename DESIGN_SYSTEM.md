# EduConnect - Design System Specification
**Version:** 1.0.0  
**Design Philosophy:** Modern, Trustworthy, Aspirational & Distraction-Free EdTech Platform  
**Target Audience:** Engineering & University Students preparing for high-stakes placement drives & Faculty/Placement Coordinators  
**Accessibility Target:** WCAG 2.1 AA Compliant across all Light and Dark modes

---

## 1. Brand Identity & Principles

### 1.1 Brand Archetype & Persona
- **Archetype:** *The Sage & The Catalyst* — Knowledgeable, empowering, rigorous, yet empathetic to student anxiety during placement seasons.
- **Visual Personality:** Crisp typography, calm slate and deep indigo tones, high-clarity data visualizations, purposeful motion, zero clutter.
- **Core Principles:**
  1. **Cognitive Calm:** High-stakes exam prep is mentally taxing. Interfaces minimize visual noise, eliminate unnecessary ornaments, and emphasize readability.
  2. **Affirmative Clarity:** Immediate feedback on actions, obvious next steps, clear progress milestones, and zero ambiguity on exam timers or submission states.
  3. **Credibility & Trust:** Official university badges, "Verified" job badges with provenance metadata (verifier, timestamp, source link), transparent scoring, peer percentile benchmarks.
  4. **Universal Accessibility:** 100% keyboard navigable, high-contrast text ratios (minimum 4.5:1 for body text, 3:1 for large display), reduced-motion adaptability.

---

## 2. Color Palette & Semantic Tokens

EduConnect features a dual-theme token architecture (Light & Dark) calibrated for extreme readability and minimal eye strain during prolonged late-night study sessions.

### 2.1 Primary & Neutral Tokens

| Token Name | Light Mode (HEX / HSL) | Dark Mode (HEX / HSL) | Usage / Intent |
| :--- | :--- | :--- | :--- |
| `color-primary-50` | `#EEF2FF` / `226 100% 97%` | `#0F172A` / `222 47% 11%` | Subdued surface tint / active background |
| `color-primary-100` | `#E0E7FF` / `226 100% 94%` | `#1E293B` / `217 33% 17%` | Hover pills, light container highlight |
| `color-primary-500` | `#6366F1` / `239 84% 67%` | `#818CF8` / `234 89% 74%` | Brand primary, action highlights |
| `color-primary-600` | `#4F46E5` / `243 75% 59%` | `#6366F1` / `239 84% 67%` | Main CTA buttons, active tab indicator |
| `color-primary-700` | `#4338CA` / `244 58% 51%` | `#4F46E5` / `243 75% 59%` | Button active/pressed states |
| `color-background` | `#F8FAFC` / `210 40% 98%` | `#090D16` / `222 47% 6%` | Canvas / application backdrop |
| `color-surface` | `#FFFFFF` / `0 0% 100%` | `#111827` / `222 47% 11%` | Card surfaces, modals, popovers |
| `color-surface-elevated` | `#FFFFFF` / `0 0% 100%` | `#1E293B` / `217 33% 17%` | Dropdowns, tooltips, floating widgets |
| `color-border` | `#E2E8F0` / `214 32% 91%` | `#2D3748` / `215 25% 23%` | Structural borders, card outlines |
| `color-border-subtle` | `#F1F5F9` / `210 40% 96%` | `#1E293B` / `217 33% 17%` | Inner dividers, table row lines |
| `color-text-main` | `#0F172A` / `222 47% 11%` | `#F8FAFC` / `210 40% 98%` | Primary headings, prominent body copy |
| `color-text-muted` | `#64748B` / `215 16% 47%` | `#94A3B8` / `215 20% 65%` | Helper text, secondary stats, captions |
| `color-text-subtle` | `#94A3B8` / `215 20% 65%` | `#64748B` / `215 16% 47%` | Placeholders, inactive icons |

### 2.2 Semantic & State Tokens

| Role | Token Key | Light Value | Dark Value | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Success** | `color-success-50` | `#ECFDF5` | `#064E3B` | Positive banner backgrounds |
| | `color-success-500` | `#10B981` | `#34D399` | Answered questions, verified badges, pass marks |
| | `color-success-600` | `#059669` | `#10B981` | Completed test states, high accuracy |
| **Warning** | `color-warning-50` | `#FFFBEB` | `#78350F` | Review alert background |
| | `color-warning-500` | `#F59E0B` | `#FBBF24` | Marked for review, deadline approaching |
| | `color-warning-600` | `#D97706` | `#F59E0B` | Critical warnings, timer `< 5 min` |
| **Destructive** | `color-danger-50` | `#FEF2F2` | `#7F1D1D` | Error background, negative marking indicator |
| | `color-danger-500` | `#EF4444` | `#F87171` | Incorrect answer, delete modal, urgent alert |
| | `color-danger-600` | `#DC2626` | `#EF4444` | Negative marking penalty callout |
| **Info / Accent** | `color-info-50` | `#F0F9FF` | `#0C4A6E` | Informational callouts |
| | `color-info-500` | `#0EA5E9` | `#38BDF8` | In-progress exams, category tags |
| | `color-accent-amber`| `#D97706` | `#F59E0B` | Streak badges, top ranking badges |

---

## 3. Typography Scale & Hierarchy

EduConnect adopts a high-performance modern font stack:
- **Heading Display:** `Plus Jakarta Sans`, sans-serif (Clean geometric proportions, distinct letter terminals, authoritative presence)
- **Body & Data:** `Inter`, system-ui, sans-serif (Optimal micro-legibility for complex mathematical formulas, options, and tables)
- **Code & Tech Snippets:** `JetBrains Mono`, `Fira Code`, monospace (For technical CS MCQs, code snippets, and keyboard hints)

### 3.1 Type Scale

| Style / Token | Size | Line Height | Tracking | Weight | Semantic HTML / Element |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display 2XL** | `2.5rem` (40px) | `1.15` (46px) | `-0.025em` | Bold (700) | Landing Hero, Celebration Score |
| **Heading XL** | `2.0rem` (32px) | `1.2` (38px) | `-0.02em` | SemiBold (600) | Main Dashboard Heading, Exam Title |
| **Heading LG** | `1.5rem` (24px) | `1.3` (31px) | `-0.015em` | SemiBold (600) | Card Headers, Modal Titles |
| **Heading MD** | `1.25rem` (20px) | `1.4` (28px) | `-0.01em` | Medium (500) | Section Subheadings, Question Prompt |
| **Body Large** | `1.125rem` (18px) | `1.55` (28px) | `0em` | Regular (400) | Reading articles, Newsletter body |
| **Body Base** | `1.0rem` (16px) | `1.5` (24px) | `0em` | Regular (400) / Medium | Standard UI text, MCQ options |
| **Body Small** | `0.875rem` (14px) | `1.45` (20px) | `0em` | Regular / Medium (500) | Table cells, Chat messages, Meta tags |
| **Caption / Micro** | `0.75rem` (12px) | `1.4` (16px) | `+0.01em` | Medium (500) | Palette buttons, Timestamps, Badges |

---

## 4. Spacing, Elevation & Surface Architecture

EduConnect adheres strictly to an 8-point spatial grid with a 4-point micro-grid for fine adjustments.

### 4.1 Spacing Scale
- `space-1`: `4px` (Inline icon-text gaps)
- `space-2`: `8px` (Compact padding, badge insets)
- `space-3`: `12px` (Button horizontal padding, list item gaps)
- `space-4`: `16px` (Standard card padding, input fields)
- `space-6`: `24px` (Section gaps, modal padding)
- `space-8`: `32px` (Grid gaps, dashboard widget margins)
- `space-12`: `48px` (Major layout structural separation)

### 4.2 Border Radius Scale
- `radius-sm`: `6px` (Tags, chips, small badges)
- `radius-md`: `10px` (Buttons, inputs, question palette squares)
- `radius-lg`: `14px` (Cards, dropdowns, newsletter cards)
- `radius-xl`: `20px` (Modals, chatbot sheet, floating widget)
- `radius-full`: `9999px` (Avatars, pills, streak counters)

### 4.3 Shadows & Surface Elevation
- **Level 0 (Flat):** `border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900`
- **Level 1 (Card Hover / List item):** `0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)`
- **Level 2 (Active Widget / Card Rest):** `0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)`
- **Level 3 (Modal / Floating Chatbot / Palette):** `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)`
- **Glassmorphism Accent:** `backdrop-blur-md bg-white/85 dark:bg-slate-900/85 border border-white/20 dark:border-slate-700/30`

---

## 5. Component Library Specifications

### 5.1 Buttons
- **Primary:** Gradient/Solid `bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm transition-all active:scale-[0.98]`
- **Secondary:** `bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100`
- **Outline:** `border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60`
- **Ghost:** `text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800`
- **Danger:** `bg-rose-600 hover:bg-rose-700 text-white font-medium`
- **Verified Badge Button:** Small rounded-full chip with Lucide `ShieldCheck` icon, tooltip displaying verification timestamp, faculty name, and audit source.

### 5.2 Exam Engine Specific UI
1. **Countdown Timer:**
   - Normal state (`> 10m`): Deep indigo text with gentle pulsing clock icon.
   - Caution state (`< 10m`): Amber text, subtle outline pulse.
   - Critical state (`< 3m`): Red bold text, alert icon, sticky top bar prominence.
2. **Question Palette (Grid of 15 to 30 buttons):**
   - **Answered:** Emerald solid background (`bg-emerald-500 text-white`)
   - **Marked for Review:** Amber solid background (`bg-amber-500 text-white`)
   - **Answered & Marked for Review:** Violet background with amber badge dot
   - **Not Answered:** Slate outlined background (`border-slate-300 dark:border-slate-700 text-slate-600`)
   - **Current Active Question:** Prominent Indigo ring (`ring-2 ring-indigo-500 ring-offset-2`)
3. **MCQ Option Card:**
   - Large clickable touch target (`min-h-[56px]`), radio circle on left, option letter (A, B, C, D) in rounded pill, clean text styling.
   - Selected state: `border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-500`.
   - Review mode: Correct answers highlighted in Emerald with explanation card beneath; student incorrect choices highlighted in Rose with differential feedback.

### 5.3 Verified Job Card Component
- **Header:** Company logo / initial avatar, Job Title, Company Name, Location & Work Mode (Remote / Onsite / Hybrid).
- **Verified Pill:** Glowing verified icon: `Verified by Placement Cell` with hover metadata popover.
- **Metadata Strip:** Role Type (Full-time / 6M Internship), Stipend / CTC range, Batch Eligibility, Application Deadline with relative time countdown ("Closes in 3 days").
- **Action Bar:** "Apply via Official Link" (external link icon), Bookmark (heart/star icon), "Mark as Applied" tracker toggle, "Report Link Issue" modal trigger.

### 5.4 Placement Chatbot Component ("CampusPrep AI")
- **Floating Widget:** Bottom-right floating action pill (`right-6 bottom-6`) with smooth expanding popover.
- **Full Page Mode:** Dedicated split-view workspace (`/chat`) with previous chat sessions drawer, prompt suggestions, and interactive grounding citations.
- **RAG Citations:** Inline clickable chips referencing portal exams (e.g. `[Aptitude Exam: TSD-02]`), study materials (`[OS Cheat Sheet PDF]`), and current job opportunities (`[Google SWE Intern 2026]`).
- **Contextual Action:** "Ask AI to explain this question" button on every post-exam review card.

---

## 6. Accessibility & Motion Guidelines

1. **Reduced Motion:** All transitions respect `@media (prefers-reduced-motion: reduce)` using standard CSS fallbacks.
2. **Focus Rings:** High-visibility `ring-2 ring-indigo-500 ring-offset-2 ring-offset-background` on all interactive keyboard tab stops.
3. **Screen Readers:** ARIA live regions for exam timer countdown, live question status announcements, and chatbot streaming content buffers.
4. **Color Contrast:** Every text combination is audited against WCAG AA standards (4.5:1 minimum). Color is never the sole indicator of status (always combined with icons or text labels).
