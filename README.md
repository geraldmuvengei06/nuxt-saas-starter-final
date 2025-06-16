# Nuxt 3 SaaS Starter Kit

A complete, production-ready SaaS starter kit built with Nuxt 3, featuring authentication, payments, teams, and more.

## 🚀 Features

### Authentication (AUTH001-AUTH011)

- ✅ Email/Password Registration & Login
- ✅ Social Login (Google, GitHub)
- ✅ Magic Links
- ✅ OAuth Callback Handling
- ✅ Email Verification
- ✅ Password Reset
- ✅ Account Linking
- 🔲 Passkeys (WebAuthn) - Planned
- 🔲 Phone Authentication - Planned
- 🔲 Two-Factor Authentication (2FA) - Planned
- 🔲 Login Notifications - Planned

### Billing & Subscriptions (BILL001-BILL007)

- ✅ Stripe Integration
- ✅ Subscription Management
- ✅ Billing Portal
- ✅ Webhook Handling
- ✅ Customer Management
- ✅ Pricing Plans
- ✅ Checkout Sessions

### Teams & Organizations (TEAM001-TEAM005)

- 🔲 Create Teams/Organizations - Planned
- 🔲 Invite Users - Planned
- 🔲 Role Management - Planned
- 🔲 Transfer Ownership - Planned
- 🔲 Team Dashboard - Planned

### Super Admin (ADMIN001-ADMIN006)

- 🔲 User Management Dashboard - Planned
- 🔲 User Impersonation - Planned
- 🔲 Ban/Un-ban Users - Planned
- 🔲 Stripe Plan Sync - Planned
- 🔲 Newsletter Management - Planned
- 🔲 Feedback Review - Planned

### General Features (GEN001-GEN002)

- ✅ Responsive Design
- 🔲 Internationalization (I18n) - Planned

## 🛠 Tech Stack

- **Framework:** Nuxt 3 with Vue 3
- **Backend:** Nuxt Server Engine + Supabase
- **Database:** PostgreSQL (via Supabase)
- **ORM:** Prisma (schema management)
- **Authentication:** Supabase Auth
- **Payments:** Stripe
- **UI Library:** Nuxt UI + Tailwind CSS
- **State Management:** Pinia
- **Language:** TypeScript
- **Linting:** ESLint + Prettier
- **Git Hooks:** Husky + lint-staged
- **Testing:** Vitest + Playwright (configured)

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
