// frontend/src/pages/ResetPasswordConfirmPage.tsx
import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { toast } from "sonner";
import Seo from '@/components/Seo';
import { confirmPasswordReset } from '@/api';

type PasswordResetFormData = {
  password: string;
  password_confirm: string;
};

const ResetPasswordConfirmPage: React.FC = () => {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const navigate = useNavigate();

  const form = useForm<PasswordResetFormData>({
    defaultValues: {
      password: '',
      password_confirm: '',
    },
  });

  const { register, handleSubmit, formState: { errors, isSubmitting }, setError: setFormError } = form;

  const onSubmit: SubmitHandler<PasswordResetFormData> = async (data) => {
    // Manual Validation
    if (data.password.length < 8) {
      setFormError('password', { type: 'manual', message: 'Password must be at least 8 characters long.' });
      return;
    }
    if (data.password !== data.password_confirm) {
      setFormError('password_confirm', { type: 'manual', message: "The two password fields didn't match." });
      return;
    }

    if (!uid || !token) {
        toast.error("Error", {
            description: "UID or Token is missing from the URL.",
        });
        return;
    }

    try {
      await confirmPasswordReset(uid, token, data);
      toast.success("Password has been reset! You can now log in.");
      navigate('/login');
    } catch (err: any) {
      const errorMessage = err.message || "An error occurred. Please try again.";
      toast.error("Error", {
        description: errorMessage,
      });
    }
  };

  return (
    <div className="bg-[var(--color4)] flex flex-grow min-h-full flex-col items-center justify-center p-6 md:p-10">
      <Seo
        title="Reset Your Password | FutureFlower"
        description="Enter your new password to complete the password reset process."
      />
      <div className="flex flex-col gap-6 w-full max-w-sm md:max-w-md">
        <Card className="overflow-hidden p-0 bg-white text-black shadow-md border-none">
          <CardContent className="p-0">
            <div className="p-6 md:p-8">
              <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                  <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Set Your New Password</h1>
                    <p className="text-muted-foreground text-balance text-sm">
                      Please enter and confirm your new password below.
                    </p>
                  </div>

                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="new-password"
                        disabled={isSubmitting}
                        {...register('password')}
                      />
                    </FormControl>
                    <FormMessage>{errors.password?.message}</FormMessage>
                  </FormItem>

                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="new-password"
                        disabled={isSubmitting}
                        {...register('password_confirm')}
                      />
                    </FormControl>
                    <FormMessage>{errors.password_confirm?.message}</FormMessage>
                  </FormItem>

                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <Spinner className="mr-2 h-4 w-4" />
                        <span>Resetting Password...</span>
                      </div>
                    ) : (
                      'Reset Password'
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
  );
};

export default ResetPasswordConfirmPage;
