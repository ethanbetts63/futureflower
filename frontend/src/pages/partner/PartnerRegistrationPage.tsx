import React, { useState } from 'react';
import { useNavigate, useParams, Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import Seo from '@/components/Seo';
import BackButton from '@/components/BackButton';
import ServiceAreaMap from '@/components/ServiceAreaMap';
import { registerPartner } from '@/api/partners';
import { acceptTerms } from '@/api';
import type { PartnerRegistrationData } from '@/types';

const PartnerRegistrationPage: React.FC = () => {
  const { partnerType } = useParams<{ partnerType: string }>();
  const navigate = useNavigate();
  const { handleLoginSuccess } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerTermsAccepted, setCustomerTermsAccepted] = useState(false);
  const [partnerTermsAccepted, setPartnerTermsAccepted] = useState(false);

  // Service area map state
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [radiusKm, setRadiusKm] = useState(10);

  const isDelivery = partnerType === 'delivery';

  // Redirect if invalid partner type
  if (partnerType !== 'referral' && partnerType !== 'delivery') {
    return <Navigate to="/partner/register" replace />;
  }

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirm_password: '',
    first_name: '',
    last_name: '',
    business_name: '',
    phone: '',
    street_address: '',
    suburb: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirm_password) {
      toast.error('Passwords do not match.');
      return;
    }

    if (isDelivery && (latitude === null || longitude === null)) {
      toast.error('Please set your delivery location on the map.');
      return;
    }

    if (!customerTermsAccepted || !partnerTermsAccepted) {
      toast.error('Please accept all terms and conditions before registering.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { confirm_password, ...formData } = form;
      const data: PartnerRegistrationData = {
        ...formData,
        partner_type: isDelivery ? 'delivery' : 'non_delivery',
        ...(isDelivery && {
          latitude: latitude!,
          longitude: longitude!,
          service_radius_km: radiusKm,
        }),
      };

      await registerPartner(data);
      await handleLoginSuccess();
      await Promise.all([
        acceptTerms('customer'),
        acceptTerms(isDelivery ? 'florist' : 'affiliate'),
      ]);
      navigate('/dashboard/partner');
    } catch (error: any) {
      const errorData = error.data || {};
      const description = Object.entries(errorData)
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
        .join('; ');
      toast.error('Registration failed', {
        description: description || error.message || 'Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Seo title={`${isDelivery ? 'Delivery' : 'Referral'} Partner Registration | FutureFlower`} />
      <div className="min-h-screen w-full py-0 md:py-12 px-0 md:px-4" style={{ backgroundColor: 'var(--color4)' }}>
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-white text-black border-none shadow-none md:shadow-xl md:shadow-black/5 rounded-none md:rounded-[2rem] overflow-hidden">
            <CardHeader className="px-4 md:px-8">
              <CardTitle className="text-3xl md:text-4xl font-bold font-['Playfair_Display',_serif]">
                {isDelivery ? 'Delivery Partner' : 'Referral Partner'} Registration
              </CardTitle>
              <CardDescription>
                {isDelivery
                  ? 'Sign up to fulfil flower deliveries in your area and earn from each order.'
                  : 'Sign up to get your unique discount code and start earning commissions.'}
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6 px-4 md:px-8">
                {/* Account Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name *</Label>
                    <Input id="first_name" name="first_name" value={form.first_name} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name *</Label>
                    <Input id="last_name" name="last_name" value={form.last_name} onChange={handleChange} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm_password">Confirm Password *</Label>
                    <Input id="confirm_password" name="confirm_password" type="password" value={form.confirm_password} onChange={handleChange} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="business_name">Business Name</Label>
                    <Input id="business_name" name="business_name" value={form.business_name} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" value={form.phone} onChange={handleChange} />
                  </div>
                </div>

                {/* Delivery Partner Fields */}
                {isDelivery && (
                  <div className="border-t pt-6 space-y-4">
                    <h3 className="font-semibold text-lg">Store Location</h3>

                    <div className="space-y-2">
                      <Label htmlFor="street_address">Street Address</Label>
                      <Input id="street_address" name="street_address" value={form.street_address} onChange={handleChange} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="suburb">Suburb</Label>
                        <Input id="suburb" name="suburb" value={form.suburb} onChange={handleChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" name="city" value={form.city} onChange={handleChange} />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" name="state" value={form.state} onChange={handleChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postcode">Postcode</Label>
                        <Input id="postcode" name="postcode" value={form.postcode} onChange={handleChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" name="country" value={form.country} onChange={handleChange} />
                      </div>
                    </div>

                    <ServiceAreaMap
                      latitude={latitude}
                      longitude={longitude}
                      radiusKm={radiusKm}
                      onLocationChange={(lat, lng) => { setLatitude(lat); setLongitude(lng); }}
                      onRadiusChange={setRadiusKm}
                    />
                  </div>
                )}
                {/* Terms & Conditions */}
                <div className="border-t pt-6 space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      checked={customerTermsAccepted}
                      onCheckedChange={(checked) => setCustomerTermsAccepted(checked === true)}
                      className="mt-0.5 flex-shrink-0"
                    />
                    <span className="text-sm text-black/70 leading-relaxed">
                      I have read and agree to the{' '}
                      <Link to="/terms-and-conditions/customer" target="_blank" className="underline text-black hover:text-black/70">
                        Customer Terms & Conditions
                      </Link>
                      .
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      checked={partnerTermsAccepted}
                      onCheckedChange={(checked) => setPartnerTermsAccepted(checked === true)}
                      className="mt-0.5 flex-shrink-0"
                    />
                    <span className="text-sm text-black/70 leading-relaxed">
                      I have read and agree to the{' '}
                      <Link to={`/terms-and-conditions/${isDelivery ? 'florist' : 'affiliate'}`} target="_blank" className="underline text-black hover:text-black/70">
                        {isDelivery ? 'Florist' : 'Affiliate'} Terms & Conditions
                      </Link>
                      .
                    </span>
                  </label>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between border-t border-black/5 py-2 px-4 md:px-8">
                <BackButton to="/partner/register" />
                <Button type="submit" size="lg" disabled={isSubmitting || !customerTermsAccepted || !partnerTermsAccepted}>
                  {isSubmitting && <Spinner className="mr-2 h-4 w-4" />}
                  Register
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PartnerRegistrationPage;
