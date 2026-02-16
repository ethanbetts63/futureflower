// futureflower/frontend/src/components/MessagesEditor.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ChevronRight } from 'lucide-react';
import Seo from '@/components/Seo';
import { toast } from 'sonner';
import { getUpfrontPlan, updateUpfrontPlan, updateEvent, getProjectedDeliveries } from '@/api';
import type { ProjectedDelivery } from '@/api/upfrontPlans';
import type { DeliveryEvent } from '../../types/DeliveryEvent';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from '@/components/ui/label';
import FlowBackButton from '@/components/form_flow/FlowBackButton';
import FlowNextButton from '@/components/form_flow/FlowNextButton';
import type { UpfrontPlan } from '../../types/UpfrontPlan';
import type { MessagesEditorProps } from '../../types/MessagesEditorProps';

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

    // Projected deliveries from API (pre-payment)
    const [projectedDeliveries, setProjectedDeliveries] = useState<ProjectedDelivery[]>([]);

    // Message State
    const [messageMode, setMessageMode] = useState<MessageMode>('single');
    const [singleMessage, setSingleMessage] = useState('');
    const [multipleMessages, setMultipleMessages] = useState<Record<string, string>>({});

    const hasEvents = (upfrontPlan?.events?.length ?? 0) > 0;

    const totalDeliveries = hasEvents
        ? upfrontPlan!.events.length
        : projectedDeliveries.length;

    useEffect(() => {
        if (!planId) {
            toast.error("No flower plan specified.");
            navigate('/dashboard');
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [planData, projected] = await Promise.all([
                    getUpfrontPlan(planId),
                    getProjectedDeliveries(planId),
                ]);

                setUpfrontPlan(planData);
                setProjectedDeliveries(projected);

                if (planData.events && planData.events.length > 0) {
                    // Post-payment: load from event messages
                    const allMessages = planData.events.map((e: DeliveryEvent) => e.message || '');
                    const uniqueMessages = new Set(allMessages.filter(m => m));

                    if (uniqueMessages.size <= 1) {
                        setMessageMode('single');
                        setSingleMessage(uniqueMessages.values().next().value || '');
                    } else {
                        setMessageMode('multiple');
                        const messagesMap = planData.events.reduce((acc: Record<string, string>, event: DeliveryEvent) => {
                            acc[String(event.id)] = event.message || '';
                            return acc;
                        }, {});
                        setMultipleMessages(messagesMap);
                    }
                } else if (planData.draft_card_messages && Object.keys(planData.draft_card_messages).length > 0) {
                    // Pre-payment: load from draft_card_messages
                    const draft = planData.draft_card_messages;
                    const values = Object.values(draft).filter(m => m);
                    const uniqueValues = new Set(values);

                    if (uniqueValues.size <= 1) {
                        setMessageMode('single');
                        setSingleMessage(uniqueValues.values().next().value || '');
                    } else {
                        setMessageMode('multiple');
                        setMultipleMessages({ ...draft });
                    }
                }

            } catch (err) {
                setError("Failed to load your flower plan. Please try again later.");
                toast.error("Failed to load your flower plan.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [isAuthenticated, navigate, planId]);

    const handleMultipleMessageChange = (key: string, value: string) => {
        setMultipleMessages(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSave = async () => {
        if (!upfrontPlan || !planId) return;

        setIsSaving(true);
        try {
            if (hasEvents) {
                // Post-payment: save directly to Event.message
                const promises: Promise<any>[] = [];

                if (messageMode === 'single') {
                    upfrontPlan.events.forEach((event: DeliveryEvent) => {
                        promises.push(updateEvent(event.id, { message: singleMessage }));
                    });
                } else {
                    upfrontPlan.events.forEach((event: DeliveryEvent) => {
                        const key = String(event.id);
                        if (multipleMessages[key] !== (event.message || '')) {
                            promises.push(updateEvent(event.id, { message: multipleMessages[key] || '' }));
                        }
                    });
                }

                await Promise.all(promises);
            } else {
                // Pre-payment: save to draft_card_messages on the plan
                const draft: Record<string, string> = {};

                if (messageMode === 'single') {
                    projectedDeliveries.forEach((d) => {
                        draft[String(d.index)] = singleMessage;
                    });
                } else {
                    projectedDeliveries.forEach((d) => {
                        draft[String(d.index)] = multipleMessages[String(d.index)] || '';
                    });
                }

                await updateUpfrontPlan(planId, { draft_card_messages: draft });
            }

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
            <div className="container mx-auto max-w-4xl py-0 md:py-12 px-0 md:px-4">
                <Seo title={`${title} | FutureFlower`} />
                <Card className="bg-white text-black border-none shadow-none md:shadow-xl md:shadow-black/5 rounded-none md:rounded-[2rem] overflow-hidden">
                    <CardHeader className="px-4 md:px-8 pt-2">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                            <div>
                                <CardTitle className="text-3xl md:text-4xl font-bold font-['Playfair_Display',_serif]">{title}</CardTitle>
                                <CardDescription className="text-black">
                                    {description}
                                </CardDescription>
                            </div>
                            {showSkipButton && (
                                <Button 
                                    onClick={handleSkip} 
                                    className="bg-white text-black font-semibold px-6 py-4 rounded-lg hover:bg-gray-100 transition-all cursor-pointer group shadow-lg flex items-center justify-between gap-4 border-none"
                                >
                                    <span>Skip for Now</span>
                                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-black transition-colors" />
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-8 px-4 md:px-8 py-6">
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

                            {messageMode === 'multiple' && hasEvents && (
                                <div className="space-y-6">
                                    <p className="text-sm text-gray-600">You have {totalDeliveries} deliveries scheduled.</p>
                                    {upfrontPlan?.events.map((event: DeliveryEvent, index: number) => (
                                        <div key={event.id} className="space-y-2">
                                            <Label htmlFor={`message-${event.id}`}>
                                                Delivery {index + 1} ({new Date(event.delivery_date).toLocaleDateString()})
                                            </Label>
                                            <Textarea
                                                id={`message-${event.id}`}
                                                placeholder={`e.g., Happy Anniversary!`}
                                                value={multipleMessages[String(event.id)] || ''}
                                                onChange={(e) => handleMultipleMessageChange(String(event.id), e.target.value)}
                                                rows={3}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {messageMode === 'multiple' && !hasEvents && (
                                <div className="space-y-6 pb-4">
                                    <p className="text-sm text-gray-600">You have {totalDeliveries} deliveries planned.</p>
                                    {projectedDeliveries.map((delivery) => (
                                        <div key={delivery.index} className="space-y-2">
                                            <Label htmlFor={`message-${delivery.index}`}>
                                                Delivery {delivery.index + 1} ({new Date(delivery.date + 'T00:00:00').toLocaleDateString()})
                                            </Label>
                                            <Textarea
                                                id={`message-${delivery.index}`}
                                                placeholder={`e.g., Happy Anniversary!`}
                                                value={multipleMessages[String(delivery.index)] || ''}
                                                onChange={(e) => handleMultipleMessageChange(String(delivery.index), e.target.value)}
                                                rows={3}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-row justify-between items-center gap-4 py-6 md:py-10 px-4 md:px-8 border-t border-black/5">
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

export default MessagesEditor;
