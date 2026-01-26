import { type Request, type Response, type NextFunction } from 'express';
import { betterAuth } from 'better-auth';
import { Pool } from 'pg';
import { prisma } from './db.js';

// Initialize Better Auth with the same configuration as frontend
const connectionString = process.env.DATABASE_URL!;

export const auth = betterAuth({
  database: new Pool({ connectionString }),
  secret: process.env.BETTER_AUTH_SECRET || 'fallback-secret-for-dev',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3847',
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  advanced: {
    disableCSRFCheck: true,
  },
});

export interface AuthUser {
  id: string;
  email: string;
  role: 'sponsor' | 'publisher' | null;
  sponsorId?: string;
  publisherId?: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

/**
 * Middleware that requires authentication.
 * Validates the session cookie and attaches user info to the request.
 * Returns 401 Unauthorized if no valid session exists.
 */
export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Convert Express headers to Web API Headers format for Better Auth
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value) {
        headers.set(key, Array.isArray(value) ? value.join(', ') : value);
      }
    }

    // Get session from Better Auth using the request headers
    const session = await auth.api.getSession({ headers });

    if (!session?.user) {
      res.status(401).json({ error: 'Unauthorized - no valid session' });
      return;
    }

    // Look up user's role (sponsor or publisher)
    const sponsor = await prisma.sponsor.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (sponsor) {
      req.user = {
        id: session.user.id,
        email: session.user.email,
        role: 'sponsor',
        sponsorId: sponsor.id,
      };
      next();
      return;
    }

    const publisher = await prisma.publisher.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (publisher) {
      req.user = {
        id: session.user.id,
        email: session.user.email,
        role: 'publisher',
        publisherId: publisher.id,
      };
      next();
      return;
    }

    // User exists but has no sponsor/publisher profile
    req.user = {
      id: session.user.id,
      email: session.user.email,
      role: null,
    };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Unauthorized - invalid session' });
  }
}

/**
 * Middleware that requires a specific role.
 * Must be used after requireAuth middleware.
 */
export function requireRole(allowedRoles: Array<'sponsor' | 'publisher'>) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!req.user.role || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: 'Forbidden - insufficient permissions' });
      return;
    }

    next();
  };
}
