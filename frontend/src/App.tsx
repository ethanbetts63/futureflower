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
const UpfrontPlanListPage = lazy(() => import('./pages/user_dashboard/UpfrontPlanListPage'));
const PlanOverviewPage = lazy(() => import('./pages/user_dashboard/upfront_management/PlanOverviewPage'));
const EditRecipientPage = lazy(() => import('./pages/user_dashboard/upfront_management/EditRecipientPage'));
const EditStructurePage = lazy(() => import('./pages/user_dashboard/upfront_management/EditStructurePage'));
const EditPreferencesPage = lazy(() => import('./pages/user_dashboard/upfront_management/EditPreferencesPage'));
const EditMessagesPage = lazy(() => import('./pages/user_dashboard/upfront_management/EditMessagesPage'));
const SubscriptionPlanOverviewPage = lazy(() => import('./pages/user_dashboard/subscription_management/SubscriptionPlanOverviewPage'));
const SubscriptionEditRecipientPage = lazy(() => import('./pages/user_dashboard/subscription_management/EditRecipientPage'));
const SubscriptionEditPreferencesPage = lazy(() => import('./pages/user_dashboard/subscription_management/EditPreferencesPage'));
const SubscriptionEditStructurePage = lazy(() => import('./pages/user_dashboard/subscription_management/EditStructurePage'));

const EventGate = lazy(() => import('@/components/EventGate'));
const Step1CreateAccountPage = lazy(() => import('./pages/Step1CreateAccountPage'));
const Step2RecipientPage = lazy(() => import('./pages/upfront_flow/Step2RecipientPage'));
const Step3PreferenceSelectionPage = lazy(() => import('./pages/upfront_flow/Step3PreferenceSelectionPage'));
const Step4CustomMessagePage = lazy(() => import('./pages/upfront_flow/Step4CustomMessagePage'));
const Step5StructurePage = lazy(() => import('./pages/upfront_flow/Step5StructurePage'));
const Step6BookingConfirmationPage = lazy(() => import('./pages/upfront_flow/Step6BookingConfirmationPage'));

const SubscriptionStep2RecipientPage = lazy(() => import('./pages/subscription_flow/Step2RecipientPage'));
const SubscriptionStep3PreferenceSelectionPage = lazy(() => import('./pages/subscription_flow/Step3PreferenceSelectionPage'));
const SubscriptionStep4StructurePage = lazy(() => import('./pages/subscription_flow/Step4StructurePage'));
const SubscriptionStep5ConfirmationPage = lazy(() => import('./pages/subscription_flow/Step5ConfirmationPage'));


const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const PaymentStatusPage = lazy(() => import('./pages/PaymentStatusPage'));
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
                <Route path="/event-gate/subscription" element={<EventGate />} />
                <Route path="/event-gate/single-delivery" element={<EventGate />} />
                <Route path="/book-flow/create-account" element={<Step1CreateAccountPage />} />
                <Route path="/book-flow/upfront-plan/:planId/recipient" element={<Step2RecipientPage />} />
                <Route path="/book-flow/upfront-plan/:planId/structure" element={<Step5StructurePage />} />
                <Route path="/book-flow/upfront-plan/:planId/preferences" element={<Step3PreferenceSelectionPage />} />
                <Route path="/book-flow/upfront-plan/:planId/add-message" element={<Step4CustomMessagePage />} />
                <Route path="/book-flow/upfront-plan/:planId/confirmation" element={<Step6BookingConfirmationPage />} />
                
                {/* Subscription Plan Flow */}
                <Route path="/subscribe-flow/subscription-plan/:planId/recipient" element={<SubscriptionStep2RecipientPage />} />
                <Route path="/subscribe-flow/subscription-plan/:planId/preferences" element={<SubscriptionStep3PreferenceSelectionPage />} />
                <Route path="/subscribe-flow/subscription-plan/:planId/structure" element={<SubscriptionStep4StructurePage />} />
                <Route path="/subscribe-flow/subscription-plan/:planId/confirmation" element={<SubscriptionStep5ConfirmationPage />} />


                {/* Unified Checkout and Status Pages */}
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/payment-status" element={<PaymentStatusPage />} />

                {/* Admin Section */}
                <Route path="/admin-dashboard" element={<AdminLayout />}>
                  <Route index element={<AdminHomePage />} />
                </Route>

                {/* Logged-in user dashboard routes */}
                <Route path="/dashboard" element={<UserDashboardLayout />}>
                  <Route index element={<UserDashboardPage />} />
                  <Route path="account" element={<AccountManagementPage />} />
                  <Route path="plans" element={<UpfrontPlanListPage />} />
                  <Route path="plans/:planId/overview" element={<PlanOverviewPage />} />
                  <Route path="plans/:planId/edit-recipient" element={<EditRecipientPage />} />
                  <Route path="plans/:planId/edit-structure" element={<EditStructurePage />} />
                  <Route path="plans/:planId/edit-preferences" element={<EditPreferencesPage />} />
                  <Route path="plans/:planId/edit-messages" element={<EditMessagesPage />} />
                  <Route path="subscription-plans/:planId/overview" element={<SubscriptionPlanOverviewPage />} />
                  <Route path="subscription-plans/:planId/edit-recipient" element={<SubscriptionEditRecipientPage />} />
                  <Route path="subscription-plans/:planId/edit-preferences" element={<SubscriptionEditPreferencesPage />} />
                  <Route path="subscription-plans/:planId/edit-structure" element={<SubscriptionEditStructurePage />} />
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