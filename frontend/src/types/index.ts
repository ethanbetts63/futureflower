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
    flower_plan: number;
    delivery_date: string;
    message: string | null;
    bouquet_preference: string | null;
    status: string;
    created_at: string;
    updated_at: string;
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
