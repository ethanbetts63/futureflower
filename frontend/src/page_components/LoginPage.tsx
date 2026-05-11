import { LoginForm } from "@/forms/LoginForm";
import Seo from '../components/Seo';

const LoginPage = () => {
  return (
    <div className="bg-[var(--color4)] flex flex-grow min-h-full flex-col items-center justify-center p-6 md:p-10">
      <Seo
        title="Login | FutureFlower"
        description="Access your FutureFlower account to manage your critical long-term events and view your notification settings."
        canonicalPath="/login"
      />
      <div className="w-full max-w-sm md:max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
