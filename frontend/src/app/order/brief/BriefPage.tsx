"use client";
import HomeStarterForm from '@/shared_components/HomeStarterForm';

// The homepage brief form, reused as the single edit target for the order's
// occasion, budget, delivery date, card message, and flower notes. Every "Edit"
// link on the confirmation summary points here; the form loads the draft, so it
// opens prefilled and saves back to the same order.
const BriefPage = () => (
  <div className="min-h-screen w-full" style={{ backgroundColor: 'var(--color4)' }}>
    <div className="container mx-auto max-w-2xl px-0 py-0 md:px-4 md:py-12">
      <HomeStarterForm mode="edit" />
    </div>
  </div>
);

export default BriefPage;
