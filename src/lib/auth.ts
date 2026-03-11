import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL, // ex: http://localhost:3000
  secret: process.env.BETTER_AUTH_SECRET,

  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  // Mapper les champs BetterAuth vers ton modèle User existant
  user: {
    fields: {
      name: 'name',
    },
  },

  emailAndPassword: {
    enabled: true,
  },

  trustedOrigins: [process.env.FRONTEND_URL ?? 'http://localhost:4200'],
});

export type Auth = typeof auth;
