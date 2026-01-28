// foreverflower/frontend/src/types/index.ts

// Export types from auth.ts
export type { AuthResponse } from './auth';

// Export types from config.ts
export type { AppConfig } from './config';

// Export types from data.ts
export type { FaqItem, TermsAndConditions } from './data';

// Export types from events.ts
export type { Event, EventCreationResponse } from './events'; 

// Export types from payments.ts
export type { CreatePaymentIntentPayload, Payment } from './payments';

// Export types from plans.ts
export type { Color, FlowerType, UpfrontPlan, CreateUpfrontPlanPayload, PartialUpfrontPlan } from './plans';

// Export types from users.ts
export type { UserProfile } from './users';

// ProfileCreationData is assumed to be defined in forms/ProfileCreationForm.ts
// and will be imported directly where needed, or its definition could be moved here
// if that file is purely for type definitions and we decide to centralize it.
// export type { ProfileCreationData } from './users'; // or from a dedicated forms.ts