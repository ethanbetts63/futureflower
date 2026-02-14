import React from 'react';

interface StepProgressBarProps {
    currentStep: number;
    totalSteps: number;
    planName: string;
}

const StepProgressBar: React.FC<StepProgressBarProps> = ({ currentStep, totalSteps, planName }) => {
    const progressPercent = (currentStep / totalSteps) * 100;

    return (
        <div className="w-full bg-[var(--background-white)] border-b border-black/10 px-4 py-4">
            <div className="container mx-auto max-w-3xl">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold tracking-[0.2em] text-black/80 uppercase">
                        {planName}
                    </p>
                    <p className="text-s font-semibold text-black/80">
                        Step {currentStep} of {totalSteps}
                    </p>
                </div>
                <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[var(--colorgreen)] rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default StepProgressBar;
