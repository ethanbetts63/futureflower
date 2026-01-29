import type { EventCreationData } from './EventCreationData';

export interface EventCreationFormProps {
    initialData: Partial<EventCreationData>;
    onSubmit: (data: EventCreationData) => void;
}
