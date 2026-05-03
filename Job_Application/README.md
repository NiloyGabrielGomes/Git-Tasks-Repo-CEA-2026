# Multi-Step Job Application Form

A fully accessible, multi-step job application form built with **React**, **TypeScript**, **React Hook Form**, and **Zod**.

## Features

- **3-step wizard**: Personal Info → Experience → Review & Submit
- **Dynamic job entries**: Add/remove previous positions using `useFieldArray`
- **Robust validation**:
  - Email format validation
  - Async email uniqueness check with simulated 500ms API delay
  - Cross-field rule: `endDate` must be strictly greater than `startDate`
- **Smart validation UX**: Validates on `onBlur` initially; switches to `onChange` re-validation once a field has errored
- **Full accessibility**: Every input has a `<label>`, `aria-invalid`, `aria-describedby` for errors, and focus management to the first invalid field on submit
- **Loading states**: Next and Submit buttons are disabled while validation or submission is in progress
- **Mock server**: Random 40% submission rejection rate with toast notifications on failure
- **Back navigation**: Users can navigate back without losing entered data

## Tech Stack

- [Vite](https://vitejs.dev/) — Build tool
- [React](https://react.dev/) — UI library
- [TypeScript](https://www.typescriptlang.org/) — Type safety
- [React Hook Form](https://react-hook-form.com/) — Form state management
- [Zod](https://zod.dev/) — Schema validation
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first styling
- [Sonner](https://sonner.emilkowal.ski/) — Toast notifications

## Getting Started

```bash
cd Job_Application
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## Project Structure

```
src/
├── components/
│   ├── PersonalInfoStep.tsx   # Step 1: name, email with async validation
│   ├── ExperienceStep.tsx     # Step 2: dynamic job entries with date rules
│   └── ReviewStep.tsx         # Step 3: read-only review & submit
├── schemas/
│   └── jobApplicationSchema.ts # Zod schema with cross-field & async rules
├── utils/
│   └── mockApi.ts              # Mock email check & server submit
├── App.tsx                     # Step orchestration & FormProvider
└── main.tsx                    # Entry point
```

## Architectural Decisions & Trade-offs

### 1. Single `useForm` instance with `FormProvider`

**Decision:** All three steps share one `useForm` instance at the `App` level, wrapped in `FormProvider`.

**Rationale:**
- Guarantees data persistence when navigating back and forth — no state lifting or external storage needed.
- Keeps validation logic centralized; the Zod schema validates the entire form shape.

**Trade-off:**
- All fields are mounted/unmounted as steps change. This means `setFocus` must be called immediately after validation within the same step, before the component unmounts. For our use case this is safe because we only focus fields in the currently visible step.

### 2. `mode: 'onBlur'` with default `reValidateMode: 'onChange'`

**Decision:** Rely on React Hook Form's built-in `mode: 'onBlur'` and the default `reValidateMode: 'onChange'`.

**Rationale:**
- This gives the exact requested behavior out of the box: first validation fires on blur, and once a field is invalid, it re-validates on every change.
- No custom per-field state or manual `trigger` calls are needed, reducing complexity.

**Trade-off:**
- Less granular control if we ever needed different re-validation strategies for different fields. For this project, the default behavior is ideal.

### 3. Async validation via Zod `superRefine`

**Decision:** The async email uniqueness check lives inside the Zod schema using `superRefine`.

**Rationale:**
- Keeps validation logic co-located with the schema, making it easy to read and test.
- `@hookform/resolvers` handles async Zod schemas transparently; `formState.isValidating` reflects the pending state.

**Trade-off:**
- The async check runs even when the user is on a different step, because the resolver validates the entire schema on `handleSubmit`. In practice this is fine because `handleSubmit` is only called on the final Review step. For step navigation, we use `trigger()` with specific field names, avoiding the async email call.

### 4. `trigger()` for step-guard validation

**Decision:** Each "Next" button calls `trigger(['field1', 'field2'])` instead of `handleSubmit`.

**Rationale:**
- Prevents advancing to the next step with invalid data.
- Allows us to focus the first invalid field before unmounting the current step.

**Trade-off:**
- Validation logic is duplicated between the Zod schema and the `trigger` field lists. If the schema changes, the `trigger` calls must be updated. An alternative would be a discriminated union schema per step, but that adds significant complexity for marginal gain.

### 5. In-memory mock API

**Decision:** The mock email uniqueness check uses a module-level `Set`, and the mock server randomly rejects submissions.

**Rationale:**
- Zero external dependencies or network setup required.
- Demonstrates real-world async patterns (loading states, error handling) without a backend.

**Trade-off:**
- Data is lost on page refresh. In a production app, this would be replaced by actual API calls.

### 6. Tailwind CSS v4 with Vite plugin

**Decision:** Used Tailwind CSS v4 and the official `@tailwindcss/vite` plugin.

**Rationale:**
- Fast build times and modern CSS-first configuration (no `tailwind.config.js`).
- Utility classes keep component files self-contained and readable.

**Trade-off:**
- Custom theming requires inline `@theme` directives in CSS rather than a traditional config file, which may feel unfamiliar to developers used to Tailwind v3.

### 7. Focus management strategy

**Decision:** On validation failure, we call `setFocus(firstErrorField)` (RHF API) for step navigation, and use `handleSubmit(onValid, onInvalid)` for the final submit.

**Rationale:**
- `setFocus` programmatically moves keyboard focus to the invalid input, satisfying WCAG 3.3.1 (Error Identification) and improving keyboard UX.
- For the final submit, the `onInvalid` callback of `handleSubmit` achieves the same behavior across the entire form.

**Trade-off:**
- If a step is conditionally rendered (not just hidden), the target element may not exist in the DOM. We mitigate this by only calling `setFocus` on fields known to be in the current step.

## Accessibility Checklist

| Requirement | Implementation |
|-------------|----------------|
| Every input has a `<label>` | `htmlFor` on labels matches `id` on inputs |
| `aria-invalid` | Dynamically set to `"true"` when a field has an error |
| `aria-describedby` | Points to the error message element ID |
| Focus on first invalid field | `setFocus` called after failed validation |
| Error announcements | Error messages use `role="alert"` for screen-reader announcement |
| Loading states | Buttons use `aria-busy` when validation/submission is in progress |
| Step indicator | `aria-label="Form progress"` and `aria-current="step"` on active step |

## Possible Improvements

1. **Persist form state to `localStorage`** so data survives accidental page refreshes.
2. **Add unit/integration tests** with React Testing Library to verify step navigation, validation, and focus management.
3. **Animate step transitions** for a smoother user experience.
4. **Support current employment** by adding a checkbox that disables the end date field.
