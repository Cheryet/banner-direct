import Link from 'next/link';
import { LinkButton } from '@/components/ui/link-button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { HeroSection } from '@/components/layout/hero-section';
import { MapPin, Leaf, Award, Users } from 'lucide-react';

export const metadata = {
  title: 'About Us',
  description:
    'Learn about Banner Direct - Canadian-made custom banners with quality materials and fast turnaround.',
};

const values = [
  {
    icon: MapPin,
    title: 'Made in Canada',
    description:
      'All our banners are printed in our Ontario facility, supporting local jobs and reducing shipping times.',
  },
  {
    icon: Leaf,
    title: 'Eco-Conscious',
    description:
      'We use eco-friendly inks and recyclable materials wherever possible. Our vinyl is PVC-free.',
  },
  {
    icon: Award,
    title: 'Quality First',
    description:
      'Every banner is inspected before shipping. We stand behind our work with a satisfaction guarantee.',
  },
  {
    icon: Users,
    title: 'Customer Focused',
    description: "Real humans answer your calls and emails. We're here to help you succeed.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section - Centered variant with paper texture */}
      <HeroSection
        title="About Banner Direct"
        subtitle="We're a Canadian print company on a mission to make custom banners accessible, affordable, and hassle-free for businesses of all sizes."
        eyebrow="Proudly Canadian"
        eyebrowIcon={<MapPin className="h-4 w-4" />}
        texture="paper"
        variant="centered"
      />

      <div className="container py-8 md:py-12">

      {/* Story */}
      <div className="mt-16 grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
        <div className="aspect-[4/3] overflow-hidden rounded-lg bg-muted">
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Production Facility Photo
          </div>
        </div>
        <div>
          <h2 className="mb-4">Our Story</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Banner Direct started in 2018 when our founders got tired of the complicated,
              overpriced banner ordering process. They knew there had to be a better way.
            </p>
            <p>
              Today, we've helped thousands of Canadian businesses—from local shops to national
              brands—create stunning banners for trade shows, events, storefronts, and more.
            </p>
            <p>
              Our state-of-the-art facility in Ontario uses the latest printing technology to
              deliver vibrant, durable banners with fast turnaround times.
            </p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="mt-16">
        <h2 className="mb-8 text-center">What We Stand For</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <Card key={value.title}>
              <CardContent className="p-6 text-center">
                <div className="mx-auto w-fit rounded-lg bg-primary/10 p-3">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold">{value.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-16 rounded-lg bg-primary/5 p-8">
        <div className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-4xl font-bold text-primary">50,000+</p>
            <p className="mt-1 text-muted-foreground">Banners Printed</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary">5,000+</p>
            <p className="mt-1 text-muted-foreground">Happy Customers</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary">99%</p>
            <p className="mt-1 text-muted-foreground">Satisfaction Rate</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary">24hr</p>
            <p className="mt-1 text-muted-foreground">Avg. Response Time</p>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="mt-16 grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="mb-4">Visit Us</h2>
          <p className="text-muted-foreground">
            Our production facility is located in the Greater Toronto Area. Local pickup is
            available for all orders.
          </p>
          <div className="mt-6 space-y-2">
            <p className="font-medium">Banner Direct</p>
            <p className="text-muted-foreground">
              123 Print Street
              <br />
              Toronto, ON M5V 1A1
              <br />
              Canada
            </p>
          </div>
          <div className="mt-6 space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>Hours:</strong> Monday-Friday, 9am-5pm EST
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Phone:</strong> 1-800-555-1234
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Email:</strong> hello@bannerdirect.ca
            </p>
          </div>
        </div>
        <div className="aspect-[4/3] overflow-hidden rounded-lg bg-muted">
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Map / Location Photo
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <h3 className="text-2xl font-bold">Ready to create your banner?</h3>
        <p className="mt-2 text-muted-foreground">
          Join thousands of Canadian businesses who trust Banner Direct.
        </p>
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <LinkButton href="/product/pvc-banner-3x6" size="lg">
            Create Your Banner
          </LinkButton>
          <LinkButton href="/contact" variant="outline" size="lg">
            Contact Us
          </LinkButton>
        </div>
      </div>
      </div>
    </>
  );
}
