# **Copilot Agent Instructions: Nuxt 3 SaaS Starter Kit**

## **1\. Project Objective & Scope**

The primary goal is to build a professional, production-ready Nuxt 3 SaaS Starter Kit. The kit must be built following the precise architecture, tools, and patterns outlined in this document.

**Scope:** This document provides instructions on the **codebase architecture, tools, and frameworks**. It is not a Product Requirements Document (PRD); feature specifications will be provided separately.

## **2\. Core Technology Stack (Mandatory)**

You must use the following technologies. Do not deviate from this stack.

- **Framework:** Nuxt 3 (using Vue 3\)
- **Backend Logic:** Nuxt 3 Server Engine (server/api/, server/routes/, server/middleware/)
- **Authentication & Database:** @nuxtjs/supabase Nuxt module. This is the primary interface for both user authentication and database operations.
- **Schema Management:** Prisma. Use Prisma for defining and migrating the database schema. The actual queries can be performed using either the Supabase client (via @nuxtjs/supabase) or the Prisma client for complex server-side operations.
- **Payment Gateway:** Stripe (for subscriptions)
- **UI & Styling:** Tailwind CSS (utility-first)
- **UI Component Library:** **Nuxt UI**. Use this for pre-built, accessible components like buttons, modals, forms, and dropdowns to accelerate UI development.
- **State Management:** Pinia
- **Linting & Formatting:** ESLint and Prettier
- **Git Hooks:** Husky and lint-staged
- **Language:** TypeScript

## **3\. Foundational Architectural Rules**

- **Single Backend Source:** Supabase is the **only** backend for identity and database storage. All data will reside in its PostgreSQL instance.
- **Nuxt as the Backend Server:** All backend logic, API endpoints, and interactions with external services (Supabase, Stripe) must be handled within the Nuxt 3 server engine (server/ directory).
- **Schema Management vs. Data Access:**
  - **Prisma:** The prisma/schema.prisma file is the definitive source for the entire database schema. Use Prisma Migrate for all schema changes.
  - **@nuxtjs/supabase:** The composables (useSupabaseClient) provided by this module are the default way to perform database queries from both the client and server side. The Prisma Client can be used as an alternative for complex, server-only queries where its type safety and query-building capabilities are beneficial.
- **Authentication Flow:**
  1. Authentication is managed directly by the @nuxtjs/supabase module, which wraps Supabase's GoTrue-JS client.
  2. Frontend auth actions (login, register, logout) are handled by calling methods on the supabase.auth object (e.g., supabase.auth.signInWithPassword()).
  3. The module automatically handles session management via cookies and provides composables like useSupabaseUser() to access the user state globally.
  4. A user's profile in our public profiles table **must** be created automatically upon successful registration. This should be handled by a Supabase Database Function (trigger).
- **Separation of Concerns:**
  - Use **Services** (server/services/) for orchestrating business logic (e.g., subscriptionService.ts handles logic involving Stripe and database updates).
  - Use **Repositories** (server/repositories/) for abstracting complex database queries (whether using the Supabase client or Prisma client).

## **4\. Project Structure (Mandatory)**

Adhere to the following directory structure:

├── .env \# All secrets and keys must be stored here ONLY  
├── .husky/ \# Husky pre-commit hooks  
│ └── pre-commit  
├── nuxt.config.ts  
├── package.json  
├── prisma/  
│ ├── schema.prisma \# Central schema definition for ALL tables  
│ └── migrations/  
├── server/  
│ ├── api/  
│ │ ├── stripe/  
│ │ │ └── webhook.ts  
│ │ └── (your_app_routes)/  
│ ├── services/ \# e.g., projectService.ts, subscriptionService.ts  
│ └── repositories/ \# e.g., projectRepository.ts  
├── lib/  
│ └── prisma.ts \# Prisma client singleton instance (optional, if used for complex queries)  
├── pages/  
├── components/  
│ └── ui/ \# For custom UI components built on top of Nuxt UI  
├── layouts/  
├── composables/ \# e.g., useNotifications.ts  
├── store/  
│ └── user.ts \# Pinia store for user profile and subscription status  
├── middleware/  
│ └── auth.ts \# Named middleware for protecting specific routes  
├── public/  
└── types/ \# Custom TypeScript definitions (e.g., stripe.d.ts)

## **5\. Implementation Plan & Instructions**

### **Step 1: Project & Dependency Setup**

- Initialize a new Nuxt 3 project.
- Install required dependencies: @nuxtjs/supabase, @nuxt/ui, @pinia/nuxt, stripe.
- Install required dev dependencies: prisma, @prisma/client, husky, lint-staged, eslint, prettier, @nuxt/test-utils, vitest, playwright.
- Run npx husky init to set up Git hooks.

