import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import Seo from '@/components/Seo';
import ServiceAreaInput from '@/components/ServiceAreaInput';
import { registerPartner } from '@/api/partners';
import type { PartnerRegistrationData, ServiceAreaInput as ServiceAreaInputType } from '@/types';

const PartnerRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { handleLoginSuccess } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [partnerType, setPartnerType] = useState<'non_delivery' | 'delivery'>('non_delivery');
  const [serviceAreas, setServiceAreas] = useState<ServiceAreaInputType[]>([]);

  const [form, setForm] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    business_name: '',
    phone: '',
    booking_slug: '',
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
    setIsSubmitting(true);

    try {
      const data: PartnerRegistrationData = {
        ...form,
        partner_type: partnerType,
        service_areas: partnerType === 'delivery' ? serviceAreas : [],
      };

      const authResponse = await registerPartner(data);
      await handleLoginSuccess(authResponse);
      navigate('/partner/dashboard');
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
      <Seo title="Partner Registration | ForeverFlower" />
      <div className="min-h-screen w-full py-8" style={{ backgroundColor: 'var(--color4)' }}>
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="bg-white text-black border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-3xl">Become a Partner</CardTitle>
              <CardDescription>
                Join ForeverFlower as a partner and start earning commissions.
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                {/* Partner Type Selection */}
                <div className="space-y-2">
                  <Label>Partner Type</Label>
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant={partnerType === 'non_delivery' ? 'default' : 'outline'}
                      onClick={() => setPartnerType('non_delivery')}
                    >
                      Referral Partner
                    </Button>
                    <Button
                      type="button"
                      variant={partnerType === 'delivery' ? 'default' : 'outline'}
                      onClick={() => setPartnerType('delivery')}
                    >
                      Delivery Partner
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {partnerType === 'non_delivery'
                      ? 'Earn commissions by referring customers with your unique discount code.'
                      : 'Fulfill flower deliveries in your area and earn from each order.'}
                  </p>
                </div>

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

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} required />
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
                {partnerType === 'delivery' && (
                  <>
                    <div className="border-t pt-6 space-y-4">
                      <h3 className="font-semibold text-lg">Delivery Partner Details</h3>

                      <div className="space-y-2">
                        <Label htmlFor="booking_slug">Booking Slug *</Label>
                        <Input
                          id="booking_slug"
                          name="booking_slug"
                          value={form.booking_slug}
                          onChange={handleChange}
                          placeholder="e.g. rosesandthorns"
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          This will be your unique URL: foreverflower.app/?delivery_partner={form.booking_slug || 'yourslug'}
                        </p>
                      </div>

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

                      <ServiceAreaInput areas={serviceAreas} onChange={setServiceAreas} />
                    </div>
                  </>
                )}
              </CardContent>

              <CardFooter className="flex justify-end">
                <Button type="submit" size="lg" disabled={isSubmitting}>
                  {isSubmitting && <Spinner className="mr-2 h-4 w-4" />}
                  Register as Partner
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
