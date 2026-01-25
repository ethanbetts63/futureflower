import React from 'react';
import { useForm } from 'react-hook-form';
import type { UserProfile } from '@/types';
import { updateUserProfile } from '@/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField as ShadcnFormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

interface ProfileFormProps {
    profile: UserProfile;
    onProfileUpdate: (updatedProfile: UserProfile) => void;
    isEditing: boolean;
}

type ProfileFormData = Omit<UserProfile, 'id' | 'username'>;

export const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onProfileUpdate, isEditing }) => {
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
        } catch (error: any) {
            const errorData = error.data || {};
            let description = "An unknown error occurred.";
            if (Object.keys(errorData).length > 0) {
                 description = Object.entries(errorData).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`).join('\n');
            }
            toast.error("Update Failed", { description });
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
