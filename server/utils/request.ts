import type { H3Event } from 'h3'
import { getHeader as h3GetHeader, getHeaders as h3GetHeaders } from 'h3'

/**
 * Get client IP address from various sources
 */
export function getClientIP(event: H3Event): string | null {
  const headers = h3GetHeaders(event)

  // Check various headers that might contain the real IP
  const ipHeaders = [
    'x-forwarded-for',
    'x-real-ip',
    'x-client-ip',
    'cf-connecting-ip', // Cloudflare
    'x-forwarded',
    'forwarded-for',
    'forwarded',
  ]

  for (const header of ipHeaders) {
    const value = headers[header]
    if (value && typeof value === 'string') {
      // x-forwarded-for can contain multiple IPs, take the first one
      const ip = value.split(',')[0].trim()
      if (ip && ip !== 'unknown') {
        return ip
      }
    }
  }

  // Fallback to connection remote address
  const remoteAddress = event.node.req.socket?.remoteAddress
  if (remoteAddress && remoteAddress !== '::1' && remoteAddress !== '127.0.0.1') {
    return remoteAddress
  }

  return null
}

/**
 * Get specific header value from the request
 */
export function getHeader(event: H3Event, name: string): string | null {
  return h3GetHeader(event, name) || null
}

/**
 * Get user agent from request headers
 */
export function getUserAgent(event: H3Event): string | null {
  return getHeader(event, 'user-agent')
}

/**
 * Get referer from request headers
 */
export function getReferer(event: H3Event): string | null {
  return getHeader(event, 'referer') || getHeader(event, 'referrer')
}
