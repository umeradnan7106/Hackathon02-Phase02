/**
 * Better Auth configuration for Next.js application.
 * Handles JWT-based authentication with 7-day token expiration.
 */

import { betterAuth } from "better-auth";

/**
 * Better Auth instance configured with database and JWT settings.
 */
export const auth = betterAuth({
  // Database configuration (uses Neon PostgreSQL)
  database: {
    provider: "postgres",
    url: process.env.DATABASE_URL!,
  },

  // Email/password authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Disabled for Phase II
  },

  // JWT token configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days in seconds
    updateAge: 60 * 60 * 24, // Update session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  },

  // Secret key for JWT signing (must match backend)
  secret: process.env.BETTER_AUTH_SECRET!,

  // Base URL for authentication endpoints
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

  // Advanced options
  advanced: {
    generateId: false, // Use database auto-increment
    cookieSecurity: {
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "lax",
      httpOnly: true,
    },
  },
});

/**
 * Type-safe auth client for use in React components.
 */
export type Auth = typeof auth;
