import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export const metadata = {
  title: 'Contact Us',
  description: "Get in touch with Banner Direct. We're here to help with your custom banner needs.",
};

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone',
    content: '1-800-555-1234',
    href: 'tel:+18005551234',
  },
  {
    icon: Mail,
    title: 'Email',
    content: 'hello@bannerdirect.ca',
    href: 'mailto:hello@bannerdirect.ca',
  },
  {
    icon: MapPin,
    title: 'Address',
    content: '123 Print Street, Toronto, ON M5V 1A1',
    href: null,
  },
  {
    icon: Clock,
    title: 'Hours',
    content: 'Mon-Fri, 9am-5pm EST',
    href: null,
  },
];

export default function ContactPage() {
  return (
    <div className="container py-8 md:py-12">
      {/* Header */}
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="mb-4">Contact Us</h1>
        <p className="text-lg text-muted-foreground">
          Have a question or need help with your order? We're here for you.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        {/* Contact Info */}
        <div className="space-y-4">
          {contactInfo.map((item) => (
            <Card key={item.title}>
              <CardContent className="flex items-start gap-4 p-4">
                <div className="rounded-lg bg-primary/10 p-2">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      {item.content}
                    </a>
                  ) : (
                    <p className="text-sm text-muted-foreground">{item.content}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-6 text-xl font-semibold">Send us a message</h2>
              <form className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your name" required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@example.com" required />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input id="phone" type="tel" placeholder="(123) 456-7890" />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Select>
                      <SelectTrigger id="subject">
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="order">Order Question</SelectItem>
                        <SelectItem value="quote">Request a Quote</SelectItem>
                        <SelectItem value="design">Design Help</SelectItem>
                        <SelectItem value="shipping">Shipping Inquiry</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="orderNumber">Order Number (if applicable)</Label>
                  <Input id="orderNumber" placeholder="e.g., BD-12345" />
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="How can we help you?" rows={5} required />
                </div>

                <Button type="submit" size="lg" className="w-full">
                  Send Message
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  We typically respond within 2-4 business hours.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
