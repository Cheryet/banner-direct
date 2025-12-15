'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  FileImage, 
  Settings,
  BarChart3,
  LogOut,
  ChevronDown,
  ChevronRight,
  Layers,
  Truck,
  Tag,
  Menu,
  X,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { 
    name: 'Orders', 
    icon: ShoppingCart,
    children: [
      { name: 'All Orders', href: '/admin/orders' },
      { name: 'Fulfillment Board', href: '/admin/orders/board' },
    ]
  },
  { 
    name: 'Products', 
    icon: Package,
    children: [
      { name: 'All Products', href: '/admin/products' },
      { name: 'Add Product', href: '/admin/products/new' },
      { name: 'Categories', href: '/admin/products/categories' },
      { name: 'Templates', href: '/admin/templates' },
    ]
  },
  { 
    name: 'Shipping', 
    icon: Truck,
    children: [
      { name: 'Shipping Zones', href: '/admin/shipping/zones' },
      { name: 'Shipping Rates', href: '/admin/shipping/rates' },
      { name: 'Lead Times', href: '/admin/shipping/lead-times' },
    ]
  },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Uploads', href: '/admin/uploads', icon: FileImage },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar({ profile }) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = React.useState(['Orders', 'Products', 'Shipping']);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const toggleExpanded = (name) => {
    setExpandedItems(prev => 
      prev.includes(name) 
        ? prev.filter(item => item !== name)
        : [...prev, name]
    );
  };

  const isActive = (href) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const isChildActive = (children) => {
    return children?.some(child => pathname.startsWith(child.href));
  };

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b bg-white px-4 lg:hidden">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/admin" className="flex items-center gap-1">
          <span className="text-lg font-bold text-emerald-600">Banner</span>
          <span className="text-lg font-bold text-gray-900">Direct</span>
        </Link>
        <div className="w-9" /> {/* Spacer for centering */}
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-200 bg-white transition-transform duration-300 lg:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col">
          {/* Header with close button for mobile */}
          <div className="flex h-14 items-center border-b px-3 lg:h-16 lg:px-6">
            {/* Close button - visible on mobile only */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="mr-3 flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
            <Link href="/admin" className="flex items-center gap-2">
              <span className="text-xl font-bold text-emerald-600">Banner</span>
              <span className="text-xl font-bold text-gray-900">Direct</span>
              <span className="ml-1 hidden rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-600 lg:inline">
                Admin
              </span>
            </Link>
          </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedItems.includes(item.name);
            const childActive = isChildActive(item.children);

            if (hasChildren) {
              return (
                <div key={item.name}>
                  <button
                    onClick={() => toggleExpanded(item.name)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      childActive
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="ml-4 mt-1 space-y-1 border-l pl-4">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                            isActive(child.href)
                              ? 'bg-emerald-50 font-medium text-emerald-700'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-medium text-emerald-700">
              {(profile?.full_name || profile?.email || 'A').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 truncate">
              <p className="truncate text-sm font-medium text-gray-900">
                {profile?.full_name || 'Admin'}
              </p>
              <p className="truncate text-xs text-gray-500">
                {profile?.email}
              </p>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex-1 rounded-lg border px-3 py-2 text-center text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100"
            >
              View Store
            </Link>
            <form action="/auth/signout" method="post" className="flex-1">
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100"
              >
                <LogOut className="h-3 w-3" />
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
}
