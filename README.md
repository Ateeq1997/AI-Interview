# 🎯 AI Interview Session Configurator

A production-quality React 18 + TypeScript + Tailwind CSS application built for a frontend developer assessment. Users configure a custom AI interview session, review an order summary, apply coupons, and complete a mock payment.

---

## 📋 Table of Contents

- [Setup & Running](#setup--running)
- [Project Structure](#project-structure)
- [Features](#features)
- [State Management Approach](#state-management-approach)
- [Dependency Rules](#dependency-rules)
- [Testing](#testing)
- [What I Would Improve](#what-i-would-improve)

---

## ⚙️ Setup & Running

### Prerequisites
- **Node.js** v18 or higher
- **npm** v9 or higher

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd ai-interview-configurator

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**

### Other commands

```bash
npm run build      # Build for production (outputs to /dist)
npm run preview    # Preview the production build locally
npm test           # Run all unit tests
npm run test:watch # Watch mode for tests
```

### Using your own question bank data

Replace `src/data/question-bank-data.json` with the provided `question-bank-data.json` file. The app loads it automatically.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── configure/
│   │   ├── InterviewTypeSelector.tsx  # Interview type buttons + System Design rule
│   │   ├── DifficultySelector.tsx     # Difficulty pills
│   │   ├── TopicsInput.tsx            # Tag-style topic input
│   │   ├── DurationSelector.tsx       # Duration cards
│   │   └── AddOnsSelector.tsx         # Add-on checkboxes + Expert Review rules
│   ├── checkout/
│   │   ├── OrderSummary.tsx           # Full price breakdown
│   │   ├── CouponSection.tsx          # Hidden coupon input with fake API delay
│   │   └── PaymentForm.tsx            # Name/email validation + mock payment
│   └── ui/
│       ├── NavBar.tsx                 # Sticky navigation
│       ├── PriceDisplay.tsx           # Animated price number
│       ├── Spinner.tsx                # Loading spinner
│       └── Tooltip.tsx                # Hover tooltip for disabled states
├── context/
│   └── ConfigContext.tsx             # Global state: useReducer + Context
├── pages/
│   ├── ConfigurePage.tsx             # Route: /configure
│   ├── CheckoutPage.tsx              # Route: /checkout
│   └── QuestionBankPage.tsx          # Route: /question-bank
├── utils/
│   ├── pricing.ts                    # calculatePrice + applyCoupon functions
│   └── localStorage.ts              # Save/load/expire config with TTL
├── types/
│   └── index.ts                     # All TypeScript types and constants
├── test/
│   ├── dependencyRules.test.tsx     # RTL test: System Design disable/enable
│   ├── couponLogic.test.ts          # Unit test: SAVE10, FIRST50, invalid codes
│   └── setup.ts                     # @testing-library/jest-dom setup
├── data/
│   └── question-bank-data.json      # 500-item question bank (replace with yours)
└── main.tsx                         # App entry point + routes
```

---

## ✨ Features

### Screen 1 — Configure (`/configure`)

| Field | Details |
|---|---|
| Interview Type | Technical, Behavioral, System Design, Mixed |
| Difficulty | Junior (1.0×), Mid (1.2×), Senior (1.5×), Lead (1.8×) |
| Topics | Free-text tag input, Enter to add, click to remove, 1–5 topics |
| Duration | 15 min ($10), 30 min ($20), 45 min ($35), 60 min ($50) |
| Add-ons | AI Follow-up (+$5), Report (+$10), Video (+$8), Expert Review (+$25) |

**Live price formula:** `Total = (base price × difficulty multiplier) + sum of add-ons`

**Example:** 30 min ($20) × Mid (1.2×) = $24 + Follow-up ($5) + Report ($10) = **$39.00**

The price number animates with a scale+color flash on every change.

### Screen 2 — Checkout (`/checkout`)

- Full order summary with every line item
- Name (2-word minimum) and email validation with inline errors
- Coupon input hidden behind "Have a coupon?" toggle with 1.5s fake API delay
- Mock payment with processing / success / failure states
- Responsive: side-by-side on desktop, stacked on mobile

### Question Bank (`/question-bank`)

- Loads 500 questions from the provided JSON file
- Real-time search by title
- Filter by difficulty and topic
- Performant: `useMemo` for filtering, `React.memo` + `useCallback` for rows

---

## 🗂 State Management Approach

The interview configuration state is managed with **React Context + useReducer**. Here's why:

### Why not useState?
The configuration has multiple fields that interact with each other through dependency rules. Managing four interdependent fields with separate `useState` calls leads to scattered, hard-to-test logic. A reducer centralises all transitions.

### Why useReducer?
All four dependency rules are enforced **atomically inside the reducer**:

```
SET_DIFFICULTY(Junior) → in one dispatch:
  • sets difficulty to Junior
  • clears interviewType if it was System Design  (Rule 1)
  • removes Expert Review from addOns             (Rule 4)
```

This is predictable, pure, and easy to unit test.

### Why Context over Redux/Zustand?
The state shape is small (one `InterviewConfig` object) and only needs to be shared between two routes. Adding Redux would be significant overhead for no benefit. Context + useReducer is idiomatic, zero-dependency React.

### Side-effect toasts
Toast notifications are **decoupled from the reducer** (which stays pure). A `useEffect` watches `state.config` via a `prevConfig` ref and fires toasts when it detects specific transitions (e.g. Expert Review was in prev but not in curr when difficulty is now Junior).

### Checkout state
Coupon state (`couponCode`, `couponDiscount`) lives as local `useState` in `CheckoutPage` — it's not shared anywhere else, so Context would be overkill.

---

## 🔗 Dependency Rules

All four rules are implemented in the reducer and tested:

| Rule | Trigger | Effect | Toast |
|---|---|---|---|
| **1** | System Design selected | Only enabled for Senior/Lead. Disabled + tooltip for others. | Auto-deselects with toast if difficulty changes to Junior/Mid |
| **2** | Mixed type selected at 15 min | Duration auto-switches to 30 min | "Mixed interviews require at least 30 minutes." |
| **3** | Duration switches to 15 min | Expert Review auto-unchecked + tooltip | "Expert Review requires at least 30 minutes — it has been removed." |
| **4** | Difficulty switches to Junior | Expert Review auto-unchecked + tooltip | "Expert Review is not available for Junior difficulty — it has been removed." |

---

## 🧪 Testing

Two test suites using **React Testing Library** and **Vitest**:

```bash
npm test
```

### `dependencyRules.test.tsx`
Verifies Rule 1 (System Design button disabled/enabled) across all four difficulty levels:
- Junior → disabled ✓
- Mid → disabled ✓  
- Senior → enabled ✓
- Lead → enabled ✓

### `couponLogic.test.ts`
Pure unit tests for the `applyCoupon` function:
- `SAVE10` returns $10 when subtotal > $30 ✓
- `SAVE10` returns error when subtotal ≤ $30 ✓
- `FIRST50` returns 50% discount ✓
- `FIRST50` caps at $25 for large subtotals ✓
- Invalid codes return error message ✓
- Case-insensitive (`save10` === `SAVE10`) ✓

---

## 🚀 What I Would Improve

**1. Virtual scrolling for the Question Bank**
The list renders all visible DOM nodes at once. With `@tanstack/react-virtual`, only the ~10–15 visible rows would exist in the DOM, making it much faster for 500+ items.

**2. React Hook Form + Zod for payment validation**
The hand-rolled validation in `PaymentForm` works but `react-hook-form` with a `zod` schema would be cleaner, give better UX (validate on blur vs. submit), and scale to more fields.

**3. Playwright end-to-end tests**
The dependency rules are complex enough that E2E tests clicking through the full configure → checkout flow would catch regression bugs that unit tests miss.

**4. Persist coupon code in localStorage**
Right now a page refresh clears the applied coupon. Storing it alongside the config would improve the checkout experience.

**5. Accessible toast live region**
`react-hot-toast` renders toasts visually. Adding a hidden `aria-live="polite"` region mirroring the toast content would announce them to screen reader users.

**6. Optimistic UI for coupon**
Rather than waiting the full 1.5s, the order summary could show a "pending" discount state while the fake API call is in progress.

---

## 🛠 Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| React | 18 | UI framework |
| TypeScript | 5 | Type safety |
| React Router | 6 | Client-side routing |
| Tailwind CSS | 3 | Styling |
| react-hot-toast | 2 | Toast notifications |
| Vitest | 1 | Test runner |
| React Testing Library | 14 | Component testing |
| Vite | 5 | Build tool |

---

## 📝 Git History

The repository has a clean, meaningful commit history:

```
feat: initial project setup with Vite, React 18, TypeScript, Tailwind
feat: add types, pricing utils, and localStorage persistence
feat: implement Screen 1 — configure page with all form fields
feat: implement all four dependency rules with toasts
feat: add Screen 2 — checkout with order summary and payment form
feat: add coupon logic (FIRST50, SAVE10) with shake animation
feat: add FixedQuestionList and REVIEW.md bug analysis
feat: add unit tests for dependency rules and coupon logic
fix: resolve Try Again race condition in PaymentForm
fix: reset CouponSection local state on coupon removal
```
