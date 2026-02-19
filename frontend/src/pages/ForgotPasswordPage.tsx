// frontend/src/pages/ForgotPasswordPage.tsx
import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card'; // Added import
import { toast } from "sonner";
import Seo from '@/components/Seo';
import { requestPasswordReset } from '@/api';

type EmailFormData = {
  email: string;
};

const ForgotPasswordPage: React.FC = () => {
  const form = useForm<EmailFormData>({
    defaultValues: {
      email: '',
    },
  });

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = form;

  const onSubmit: SubmitHandler<EmailFormData> = async (data) => {
    try {
      const response = await requestPasswordReset(data.email);
      toast.info(response.detail); // Show the generic message from the backend
      reset();
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="bg-[var(--color4)] flex flex-grow min-h-full flex-col items-center justify-center p-6 md:p-10">
      <Seo
        title="Forgot Password | FutureFlower"
        description="Reset your password for your FutureFlower account. Enter your email to receive a password reset link."
        canonicalPath="/forgot-password"
      />
      <div className="w-full max-w-sm md:max-w-md">
        <Card className="overflow-hidden p-0 bg-white text-black shadow-md border-none">
          <CardContent className="p-0">
            <div className="p-6 md:p-8"> {/* This div for padding */}
              <h1 className="text-2xl font-bold mb-6">Forgot Your Password?</h1>
              <p className="mb-6">
                Enter your email address below and we'll send you a link to reset your password.
              </p>
              <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...register('email', { required: 'Email address is required' })}
                      />
                    </FormControl>
                    <FormMessage>{errors.email?.message}</FormMessage>
                  </FormItem>

                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );};

export default ForgotPasswordPage;
