# Supabase Auth ↔ Profiles Synchronization Implementation

## Overview

This document describes the comprehensive synchronization system implemented between Supabase's `auth.users` table and the application's `profiles` table. The system ensures that user authentication data remains consistent with application profile data through automated triggers, services, and manual management tools.

## Architecture

### 1. Database Layer

#### Prisma Schema Updates

- Added sync metadata columns to `profiles` table:
  - `email_verified`: Synced from `auth.users.email_confirmed_at`
  - `phone_verified`: Synced from `auth.users.phone_confirmed_at`
  - `last_sign_in_at`: Synced from `auth.users.last_sign_in_at`
- Added `SyncLog` model for tracking synchronization operations

#### Database Triggers (Manual Installation Required)

Located in: `supabase-sync-triggers.sql`

**Functions:**

- `handle_new_user()`: Creates profile when user registers
- `handle_user_update()`: Updates profile when auth user data changes
- `handle_user_delete()`: Logs deletion before user is removed
- `manual_sync_all_users()`: Backfills profiles for existing users

**Triggers:**

- `on_auth_user_created`: Executes after INSERT on auth.users
- `on_auth_user_updated`: Executes after UPDATE on auth.users
- `on_auth_user_deleted`: Executes before DELETE on auth.users

### 2. Service Layer

#### ProfileSyncService (`server/services/profileSyncService.ts`)

Core service for handling profile synchronization:

**Key Methods:**

- `syncProfile(authUser, event?)`: Creates or updates profile from auth user data
- `syncCurrentUserProfile(event)`: Syncs profile for authenticated user
- `syncAllUsers(event?)`: Bulk sync all auth users to profiles
- `handleUserDeletion(userId, event?)`: Handle user deletion cleanup
- `retryFailedSyncs(event?)`: Retry previously failed sync operations

#### UserManagementService (`server/services/userManagementService.ts`)

Coordinates user lifecycle events:

**Key Methods:**

- `handleUserRegistration(userId, event?)`: Complete user registration flow
- `handleUserUpdate(userId, updates, event?)`: Handle user metadata updates
- `handleUserDeletion(userId, event?)`: Manage user deletion with cleanup
- `bulkSyncUsers(event?)`: Bulk synchronization with detailed reporting
- `validateUserProfileIntegrity(event?)`: Validate sync integrity

### 3. API Layer

#### Authentication Endpoints

- `POST /api/auth/sync-profile`: Sync current user's profile
- `GET /api/auth/profile`: Get current user's profile (updated with sync fallback)

#### Admin Endpoints (Super Admin Only)

- `POST /api/admin/sync-users`: Bulk sync all users
- `GET /api/admin/validate-integrity`: Validate user-profile integrity

### 4. Frontend Integration

#### Updated useAuth Composable

Enhanced with synchronization capabilities:

**New Features:**

- `syncUserProfile()`: Manual profile sync
- `updateUserProfile(updates)`: Update user with automatic sync
- `syncStatus`: Track sync operation status
- Automatic sync fallback when profile fetch fails

#### Admin Interface

New admin page: `pages/admin/sync.vue`

**Features:**

- Real-time sync status monitoring
- Integrity validation with detailed reporting
- Bulk sync operations
- Individual user sync management
- Export sync reports

## Installation Instructions

### 1. Database Setup

1. **Apply Prisma Migration:**

   ```bash
   npx prisma migrate dev --name add_profile_sync_support
   ```

2. **Install Supabase Triggers:**

   - Copy the contents of `supabase-sync-triggers.sql`
   - Run it in your Supabase SQL Editor
   - This will install all necessary triggers and functions

3. **Initial Sync (if you have existing users):**
   ```sql
   SELECT * FROM public.manual_sync_all_users();
   ```

### 2. Environment Variables

Ensure you have the required Supabase environment variables:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
```

### 3. RLS Policies

The installation script automatically sets up Row Level Security for the `sync_logs` table. Verify that your `profiles` table has proper RLS policies:

```sql
-- Profiles are accessible by their owner or service role
CREATE POLICY "profiles_policy" ON public.profiles
  FOR ALL
  USING (
    auth.uid() = id
    OR auth.role() = 'service_role'
  );
