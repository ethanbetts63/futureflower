// frontend/src/pages/ResetPasswordConfirmPage.tsx
import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
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
    <div className="container mx-auto max-w-md py-12">
      <Seo
        title="Reset Your Password | FutureFlower"
        description="Enter your new password to complete the password reset process."
      />
      <h1 className="text-2xl font-bold mb-6">Set Your New Password</h1>
      <p className="mb-6 text-muted-foreground">
        Please enter and confirm your new password below.
      </p>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormItem>
            <FormLabel>New Password</FormLabel>
            <FormControl>
              <Input 
                type="password" 
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
                {...register('password_confirm')} 
              />
            </FormControl>
            <FormMessage>{errors.password_confirm?.message}</FormMessage>
          </FormItem>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ResetPasswordConfirmPage;
