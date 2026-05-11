import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './page_components/home';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { Toaster } from "@/components/ui/sonner"
import { Spinner } from './components/ui/spinner';

// --- Lazy-loaded Pages ---
const LoginPage = lazy(() => import('./page_components/LoginPage'));
const UserDashboardLayout = lazy(() => import('./page_components/user_dashboard/UserDashboardLayout'));
const UserDashboardPage = lazy(() => import('./page_components/user_dashboard/UserDashboardPage'));
const AccountManagementPage = lazy(() => import('./page_components/user_dashboard/AccountManagementPage'));
const PlanOverviewPage = lazy(() => import('./page_components/user_dashboard/upfront_management/PlanOverviewPage'));
const EditRecipientPage = lazy(() => import('./page_components/user_dashboard/upfront_management/EditRecipientPage'));
const EditPreferencesPage = lazy(() => import('./page_components/user_dashboard/upfront_management/EditPreferencesPage'));
const EditStructurePage = lazy(() => import('./page_components/user_dashboard/upfront_management/EditStructurePage'));
const SubscriptionPlanOverviewPage = lazy(() => import('./page_components/user_dashboard/subscription_management/SubscriptionPlanOverviewPage'));
const SubscriptionEditRecipientPage = lazy(() => import('./page_components/user_dashboard/subscription_management/EditRecipientPage'));
const SubscriptionEditPreferencesPage = lazy(() => import('./page_components/user_dashboard/subscription_management/EditPreferencesPage'));
const SubscriptionEditStructurePage = lazy(() => import('./page_components/user_dashboard/subscription_management/EditStructurePage'));
const CancelSubscriptionPage = lazy(() => import('./page_components/user_dashboard/subscription_management/CancelSubscriptionPage'));
const RefundRequestPage = lazy(() => import('./page_components/user_dashboard/RefundRequestPage'));

const EventGate = lazy(() => import('@/components/form_flow/EventGate'));
const Step1CreateAccountPage = lazy(() => import('./page_components/Step1CreateAccountPage'));

// Subscription Flow Pages
const SubscriptionStep2RecipientPage = lazy(() => import('./page_components/subscription_flow/Step2RecipientPage'));
const SubscriptionStep3PreferenceSelectionPage = lazy(() => import('./page_components/subscription_flow/Step3PreferenceSelectionPage'));
const SubscriptionStep4StructurePage = lazy(() => import('./page_components/subscription_flow/Step4StructurePage'));
const SubscriptionStep5ConfirmationPage = lazy(() => import('./page_components/subscription_flow/Step5ConfirmationPage'));

// Single Delivery Flow Pages
const SingleDeliveryStep2RecipientPage = lazy(() => import('./page_components/single_delivery_flow/Step2RecipientPage'));
const SingleDeliveryStep3PreferencesPage = lazy(() => import('./page_components/single_delivery_flow/Step3PreferencesPage'));
const SingleDeliveryStep4StructurePage = lazy(() => import('./page_components/single_delivery_flow/Step4StructurePage'));
const SingleDeliveryStep5ConfirmationPage = lazy(() => import('./page_components/single_delivery_flow/Step5ConfirmationPage'));

// --- Partner Pages ---
const PartnerTypeSelectionPage = lazy(() => import('./page_components/partner/PartnerTypeSelectionPage'));
const ProductSelectionPage = lazy(() => import('./page_components/ProductSelectionPage'));
const PartnerRegistrationPage = lazy(() => import('./page_components/partner/PartnerRegistrationPage'));
const PartnerDashboardPage = lazy(() => import('./page_components/partner/PartnerDashboardPage'));
const DeliveryRequestPage = lazy(() => import('./page_components/partner/DeliveryRequestPage'));
const StripeConnectReturnPage = lazy(() => import('./page_components/partner/StripeConnectReturnPage'));
const StripeConnectOnboardingPage = lazy(() => import('./page_components/partner/StripeConnectOnboardingPage'));
const PayoutsPage = lazy(() => import('./page_components/partner/PayoutsPage'));
const PayoutDetailPage = lazy(() => import('./page_components/partner/PayoutDetailPage'));
const BusinessDetailsPage = lazy(() => import('./page_components/partner/BusinessDetailsPage'));

