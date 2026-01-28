// frontend/src/components/flow/EventCreationForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import type { FieldErrors, Resolver } from 'react-hook-form';

// Manually define the data type, removing the dependency on Zod
import type { EventCreationData, EventCreationFormProps } from '../types/forms';

// Custom resolver for EventCreationForm
const eventFormResolver: Resolver<EventCreationData> = async (data) => {
    const errors: FieldErrors<EventCreationData> = {};

    // Name validation
    if (!data.name) {
        errors.name = { type: 'required', message: 'Event name is required.' };
    }

    // Event Date validation
    if (!data.event_date) {
        errors.event_date = { type: 'required', message: 'Event date is required.' };
    }

    // Weeks in Advance validation
    if (data.weeks_in_advance === undefined || data.weeks_in_advance === null) {
        errors.weeks_in_advance = { type: 'required', message: 'Weeks in advance is required.' };
    } else if (data.weeks_in_advance < 0) {
        errors.weeks_in_advance = { type: 'min', message: 'Weeks in advance cannot be negative.' };
    }

    return {
        values: Object.keys(errors).length > 0 ? {} : data,
        errors: errors,
    };
};

export const EventCreationForm: React.FC<EventCreationFormProps> = ({ initialData, onSubmit }) => {
    const form = useForm<EventCreationData>({
        defaultValues: {
            weeks_in_advance: 4,
            ...initialData,
        },
        resolver: eventFormResolver,
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">Event Name</FormLabel>
                    <FormControl><Input placeholder="e.g., Warranty renewal for solar panels..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="event_date" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">Event Date</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="notes" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-black">Notes (Optional)</FormLabel>
                        <FormControl><Textarea placeholder="Add any details to jog your memory, like a policy number or a link to the website..." {...field} /></FormControl>
                        <FormDescription className="text-black">A paragraph or two to help you remember the specifics of this event.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="weeks_in_advance" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-black">Weeks in Advance</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormDescription className="text-black">How many weeks in advance should we start sending notifications?</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
                <Button type="submit" id="event-creation-submit" className="hidden" />
            </form>
        </Form>
    );
};
