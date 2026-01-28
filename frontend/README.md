# React + TypeScript + Vite

# API Client 
-   **`api/auth.ts`**: Contains functions for authentication and user registration (e.g., `loginUser`, `registerUser`, `claimAccount`, `confirmPasswordReset`, `requestPasswordReset`).
-   **`api/config.ts`**: Contains functions for application configuration (e.g., `getAppConfig`).
-   **`api/legal.ts`**: Contains functions for legal documents (e.g., `getLatestTermsAndConditions`).
-   **`api/faq.ts`**: Contains functions for frequently asked questions (e.g., `getFaqs`).
-   **`api/events.ts`**: Contains functions related to delivery events, colors, flower types, and general price calculation (e.g., `getEvents`, `createEvent`, `calculatePrice`, `getColors`, `getFlowerTypes`).
-   **`api/upfrontPlans.ts`**: Contains functions specifically for upfront payment plans (e.g., `getUpfrontPlan`, `createUpfrontPlan`, `updateUpfrontPlan`, `calculateUpfrontPriceForPlan`).
-   **`api/users.ts`**: Contains functions for user profile management and analytics (e.g., `getUserProfile`, `updateUserProfile`, `getDashboardAnalytics`, `changePassword`, `deleteAccount`).
-   **`api/payments.ts`**: Contains functions for payment processing (e.g., `createPaymentIntent`).
-   **`api/helpers.ts`**: Contains shared helper functions, such as `handleResponse`, which centralizes API response parsing and error handling.
-   **`api/index.ts`**: Serves as the main entry point for the API client. It re-exports all functions from the individual API domain files, allowing other parts of the application to continue importing API functions using the familiar `@/api` alias (e.g., `import { loginUser } from '@/api';`).
