// src/types/index.ts

export interface AuthResponse {
    refresh: string;
    access: string;
    user: {
        id: number;
        email: string;
        first_name: string;
        last_name: string;
    };
}

export interface EventCreationResponse {
    event: {
        name: string;
        event_date: string;
        notes: string | null;
    };
    user: {
        email: string;
    };
}

export interface Event {
    id: number;
    name:string;
    notes: string | null;
    event_date: string;
    weeks_in_advance: number;
    user: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    payment_details: {
        amount: number;
        date: string;
    } | null;
}

export interface UserProfile {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_staff?: boolean;
    is_superuser?: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface AppConfig {
  priceId: number;
  amount: number;
  currency: string;
}


export interface TermsAndConditions {
    version: string;
    content: string;
    published_at: string;
}
