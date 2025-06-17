# Admin System Documentation

## Overview

The Nuxt 3 SaaS Starter Kit includes a comprehensive admin system for managing users, teams, projects, feedback, and monitoring system activity. The admin system is designed with security and usability in mind.

## Features

### 1. Admin Dashboard (`/admin`)

- System statistics overview (users, teams, projects, subscriptions)
- Quick navigation to all admin functions
- Real-time metrics display

### 2. User Management (`/admin/users`)

- View all registered users
- User profile information and metadata
- User subscription status
- Delete user accounts
- Search and filter users
- Pagination support

### 3. Team Management (`/admin/teams`)

- View all teams in the system
- Team member lists with roles
- Project assignments per team
- Delete teams
- Search and filter teams

### 4. Project Management (`/admin/projects`)

- View all projects across all users/teams
- Project ownership details
- Team assignments
- Delete projects
- Search and filter projects

### 5. Feedback Management (`/admin/feedback`)

- View all user feedback submissions
- Update feedback status (pending, reviewed, resolved)
- Detailed feedback viewer with modal
- Anonymous and authenticated feedback support
- Search and filter feedback

### 6. Activity Logging (`/admin/activity`)

- Monitor all admin actions
- User activity tracking
- System event logging
- Detailed metadata for each action
- Search and filter logs

## Security

### Access Control

- Simple email-based admin check (for demo purposes)
- All admin routes protected with middleware
- Server-side permission validation
- Session-based authentication required

### Audit Trail

- All admin actions are logged
- Activity logs include user, action, timestamp, and metadata
- IP address and user agent tracking (ready for implementation)

## Technical Implementation

### Architecture

```
server/
├── repositories/
│   └── adminRepository.ts     # Data access layer
├── services/
│   └── adminService.ts        # Business logic layer
└── api/
    └── admin/
        ├── stats.ts           # System statistics
        ├── users.ts           # User management
        ├── teams.ts           # Team management
        ├── projects.ts        # Project management
        ├── feedback.ts        # Feedback management
        └── activity-logs.ts   # Activity monitoring
```

### Database Models

- Enhanced `Profile` model with admin relations
- `Feedback` model with status tracking
- `ActivityLog` model for audit trails
- Proper foreign key relationships and cascading deletes

### API Endpoints

#### Statistics

- `GET /api/admin/stats` - System overview statistics

#### User Management

- `GET /api/admin/users` - List all users with pagination
- `DELETE /api/admin/users/{id}` - Delete user account

#### Team Management

- `GET /api/admin/teams` - List all teams with pagination
- `DELETE /api/admin/teams/{id}` - Delete team

#### Project Management

- `GET /api/admin/projects` - List all projects with pagination
- `DELETE /api/admin/projects/{id}` - Delete project

#### Feedback Management

- `GET /api/admin/feedback` - List all feedback with pagination
- `PATCH /api/admin/feedback/{id}` - Update feedback status

#### Activity Logs

- `GET /api/admin/activity-logs` - List activity logs with pagination

## Usage

### Accessing the Admin Panel

1. Log in with an account containing "admin" in the email address
2. Navigate to `/admin` or click the "Admin" link in the dashboard navigation
3. Use the quick action cards to navigate to specific admin functions

### Managing Users

1. Go to `/admin/users`
2. Search for specific users using the search bar
3. View user details, subscription status, and associated data
4. Delete users using the action menu (cannot delete yourself)

### Managing Teams

1. Go to `/admin/teams`
2. View team composition, member roles, and projects
3. Delete teams using the action menu
4. Navigate to team detail pages for more information

### Managing Projects

1. Go to `/admin/projects`
2. View project ownership and team assignments
3. Delete projects using the action menu
4. Filter by owner, team, or project name

### Managing Feedback

1. Go to `/admin/feedback`
2. Filter feedback by status (pending, reviewed, resolved)
3. View detailed feedback in modal popup
4. Update feedback status directly from the interface

### Monitoring Activity

1. Go to `/admin/activity`
2. View chronological list of system events
3. Search through activity descriptions and metadata
4. Monitor admin actions and system changes

## Demo Limitations

### Current Implementation

- Admin access is determined by email containing "admin"
- Some advanced features are placeholders for production implementation
- Activity logging may not be fully enabled until database migration

### Production Recommendations

1. **Role-Based Access Control**

   - Add `role` field to Profile model
   - Implement proper admin role assignment
   - Create middleware for role-based permissions

2. **Enhanced Security**

   - IP address whitelisting for admin access
   - Two-factor authentication for admin accounts
   - Session timeout and security logging

3. **Advanced Features**

   - User impersonation for support
   - Bulk operations for user/team management
   - Advanced analytics and reporting
   - Export functionality for data

4. **Database Optimization**
   - Implement proper count queries for pagination
   - Add database indexes for search operations
   - Regular activity log cleanup

## Migration Instructions

To enable the full admin system with activity logging:

1. Run Prisma migration to create ActivityLog table:

   ```bash
   npx prisma db push
   ```

2. Generate updated Prisma client:

   ```bash
   npx prisma generate
   ```

3. Verify admin access by logging in with an email containing "admin"

4. Test all admin functions and verify activity logging

## Support

For issues or questions about the admin system:

- Check the console logs for any errors
- Verify database schema is up to date
- Ensure proper admin permissions are configured
- Review API endpoint responses for error details
