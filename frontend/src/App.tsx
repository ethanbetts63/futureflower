import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import HomePage from './pages/home';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { Toaster } from "@/components/ui/sonner"
import { Spinner } from './components/ui/spinner';

// --- Lazy-loaded Pages ---
const LoginPage = lazy(() => import('./pages/LoginPage'));
const UserDashboardLayout = lazy(() => import('./pages/user_dashboard/UserDashboardLayout'));
const UserDashboardPage = lazy(() => import('./pages/user_dashboard/UserDashboardPage'));
const AccountManagementPage = lazy(() => import('./pages/user_dashboard/AccountManagementPage'));
const UpfrontPlanListPage = lazy(() => import('./pages/user_dashboard/PlanListPage'));
const PlanOverviewPage = lazy(() => import('./pages/user_dashboard/upfront_management/PlanOverviewPage'));
const EditRecipientPage = lazy(() => import('./pages/user_dashboard/upfront_management/EditRecipientPage'));
const EditStructurePage = lazy(() => import('./pages/user_dashboard/upfront_management/EditStructurePage'));
const EditPreferencesPage = lazy(() => import('./pages/user_dashboard/upfront_management/EditPreferencesPage'));
const EditMessagesPage = lazy(() => import('./pages/user_dashboard/upfront_management/EditMessagesPage'));
const SubscriptionPlanOverviewPage = lazy(() => import('./pages/user_dashboard/subscription_management/SubscriptionPlanOverviewPage'));
const SubscriptionEditRecipientPage = lazy(() => import('./pages/user_dashboard/subscription_management/EditRecipientPage'));
const SubscriptionEditPreferencesPage = lazy(() => import('./pages/user_dashboard/subscription_management/EditPreferencesPage'));
const SubscriptionEditStructurePage = lazy(() => import('./pages/user_dashboard/subscription_management/EditStructurePage'));
const CancelSubscriptionPage = lazy(() => import('./pages/user_dashboard/subscription_management/CancelSubscriptionPage'));
const RefundRequestPage = lazy(() => import('./pages/user_dashboard/RefundRequestPage'));

const EventGate = lazy(() => import('@/components/form_flow/EventGate'));
const Step1CreateAccountPage = lazy(() => import('./pages/Step1CreateAccountPage'));

// Upfront Flow Pages
const Step2RecipientPage = lazy(() => import('./pages/upfront_flow/Step2RecipientPage'));
const Step3PreferenceSelectionPage = lazy(() => import('./pages/upfront_flow/Step3PreferenceSelectionPage'));
const Step4CustomMessagePage = lazy(() => import('./pages/upfront_flow/Step4CustomMessagePage'));
const Step5StructurePage = lazy(() => import('./pages/upfront_flow/Step5StructurePage'));
const Step6BookingConfirmationPage = lazy(() => import('./pages/upfront_flow/Step6BookingConfirmationPage'));

// Subscription Flow Pages
const SubscriptionStep2RecipientPage = lazy(() => import('./pages/subscription_flow/Step2RecipientPage'));
const SubscriptionStep3PreferenceSelectionPage = lazy(() => import('./pages/subscription_flow/Step3PreferenceSelectionPage'));
const SubscriptionStep4StructurePage = lazy(() => import('./pages/subscription_flow/Step4StructurePage'));
const SubscriptionStep5ConfirmationPage = lazy(() => import('./pages/subscription_flow/Step5ConfirmationPage'));

// Single Delivery Flow Pages
const SingleDeliveryStep2RecipientPage = lazy(() => import('./pages/single_delivery_flow/Step2RecipientPage'));
const SingleDeliveryStep3PreferencesPage = lazy(() => import('./pages/single_delivery_flow/Step3PreferencesPage'));
const SingleDeliveryStep4StructurePage = lazy(() => import('./pages/single_delivery_flow/Step4StructurePage'));
const SingleDeliveryStep5ConfirmationPage = lazy(() => import('./pages/single_delivery_flow/Step5ConfirmationPage'));

// --- Partner Pages ---
const PartnerTypeSelectionPage = lazy(() => import('./pages/partner/PartnerTypeSelectionPage'));
const ProductSelectionPage = lazy(() => import('./pages/ProductSelectionPage'));
const PartnerRegistrationPage = lazy(() => import('./pages/partner/PartnerRegistrationPage'));
const PartnerDashboardPage = lazy(() => import('./pages/partner/PartnerDashboardPage'));
const DeliveryRequestPage = lazy(() => import('./pages/partner/DeliveryRequestPage'));
const StripeConnectReturnPage = lazy(() => import('./pages/partner/StripeConnectReturnPage'));
const PayoutsPage = lazy(() => import('./pages/partner/PayoutsPage'));
const PayoutDetailPage = lazy(() => import('./pages/partner/PayoutDetailPage'));
const BusinessDetailsPage = lazy(() => import('./pages/partner/BusinessDetailsPage'));

