import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import HomePage from './pages/home';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { Toaster } from "@/components/ui/sonner"
import { ConfigProvider } from './context/ConfigContext';
import { Spinner } from './components/ui/spinner';

// --- Lazy-loaded Pages ---
const ConfirmationPage = lazy(() => import('./pages/flow/ConfirmationPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const UserDashboardLayout = lazy(() => import('./pages/UserDashboardLayout'));
const AccountManagementPage = lazy(() => import('./pages/AccountManagementPage'));
const EventGate = lazy(() => import('@/components/EventGate'));
const ProfileCreationPage = lazy(() => import('./pages/flow/ProfileCreationPage'));
const EventCreationPage = lazy(() => import('./pages/flow/FlowerPlanCreationPage'));
const ActivationSuccessPage = lazy(() => import('./pages/ActivationSuccessPage'));
const PaymentPage = lazy(() => import('./pages/flow/PaymentPage'));
const PaymentStatusPage = lazy(() => import('./pages/flow/PaymentStatusPage'));
const VerificationSuccessPage = lazy(() => import('./pages/VerificationSuccessPage'));
const BlocklistSuccessPage = lazy(() => import('./pages/BlocklistSuccessPage'));
const TermsAndConditionsPage = lazy(() => import('./pages/TermsAndConditionsPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordConfirmPage = lazy(() => import('./pages/ResetPasswordConfirmPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const BlogExplorePage = lazy(() => import('./pages/BlogExplorePage'));
const BestFlowerSubscriptionServicesUS = lazy(() => import('./pages/articles/BestFlowerSubscriptionServicesUS'));
const BestFlowerSubscriptionServicesAU = lazy(() => import('./pages/articles/BestFlowerSubscriptionServicesAU'));
const BestFlowerSubscriptionServicesUK = lazy(() => import('./pages/articles/BestFlowerSubscriptionServicesUK'));
const BestFlowerSubscriptionServicesEU = lazy(() => import('./pages/articles/BestFlowerSubscriptionServicesEU'));
const BestFlowerSubscriptionServicesNZ = lazy(() => import('./pages/articles/BestFlowerSubscriptionServicesNZ'));
const BestFlowerDeliveryPerth = lazy(() => import('./pages/articles/BestFlowerDeliveryPerth'));
const BestFlowerDeliverySydney = lazy(() => import('./pages/articles/BestFlowerDeliverySydney'));

const CreateAccountPage = lazy(() => import('./pages/flow/CreateAccountPage'));

// --- Lazy-loaded Admin Pages ---
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminHomePage = lazy(() => import('./pages/admin/AdminHomePage'));

const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <Spinner className="h-12 w-12" />
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <Toaster position="top-center" />
        <div className="flex-grow">
          <ConfigProvider>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/confirmation/:eventId" element={<ConfirmationPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/create-account" element={<CreateAccountPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password-confirm/:uid/:token" element={<ResetPasswordConfirmPage />} />
                <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
                <Route path="/verification-success" element={<VerificationSuccessPage />} />
                <Route path="/blocklist-success" element={<BlocklistSuccessPage />} />
                <Route path="/articles" element={<BlogExplorePage />} />
                <Route path="/articles/best-flower-subscription-services-us" element={<BestFlowerSubscriptionServicesUS />} />
                <Route path="/articles/best-flower-subscription-services-au" element={<BestFlowerSubscriptionServicesAU />} />
                <Route path="/articles/best-flower-subscription-services-uk" element={<BestFlowerSubscriptionServicesUK />} />
                <Route path="/articles/best-flower-subscription-services-eu" element={<BestFlowerSubscriptionServicesEU />} />
                <Route path="/articles/best-flower-subscription-services-nz" element={<BestFlowerSubscriptionServicesNZ />} />
                <Route path="/articles/best-flower-delivery-perth" element={<BestFlowerDeliveryPerth />} />
                <Route path="/articles/best-flower-delivery-sydney" element={<BestFlowerDeliverySydney />} />


                {/* Event Creation Flow */}
                <Route path="/event-gate" element={<EventGate />} />
                <Route path="/create-flow/profile" element={<ProfileCreationPage />} />
                <Route path="/create-flow/event" element={<EventCreationPage />} />
                <Route path="/create-flow/payment" element={<PaymentPage />} />
                <Route path="/create-flow/success" element={<ActivationSuccessPage />} />
                <Route path="/payment-status" element={<PaymentStatusPage />} />

                {/* Admin Section */}
                <Route path="/admin-dashboard" element={<AdminLayout />}>
                  <Route index element={<AdminHomePage />} />
                </Route>

                {/* Logged-in user dashboard routes */}
                <Route path="/dashboard" element={<UserDashboardLayout />}>
                  <Route index element={<Navigate to="events" replace />} />
                  <Route path="account" element={<AccountManagementPage />} />
                </Route>

              </Routes>
            </Suspense>
          </ConfigProvider>
        </div>
        <Footer />
      </div>
    </HelmetProvider>
  );
}

export default App;