### **Step 2: Environment & Configuration**

- Create the .env file with SUPABASE_URL, SUPABASE_KEY, DATABASE_URL (for Prisma), and all Stripe keys. **Do not hardcode secrets.**
- Configure @nuxtjs/supabase, @nuxt/ui, and other modules in nuxt.config.ts. The Supabase module must be configured to handle redirects:  
  // nuxt.config.ts  
  export default defineNuxtConfig({  
   modules: \['@nuxtjs/supabase', '@nuxt/ui', '@pinia/nuxt'\],  
   supabase: {  
   redirectOptions: {  
   login: '/login',  
   callback: '/confirm',  
   exclude: \['/', '/register'\], // Exclude marketing/public pages  
   },  
   },  
  })

### **Step 3: Linting, Formatting, and Git Hooks**

- Configure ESLint and Prettier for the project.
- Configure lint-staged in package.json to run Prettier and ESLint on staged files.
- Create the .husky/pre-commit hook to run npx lint-staged.  
  \# .husky/pre-commit  
  \#\!/usr/bin/env sh  
  . "$(dirname \-- "$0")/\_/husky.sh"

  npx lint-staged

### **Step 4: Prisma Schema Definition & RLS**

- Create prisma/schema.prisma. Define models for Profile, Subscription, and Project with appropriate relations, default values, and @updatedAt directives. The primary key id of the Profile table **must** reference auth.users.id.
- Create a Supabase Database Function and Trigger to automatically create a new public Profile whenever a new user signs up in auth.users.  
  \-- SQL to run in Supabase SQL Editor  
  \-- Create the function  
  create function public.handle_new_user()  
  returns trigger as $$  
  begin  
   insert into public.profiles (id, email)  
   values (new.id, new.email);  
   return new;  
  end;

  $$
  language plpgsql security definer;

  \-- Create the trigger
  create trigger on\_auth\_user\_created
    after insert on auth.users
    for each row execute procedure public.handle\_new\_user();
  $$

- Run npx prisma migrate dev \--name init to sync your schema with the Supabase database.
- **Enable Row-Level Security (RLS)** on all tables containing user data (e.g., profiles, projects). Create policies that ensure users can only access and modify their own data.

### **Step 5: Authentication Implementation**

- Create authentication pages (/login, /register, etc.) with forms using Nuxt UI components.
- Use the useSupabaseClient() composable to call supabase.auth.signInWithPassword(), supabase.auth.signUp(), and supabase.auth.signInWithOAuth() methods.
- Implement the OAuth callback route (/confirm) required by @nuxtjs/supabase.
- Create a **named** route middleware in middleware/auth.ts to protect pages. This middleware should check useSupabaseUser() and redirect to /login if no user is present. Apply it selectively in page components: definePageMeta({ middleware: 'auth' }).

### **Step 6: Stripe Integration**

- Implement the three required Stripe server routes: /api/stripe/create-checkout-session, /api/stripe/create-portal-session, and /api/stripe/webhook.
- The webhook handler **must** securely verify the Stripe signature. It must handle checkout.session.completed, invoice.paid, and customer.subscription.deleted events by updating the Subscription table in the database. Use the Supabase client for these updates.

### **Step 7: Application Logic**

- For any application-specific feature (e.g., "Projects"), create the corresponding repository and service.
- Create the API endpoints in server/api/ that use these services.
- Secure these endpoints by checking for an active user session using getServerSupabaseUser(event).

## **6\. Testing Strategy**

- **Unit & Integration Testing:** Use **Vitest** via @nuxt/test-utils to test composables, server utilities, and components.
- **End-to-End (E2E) Testing:** Use **Playwright** to test critical user flows like registration, login, subscription creation, and core application functionality.
- **CI/CD:** Configure a CI/CD pipeline (e.g., GitHub Actions) to automatically run linting, tests, and builds on pull requests.

## **7\. Coding Standards & Rules**

- **TypeScript is Mandatory:** All code must use TypeScript. Use the types/ directory for any custom or complex type definitions.
- **Composability:** Use composables (composables/) for any reusable frontend logic (e.g., useNotifications for a toast system).
- **Modularity:** Create small, single-purpose Vue components. Name component files in PascalCase.
- **Error Handling:** All API calls and server-side logic must be wrapped in try...catch blocks. Return meaningful error responses using throw createError().
- **Security:**
  - Never expose secret keys on the client side.
  - Always validate user input on the server side before database operations (e.g., using a library like Zod).
  - Always check for authentication and authorization in server routes.
  - Always verify the Stripe webhook signature.
  - **Row-Level Security (RLS) policies in Supabase are non-negotiable.** They must be the primary mechanism for data access control.
