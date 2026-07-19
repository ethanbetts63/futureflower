"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import PlanEditorShell from '@/shared_components/form_flow/PlanEditorShell';
import RecipientForm from '@/shared_components/form_flow/RecipientForm';
import { Checkbox } from '@/shared_components/ui/checkbox';
import { Label } from '@/shared_components/ui/label';
import { Input } from '@/shared_components/ui/input';
import { Textarea } from '@/shared_components/ui/textarea';
import { claimGuestCheckout, getGuestOrder, updateGuestOrder } from '@/api/guestCheckout';
import { errorMessage } from '@/lib/errors';
import { EMPTY_RECIPIENT, recipientFromPlan } from '@/lib/recipientData';
import type { Order } from '@/types/Order';
import type { RecipientData } from '@/types/RecipientData';

/**
 * Step 2 of the guest flow: who is ordering and who receives the flowers.
 * Contact details live here (not on the details step) because they are part of
 * "who's involved" — and because the deliver-to-self toggle can then reuse the
 * customer's name as the recipient's instead of asking for it twice.
 *
 * Saving claims the checkout (records name/email on the order) and stores the
 * recipient in the same action. The dashboard's post-payment recipient editor
 * is OrderRecipientEditor.
 */
const GuestRecipientEditor = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [deliverToSelf, setDeliverToSelf] = useState(false);
    const [recipient, setRecipient] = useState<RecipientData>(EMPTY_RECIPIENT);

    useEffect(() => {
        let cancelled = false;
        getGuestOrder()
            .then((plan: Order) => {
                if (cancelled) return;
                const customerFirst = plan.customer_first_name || '';
                const customerLast = plan.customer_last_name || '';
                setFirstName(customerFirst);
                setLastName(customerLast);
                setEmail(plan.customer_email || '');
                setRecipient(recipientFromPlan(plan));
                // A previous visit that delivered to the customer themselves.
                if (customerFirst && plan.recipient_first_name === customerFirst && plan.recipient_last_name === customerLast) {
                    setDeliverToSelf(true);
                }
            })
            .catch((err) => {
                if (cancelled) return;
                toast.error('Failed to load your order.', { description: errorMessage(err) });
                router.push('/');
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [router]);

    const setRecipientField = (field: keyof RecipientData, value: string) => {
        setRecipient((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!firstName || !lastName || !email) {
            toast.error('Please fill in your name and email.');
            return;
        }
        const recipientFirst = deliverToSelf ? firstName : recipient.recipient_first_name;
        const recipientLast = deliverToSelf ? lastName : recipient.recipient_last_name;
        if (!recipientFirst || !recipient.recipient_street_address || !recipient.recipient_city) {
            toast.error("Please fill in at least the recipient's first name, address, and city.");
            return;
        }

        setIsSaving(true);
        try {
            await claimGuestCheckout({ email, first_name: firstName, last_name: lastName });
            await updateGuestOrder({
                ...recipient,
                recipient_first_name: recipientFirst,
                recipient_last_name: recipientLast,
            });
            router.push('/order/details');
        } catch (err) {
            toast.error('Failed to save your details.', { description: errorMessage(err) });
            setIsSaving(false);
        }
    };

    return (
        <PlanEditorShell
            title="Who is receiving the flowers?"
            backPath="/"
            saveButtonText="Next: Final Details"
            isLoading={isLoading}
            isSaving={isSaving}
            onSave={handleSave}
        >
            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Your Details</h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="customer-first-name">First Name<span className="text-red-500">*</span></Label>
                            <Input id="customer-first-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Your first name" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="customer-last-name">Last Name<span className="text-red-500">*</span></Label>
                            <Input id="customer-last-name" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Your last name" />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="customer-email">Email<span className="text-red-500">*</span></Label>
                        <Input id="customer-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" />
                    </div>
                    <label className="flex items-start gap-3 cursor-pointer pt-1">
                        <Checkbox
                            checked={deliverToSelf}
                            onCheckedChange={(checked) => setDeliverToSelf(checked === true)}
                            className="mt-0.5 flex-shrink-0"
                        />
                        <span className="text-sm text-black/70">
                            I&apos;m the recipient — deliver to me
                        </span>
                    </label>
                </div>
            </div>

            <RecipientForm
                formData={recipient}
                onFormChange={setRecipientField}
                title={deliverToSelf ? 'Delivery Address' : 'Recipient Details'}
                hideNameFields={deliverToSelf}
            />

            <div className="grid gap-2 mt-2 pb-4">
                <Label htmlFor="delivery-notes">Delivery Notes (Optional)</Label>
                <Textarea
                    id="delivery-notes"
                    placeholder="e.g., Leave at the front door, ring the bell twice, etc."
                    value={recipient.delivery_notes}
                    onChange={(e) => setRecipientField('delivery_notes', e.target.value)}
                    rows={3}
                />
                <p className="text-sm text-muted-foreground">Any special instructions for the delivery driver.</p>
            </div>
        </PlanEditorShell>
    );
};

export default GuestRecipientEditor;
