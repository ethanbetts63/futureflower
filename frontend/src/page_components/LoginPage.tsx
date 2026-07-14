import { LoginForm } from "@/forms/LoginForm";
import Seo from '../components/Seo';

const LoginPage = () => {
  return (
    <div className="bg-[var(--color4)] flex flex-grow min-h-full flex-col items-center justify-center p-6 md:p-10">
      <Seo
        title="Partner and Staff Login | FutureFlower"
        description="Access the FutureFlower partner and staff workspace."
        canonicalPath="/login"
      />
      <div className="w-full max-w-sm md:max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
