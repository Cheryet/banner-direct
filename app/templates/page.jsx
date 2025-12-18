import Link from 'next/link';
import Image from 'next/image';
import { getTemplates, getTemplateCategories } from '@/lib/db/templates';
import { Button } from '@/components/ui/button';
import { LinkButton } from '@/components/ui/link-button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileImage, Sparkles } from 'lucide-react';

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const categoryFilter = params?.category;

  if (categoryFilter && categoryFilter !== 'all') {
    return {
      title: `${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)} Templates | Banner Direct`,
      description: `Browse ${categoryFilter} banner templates. Customize text, colors, and logos for quick ordering.`,
    };
  }

  return {
    title: 'Design Templates - Custom Banners | Banner Direct',
    description:
      'Browse pre-designed banner templates. Customize text, colors, and logos for quick ordering.',
  };
}

export default async function TemplatesPage({ searchParams }) {
  const params = await searchParams;
  const categoryFilter = params?.category || 'all';

  // Fetch templates and categories in parallel
  const [templates, templateCategories] = await Promise.all([
    getTemplates({
      category: categoryFilter !== 'all' ? categoryFilter : null,
    }),
    getTemplateCategories(),
  ]);

  return (
    <div className="container py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2">Design Templates</h1>
        <p className="text-lg text-muted-foreground">
          Start with a professional design. Customize text, colors, and add your logo.
        </p>
      </div>

      {/* Category Filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        <LinkButton
          href="/templates"
          variant={categoryFilter === 'all' ? 'default' : 'outline'}
          size="sm"
        >
          All Templates
        </LinkButton>
        {templateCategories.map((category) => (
          <LinkButton
            key={category}
            href={`/templates?category=${category}`}
            variant={categoryFilter === category ? 'default' : 'outline'}
            size="sm"
            className="capitalize"
          >
            {category}
          </LinkButton>
        ))}
      </div>

      {/* Templates Grid */}
      {templates.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id} className="group overflow-hidden">
              <div className="relative aspect-[3/2] overflow-hidden bg-muted">
                {template.thumbnail_url ? (
                  <Image
                    src={template.thumbnail_url}
                    alt={template.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                    <span className="text-2xl font-bold text-primary/50">{template.name}</span>
                  </div>
                )}
                <div className="absolute right-3 top-3 flex gap-2">
                  {template.is_featured && (
                    <Badge variant="default" className="gap-1">
                      <Sparkles className="h-3 w-3" />
                      Featured
                    </Badge>
                  )}
                  {template.category && (
                    <Badge variant="secondary" className="capitalize">
                      {template.category}
                    </Badge>
                  )}
                </div>
                {template.use_count > 0 && (
                  <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-2 py-1 text-xs text-white">
                    {template.use_count.toLocaleString()} uses
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold">{template.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {template.description}
                </p>
                <LinkButton href={`/templates/${template.slug}`} className="mt-4 w-full">
                  Customize Template
                </LinkButton>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <FileImage className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">No templates found</h3>
          <p className="mb-6 text-muted-foreground">
            {categoryFilter !== 'all'
              ? `No templates available in the ${categoryFilter} category yet.`
              : 'No templates available at the moment.'}
          </p>
          <LinkButton href="/templates">View All Templates</LinkButton>
        </div>
      )}

      {/* Custom Design CTA */}
      <div className="mt-16 rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center">
        <h3 className="text-xl font-semibold">Don't see what you need?</h3>
        <p className="mt-2 text-muted-foreground">
          Upload your own design or start from scratch with our easy configurator.
        </p>
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <LinkButton href="/products">Upload Your Design</LinkButton>
          <LinkButton href="/help/file-specs" variant="outline">
            View File Specs
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
