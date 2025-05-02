# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).


# Xavigate Superintelligent Onboarding + Memory System

This project implements a next-generation onboarding, memory, and personalization framework for the Xavigate diagnostic engine using the Alignment Dynamics (AD) and Multiple Natures (MN) systems. It builds on our existing session memory, persistent memory, and RAG infrastructure.

---

## 🧠 Core Capabilities (This Release)

- AI-mediated onboarding to assess alignment state, traits, and emotional posture
- Live session scoring and tagging (AX, AQ, ASS, TAS, SAS, alignment tags)
- Avatar Composer system that personalizes tone and prompt phrasing
- Memory architecture for session + persistent state management
- Tag-driven prompt selection, quadrant recalibration, and real-time modulation

---

## 🗂 Directory Structure

```bash
xavigate-intelligence/
├── backend/
│   ├── memory/
│   │   ├── models.py               # Tag, Avatar, Metric, and Session schemas
│   │   └── storage.py              # Interface for loading/saving session + persistent memory
│   ├── metrics/
│   │   ├── scoring_ax.py           # AX = (TAS + SAS) / 2
│   │   ├── scoring_aq.py           # 7-dimension AQ calculation
│   │   ├── scoring_tas.py          # Trait alignment score
│   │   └── scoring_sas.py          # Situational alignment score
│   ├── tags/
│   │   ├── registry.py             # All approved tag definitions
│   │   └── inference.py            # Trigger rules from session data
│   └── onboarding/
│       └── flow.py                 # Guided onboarding logic and tag estimation
│
├── frontend/
│   ├── avatar/
│   │   └── composer.tsx           # Input UI for Avatar shaping
│   ├── session/
│   │   ├── toneModulator.ts       # Modulates prompt tone based on tag/quadrant
│   │   └── reflectionUI.tsx       # Prompt + micro-alignment actions
│   └── onboarding/
│       └── wizard.tsx             # Onboarding assistant steps
│
├── data/
│   └── prompts.json               # Prompt library categorized by tag/quadrant
│
├── tests/
│   └── scoring.test.ts            # Unit tests for TAS, SAS, AX, AQ
│
├── docs/
│   └── architecture.md            # System diagrams and flows
└── README.md                      # You are here
```

---

## 🧬 Alignment Metrics Implemented

| Metric | Description | Range | Source |
|--------|-------------|--------|--------|
| TAS    | Trait Alignment Score | 0–10 | Trait usage/suppression【21†source】 |
| SAS    | Situational Alignment Score | 0–10 | Environmental fit【20†source】 |
| AX     | Alignment Index | 0–100 | (TAS + SAS) / 2【13†source】 |
| AQ     | Alignment Quotient | 0–100 | 7-dimension rubric【15†source】 |
| ASS    | Alignment Stability Score | 0–100 | Trend of AX over time【19†source】 |

---

## 🏷 Alignment Tags
Tags track patterns like burnout, quadrant drift, or suppressed traits. See `tags/registry.py` for definitions.

Each tag includes:
- `tag_id` (e.g. `creative_trait_suppression`)
- `category` (trait_misalignment, emotional_risk, etc.)
- `trigger_source` (onboarding, reflection, quadrant_transition...)
- `priority_level` (1–10)
- `memory_scope` (session or persistent)

Reference: [Alignment Tags Framework]【14†source】

---

## 🎭 Avatar Composer
Users define their preferred voice via:
- Real/fictive people or characters
- Archetypes or energy metaphors
- Relational role descriptions

The system parses this input to build a `tone_matrix` and modulates prompt tone in real time.

Reference: [Avatar Composer Spec]【16†source】

---

## 🧩 Next Steps (Implementation Plan)

1. **[ ] Set up alignment memory models** (metrics, tags, avatar)
2. **[ ] Implement TAS/SAS scoring pipeline**
3. **[ ] Create onboarding wizard** (frontend) + logic flow (backend)
4. **[ ] Tag inference engine + rules**
5. **[ ] Live session modulation and scoring**
6. **[ ] Prompt tone matching via Avatar Composer
7. **[ ] Historical memory tracking and trend logic (ASS)

---

## 🧪 Testing
Run unit tests for metric scoring with sample onboarding payloads:
```bash
pytest tests/
```

---

## 📚 References
- [Onboarding Flow]【18†source】
- [Session Flow Logic]【19†source】
- [Master Parameter List]【17†source】
- [TAS / SAS / AX Rubrics]【13†source】【20†source】【21†source】
- [AQ Scoring Rubric]【15†source】
- [Alignment Tags Spec]【14†source】
- [Avatar Composer System]【16†source】

---

Let’s make our AI remember who you are — and reflect it back with truth, nuance, and care.