const CheckoutPage = lazy(() => import('./page_components/CheckoutPage'));
const PaymentStatusPage = lazy(() => import('./page_components/PaymentStatusPage'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));

// --- Misc Pages ---
const BlocklistSuccessPage = lazy(() => import('./page_components/BlocklistSuccessPage'));
const AffiliatesPage = lazy(() => import('./page_components/AffiliatesPage'));
const TermsAndConditionsPage = lazy(() => import('./page_components/TermsAndConditionsPage'));
const ForgotPasswordPage = lazy(() => import('./page_components/ForgotPasswordPage'));
const ResetPasswordConfirmPage = lazy(() => import('./page_components/ResetPasswordConfirmPage'));
const ContactPage = lazy(() => import('./page_components/ContactPage'));
const FloristsPage = lazy(() => import('./page_components/FloristsPage'));
const PricingPage = lazy(() => import('./page_components/PricingPage'));
const BirthdayFlowerDelivery = lazy(() => import('./page_components/BirthdayFlowerDelivery'));
const ValentinesDayFlowerDelivery = lazy(() => import('./page_components/ValentinesDayFlowerDelivery'));
const MothersDayFlowerDelivery = lazy(() => import('./page_components/MothersDayFlowerDelivery'));
const FlowerDeliveryPerth = lazy(() => import('./page_components/FlowerDeliveryPerth'));

// --- Blog Pages ---
const BlogExplorePage = lazy(() => import('./page_components/BlogExplorePage'));
const BestFlowerSubscriptionServicesUS = lazy(() => import('./page_components/articles/BestFlowerSubscriptionServicesUS'));
const BestFlowerSubscriptionServicesAU = lazy(() => import('./page_components/articles/BestFlowerSubscriptionServicesAU'));
const BestFlowerSubscriptionServicesUK = lazy(() => import('./page_components/articles/BestFlowerSubscriptionServicesUK'));
const BestFlowerSubscriptionServicesEU = lazy(() => import('./page_components/articles/BestFlowerSubscriptionServicesEU'));
const BestFlowerSubscriptionServicesNZ = lazy(() => import('./page_components/articles/BestFlowerSubscriptionServicesNZ'));
const BestFlowerDeliveryPerth = lazy(() => import('./page_components/articles/BestFlowerDeliveryPerth'));
const BestFlowerDeliverySydney = lazy(() => import('./page_components/articles/BestFlowerDeliverySydney'));
const BestFlowerDeliveryAdelaide = lazy(() => import('./page_components/articles/BestFlowerDeliveryAdelaide'));
const BestFlowerDeliveryDarwin = lazy(() => import('./page_components/articles/BestFlowerDeliveryDarwin'));
const BestFlowerDeliveryMelbourne = lazy(() => import('./page_components/articles/BestFlowerDeliveryMelbourne'));

// --- Admin Pages ---
const AdminDashboardPage = lazy(() => import('./page_components/admin/AdminDashboardPage'));
const AdminEventDetailPage = lazy(() => import('./page_components/admin/AdminEventDetailPage'));
const AdminPartnerListPage = lazy(() => import('./page_components/admin/AdminPartnerListPage'));
const AdminPartnerDetailPage = lazy(() => import('./page_components/admin/AdminPartnerDetailPage'));
const AdminPlanListPage = lazy(() => import('./page_components/admin/AdminPlanListPage'));
const AdminPlanDetailPage = lazy(() => import('./page_components/admin/AdminPlanDetailPage'));
const MarkOrderedPage = lazy(() => import('./page_components/admin/MarkOrderedPage'));
const MarkDeliveredPage = lazy(() => import('./page_components/admin/MarkDeliveredPage'));
const AdminUserListPage = lazy(() => import('./page_components/admin/AdminUserListPage'));
const AdminUserDetailPage = lazy(() => import('./page_components/admin/AdminUserDetailPage'));
const AdminPayoutListPage = lazy(() => import('./page_components/admin/AdminPayoutListPage'));
const AdminPayoutDetailPage = lazy(() => import('./page_components/admin/AdminPayoutDetailPage'));
const AdminGuard = lazy(() => import('./components/AdminGuard'));

const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <Spinner className="h-12 w-12" />
  </div>
);

