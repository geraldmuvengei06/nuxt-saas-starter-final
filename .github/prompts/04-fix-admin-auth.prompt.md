@workspace Replace the insecure email-based admin detection with a proper role-based authentication system. The current system checking for "admin" in email addresses is a security vulnerability. Please:

1. Update the Prisma schema:

   - Add a 'role' enum field to the Profile model with values: 'USER', 'ADMIN', 'SUPER_ADMIN'
   - Set default value to 'USER'
   - Generate migration for this change

2. Create proper role management:

   - Add server utility functions to check user roles
   - Create middleware in /server/middleware for role-based route protection
   - Update super admin dashboard to check for 'SUPER_ADMIN' role instead of email pattern

3. Implement secure role assignment:

   - Create API endpoint for super admins to assign roles (protected by role check)
   - Add role management interface in super admin dashboard
   - Ensure only existing super admins can modify user roles

4. Update authentication flow:

   - Remove all email pattern matching for admin detection
   - Replace with proper role-based checks using the new role field
   - Update any admin route guards to use role validation

5. Add initial super admin setup mechanism (database seeding or manual assignment process)

Focus on security best practices and ensure the role field is properly protected from unauthorized modification.
