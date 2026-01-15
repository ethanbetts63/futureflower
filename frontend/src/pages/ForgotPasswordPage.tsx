// frontend/src/pages/ForgotPasswordPage.tsx
import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from "sonner";
import Seo from '@/components/Seo';

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

  const requestPasswordReset = async (data: EmailFormData) => {
    const response = await fetch('/api/users/password-reset/request/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // We don't expect a detailed error here due to the backend's design
      // but we throw to be caught by the onSubmit handler.
      throw new Error('An unexpected error occurred.');
    }

    return response.json();
  };

  const onSubmit: SubmitHandler<EmailFormData> = async (data) => {
    try {
      const response = await requestPasswordReset(data);
      toast.info(response.detail); // Show the generic message from the backend
      reset();
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="container mx-auto max-w-md py-12">
      <Seo
        title="Forgot Password | ForeverFlower"
        description="Reset your password for your ForeverFlower account. Enter your email to receive a password reset link."
        canonicalPath="/forgot-password"
      />
      <h1 className="text-2xl font-bold mb-6">Forgot Your Password?</h1>
      <p className="mb-6 text-muted-foreground">
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
  );
};

export default ForgotPasswordPage;
