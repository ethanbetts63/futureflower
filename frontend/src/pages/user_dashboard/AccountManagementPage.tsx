import React, { useState, useEffect } from 'react';
import type { UserProfile } from '@/types/UserProfile';
import { getUserProfile } from '@/api';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Terminal } from "lucide-react";
import { ProfileForm } from '@/forms/ProfileForm'; 
import { ChangePasswordForm } from '@/forms/ChangePasswordForm';
import Seo from '@/components/Seo';
import DeleteAccountSection from '@/components/DeleteAccountSection';

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
            <div className="space-y-8">
                {/* Skeleton for Profile Form */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>
                    <div className="space-y-4 p-4 border rounded-lg">
                        <Skeleton className="h-8 w-1/3" />
                        <Skeleton className="h-8 w-1/2" />
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                </div>

            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    return (
        <div style={{ backgroundColor: 'var(--color4)' }} className="min-h-screen py-0 md:py-12 px-0 md:px-4">
            <div className="container mx-auto max-w-4xl space-y-8">
                <Seo title="Manage Account | FutureFlower" />
                {profile && (
                    <Card className="bg-white text-black border-none shadow-md">
                        <CardHeader className="flex flex-row items-start justify-between">
                            <div>
                                <CardTitle className="text-2xl text-black">Your Profile</CardTitle>
                                <CardDescription className="text-black">
                                    Update your personal information and social media handles. The more contact methods you provide, the more secure your reminder will be.
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                {!isEditing ? (
                                    <Button variant="default" onClick={() => setIsEditing(true)}>Edit</Button>
                                ) : (
                                    <>
                                        <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                                        <Button onClick={() => document.getElementById('profile-form-submit')?.click()}>
                                            Save
                                        </Button>
                                    </>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ProfileForm
                                profile={profile}
                                onProfileUpdate={handleProfileUpdate}
                                isEditing={isEditing}
                            />
                        </CardContent>
                    </Card>
                )}

            <Card className="bg-white text-black border-none shadow-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-black">Change Your Password</CardTitle>
                     <CardDescription className="text-black">
                        Update your password below. After changing, you may be required to log in again.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ChangePasswordForm />
                </CardContent>
            </Card>

            <DeleteAccountSection />
            </div>
        </div>
    );
};

export default AccountManagementPage;