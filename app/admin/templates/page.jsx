import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LinkButton } from '@/components/ui/link-button';
import Link from 'next/link';
import { 
  Layers, 
  Plus,
  Edit,
  Eye,
  Trash2,
  Search,
  Filter,
  Image as ImageIcon,
  Tag
} from 'lucide-react';

export const metadata = {
  title: 'Templates - Admin',
  description: 'Manage design templates',
};

export default async function AdminTemplatesPage({ searchParams }) {
  const supabase = await createClient();
  const params = await searchParams;
  const categoryFilter = params?.category || 'all';

  // Fetch templates
  let query = supabase
    .from('templates')
    .select('*')
    .order('created_at', { ascending: false });

  if (categoryFilter !== 'all') {
    query = query.eq('category', categoryFilter);
  }

  const { data: templates, error } = await query;

  // Get categories
  const { data: categories } = await supabase
    .from('templates')
    .select('category')
    .not('category', 'is', null);

  const uniqueCategories = [...new Set(categories?.map(c => c.category).filter(Boolean) || [])];

  const stats = {
    total: templates?.length || 0,
    active: templates?.filter(t => t.is_active).length || 0,
  };

  return (
    <div className="min-w-0">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Templates</h1>
          <p className="text-sm text-muted-foreground">
            Manage design templates for customers
          </p>
        </div>
        <LinkButton href="/admin/templates/new" className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Template
        </LinkButton>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Templates</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Layers className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
              </div>
              <Eye className="h-8 w-8 text-emerald-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">{uniqueCategories.length}</p>
              </div>
              <Tag className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/admin/templates"
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            categoryFilter === 'all'
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </Link>
        {uniqueCategories.map((cat) => (
          <Link
            key={cat}
            href={`/admin/templates?category=${cat}`}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              categoryFilter === cat
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* Templates Grid */}
      {!templates || templates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Layers className="h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No templates found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Create design templates for customers to use.
            </p>
            <LinkButton href="/admin/templates/new" className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Add Template
            </LinkButton>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {templates.map((template) => (
            <Card key={template.id} className="overflow-hidden">
              <div className="aspect-[4/3] bg-gray-100 relative">
                {template.thumbnail_url ? (
                  <img 
                    src={template.thumbnail_url} 
                    alt={template.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Layers className="h-12 w-12 text-gray-300" />
                  </div>
                )}
                {!template.is_active && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <span className="rounded-full bg-gray-900 px-3 py-1 text-sm font-medium text-white">
                      Inactive
                    </span>
                  </div>
                )}
                {template.is_premium && (
                  <div className="absolute top-2 right-2">
                    <span className="rounded-full bg-amber-500 px-2 py-1 text-xs font-medium text-white">
                      Premium
                    </span>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900">{template.title}</h3>
                <p className="text-sm text-gray-500">{template.category || 'Uncategorized'}</p>
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/admin/templates/${template.id}`}
                    className="flex-1 rounded-lg border px-3 py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <Edit className="mr-1 inline h-4 w-4" />
                    Edit
                  </Link>
                  <Link
                    href={`/templates/${template.slug || template.id}`}
                    target="_blank"
                    className="rounded-lg border px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
