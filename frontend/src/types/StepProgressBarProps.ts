export interface StepProgressBarProps {
    currentStep: number;
    totalSteps: number;
    planName: string;
    isReview?: boolean;
    customLabel?: string;
}
