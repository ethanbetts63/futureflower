// futureflower/frontend/src/components/form_flow/PreferencesEditor.tsx
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import FlowBackButton from '@/components/form_flow/FlowBackButton';
import FlowNextButton from '@/components/form_flow/FlowNextButton';
import type { PreferencesEditorProps } from '../../types/PreferencesEditorProps';
import { errorMessage } from '@/utils/errors';

const PreferencesEditor = ({
    mode,
    title = "The Florist's Brief",
    saveButtonText,
    onSaveNavigateTo,
    backPath,
    getPlan,
    updatePlan,
}: PreferencesEditorProps) => {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [flowerNotes, setFlowerNotes] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const planData = await getPlan();
                if (planData) {
                    setFlowerNotes(planData.flower_notes || '');
                }
            } catch (err) {
                setError("Failed to load your preferences. Please try again later.");
                toast.error("Failed to load your preferences.", { description: errorMessage(err) });
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [getPlan]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updatePlan({ flower_notes: flowerNotes });
            if (mode === 'edit') {
                toast.success("Preferences saved successfully!");
            }
            router.push(onSaveNavigateTo);
        } catch (err) {
            toast.error("Failed to save preferences.", { description: errorMessage(err) });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="flex justify-center items-center h-screen"><Spinner className="h-12 w-12" /></div>;
    if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

    return (
        <div className="min-h-screen w-full" style={{ backgroundColor: 'var(--color4)' }}>
            <div className="container mx-auto max-w-4xl py-0 md:py-12 px-0 md:px-4">
                <Card className="bg-white text-black border-none shadow-none md:shadow-xl md:shadow-black/5 rounded-none md:rounded-[2rem] overflow-hidden">
                    <CardHeader className="px-4 md:px-8 pt-2">
                        <CardTitle className="text-3xl md:text-4xl font-bold font-playfair-display">{title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8 px-4 md:px-8">
                        <div className="pb-4">
                            <h3 className="text-xl font-semibold mb-2">What should the florist know?</h3>
                            <p className="text-sm text-gray-600 mb-4">The occasion, favourite colours, dislikes, allergies — anything that helps them get it right.</p>
                            <Textarea
                                placeholder="She loves peonies but hates lilies. Keep it soft and pastel."
                                value={flowerNotes}
                                onChange={(e) => setFlowerNotes(e.target.value)}
                                className="min-h-[100px]"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-row justify-between items-center gap-4 py-2 px-4 md:px-8 border-t border-black/5">
                        <FlowBackButton to={backPath} />
                        <FlowNextButton
                            label={saveButtonText}
                            onClick={handleSave}
                            isLoading={isSaving}
                        />
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default PreferencesEditor;
