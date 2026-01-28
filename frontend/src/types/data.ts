// foreverflower/frontend/src/types/data.ts

/**
 * Defines the structure for a single FAQ item.
 */
export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Defines the structure for Terms and Conditions content.
 */
export interface TermsAndConditions {
    version: string;
    content: string;
    published_at: string;
}