# Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Installation des dépendances
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci
RUN npx prisma generate

# Copie et build du code
COPY . .
RUN npm run build

# Image de production
FROM node:20-alpine AS production

WORKDIR /app

# Copie uniquement ce qui est nécessaire
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

EXPOSE 3000

# Démarrage en production
CMD ["npm", "run", "start:prod"]