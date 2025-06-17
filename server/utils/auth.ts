import type { H3Event } from 'h3'
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'

export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN'

/**
 * Get the current user from the session
 */
export async function getCurrentUser(event: H3Event) {
  const user = await serverSupabaseUser(event)
  //   try {
  //     return user
  //   }
  //   catch (error) {
  //     throw error
  //     return null
  //   }
  return user
}

/**
 * Get the user's profile including role information
 */
export async function getUserProfile(event: H3Event) {
  try {
    const user = await getCurrentUser(event)
    if (!user) return null

    const supabase = await serverSupabaseClient(event)
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, avatar_url, role, created_at, updated_at')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }

    console.log("profile", profile);


    return profile
  } catch (error) {
    console.error('Error in getUserProfile:', error)
    return null
  }
}

/**
 * Check if user has a specific role
 */
export async function hasRole(event: H3Event, requiredRole: UserRole): Promise<boolean> {
  try {
    const profile = await getUserProfile(event)
    if (!profile) return false

    return profile.role === requiredRole
  } catch (error) {
    console.error('Error checking user role:', error)
    return false
  }
}

/**
 * Check if user has any of the specified roles
 */
export async function hasAnyRole(event: H3Event, roles: UserRole[]): Promise<boolean> {
  try {
    const profile = await getUserProfile(event)
    if (!profile) return false

    return roles.includes(profile.role as UserRole)
  } catch (error) {
    console.error('Error checking user roles:', error)
    return false
  }
}

/**
 * Check if user is an admin (ADMIN or SUPER_ADMIN)
 */
export async function isAdmin(event: H3Event): Promise<boolean> {
  return await hasAnyRole(event, ['ADMIN', 'SUPER_ADMIN'])
}

/**
 * Check if user is a super admin
 */
export async function isSuperAdmin(event: H3Event): Promise<boolean> {
  return await hasRole(event, 'SUPER_ADMIN')
}

/**
 * Require authentication - throws error if user is not authenticated
 */
export async function requireAuth(event: H3Event) {
  const user = await getCurrentUser(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required',
    })
  }
  return user
}

/**
 * Require specific role - throws error if user doesn't have the role
 */
export async function requireRole(event: H3Event, requiredRole: UserRole) {
  await requireAuth(event)

  const hasRequiredRole = await hasRole(event, requiredRole)
  if (!hasRequiredRole) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Insufficient permissions',
    })
  }
}

/**
 * Require any of the specified roles
 */
export async function requireAnyRole(event: H3Event, roles: UserRole[]) {
  await requireAuth(event)

  const hasRequiredRole = await hasAnyRole(event, roles)
  if (!hasRequiredRole) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Insufficient permissions',
    })
  }
}

/**
 * Require admin access (ADMIN or SUPER_ADMIN)
 */
export async function requireAdmin(event: H3Event) {
  await requireAnyRole(event, ['ADMIN', 'SUPER_ADMIN'])
}

/**
 * Require super admin access
 */
export async function requireSuperAdmin(event: H3Event) {
  await requireRole(event, 'SUPER_ADMIN')
}
