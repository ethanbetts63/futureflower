# Single Delivery Flow Summary

This document outlines the user journey through the Single Delivery Flow, from initial account creation to the final order confirmation, excluding payment details. The flow consists of 4 main steps after the initial account creation.

## Step 1: Create Your Account
**Page:** `frontend/src/pages/Step1CreateAccountPage.tsx`
**Description:** This is the entry point for new users initiating a single delivery order.
**What the user sees:**
*   A "Create Your Account" card.
*   A description welcoming them and inviting them to set up their account to create their first order.
*   A form to input profile creation details (e.g., name, email, password).
*   A `StepProgressBar` at the top indicating "Step 1 of 4" for "Single Delivery Plan".
**User Action:** The user fills out the required registration information and clicks the "Next: Create Your Plan" button.
**Navigation:** Upon successful account creation, the user is automatically logged in and redirected to the next step: Recipient Details for their single delivery plan.

## Step 2: Recipient Details
**Page:** `frontend/src/pages/single_delivery_flow/Step2RecipientPage.tsx`
**Description:** The user specifies who will receive the flower delivery.
**What the user sees:**
*   A `StepProgressBar` at the top indicating "Step 2 of 4" for "Single Delivery Plan".
*   A form titled "Who is receiving the flowers?" for entering recipient information. This typically includes fields like recipient's name, address, and contact details.
**User Action:** The user provides the necessary recipient details and clicks the "Next: Plan Preferences" button.
**Navigation:** The flow proceeds to the Preferences page.

## Step 3: Preferences
**Page:** `frontend/src/pages/single_delivery_flow/Step3PreferencesPage.tsx`
**Description:** The user customizes the aesthetic preferences for the flower arrangement.
**What the user sees:**
*   A `StepProgressBar` at the top indicating "Step 3 of 4" for "Single Delivery Plan".
*   A form with options to select various flower preferences, such as color palette, style, or specific flower types.
**User Action:** The user makes their desired selections for the flower preferences and clicks the "Next: Details" button.
**Navigation:** The flow proceeds to the Structure page.

## Step 4: Structure (Delivery Details)
**Page:** `frontend/src/pages/single_delivery_flow/Step4StructurePage.tsx`
**Description:** The user defines the specific details of the delivery, including date and budget.
**What the user sees:**
*   A `StepProgressBar` at the top indicating "Step 4 of 4" for "Single Delivery Plan".
*   A form allowing the user to specify crucial delivery details, such as the desired delivery date and their budget for the arrangement.
**User Action:** The user inputs the delivery date and budget, then clicks the "Next: Confirm Your Order" button.
**Navigation:** The flow proceeds to the Confirmation page.

## Step 5: Order Confirmation
**Page:** `frontend/src/pages/single_delivery_flow/Step5ConfirmationPage.tsx`
**Description:** The user reviews all the details of their single delivery order before finalization.
**What the user sees:**
*   A page with the title "Confirm Your Order".
*   A summary of all the information provided in the previous steps, including recipient details, flower preferences, delivery date, and budget. This summary is presented via `PlanDisplay` and `UpfrontSummary` components.
**User Action:** The user reviews the displayed order details.
**Navigation:** The flow ends here for this summary, as per the instruction not to include payment.
