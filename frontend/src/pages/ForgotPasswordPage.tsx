// frontend/src/pages/ForgotPasswordPage.tsx
import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
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
      <div className="flex flex-col gap-6 w-full max-w-sm md:max-w-md">
        <Card className="overflow-hidden p-0 bg-white text-black shadow-md border-none">
          <CardContent className="p-0">
            <div className="p-6 md:p-8">
              <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                  <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Forgot Your Password?</h1>
                    <p className="text-muted-foreground text-balance text-sm">
                      Enter your email and we'll send you a reset link.
                    </p>
                  </div>

                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="m@example.com"
                        disabled={isSubmitting}
                        {...register('email', { required: 'Email address is required' })}
                      />
                    </FormControl>
                    <FormMessage>{errors.email?.message}</FormMessage>
                  </FormItem>

                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <Spinner className="mr-2 h-4 w-4" />
                        <span>Sending...</span>
                      </div>
                    ) : (
                      'Send Reset Link'
                    )}
                  </Button>

                  <div className="text-center text-sm text-black">
                    Remember your password?{" "}
                    <Link to="/login" className="underline underline-offset-2 hover:underline hover:text-primary">
                      Back to login
                    </Link>
                  </div>

                </form>
              </Form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );};

export default ForgotPasswordPage;
