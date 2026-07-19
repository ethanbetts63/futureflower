
"use client";

import { useForm } from 'react-hook-form';
import type { UserProfile } from '@/types/UserProfile';
import { updateUserProfile } from '@/api';
import { Button } from "@/shared_components/ui/button";
import { Input } from "@/shared_components/ui/input";
import { Form, FormControl, FormField as ShadcnFormField, FormItem, FormLabel, FormMessage } from "@/shared_components/ui/form";
import { toast } from "sonner";

import type { ProfileFormProps } from '@/types/ProfileFormProps';
import { fieldErrorSummary } from '@/api/ApiError';
import { errorMessage } from '@/lib/errors';

type ProfileFormData = Omit<UserProfile, 'id' | 'username'>;

export const ProfileForm = ({ profile, onProfileUpdate, isEditing }: ProfileFormProps) => {
    const form = useForm<ProfileFormData>({
        defaultValues: {
            first_name: profile.first_name || '',
            last_name: profile.last_name || '',
            email: profile.email || '',
        },
    });
    const { handleSubmit, control } = form;

    const onSubmit = async (values: ProfileFormData) => {
        try {
            const updatedProfile = await updateUserProfile(values);
            onProfileUpdate(updatedProfile);
        } catch (error) {
            toast.error("Update Failed", {
                description: fieldErrorSummary(error, '\n') || errorMessage(error),
            });
        }
    };
    
    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ShadcnFormField control={control} name="first_name" render={({ field }) => (
                        <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <ShadcnFormField control={control} name="last_name" render={({ field }) => (
                        <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                <ShadcnFormField control={control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>
                )} />

                 <Button type="submit" id="profile-form-submit" className="hidden" />
            </form>
        </Form>
    );
};
