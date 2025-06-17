**🔄 CRITICAL FIX: Supabase Auth Users ↔ Profiles Synchronization System**

I need to implement a robust synchronization system between Supabase's `auth.users` table and my application's `profiles` table. Currently, the Profile model is the primary entity for all application relationships, but it's not properly synchronized with Supabase authentication events.

## **PROBLEM ANALYSIS:**

### **Current Issue:**

- Supabase `auth.users` table is not exposed via API (security measure)
- My `profiles` table references `auth.users.id` but sync is inconsistent
- User registration/updates don't automatically reflect in `profiles` table
- Profile data becomes stale when users update their auth information

### **Required Architecture:**

According to Supabase documentation, the `profiles` table must:

1. Use `auth.users.id` as primary key with `ON DELETE CASCADE`
2. Be automatically populated via database triggers
3. Stay synchronized with all auth events (signup, profile updates, deletion)

## **IMPLEMENTATION REQUIREMENTS:**

### **1. Database Schema Fixes**

**Current Prisma Schema Issues:**

```prisma
model Profile {
    id           String        @id @db.Uuid // References auth.users.id
    email        String        @unique
    fullName     String?       @map("full_name")
    // ... other fields
}
```

**Required Changes:**

- Ensure foreign key constraint properly references `auth.users.id`
- Add proper cascade deletion rules
- Implement missing fields that should sync from `auth.users`

### **2. Database Triggers & Functions**

**Critical Missing Components:**

- `handle_new_user()` function for automatic profile creation
- `handle_user_update()` function for profile synchronization
- `handle_user_delete()` function for cleanup
- Triggers on `auth.users` for INSERT, UPDATE, DELETE events

### **3. Server-Side Sync Logic**

**Required Server Utilities:**

- Profile creation service with auth user data extraction
- Profile update service that syncs with auth changes
- Error handling for sync failures
- Rollback mechanisms for failed operations

### **4. Client-Side Integration**

**Authentication Flow Fixes:**

- Registration process must ensure profile creation
- Profile updates must sync back to auth metadata where applicable
- Handle edge cases where sync fails

## **SPECIFIC IMPLEMENTATION TASKS:**

### **Phase 1: Database Layer**

```sql
-- Create comprehensive trigger system for auth.users ↔ profiles sync
-- Handle user metadata extraction and profile field mapping
-- Implement proper cascade deletion and update rules
```

### **Phase 2: Prisma Schema Updates**

- Update `profiles` model to match auth.users structure
- Add missing fields that should sync from auth metadata
- Ensure proper foreign key constraints and cascade rules

### **Phase 3: Server Services**

Create services in services:

- `profileSyncService.ts` - Handle auth ↔ profile synchronization
- `userManagementService.ts` - Coordinate user lifecycle events

### **Phase 4: Authentication Flow Integration**

Update authentication pages and composables:

- register.vue - Ensure profile creation after signup
- confirm.vue - Handle profile activation
- `composables/useAuth.ts` - Add profile sync utilities

### **Phase 5: Admin Functions**

Update admin services to handle:

- User deletion with proper profile cleanup
- User restoration with profile recreation
- Bulk sync operations for existing users

## **TECHNICAL REQUIREMENTS:**

### **Database Functions Needed:**

1. **`handle_new_user()`** - Extract auth metadata → create profile
2. **`handle_user_update()`** - Sync auth changes → update profile
3. **`handle_user_delete()`** - Clean up profile and related data
4. **`sync_existing_users()`** - Backfill profiles for existing auth users

### **Error Handling Requirements:**

- Graceful handling of sync failures
- Retry mechanisms for transient failures
- Logging for audit trail
- Rollback procedures for partial failures

### **Data Mapping Requirements:**

Map these auth.users fields to profiles:

```typescript
// auth.users → profiles mapping
{
  id: user.id,                                    // Primary key
  email: user.email,                             // Direct copy
  fullName: user.user_metadata?.full_name,       // From metadata
  avatarUrl: user.user_metadata?.avatar_url,     // From metadata
  // Handle other metadata fields as needed
}
```

### **Security Considerations:**

- Triggers must use `SECURITY DEFINER` for proper permissions
- Profile updates must respect RLS policies
- Sync operations must be atomic to prevent data inconsistency

## **EXPECTED DELIVERABLES:**

1. **Updated Prisma Schema** with proper auth.users references
2. **Complete Database Trigger System** for automatic sync
3. **Server-Side Sync Services** with comprehensive error handling
4. **Updated Authentication Flow** with profile integration
5. **Migration Script** to backfill existing users
6. **Testing Strategy** for sync reliability
7. **Documentation** of the sync architecture

## **CRITICAL SUCCESS CRITERIA:**

- ✅ New user registration automatically creates synchronized profile
- ✅ Auth metadata changes automatically update profile fields
- ✅ User deletion properly cascades to profiles and related data
- ✅ Existing users without profiles get backfilled
- ✅ All CRUD operations maintain referential integrity
- ✅ Sync failures are logged and can be retried
- ✅ Admin operations work seamlessly with the sync system

**Please provide a complete implementation that follows the Nuxt 3 SaaS Starter Kit architecture, uses the mandatory tech stack (@nuxtjs/supabase, Prisma, TypeScript), and ensures bullet-proof synchronization between Supabase auth and the profiles table.**

---

This prompt provides GitHub Copilot Chat with comprehensive context about the authentication synchronization problem and clear requirements for implementing a robust solution that follows your coding standards and architecture.