const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const PaymentStatusPage = lazy(() => import('./pages/PaymentStatusPage'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));

// --- Misc Pages ---
const BlocklistSuccessPage = lazy(() => import('./pages/BlocklistSuccessPage'));
const AffiliatesPage = lazy(() => import('./pages/AffiliatesPage'));
const TermsAndConditionsPage = lazy(() => import('./pages/TermsAndConditionsPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordConfirmPage = lazy(() => import('./pages/ResetPasswordConfirmPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const FloristsPage = lazy(() => import('./pages/FloristsPage'));

// --- Blog Pages ---
const BlogExplorePage = lazy(() => import('./pages/BlogExplorePage'));
const BestFlowerSubscriptionServicesUS = lazy(() => import('./pages/articles/BestFlowerSubscriptionServicesUS'));
const BestFlowerSubscriptionServicesAU = lazy(() => import('./pages/articles/BestFlowerSubscriptionServicesAU'));
const BestFlowerSubscriptionServicesUK = lazy(() => import('./pages/articles/BestFlowerSubscriptionServicesUK'));
const BestFlowerSubscriptionServicesEU = lazy(() => import('./pages/articles/BestFlowerSubscriptionServicesEU'));
const BestFlowerSubscriptionServicesNZ = lazy(() => import('./pages/articles/BestFlowerSubscriptionServicesNZ'));
const BestFlowerDeliveryPerth = lazy(() => import('./pages/articles/BestFlowerDeliveryPerth'));
const BestFlowerDeliverySydney = lazy(() => import('./pages/articles/BestFlowerDeliverySydney'));

// --- Admin Pages ---
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminEventDetailPage = lazy(() => import('./pages/admin/AdminEventDetailPage'));
const AdminPartnerDetailPage = lazy(() => import('./pages/admin/AdminPartnerDetailPage'));
const MarkOrderedPage = lazy(() => import('./pages/admin/MarkOrderedPage'));
const MarkDeliveredPage = lazy(() => import('./pages/admin/MarkDeliveredPage'));
const AdminGuard = lazy(() => import('./components/AdminGuard'));

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
        <div className="flex-grow flex flex-col">
          <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password-confirm/:uid/:token" element={<ResetPasswordConfirmPage />} />
                <Route path="/terms-and-conditions/:type" element={<TermsAndConditionsPage />} />
                <Route path="/terms-and-conditions" element={<Navigate to="/terms-and-conditions/customer" replace />} />
                <Route path="/florists" element={<FloristsPage />} />
                <Route path="/affiliates" element={<AffiliatesPage />} />
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
                <Route path="/order" element={<ProductSelectionPage />} />
                <Route path="/event-gate/:flowType?" element={<EventGate />} />
                <Route path="/upfront-flow/create-account" element={<Step1CreateAccountPage />} />

                {/* Event Creation Flow - Post Gate */}
                <Route path="/upfront-flow/upfront-plan/:planId/recipient" element={<ProtectedRoute><Step2RecipientPage /></ProtectedRoute>} />
                <Route path="/upfront-flow/upfront-plan/:planId/structure" element={<ProtectedRoute><Step5StructurePage /></ProtectedRoute>} />
                <Route path="/upfront-flow/upfront-plan/:planId/preferences" element={<ProtectedRoute><Step3PreferenceSelectionPage /></ProtectedRoute>} />
                <Route path="/upfront-flow/upfront-plan/:planId/add-message" element={<ProtectedRoute><Step4CustomMessagePage /></ProtectedRoute>} />
                <Route path="/upfront-flow/upfront-plan/:planId/confirmation" element={<ProtectedRoute><Step6BookingConfirmationPage /></ProtectedRoute>} />
                
                {/* Subscription Plan Flow - Post Gate */}
                <Route path="/subscribe-flow/subscription-plan/:planId/recipient" element={<ProtectedRoute><SubscriptionStep2RecipientPage /></ProtectedRoute>} />
                <Route path="/subscribe-flow/subscription-plan/:planId/preferences" element={<ProtectedRoute><SubscriptionStep3PreferenceSelectionPage /></ProtectedRoute>} />
                <Route path="/subscribe-flow/subscription-plan/:planId/structure" element={<ProtectedRoute><SubscriptionStep4StructurePage /></ProtectedRoute>} />
                <Route path="/subscribe-flow/subscription-plan/:planId/confirmation" element={<ProtectedRoute><SubscriptionStep5ConfirmationPage /></ProtectedRoute>} />

                {/* Single Delivery Plan Flow - Post Gate */}
                <Route path="/single-delivery-flow/plan/:planId/recipient" element={<ProtectedRoute><SingleDeliveryStep2RecipientPage /></ProtectedRoute>} />
                <Route path="/single-delivery-flow/plan/:planId/preferences" element={<ProtectedRoute><SingleDeliveryStep3PreferencesPage /></ProtectedRoute>} />
                <Route path="/single-delivery-flow/plan/:planId/structure" element={<ProtectedRoute><SingleDeliveryStep4StructurePage /></ProtectedRoute>} />
                <Route path="/single-delivery-flow/plan/:planId/confirmation" element={<ProtectedRoute><SingleDeliveryStep5ConfirmationPage /></ProtectedRoute>} />



                {/* Partner Routes */}
                <Route path="/partner/register" element={<PartnerTypeSelectionPage />} />
                <Route path="/partner/register/:partnerType" element={<PartnerRegistrationPage />} />
                <Route path="/partner/dashboard" element={<Navigate to="/dashboard/partner" replace />} />
                <Route path="/partner/delivery-request/:token" element={<DeliveryRequestPage />} />
                <Route path="/partner/stripe-connect/return" element={<StripeConnectReturnPage />} />
                <Route path="/partner/payouts" element={<Navigate to="/dashboard/partner/payouts" replace />} />
                <Route path="/partner/payouts/:payoutId" element={<Navigate to="/dashboard/partner/payouts" replace />} />

                {/* Unified Checkout and Status Pages */}
                <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                <Route path="/payment-status" element={<ProtectedRoute><PaymentStatusPage /></ProtectedRoute>} />

                {/* Logged-in user dashboard routes */}
                <Route path="/dashboard" element={<ProtectedRoute><UserDashboardLayout /></ProtectedRoute>}>
                  <Route index element={<UserDashboardPage />} />
                  <Route path="account" element={<AccountManagementPage />} />
                  <Route path="plans" element={<UpfrontPlanListPage />} />
                  <Route path="upfront-plans/:planId/overview" element={<PlanOverviewPage />} />
                  <Route path="upfront-plans/:planId/edit-recipient" element={<EditRecipientPage />} />
                  <Route path="upfront-plans/:planId/edit-structure" element={<EditStructurePage />} />
                  <Route path="upfront-plans/:planId/edit-preferences" element={<EditPreferencesPage />} />
                  <Route path="upfront-plans/:planId/edit-messages" element={<EditMessagesPage />} />
                  <Route path="subscription-plans/:planId/overview" element={<SubscriptionPlanOverviewPage />} />
                  <Route path="subscription-plans/:planId/edit-recipient" element={<SubscriptionEditRecipientPage />} />
                  <Route path="subscription-plans/:planId/edit-preferences" element={<SubscriptionEditPreferencesPage />} />
                  <Route path="subscription-plans/:planId/edit-structure" element={<SubscriptionEditStructurePage />} />
                  <Route path="subscription-plans/:planId/cancel" element={<CancelSubscriptionPage />} />
                  <Route path="refunds" element={<RefundRequestPage />} />
                  {/* Partner routes (inside dashboard layout) */}
                  <Route path="partner" element={<PartnerDashboardPage />} />
                  <Route path="partner/details" element={<BusinessDetailsPage />} />
                  <Route path="partner/payouts" element={<PayoutsPage />} />
                  <Route path="partner/payouts/:payoutId" element={<PayoutDetailPage />} />
                  {/* Admin routes (inside dashboard layout) */}
                  <Route path="admin" element={<AdminGuard><AdminDashboardPage /></AdminGuard>} />
                  <Route path="admin/events/:eventId" element={<AdminGuard><AdminEventDetailPage /></AdminGuard>} />
                  <Route path="admin/events/:eventId/mark-ordered" element={<AdminGuard><MarkOrderedPage /></AdminGuard>} />
                  <Route path="admin/events/:eventId/mark-delivered" element={<AdminGuard><MarkDeliveredPage /></AdminGuard>} />
                  <Route path="admin/partners/:partnerId" element={<AdminGuard><AdminPartnerDetailPage /></AdminGuard>} />
                </Route>

              </Routes>
            </Suspense>
        </div>
        <Footer />
      </div>
    </HelmetProvider>
  );
}

export default App;