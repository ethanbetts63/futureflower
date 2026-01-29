// foreverflower/frontend/src/components/MessagesEditor.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import Seo from '@/components/Seo';
import { toast } from 'sonner';
import { getUpfrontPlan, updateEvent } from '@/api';
import type { DeliveryEvent } from '@/types';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from '@/components/ui/label';
import BackButton from '@/components/BackButton';
import type { MessagesEditorProps } from '@/types/component_props';

type MessageMode = 'single' | 'multiple';

const MessagesEditor: React.FC<MessagesEditorProps> = ({
    mode,
    title,
    description,
    saveButtonText,
    onSaveNavigateTo,
    backPath,
    showSkipButton,
}) => {
    const { planId } = useParams<{ planId: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    
    // Core State
    const [upfrontPlan, setUpfrontPlan] = useState<UpfrontPlan | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Message State
    const [messageMode, setMessageMode] = useState<MessageMode>('single');
    const [singleMessage, setSingleMessage] = useState('');
    const [multipleMessages, setMultipleMessages] = useState<Record<number, string>>({});

    useEffect(() => {
        if (!isAuthenticated) {
            toast.error("You must be logged in to manage a flower plan.");
            navigate('/login');
            return;
        }
        if (!planId) {
            toast.error("No flower plan specified.");
            navigate('/dashboard');
            return;
        }

        const fetchPlan = async () => {
            setIsLoading(true);
            try {
                const planData = await getUpfrontPlan(planId);
                setUpfrontPlan(planData);
                
                if (planData.events && planData.events.length > 0) {
                    const allMessages = planData.events.map((e: DeliveryEvent) => e.message || '');
                    const uniqueMessages = new Set(allMessages.filter(m => m));

                    if (uniqueMessages.size <= 1) {
                        setMessageMode('single');
                        setSingleMessage(uniqueMessages.values().next().value || '');
                    } else {
                        setMessageMode('multiple');
                        const messagesMap = planData.events.reduce((acc: Record<number, string>, event: DeliveryEvent) => {
                            acc[event.id] = event.message || '';
                            return acc;
                        }, {} as Record<number, string>);
                        setMultipleMessages(messagesMap);
                    }
                }

            } catch (err) {
                setError("Failed to load your flower plan. Please try again later.");
                toast.error("Failed to load your flower plan.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlan();
    }, [isAuthenticated, navigate, planId]);

    const handleMultipleMessageChange = (eventId: number, value: string) => {
        setMultipleMessages(prev => ({
            ...prev,
            [eventId]: value,
        }));
    };

    const handleSave = async () => {
        if (!upfrontPlan) return;

        setIsSaving(true);
        try {
            const promises: Promise<any>[] = [];

            if (messageMode === 'single') {
                upfrontPlan.events.forEach((event: DeliveryEvent) => {
                    promises.push(updateEvent(event.id, { message: singleMessage }));
                });
            } else {
                upfrontPlan.events.forEach((event: DeliveryEvent) => {
                    if (multipleMessages[event.id] !== (event.message || '')) {
                         promises.push(updateEvent(event.id, { message: multipleMessages[event.id] || '' }));
                    }
                });
            }
            
            await Promise.all(promises);
            if (mode === 'edit') {
                toast.success("Messages saved successfully!");
            }
            navigate(onSaveNavigateTo);
        } catch (err: any) {
            toast.error("Failed to save messages.", { description: err.message });
        } finally {
            setIsSaving(false);
        }
    };

    const handleSkip = () => {
        toast.info("You can add messages later from your dashboard.");
        navigate(onSaveNavigateTo);
    };

    if (isLoading) return <div className="flex justify-center items-center h-screen"><Spinner className="h-12 w-12" /></div>;
    if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

    return (
        <div className="min-h-screen w-full" style={{ backgroundColor: 'var(--color4)' }}>
            <div className="container mx-auto max-w-4xl py-12">
                <Seo title={`${title} | ForeverFlower`} />
                <Card className="bg-white text-black border-none shadow-md">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-3xl">{title}</CardTitle>
                                <CardDescription className="text-black">
                                    {description}
                                </CardDescription>
                            </div>
                            {showSkipButton && (
                                <Button variant="destructive" onClick={handleSkip} className="bg-transparent text-red-500 hover:bg-red-50 ml-4">
                                    Skip for Now
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Your Messages</h3>
                            
                            <RadioGroup value={messageMode} onValueChange={(value: MessageMode) => setMessageMode(value)} className="mb-6">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="single" id="r1" />
                                    <Label htmlFor="r1">Use one message for all deliveries</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="multiple" id="r2" />
                                    <Label htmlFor="r2">Write a custom message for each delivery</Label>
                                </div>
                            </RadioGroup>

                            {messageMode === 'single' && (
                                <Textarea
                                    placeholder="e.g., Thinking of you always!"
                                    value={singleMessage}
                                    onChange={(e) => setSingleMessage(e.target.value)}
                                    rows={4}
                                />
                            )}

                            {messageMode === 'multiple' && (
                                <div className="space-y-6">
                                    <p className="text-sm text-gray-600">You have {upfrontPlan?.events.length || 0} deliveries scheduled.</p>
                                    {upfrontPlan?.events.map((event: DeliveryEvent, index: number) => (
                                        <div key={event.id} className="space-y-2">
                                            <Label htmlFor={`message-${event.id}`}>
                                                Delivery {index + 1} ({new Date(event.delivery_date).toLocaleDateString()})
                                            </Label>
                                            <Textarea
                                                id={`message-${event.id}`}
                                                placeholder={`e.g., Happy Anniversary!`}
                                                value={multipleMessages[event.id] || ''}
                                                onChange={(e) => handleMultipleMessageChange(event.id, e.target.value)}
                                                rows={3}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <BackButton to={backPath} />
                        <Button size="lg" onClick={handleSave} disabled={isSaving}>
                            {isSaving ? <Spinner className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {isSaving ? 'Saving...' : saveButtonText}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default MessagesEditor;