function App() {
  return (
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
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/affiliates" element={<AffiliatesPage />} />
                <Route path="/birthday-flower-delivery" element={<BirthdayFlowerDelivery />} />
                <Route path="/valentines-day-flower-delivery" element={<ValentinesDayFlowerDelivery />} />
                <Route path="/mothers-day-flower-delivery" element={<MothersDayFlowerDelivery />} />
                <Route path="/flower-delivery-perth" element={<FlowerDeliveryPerth />} />
                <Route path="/blocklist-success" element={<BlocklistSuccessPage />} />
                <Route path="/articles" element={<BlogExplorePage />} />
                <Route path="/articles/best-flower-subscription-services-us" element={<BestFlowerSubscriptionServicesUS />} />
                <Route path="/articles/best-flower-subscription-services-au" element={<BestFlowerSubscriptionServicesAU />} />
                <Route path="/articles/best-flower-subscription-services-uk" element={<BestFlowerSubscriptionServicesUK />} />
                <Route path="/articles/best-flower-subscription-services-eu" element={<BestFlowerSubscriptionServicesEU />} />
                <Route path="/articles/best-flower-subscription-services-nz" element={<BestFlowerSubscriptionServicesNZ />} />
                <Route path="/articles/best-flower-delivery-perth" element={<BestFlowerDeliveryPerth />} />
                <Route path="/articles/best-flower-delivery-sydney" element={<BestFlowerDeliverySydney />} />
                <Route path="/articles/best-flower-delivery-adelaide" element={<BestFlowerDeliveryAdelaide />} />
                <Route path="/articles/best-flower-delivery-darwin" element={<BestFlowerDeliveryDarwin />} />
                <Route path="/articles/best-flower-delivery-melbourne" element={<BestFlowerDeliveryMelbourne />} />

                {/* Event Creation Flow */}
                <Route path="/order" element={<ProductSelectionPage />} />
                <Route path="/event-gate/:flowType?" element={<EventGate />} />
                <Route path="/create-account" element={<Step1CreateAccountPage />} />
                
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
                <Route path="/partner/stripe-connect/onboarding" element={<StripeConnectOnboardingPage />} />
                <Route path="/partner/payouts" element={<Navigate to="/dashboard/partner/payouts" replace />} />
                <Route path="/partner/payouts/:payoutId" element={<Navigate to="/dashboard/partner/payouts" replace />} />

                {/* Unified Checkout and Status Pages */}
                <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                <Route path="/payment-status" element={<ProtectedRoute><PaymentStatusPage /></ProtectedRoute>} />

                {/* Logged-in user dashboard routes */}
                <Route path="/dashboard" element={<ProtectedRoute><UserDashboardLayout /></ProtectedRoute>}>
                  <Route index element={<UserDashboardPage />} />
                  <Route path="account" element={<AccountManagementPage />} />
                  <Route path="upfront-plans/:planId/overview" element={<PlanOverviewPage />} />
                  <Route path="upfront-plans/:planId/edit-recipient" element={<EditRecipientPage />} />
                  <Route path="upfront-plans/:planId/edit-preferences" element={<EditPreferencesPage />} />
                  <Route path="upfront-plans/:planId/edit-structure" element={<EditStructurePage />} />
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
                  <Route path="admin/partners" element={<AdminGuard><AdminPartnerListPage /></AdminGuard>} />
                  <Route path="admin/plans" element={<AdminGuard><AdminPlanListPage /></AdminGuard>} />
                  <Route path="admin/plans/:planType/:planId" element={<AdminGuard><AdminPlanDetailPage /></AdminGuard>} />
                  <Route path="admin/partners/:partnerId" element={<AdminGuard><AdminPartnerDetailPage /></AdminGuard>} />
                  <Route path="admin/users" element={<AdminGuard><AdminUserListPage /></AdminGuard>} />
                  <Route path="admin/users/:userId" element={<AdminGuard><AdminUserDetailPage /></AdminGuard>} />
                  <Route path="admin/payouts" element={<AdminGuard><AdminPayoutListPage /></AdminGuard>} />
                  <Route path="admin/payouts/:commissionId" element={<AdminGuard><AdminPayoutDetailPage /></AdminGuard>} />
                </Route>

            </Routes>
          </Suspense>
      </div>
      <Footer />
    </div>
  );
}

export default App;
