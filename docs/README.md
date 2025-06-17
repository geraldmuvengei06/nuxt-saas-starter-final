# Nuxt 3 SaaS Starter Kit

A complete, production-ready SaaS starter kit built with Nuxt 3, featuring authentication, payments, teams, and more.

> **📊 Implementation Status:** See [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) for a detailed breakdown of all implemented features.

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

- ✅ Create Teams/Organizations
- ✅ Invite Users (Profile ID-based)
- ✅ Role Management (Owner, Admin, Member)
- ✅ Transfer Ownership
- ✅ Team Dashboard with Member Management
- ✅ Team Settings & Deletion
- ✅ Project Assignment to Teams

### Super Admin (ADMIN001-ADMIN006)

- ✅ User Management Dashboard
- ✅ Team Management Dashboard
- ✅ Project Management Dashboard
- ✅ Activity Logging & Monitoring
- ✅ Feedback Review System
- ✅ System Statistics & Analytics
- 🔲 User Impersonation - Planned
- 🔲 Ban/Un-ban Users - Planned
- 🔲 Stripe Plan Sync - Planned
- 🔲 Newsletter Management - Planned

### Project Management

- ✅ Create/Read/Update/Delete Projects
- ✅ Project Ownership Management
- ✅ Team Assignment
- ✅ Project Dashboard Integration
- ✅ Admin Project Management

### General Features (GEN001-GEN002)

- ✅ Responsive Design
- ✅ TypeScript Support
- ✅ Database Integration (Prisma + Supabase)
- ✅ User Dashboard & Settings
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

## 📚 Documentation

- **[Feature Summary](./FEATURE_SUMMARY.md)** - Quick overview of implemented features
- **[Implementation Status](./IMPLEMENTATION_STATUS.md)** - Detailed breakdown of implemented features
- **[Admin Documentation](./ADMIN_DOCUMENTATION.md)** - Admin system usage guide
- **[Admin Implementation Summary](./ADMIN_IMPLEMENTATION_SUMMARY.md)** - Technical implementation details
- **[Product Requirements](./Nuxt%20Saas%20Starter%20Project%20Product%20Requirements%20Documentation.md)** - Complete feature specifications

## 🎯 Quick Start

1. **Clone and Install**

   ```bash
   git clone <repository-url>
   cd nuxt-saas-starter-final
   npm install
   ```

2. **Environment Setup**

   ```bash
   # Copy environment template
   cp .env.example .env

   # Configure your environment variables:
   # - Supabase URL and keys
   # - Stripe keys
   # - Database URL
   ```

3. **Database Setup**

   ```bash
   # Run Prisma migrations
   npx prisma db push

   # Generate Prisma client
   npx prisma generate
   ```

4. **Start Development**
   ```bash
   npm run dev
   ```

## 🏗️ Architecture

This starter kit follows a clean architecture pattern:

- **Frontend:** Nuxt 3 with Vue 3 and TypeScript
- **Backend:** Nuxt Server Engine with API routes
- **Database:** PostgreSQL via Supabase with Prisma ORM
- **Authentication:** Supabase Auth with custom middleware
- **Payments:** Stripe with webhook integration
- **UI:** Nuxt UI components with Tailwind CSS

## 🔧 Key Features in Detail

### Authentication System

- Complete auth flow with email/password, social login, and magic links
- Account linking and password management
- Protected routes with middleware

### Team Management

- Multi-tenant architecture with role-based access
- Owner, Admin, and Member roles
- Team settings and member management

### Admin System

- Comprehensive admin dashboard
- User, team, and project management
- Activity logging and system monitoring

### Billing Integration

- Stripe subscription management
- Customer portal integration
- Webhook handling for subscription events

## 🚀 Production Ready

This starter kit includes:

- ✅ Type-safe API endpoints
- ✅ Database migrations and schema management
- ✅ Authentication and authorization
- ✅ Payment processing
- ✅ Admin panel
- ✅ Responsive design
- ✅ Error handling
- ✅ Development tooling (ESLint, Prettier, Husky)

## 📄 License

This project is licensed under the MIT License.
