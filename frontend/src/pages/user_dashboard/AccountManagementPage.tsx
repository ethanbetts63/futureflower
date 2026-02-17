import React, { useState, useEffect } from 'react';
import type { UserProfile } from '@/types/UserProfile';
import { getUserProfile } from '@/api';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Terminal, User, ShieldCheck, Trash2 } from "lucide-react";
import { ProfileForm } from '@/forms/ProfileForm'; 
import { ChangePasswordForm } from '@/forms/ChangePasswordForm';
import Seo from '@/components/Seo';
import DeleteAccountSection from '@/components/DeleteAccountSection';
import UnifiedSummaryCard from '@/components/form_flow/UnifiedSummaryCard';
import FlowBackButton from '@/components/form_flow/FlowBackButton';

const AccountManagementPage: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [profileData] = await Promise.all([
                getUserProfile(),
            ]);
            setProfile(profileData);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch account details.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleProfileUpdate = (updatedProfile: UserProfile) => {
        setProfile(updatedProfile);
        setIsEditing(false); // Turn off editing mode on successful save
    };
    
    if (loading) {
        return (
            <div className="min-h-screen w-full py-0 md:py-12 px-0 md:px-4" style={{ backgroundColor: 'var(--color4)' }}>
                <div className="container mx-auto max-w-4xl">
                    <div className="bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-black/5">
                        <div className="p-8 md:p-12 border-b border-black/5">
                            <Skeleton className="h-10 w-1/3 mb-4" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                        <div className="p-8 md:p-12 space-y-12">
                            <div className="space-y-6">
                                <Skeleton className="h-4 w-24" />
                                <div className="grid grid-cols-2 gap-4">
                                    <Skeleton className="h-12 w-full rounded-xl" />
                                    <Skeleton className="h-12 w-full rounded-xl" />
                                </div>
                                <Skeleton className="h-12 w-full rounded-xl" />
                            </div>
                            <div className="space-y-6">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-12 w-1/3 rounded-xl" />
                                <Skeleton className="h-12 w-1/3 rounded-xl" />
                                <Skeleton className="h-12 w-1/3 rounded-xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen w-full py-0 md:py-12 px-0 md:px-4" style={{ backgroundColor: 'var(--color4)' }}>
                <div className="container mx-auto max-w-4xl">
                    <Alert variant="destructive">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: 'var(--color4)' }} className="min-h-screen py-0 md:py-12 px-0 md:px-4">
            <div className="container mx-auto max-w-4xl">
                <Seo title="Manage Account | FutureFlower" />
                
                <UnifiedSummaryCard
                    title="Account Management"
                    description="Update your personal details, manage security settings, and control your account data."
                    footer={
                        <div className="flex justify-start items-center w-full">
                            <FlowBackButton to="/dashboard" label="Dashboard" />
                        </div>
                    }
                >
                    {profile && (
                        <div className="py-6 border-b border-black/5">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <User className="h-5 w-5 text-black/20" />
                                    <span className="text-xs font-bold tracking-[0.2em] text-black uppercase">
                                        Your Profile
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    {!isEditing ? (
                                        <Button variant="outline" size="sm" className="rounded-full px-6 font-bold" onClick={() => setIsEditing(true)}>Edit</Button>
                                    ) : (
                                        <>
                                            <Button variant="ghost" size="sm" className="rounded-full px-6" onClick={() => setIsEditing(false)}>Cancel</Button>
                                            <Button size="sm" className="rounded-full px-6 font-bold" onClick={() => document.getElementById('profile-form-submit')?.click()}>
                                                Save Profile
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="text-black leading-relaxed">
                                <ProfileForm
                                    profile={profile}
                                    onProfileUpdate={handleProfileUpdate}
                                    isEditing={isEditing}
                                />
                            </div>
                        </div>
                    )}

                    <div className="py-8 border-b border-black/5">
                        <div className="flex items-center gap-3 mb-6">
                            <ShieldCheck className="h-5 w-5 text-black/20" />
                            <span className="text-xs font-bold tracking-[0.2em] text-black uppercase">
                                Change Your Password
                            </span>
                        </div>
                        <div className="max-w-md">
                            <ChangePasswordForm />
                        </div>
                    </div>

                    <div className="py-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Trash2 className="h-5 w-5 text-black/20" />
                            <span className="text-xs font-bold tracking-[0.2em] text-black uppercase">
                                Danger Zone
                            </span>
                        </div>
                        <DeleteAccountSection />
                    </div>
                </UnifiedSummaryCard>
            </div>
        </div>
    );
};

export default AccountManagementPage;