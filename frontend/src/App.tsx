import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import HomePage from './pages/home';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { Toaster } from "@/components/ui/sonner"
import { ConfigProvider } from './context/ConfigContext';
import { Spinner } from './components/ui/spinner';

// --- Lazy-loaded Pages ---
const LoginPage = lazy(() => import('./pages/LoginPage'));
const UserDashboardLayout = lazy(() => import('./pages/user_dashboard/UserDashboardLayout'));
const UserDashboardPage = lazy(() => import('./pages/user_dashboard/UserDashboardPage'));
const AccountManagementPage = lazy(() => import('./pages/user_dashboard/AccountManagementPage'));
const FlowerPlanManagementPage = lazy(() => import('./pages/user_dashboard/FlowerPlanManagementPage'));
const PlanOverviewPage = lazy(() => import('./pages/user_dashboard/PlanOverviewPage'));
const EditRecipientPage = lazy(() => import('./pages/user_dashboard/EditRecipientPage'));
const EditStructurePage = lazy(() => import('./pages/user_dashboard/EditStructurePage'));
const EventGate = lazy(() => import('@/components/EventGate'));
const FlowerPlanCreationPage = lazy(() => import('./pages/flow/FlowerPlanCreationPage'));
const PreferenceSelectionPage = lazy(() => import('./pages/flow/PreferenceSelectionPage'));
const BookingConfirmationPage = lazy(() => import('./pages/flow/BookingConfirmationPage'));
const ActivationSuccessPage = lazy(() => import('./pages/flow/ActivationSuccessPage'));
const PaymentPage = lazy(() => import('./pages/flow/PaymentPage'));
const PaymentStatusPage = lazy(() => import('./pages/flow/PaymentStatusPage'));
const VerificationSuccessPage = lazy(() => import('./pages/VerificationSuccessPage'));
const VerificationFailedPage = lazy(() => import('./pages/VerificationFailedPage'));
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
const CustomMessagePage = lazy(() => import('./pages/flow/CustomMessagePage'));

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
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password-confirm/:uid/:token" element={<ResetPasswordConfirmPage />} />
                <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
                <Route path="/verification-success" element={<VerificationSuccessPage />} />
                <Route path="/verification-failed" element={<VerificationFailedPage />} /> 
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
                <Route path="/book-flow/create-account" element={<CreateAccountPage />} />
                <Route path="/book-flow/create-flower-plan" element={<FlowerPlanCreationPage />} />
                <Route path="/book-flow/flower-plan/:planId/preferences" element={<PreferenceSelectionPage />} />
                <Route path="/book-flow/flower-plan/:planId/add-message" element={<CustomMessagePage />} />
                <Route path="/book-flow/flower-plan/:planId/confirmation" element={<BookingConfirmationPage />} />
                <Route path="/book-flow/flower-plan/:planId/payment" element={<PaymentPage />} />
                <Route path="/create-flow/success" element={<ActivationSuccessPage />} />
                <Route path="/payment-status" element={<PaymentStatusPage />} />

                {/* Admin Section */}
                <Route path="/admin-dashboard" element={<AdminLayout />}>
                  <Route index element={<AdminHomePage />} />
                </Route>

                {/* Logged-in user dashboard routes */}
                <Route path="/dashboard" element={<UserDashboardLayout />}>
                  <Route index element={<UserDashboardPage />} />
                  <Route path="account" element={<AccountManagementPage />} />
                  <Route path="plans" element={<FlowerPlanManagementPage />} />
                  <Route path="plans/:planId/overview" element={<PlanOverviewPage />} />
                  <Route path="plans/:planId/edit-recipient" element={<EditRecipientPage />} />
                  <Route path="plans/:planId/edit-structure" element={<EditStructurePage />} />
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