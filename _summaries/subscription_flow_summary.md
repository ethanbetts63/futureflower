# Subscription Flow Summary

This document outlines the user journey through the Subscription Flow, from initial account creation to the final order confirmation, excluding payment details. The flow consists of 4 main steps after the initial account creation.

## Step 1: Create Your Account
**Page:** `frontend/src/pages/Step1CreateAccountPage.tsx`
**Description:** This is the entry point for new users initiating a subscription order.
**What the user sees:**
*   A "Create Your Account" card.
*   A description welcoming them and inviting them to set up their account to create their first order.
*   A form to input profile creation details (e.g., name, email, password).
*   A `StepProgressBar` at the top indicating "Step 1 of 4" for "Subscription Plan".
**User Action:** The user fills out the required registration information and clicks the "Next: Create Your Plan" button.
**Navigation:** Upon successful account creation, the user is automatically logged in and redirected to the next step: Recipient Details for their subscription plan.

## Step 2: Recipient Details
**Page:** `frontend/src/pages/subscription_flow/Step2RecipientPage.tsx`
**Description:** The user specifies who will be receiving the recurring flower deliveries.
**What the user sees:**
*   A `StepProgressBar` at the top indicating "Step 2 of 4" for "Subscription Plan".
*   A form titled "Who will be receiving the flowers?" for entering recipient information. This typically includes fields like recipient's name, address, and contact details.
**User Action:** The user provides the necessary recipient details and clicks the "Next: Plan Preferences" button.
**Navigation:** The flow proceeds to the Preference Selection page.

## Step 3: Preference Selection
**Page:** `frontend/src/pages/subscription_flow/Step3PreferenceSelectionPage.tsx`
**Description:** The user customizes the aesthetic preferences for the recurring flower arrangements.
**What the user sees:**
*   A `StepProgressBar` at the top indicating "Step 3 of 4" for "Subscription Plan".
*   A form with options to select various flower preferences, such as color palette, style, or specific flower types.
**User Action:** The user makes their desired selections for the flower preferences and clicks the "Save & Continue" button.
**Navigation:** The flow proceeds to the Structure page.

## Step 4: Structure (Subscription Details)
**Page:** `frontend/src/pages/subscription_flow/Step4StructurePage.tsx`
**Description:** The user defines the specific details of the subscription, including budget, frequency, and start date.
**What the user sees:**
*   A `StepProgressBar` at the top indicating "Step 4 of 4" for "Subscription Plan".
*   A form titled "Define Your Subscription" with a description "Set the budget, frequency, and start date for your flower subscription. You can also add an optional message for all deliveries.". This includes fields for budget, delivery frequency, start date, and an optional message.
**User Action:** The user inputs the subscription details, then clicks the "Next: Confirmation" button.
**Navigation:** The flow proceeds to the Confirmation page.

## Step 5: Subscription Confirmation
**Page:** `frontend/src/pages/subscription_flow/Step5ConfirmationPage.tsx`
**Description:** The user reviews all the details of their subscription plan before finalization.
**What the user sees:**
*   A page with the title "Confirm Your Subscription".
*   A summary of all the information provided in the previous steps, including recipient details, flower preferences, and subscription structure (budget, frequency, start date, message). This summary is presented via `PlanDisplay` and `SubscriptionSummary` components.
**User Action:** The user reviews the displayed subscription details.
**Navigation:** The flow ends here for this summary, as per the instruction not to include payment.
