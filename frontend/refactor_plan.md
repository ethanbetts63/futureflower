# FutureFlower UX Refactor Plan

## Already Done
- [x] **ProductCarousel** — Revamped to "How It Works" with large image cards, numbered badges, punchy copy
- [x] **HeroV2** — Two direct CTAs ("Send Flowers" → single-delivery, "Flower Subscriptions" → subscription), removed learn more, removed subtitle, bold green/white buttons
- [x] **HeroV2Props** — Stripped down to just `title`

---

## Remaining Changes

### 1. Home Page Cleanup (`pages/home.tsx`)
**What:** Remove the CtaCard sidebar/mobile section. The hero CTAs now serve this purpose.
**Details:**
- Remove the `CtaCard` import and both usages (mobile `<section className="lg:hidden">` and sticky sidebar `<aside>`)
- The Letter component stays but moves to full-width (no more 2/3 + 1/3 grid layout)
- Consider: do we still want the Letter component here, or does the page flow better without the grid? For now, keep Letter full-width and revisit later.

**Files:**
- `pages/home.tsx` — remove CtaCard, simplify layout

---

### 2. Keep the Order Page (`pages/ProductSelectionPage.tsx`)
**What:** The `/order` page stays. Nav bar "Order" button routes here as it does today.
**Details:**
- No changes needed to this page
- It remains the "browse all options" page for users who arrive via the nav
- Hero buttons and CtaCard (if kept elsewhere) bypass this page and go directly into flows

---

### 3. New Component: ImpactTierSelector
**What:** Replace the budget slider across all three flows with selectable "Impact" tier cards.
**Style:** Similar visual pattern to the revamped ProductCarousel — cards with images, but these are selectable.

**Tier definitions:**
| Tier | Label | Price | Description |
|------|-------|-------|-------------|
| Signature | The Signature | $85 | A beautiful, seasonal arrangement. Perfect for keeping the romance alive. |
| Statement | The Statement | $150 | Lush, premium stems designed to make an impression. Our most popular choice. |
| Grand | The Grand Gesture | $350 | A show-stopping display of luxury blooms for life's biggest milestones. |

**Card layout (each tier):**
- Placeholder image (top) — same style as ProductCarousel cards
- Tier name (bold, Playfair Display)
- Short description
- Price displayed prominently
- Selected state: border highlight + checkmark or ring

**Below the tier cards:**
- "Or set a custom amount" expandable/inline field
- Number input, minimum $75, validated on blur
- Helper text: "Minimum $75"

**Output:** The component emits a single `budget: number` value — the backend doesn't need to know about tiers.

**Props:**
```ts
interface ImpactTierSelectorProps {
  value: number;
  onChange: (budget: number) => void;
}
```

**File:** `components/ImpactTierSelector.tsx` (new)

---

### 4. Update Structure Forms to Use ImpactTierSelector

#### 4a. PlanStructureForm (`forms/PlanStructureForm.tsx`)
- Remove the budget `<Slider>`
- Replace with `<ImpactTierSelector value={formData.budget} onChange={...} />`
- Keep: frequency dropdown, years slider, start date input — all unchanged

#### 4b. SubscriptionStructureForm (`forms/SubscriptionStructureForm.tsx`)
- Remove the budget `<Slider>`
- Replace with `<ImpactTierSelector value={formData.budget} onChange={...} />`
- Keep: frequency dropdown, start date input, subscription message — all unchanged

#### 4c. SingleDeliveryStructureForm (`forms/SingleDeliveryStructureForm.tsx`)
- Remove the budget `<Slider>`
- Replace with `<ImpactTierSelector value={formData.budget} onChange={...} />`
- Keep: delivery date input, card message textarea — all unchanged

**Important:** The `onChange` from ImpactTierSelector should trigger the same `onFormChange('budget', value)` + `setIsDebouncePending(true)` pattern that the slider currently uses. The debounced price calculation logic in the parent editors does not need to change.

---

### 5. Update Structure Editor Pages (cosmetic)
**What:** Update the section title/description text on each structure page to frame budget as "Choose Your Impact" instead of "Set Your Budget."

**Files:**
- `pages/upfront_flow/Step5StructurePage.tsx`
- `pages/subscription_flow/Step4StructurePage.tsx`
- `pages/single_delivery_flow/Step4StructurePage.tsx`

**Note:** The editor components (`UpfrontStructureEditor`, `SubscriptionStructureEditor`, `SingleDeliveryStructureEditor`) themselves should not need logic changes — they pass form data through and call the same APIs. The only change is the form component they render now uses `ImpactTierSelector` instead of `Slider`.

---

## Considerations & Issues

### Backend: No changes required
The backend receives `budget` as a number (string-coerced). Tiers are purely a frontend concept. Selecting "The Statement" just sets `budget = 150`. Custom amount sets it directly. The price calculation endpoints work the same way.

### Default selection
When a user lands on the structure page for the first time, the plan's budget defaults to `75` (current slider min). We should change the default to `150` (The Statement tier) so the middle option is pre-selected. This means updating the initial state in:
- `UpfrontStructureEditor.tsx` (initial formData)
- `SubscriptionStructureEditor.tsx` (initial formData)
- `SingleDeliveryStructureEditor.tsx` (initial formData)

**However** — if the user is editing an existing plan that already has `budget = 75`, we need to make sure that still maps correctly. Since 75 doesn't match any tier, the custom amount field should activate and show 75. The component needs to handle "no tier selected" gracefully.

### Custom amount edge cases
- If the user selects a tier ($150), then switches to custom and types $150, that should visually re-select The Statement tier (match by value)
- If they type $85, it should select The Signature
- If they type $120, no tier is selected — custom is active
- Minimum validation: $75, enforced on blur, not on every keystroke

### Edit mode (dashboard)
The structure editors are also used in edit mode from the dashboard (`/dashboard/upfront-plans/:id/edit-structure`, etc.). The same ImpactTierSelector will render there — no separate handling needed.

### What we're NOT changing (deferred)
- Preferences page revamp (occasion selector, "vibe" tags) — separate task
- Account creation page reframing ("Your Details" / receipt framing) — separate task
- Confirmation page updates — separate task
- Removing/consolidating the Prepaid flow from the hero — it's still accessible via `/order`

---

## Execution Order
1. Build `ImpactTierSelector` component
2. Swap it into all three structure forms (PlanStructureForm, SubscriptionStructureForm, SingleDeliveryStructureForm)
3. Update default budget to 150 in editors
4. Clean up home page (remove CtaCard grid)
5. Update structure page titles/descriptions
6. Test all three flows end-to-end
