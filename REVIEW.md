# BrokenQuestionList – Code Review

## Issue 1: Missing TypeScript Types on Props
**Line:** 14 (`function QuestionList({ questions, filters })`)  
**Problem:** The component has no TypeScript types on its props. `questions` is implicitly `any[]` and `filters` is implicitly `any`. This defeats TypeScript's purpose, causes false confidence, and hides bugs at callsites.  
**Fix:** Type the props using the existing `Question` and `Filters` interfaces:
```tsx
function QuestionList({ questions, filters }: { questions: Question[]; filters: Filters })
```

---

## Issue 2: `useEffect` Missing Dependency Array (Runs on Every Render)
**Line:** 20–22  
**Problem:** `useEffect(() => { document.title = ... })` has no dependency array, so it runs after **every single render**. With 500 items and frequent re-renders from typing in search, this causes unnecessary DOM writes on every keystroke.  
**Fix:** Add `[questions.length]` as the dependency array:
```tsx
useEffect(() => {
  document.title = `${questions.length} Questions`;
}, [questions.length]);
```

---

## Issue 3: `getFilteredQuestions` Called Twice, No Memoisation
**Lines:** 24–37, 42, 56  
**Problem:** `getFilteredQuestions()` is a plain function that runs filtering, sorting, and mapping on every render. It is also called **twice** — once to render the list and once to check `.length === 0`. With 500 questions and complex logic, this is an O(n log n) operation per render, doubled.  
**Fix:** Replace with `useMemo` and reference the result:
```tsx
const filteredQuestions = useMemo(() => {
  return questions
    .filter(...)
    .sort(...)
    .map(...);
}, [questions, search, filters.difficulty, filters.topic]);

// Then use filteredQuestions everywhere, check filteredQuestions.length === 0 once
```

---

## Issue 4: `console.log('filtering...')` Left in Production Code
**Line:** 25  
**Problem:** A debug `console.log` was left inside `getFilteredQuestions`. Since the function is called on every render (and twice per render), this floods the console — potentially thousands of log entries per minute during active use.  
**Fix:** Remove it entirely.

---

## Issue 5: `key={Math.random()}` — Unstable Keys
**Line:** 44  
**Problem:** Using `Math.random()` as a list key is one of the worst React anti-patterns. React uses keys to diff the virtual DOM. A random key on every render means React can **never reuse** existing DOM nodes — it destroys and recreates every list item on every render, causing massive performance degradation and breaking focus/selection state.  
**Fix:** Use the stable, unique `question.id`:
```tsx
<div key={q.id} ...>
```

---

## Issue 6: `selectedId` Typed as `null` Instead of `string | null`
**Line:** 17  
**Problem:** `useState(null)` infers type as `null`, so `selectedId` is always `null` — the selection check `selectedId === q.id` can never be `true` once `selectedId` is set to a string.  
**Fix:**
```tsx
const [selectedId, setSelectedId] = useState<string | null>(null);
```

---

## Issue 7: `fetch` in `handleClick` Has No Error Handling
**Lines:** 39–43  
**Problem:** The `fetch('/api/track', ...)` call has no `.catch()`. If the network request fails (e.g. offline, 500 error), it results in an unhandled promise rejection, which can crash the page in some environments and always causes console errors.  
**Fix:** Add a silent catch for this non-critical tracking call:
```tsx
fetch('/api/track', { ... }).catch(() => { /* non-critical */ });
```

---

## Issue 8: Missing `Content-Type` Header on POST Request
**Line:** 41  
**Problem:** The `fetch` POST sends a JSON body (`JSON.stringify(...)`) but does not set `Content-Type: application/json`. The server will likely misparse the body, causing silent tracking failures.  
**Fix:**
```tsx
fetch('/api/track', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ id: question.id }),
})
```

---

## Issue 9: Stray Text Node `text` in JSX
**Line:** 48 (the line between `</input>` and `<div>`)  
**Problem:** There is a bare text node `text` in the JSX. This renders visible text "text" on the screen, which is clearly a bug left from development.  
**Fix:** Remove the stray text node entirely.

---

## Issue 10: `handleClick` Not Memoised — New Reference Every Render
**Lines:** 38–44  
**Problem:** `handleClick` is defined as a plain function inside the component body, so it gets a new reference on every render. Combined with `React.memo` on child components, this defeats memoisation — every row re-renders because the `onClick` prop changed.  
**Fix:**
```tsx
const handleClick = useCallback((question: Question) => { ... }, []);
```

---

## Issue 11: No Accessibility on Clickable Divs
**Lines:** 43–55  
**Problem:** The clickable `<div>` elements have no `role`, `tabIndex`, or keyboard handlers. They are inaccessible to keyboard-only users and screen readers.  
**Fix:** Add `role="button"`, `tabIndex={0}`, and an `onKeyDown` handler, or replace with a semantic `<button>` element.

---

## Issue 12: Inline Style Objects Recreated Every Render
**Lines:** 50–53  
**Problem:** `style={{ padding: '12px', border: selectedId === q.id ? ... }}` creates a new object on every render for every row. While not catastrophic, it prevents object reference equality optimisations and is poor practice at scale.  
**Fix:** Use CSS classes (Tailwind or CSS modules) with conditional class names instead of inline styles.

---

## Summary Table

| # | Issue | Severity |
|---|-------|----------|
| 1 | Missing TypeScript prop types | High |
| 2 | `useEffect` without deps — runs every render | High |
| 3 | Filtering called twice, not memoised | High |
| 4 | Debug `console.log` in production | Medium |
| 5 | `key={Math.random()}` — unstable keys | Critical |
| 6 | `selectedId` typed as `null` — selection never works | Critical |
| 7 | Unhandled fetch promise rejection | Medium |
| 8 | Missing `Content-Type` on POST | Low |
| 9 | Stray `text` node in JSX | High |
| 10 | `handleClick` not memoised | Medium |
| 11 | Clickable divs not accessible | Medium |
| 12 | Inline style objects recreated every render | Low |
