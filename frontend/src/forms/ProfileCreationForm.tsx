// frontend/src/components/flow/ProfileCreationForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import type { FieldErrors, Resolver } from 'react-hook-form';
import type { ProfileCreationData } from '../types/ProfileCreationData';
import type { ProfileCreationFormProps } from '../types/ProfileCreationFormProps';

// Custom resolver to replace Zod
const profileFormResolver: Resolver<ProfileCreationData> = async (data) => {
    const errors: FieldErrors<ProfileCreationData> = {};

    // First Name validation
    if (!data.first_name) {
        errors.first_name = { type: 'required', message: 'First name is required.' };
    }

    // Last Name validation
    if (!data.last_name) {
        errors.last_name = { type: 'required', message: 'Last name is required.' };
    }

    // Email validation
    if (!data.email) {
        errors.email = { type: 'required', message: 'Email is required.' };
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
        errors.email = { type: 'pattern', message: 'Please enter a valid email.' };
    }

    // Password validation
    if (!data.password) {
        errors.password = { type: 'required', message: 'Password is required.' };
    } else if (data.password.length < 8) {
        errors.password = { type: 'minLength', message: 'Password must be at least 8 characters.' };
    }

    // Confirm Password validation
    if (data.password && data.confirmPassword !== data.password) {
        errors.confirmPassword = { type: 'validate', message: 'Passwords do not match.' };
    }

    return {
        values: Object.keys(errors).length > 0 ? {} : data,
        errors: errors,
    };
};

export const ProfileCreationForm: React.FC<ProfileCreationFormProps> = ({ initialData, onSubmit }) => {
    const form = useForm<ProfileCreationData>({
        defaultValues: initialData,
        resolver: profileFormResolver,
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="first_name" render={({ field }) => (
                        <FormItem><FormLabel>First Name<span className="text-red-500">*</span></FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="last_name" render={({ field }) => (
                        <FormItem><FormLabel>Last Name<span className="text-red-500">*</span></FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email<span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                            <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField control={form.control} name="password" render={({ field }) => (
                        <FormItem><FormLabel>Password<span className="text-red-500">*</span></FormLabel><FormControl><Input {...field} type="password" /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                        <FormItem><FormLabel>Confirm Password<span className="text-red-500">*</span></FormLabel><FormControl><Input {...field} type="password" /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                
                <Button type="submit" id="profile-creation-submit" className="hidden" />
            </form>
        </Form>
    );
};