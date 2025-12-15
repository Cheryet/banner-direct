/**
 * =============================================================================
 * AUTH DEBUG PAGE
 * =============================================================================
 * 
 * This is a TEMPORARY page for verifying Supabase auth setup.
 * It displays the current user's authentication state from the server.
 * 
 * PURPOSE:
 * --------
 * - Verify that sessions persist across page refreshes
 * - Confirm anonymous users are created automatically
 * - Check that server-side auth reading works correctly
 * - Debug any session/cookie issues
 * 
 * THIS PAGE SHOULD BE REMOVED BEFORE PRODUCTION.
 * 
 * HOW TO USE:
 * -----------
 * 1. Visit /debug/auth in your browser
 * 2. Check that a user ID is displayed
 * 3. Refresh the page - the same user ID should persist
 * 4. Open in incognito - a new anonymous user should be created
 * 
 * WHAT TO LOOK FOR:
 * -----------------
 * ✅ User ID is displayed (not null)
 * ✅ Same user ID persists across refreshes
 * ✅ is_anonymous is true for new visitors
 * ✅ No hydration errors in console
 * 
 * =============================================================================
 */

import { createClient, getUser } from '@/lib/supabase/server';

export const metadata = {
  title: 'Auth Debug',
  description: 'Debug page for verifying Supabase auth setup',
  robots: 'noindex, nofollow', // Don't index this debug page
};

export default async function AuthDebugPage() {
  // Get the Supabase client and user from the server
  const supabase = await createClient();
  const { user, error } = await getUser();
  
  // Get session info for additional debugging
  let session = null;
  if (supabase) {
    const { data } = await supabase.auth.getSession();
    session = data.session;
  }

  // Format timestamps for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container max-w-2xl py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">🔐 Auth Debug Page</h1>
        <p className="mt-2 text-gray-600">
          This page verifies your Supabase authentication setup.
          <br />
          <span className="text-amber-600 font-medium">
            Remove this page before deploying to production.
          </span>
        </p>
      </div>

      {/* Configuration Status */}
      <section className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Configuration Status
        </h2>
        <div className="space-y-3">
          <StatusRow 
            label="Supabase Client" 
            value={supabase ? 'Configured ✅' : 'Not Configured ❌'} 
            status={!!supabase}
          />
          <StatusRow 
            label="NEXT_PUBLIC_SUPABASE_URL" 
            value={process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set ✅' : 'Missing ❌'} 
            status={!!process.env.NEXT_PUBLIC_SUPABASE_URL}
          />
          <StatusRow 
            label="NEXT_PUBLIC_SUPABASE_ANON_KEY" 
            value={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set ✅' : 'Missing ❌'} 
            status={!!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}
          />
        </div>
      </section>

      {/* User Information */}
      <section className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          User Information
        </h2>
        
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">
            <strong>Error:</strong> {error.message}
          </div>
        )}
        
        {!user && !error && (
          <div className="rounded-lg bg-amber-50 p-4 text-amber-700">
            <strong>No User Session</strong>
            <p className="mt-1 text-sm">
              This could mean:
            </p>
            <ul className="mt-2 list-inside list-disc text-sm">
              <li>Anonymous sign-in is not enabled in Supabase</li>
              <li>The AuthProvider is not initializing sessions</li>
              <li>Cookies are being blocked</li>
            </ul>
          </div>
        )}
        
        {user && (
          <div className="space-y-3">
            <DataRow label="User ID" value={user.id} mono />
            <DataRow 
              label="Anonymous" 
              value={user.is_anonymous ? 'Yes (Guest User)' : 'No (Permanent Account)'} 
            />
            <DataRow label="Email" value={user.email || 'Not set (anonymous)'} />
            <DataRow label="Role" value={user.role || 'authenticated'} />
            <DataRow label="Created At" value={formatDate(user.created_at)} />
            <DataRow label="Last Sign In" value={formatDate(user.last_sign_in_at)} />
          </div>
        )}
      </section>

      {/* Session Information */}
      <section className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Session Information
        </h2>
        
        {!session && (
          <div className="text-gray-500">No active session</div>
        )}
        
        {session && (
          <div className="space-y-3">
            <DataRow 
              label="Access Token" 
              value={session.access_token ? `${session.access_token.substring(0, 20)}...` : 'N/A'} 
              mono 
            />
            <DataRow 
              label="Token Type" 
              value={session.token_type || 'bearer'} 
            />
            <DataRow 
              label="Expires At" 
              value={session.expires_at ? formatDate(session.expires_at * 1000) : 'N/A'} 
            />
            <DataRow 
              label="Expires In" 
              value={session.expires_in ? `${session.expires_in} seconds` : 'N/A'} 
            />
          </div>
        )}
      </section>

      {/* Verification Checklist */}
      <section className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Verification Checklist
        </h2>
        <div className="space-y-2">
          <ChecklistItem 
            checked={!!supabase} 
            label="Supabase client is configured" 
          />
          <ChecklistItem 
            checked={!!user} 
            label="User session exists" 
          />
          <ChecklistItem 
            checked={user?.is_anonymous === true || user?.is_anonymous === false} 
            label="Anonymous status is readable" 
          />
          <ChecklistItem 
            checked={!!session?.access_token} 
            label="Access token is present" 
          />
          <ChecklistItem 
            checked={!!user?.id} 
            label="User ID is available for RLS" 
          />
        </div>
      </section>

      {/* Instructions */}
      <section className="rounded-lg border border-blue-200 bg-blue-50 p-6">
        <h2 className="mb-2 text-lg font-semibold text-blue-900">
          Next Steps
        </h2>
        <ol className="list-inside list-decimal space-y-2 text-blue-800">
          <li>Refresh this page - the User ID should stay the same</li>
          <li>Open in incognito - a new anonymous user should be created</li>
          <li>Check browser DevTools → Application → Cookies for Supabase cookies</li>
          <li>If everything works, delete this debug page</li>
        </ol>
      </section>
    </div>
  );
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

function StatusRow({ label, value, status }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-600">{label}</span>
      <span className={status ? 'text-green-600' : 'text-red-600'}>
        {value}
      </span>
    </div>
  );
}

function DataRow({ label, value, mono = false }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <span className="text-gray-600">{label}</span>
      <span className={`text-gray-900 ${mono ? 'font-mono text-sm' : ''}`}>
        {value}
      </span>
    </div>
  );
}

function ChecklistItem({ checked, label }) {
  return (
    <div className="flex items-center gap-2">
      <span className={checked ? 'text-green-600' : 'text-gray-400'}>
        {checked ? '✅' : '⬜'}
      </span>
      <span className={checked ? 'text-gray-900' : 'text-gray-500'}>
        {label}
      </span>
    </div>
  );
}
