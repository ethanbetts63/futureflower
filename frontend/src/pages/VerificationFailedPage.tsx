// src/pages/VerificationFailedPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircleIcon } from 'lucide-react'; // Using XCircleIcon for failure
import Seo from '@/components/Seo';

const VerificationFailedPage: React.FC = () => {
  return (
    <div className="container mx-auto max-w-2xl py-12">
      <Seo title="Verification Failed | FutureFlower" />
      <Card>
        <CardHeader className="flex flex-col items-center text-center">
          <XCircleIcon className="h-16 w-16 text-red-500 mb-4" /> {/* Red icon for failure */}
          <CardTitle className="text-2xl">Email Verification Failed</CardTitle>
          <CardDescription className="pt-2">
            We were unable to verify your email address. The link may be invalid or has expired. 
            Please try logging in and requesting a new verification email, or contact support if the issue persists.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button asChild>
            <Link to="/login">Go to Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationFailedPage;
