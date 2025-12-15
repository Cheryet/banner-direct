import Link from 'next/link';
import Image from 'next/image';
import { templates } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { LinkButton } from '@/components/ui/link-button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const metadata = {
  title: 'Templates',
  description:
    'Browse pre-designed banner templates. Customize text, colors, and logos for quick ordering.',
};

const categories = [
  { id: 'all', label: 'All Templates' },
  { id: 'business', label: 'Business' },
  { id: 'retail', label: 'Retail' },
  { id: 'events', label: 'Events' },
  { id: 'sports', label: 'Sports' },
];

export default function TemplatesPage() {
  return (
    <div className="container py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2">Design Templates</h1>
        <p className="text-lg text-muted-foreground">
          Start with a professional design. Customize text, colors, and add your logo.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={category.id === 'all' ? 'default' : 'outline'}
              size="sm"
            >
              {category.label}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select defaultValue="popular">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id} className="group overflow-hidden">
            <div className="relative aspect-[3/2] overflow-hidden bg-muted">
              {template.image ? (
                <Image
                  src={template.image}
                  alt={template.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                  <span className="text-2xl font-bold text-primary/50">{template.title}</span>
                </div>
              )}
              <Badge className="absolute right-3 top-3" variant="secondary">
                {template.category}
              </Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold">{template.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{template.description}</p>
              <LinkButton href={`/templates/${template.slug}`} className="mt-4 w-full">
                Customize Template
              </LinkButton>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Custom Design CTA */}
      <div className="mt-16 rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center">
        <h3 className="text-xl font-semibold">Don't see what you need?</h3>
        <p className="mt-2 text-muted-foreground">
          Upload your own design or start from scratch with our easy configurator.
        </p>
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <LinkButton href="/product/pvc-banner-3x6">Upload Your Design</LinkButton>
          <LinkButton href="/help/file-specs" variant="outline">
            View File Specs
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