```

## Usage

### Automatic Synchronization

Once installed, synchronization happens automatically:

1. **User Registration**: Profile created via `on_auth_user_created` trigger
2. **User Updates**: Profile updated via `on_auth_user_updated` trigger
3. **User Deletion**: Logged via `on_auth_user_deleted` trigger

### Manual Operations

#### Sync Current User Profile

```typescript
const { syncUserProfile, syncStatus } = useAuth()
await syncUserProfile()
```

#### Update User Profile with Sync

```typescript
const { updateUserProfile } = useAuth()
await updateUserProfile({
  full_name: 'New Name',
  avatar_url: 'https://example.com/avatar.jpg',
})
```

#### Admin Operations

Access the admin sync interface at `/admin/sync` (Super Admin only):

- Monitor sync status
- Validate integrity
- Perform bulk operations
- Export reports

### API Operations

#### Sync All Users (Admin)

```typescript
const result = await $fetch('/api/admin/sync-users', { method: 'POST' })
console.log(`Synced ${result.results.synced} users`)
```

#### Validate Integrity (Admin)

```typescript
const integrity = await $fetch('/api/admin/validate-integrity')
console.log(`Found ${integrity.summary.syncIssues} issues`)
```

## Monitoring

### Sync Logs

Monitor synchronization operations in the `sync_logs` table:

```sql
-- Recent sync operations
SELECT * FROM public.sync_logs
ORDER BY created_at DESC
LIMIT 20;

-- Failed sync operations
SELECT * FROM public.sync_logs
WHERE status = 'error'
ORDER BY created_at DESC;

-- Sync operations for specific user
SELECT * FROM public.sync_logs
WHERE user_id = 'user_id_here'
ORDER BY created_at DESC;
```

### Activity Logs

User lifecycle events are logged in the `activity_logs` table:

```sql
-- User registration activities
SELECT * FROM public.activity_logs
WHERE action LIKE '%registration%'
ORDER BY created_at DESC;
```

## Error Handling

### Automatic Error Recovery

- Failed sync operations are logged but don't block auth operations
- Retry mechanisms available for transient failures
- Graceful degradation when sync services are unavailable

### Manual Recovery

1. **Identify Issues**: Use the integrity validation endpoint
2. **Bulk Sync**: Run bulk sync operation to fix missing profiles
3. **Individual Sync**: Sync specific users manually
4. **Clean Orphans**: Remove profiles without corresponding auth users

## Security Considerations

### Database Security

- All functions use `SECURITY DEFINER` for proper permissions
- RLS policies protect sync logs and profiles
- Triggers log operations for audit trail

### API Security

- Sync endpoints require authentication
- Admin endpoints require super admin role
- All operations are logged for accountability

### Data Privacy

- Sync operations only handle necessary metadata
- Sensitive auth data remains in Supabase auth schema
- Profile updates respect RLS policies

## Performance Considerations

### Triggers

- Triggers are optimized to avoid blocking auth operations
- Error handling prevents cascade failures
- Logging is asynchronous where possible

### Bulk Operations

- Batch processing for large user sets
- Progress tracking for long-running operations
- Configurable batch sizes for performance tuning

### Monitoring

- Database indexes on frequently queried columns
- Efficient queries for integrity validation
- Cached results where appropriate

## Troubleshooting

### Common Issues

1. **Profile Not Created After Registration**

   - Check if triggers are installed correctly
   - Verify RLS policies allow profile creation
   - Check sync_logs for error details

2. **Profile Out of Sync**

   - Run manual sync for the user
   - Check for metadata format issues
   - Verify trigger function logic

3. **Bulk Sync Failures**
   - Check database connection limits
   - Review batch size configuration
   - Monitor sync_logs for specific errors

### Debug Commands

```sql
-- Check trigger installation
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'auth';

-- Check sync function status
SELECT routine_name, routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name LIKE '%sync%';

-- Test manual sync function
SELECT * FROM public.manual_sync_all_users();
```

## Migration Guide

### From Manual Profile Creation

If you previously created profiles manually:

1. **Backup existing profiles**
2. **Install sync system**
3. **Run integrity validation**
4. **Perform bulk sync to fill gaps**
5. **Monitor for sync issues**

### Testing the Migration

1. **Create test user** in development
2. **Verify automatic profile creation**
3. **Test profile updates**
4. **Validate admin operations**

## Future Enhancements

### Planned Features

- Real-time sync status WebSocket updates
- Advanced conflict resolution strategies
- Batch sync with progress indicators
- Sync operation rollback capabilities
- Enhanced monitoring dashboard

### Integration Opportunities

- Webhook support for external systems
- Event streaming for real-time updates
- Advanced analytics and reporting
- Automated sync health checks

---

This implementation provides a robust, scalable foundation for maintaining synchronization between Supabase authentication and application profiles, ensuring data consistency and providing comprehensive management tools for administrators.
