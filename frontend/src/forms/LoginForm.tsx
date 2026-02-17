"use client"

import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { cn } from "@/utils/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

type LoginFormData = {
  email: string;
  password: string;
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const { loginWithPassword } = useAuth();

  const form = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginWithPassword(data.email, data.password);
      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed", error);
      toast.error("Login Failed", {
        description: "Please check your email and password and try again.",
      });
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
      <Card className="overflow-hidden p-0 bg-white text-black shadow-md border-none">
        <CardContent className="p-0">

          <div className="p-6 md:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* Header */}
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  <p className="text-muted-foreground text-balance text-sm">
                    Login to your  account
                  </p>
                </div>

                {/* Email Field */}
                <FormField control={form.control} name="email" rules={{ required: 'Email is required' }} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        autoComplete="username"
                        placeholder="m@example.com"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Password Field */}
                <FormField control={form.control} name="password" rules={{ required: 'Password is required' }} render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel>Password</FormLabel>
                      <Link
                        to="/forgot-password"
                        className="ml-auto text-sm underline-offset-2 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        autoComplete="current-password"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <Spinner className="mr-2 h-4 w-4" />
                      <span>Logging In...</span>
                    </div>
                  ) : (
                    "Login"
                  )}
                </Button>

                {/* Signup Link */}
                <div className="text-center text-sm text-black">
                  Don&apos;t have an account?{" "}
                  <Link to="/order" className="underline underline-offset-2 hover:underline hover:text-primary">
                    Order Flowers
                  </Link>
                </div>

              </form>
            </Form>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
