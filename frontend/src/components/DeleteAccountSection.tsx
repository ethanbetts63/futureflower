import React, { useState } from 'react';
import { deleteAccount } from '@/api';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const DeleteAccountSection: React.FC = () => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        setDeleteError(null);
        try {
            await deleteAccount();
            
            // Clear the JWT tokens from storage to log the user out on the client side.
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            
            // Redirect to the homepage. The user is now logged out.
            window.location.href = '/'; 

        } catch (err: any) {
            setDeleteError(err.message || 'Failed to delete account. Please try again.');
            setIsDeleting(false);
        }
    };

    return (
        <div className="bg-red-50/50 border border-red-100 rounded-3xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex flex-col space-y-1">
                    <p className="font-bold text-lg font-['Playfair_Display',_serif] text-red-900">Delete Your Account</p>
                    <p className="text-sm text-red-700/70 leading-relaxed max-w-xl">Once you delete your account, there is no going back. All of your data, including personal details and flower plans, will be permanently removed.</p>
                </div>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" disabled={isDeleting} className="rounded-full px-8 font-bold shadow-lg shadow-red-200">
                            {isDeleting ? 'Deleting...' : 'Delete Account'}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white text-black border-none rounded-3xl p-8">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-2xl font-bold font-['Playfair_Display',_serif]">Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription className="text-black/60 text-base py-4">
                                This action cannot be undone. This will permanently delete your
                                account and remove all your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="gap-4">
                            <AlertDialogCancel className="rounded-full px-8">Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700 text-white rounded-full px-8 font-bold">
                                Yes, delete my account
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            {deleteError && (
                 <div className="mt-6">
                    <Alert variant="destructive" className="rounded-2xl">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Deletion Failed</AlertTitle>
                        <AlertDescription>{deleteError}</AlertDescription>
                    </Alert>
                </div>
            )}
        </div>
    );
};

export default DeleteAccountSection;
