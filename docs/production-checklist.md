# Production Deployment Checklist

## Environment Variables

### Required for Production

| Variable | Type | Description |
|----------|------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase anonymous key |
| `NEXT_PUBLIC_SITE_URL` | Public | Production URL (e.g., https://bannerdirect.ca) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret** | Server-only admin operations |

### Optional (Enable as needed)

| Variable | Type | Description |
|----------|------|-------------|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Public | Cloudflare Turnstile CAPTCHA |
| `TURNSTILE_SECRET_KEY` | **Secret** | Turnstile server verification |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Public | Stripe payments |
| `STRIPE_SECRET_KEY` | **Secret** | Stripe server operations |
| `STRIPE_WEBHOOK_SECRET` | **Secret** | Stripe webhook verification |

### Security Rules

1. **Never commit `.env.local`** - It's in `.gitignore`
2. **NEXT_PUBLIC_* only** - Only these are exposed to client
3. **Service role key** - Server-only, never in client components
4. **Rotate keys** - If any key is exposed, rotate immediately

---

## Pre-Deployment Checklist

### Build & Code
- [ ] `npm run build` passes with no errors
- [ ] No console errors in browser
- [ ] No hydration warnings
- [ ] All TypeScript/ESLint errors resolved

### Database (Supabase)
- [ ] RLS policies enabled on all tables
- [ ] Admin role check on protected tables
- [ ] Indexes on frequently queried columns
- [ ] Backup strategy configured

### Security
- [ ] Admin routes server-side protected
- [ ] No secrets in client code
- [ ] CORS configured correctly
- [ ] Rate limiting on API routes (if applicable)

### SEO
- [ ] All public pages have metadata
- [ ] Open Graph images configured
- [ ] Sitemap generated
- [ ] robots.txt configured

### Performance
- [ ] Images optimized
- [ ] Caching headers configured
- [ ] Static pages pre-rendered where possible
- [ ] Bundle size reasonable

### Monitoring
- [ ] Error logging configured
- [ ] Uptime monitoring set up
- [ ] Analytics tracking (if needed)

---

## Deployment Platforms

### Vercel (Recommended)
1. Connect GitHub repository
2. Add environment variables in Vercel dashboard
3. Configure production domain
4. Enable automatic deployments

### Other Platforms
- Ensure Node.js 18+ support
- Configure build command: `npm run build`
- Configure start command: `npm start`
- Set output directory: `.next`

---

## Post-Deployment

- [ ] Verify all pages load correctly
- [ ] Test checkout flow end-to-end
- [ ] Test admin login and operations
- [ ] Verify email notifications (if configured)
- [ ] Check error logging is capturing issues
- [ ] Monitor performance metrics
