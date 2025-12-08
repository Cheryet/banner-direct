# Banner Direct

A banner-first e-commerce site built with Next.js 14, Tailwind CSS, and shadcn/ui. Designed to be welcoming to one-off event buyers and robust for enterprise bulk orders.

## North Star

**Visual Voice**: Bright, modern, and approachable (white background, warm teal accent). Not heavy industrial.

**Brand Voice**: Welcoming, helpful, confident. Canada-first.

**UX Goal**: Reduce decision friction, guide users step-by-step, and make ordering obvious and fast.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui + Radix UI primitives
- **Icons**: Lucide React
- **Node**: v20.11.0 (see `.nvmrc`)

## Design Tokens

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `#FFFFFF` | Page background |
| `--foreground` | `#111827` | Primary text |
| `--muted` | `#6B7280` | Secondary text |
| `--primary` / `--accent` | `#0EA5A4` | Teal - Primary CTA, active states |
| `--accent-600` | `#059E96` | Hover state |
| `--accent-800` | `#047F78` | Active/pressed state |
| `--support` | `#2563EB` | Secondary blue highlights |

### Typography

- **Headings**: Poppins / Inter (semi-rounded, bold)
- **Body**: Inter (regular, 18px base on desktop)
- **Line-heights**: Optimized for readability

### Spacing

Uses Tailwind's default scale: 4, 8, 12, 16, 24, 32, 48, 64px

### Accessibility

- Focus ring: `ring-offset-2 ring-accent`
- Touch targets: Minimum 44×44px
- Color contrast: AAA target
- Semantic HTML throughout

## Getting Started

```bash
# Use correct Node version
nvm use

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
/app
  /page.js              # Home page
  /products/page.jsx    # Product listing
  /product/[slug]/      # Product configurator
  /cart/page.jsx        # Shopping cart
  /checkout/page.jsx    # Checkout flow
  /bulk/page.jsx        # Enterprise/bulk orders
  /pricing/page.jsx     # Transparent pricing
  /templates/page.jsx   # Design templates
  /help/page.jsx        # Help center & FAQs
  /about/page.jsx       # About us
  /contact/page.jsx     # Contact form
  /layout.js            # Root layout with Header/Footer

/components
  /ui/                  # shadcn/ui components
    button.jsx
    input.jsx
    select.jsx
    file-upload.jsx
    stepper.jsx
    ...
  /layout/              # Layout components
    header.jsx
    footer.jsx
    hero.jsx
  /product/             # Product-specific components
    product-card.jsx
    price-summary.jsx

/lib
  utils.js              # Utility functions (cn)
  mock-data.js          # Mock product/template data
```

## Key Features

### Product Configurator
- Size, material, and finishing selection
- Quantity slider with tiered pricing
- Lead time options (standard/rush/same-day)
- File upload with drag & drop
- Real-time price calculation
- Design proof request option

### Cart & Checkout
- Multi-step checkout with stepper
- Shipping form with Canadian provinces
- Order summary sidebar
- Promo code support

### Bulk Orders
- Volume discount calculator
- Quote request form
- Enterprise benefits showcase

### Templates
- Pre-designed banner templates
- Category filtering
- Quick customization flow

## Components

All UI components are built on shadcn/ui patterns with accessibility in mind:

- **Button**: Primary, secondary, outline, ghost, CTA variants
- **Input/Textarea/Select**: Labeled with helper text and error states
- **FileUpload**: Drag & drop with preview support
- **Stepper**: Progress indicator for multi-step flows
- **ProductCard**: Product listing cards
- **PriceSummary**: Dynamic pricing display
- **Badge**: Status and feature badges
- **Dialog/Modal**: Accessible modal dialogs
- **Accordion**: Collapsible content sections
- **Toast**: Notification system

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Environment Variables

Currently using mock data. For production, add:

```env
# .env.local
NEXT_PUBLIC_STRIPE_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## Deployment

The app is ready for deployment on Vercel, Netlify, or any Node.js hosting platform.

```bash
npm run build
```

## Contributing

1. Follow the existing code style (Prettier configured)
2. Ensure accessibility standards are maintained
3. Test on mobile and desktop viewports
4. Keep the brand voice consistent

## License

Private - All rights reserved.
