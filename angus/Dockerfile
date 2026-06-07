# Specify the platform for the build stage
FROM --platform=linux/amd64 oven/bun:1-alpine AS base

# Install dependencies
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Build the Next.js app
COPY . .
ENV NODE_ENV=production
RUN bun run build

# Specify the platform for the runner stage as well
FROM --platform=linux/amd64 oven/bun:1-alpine AS runner
WORKDIR /app
COPY --from=base /app/.next/standalone ./
COPY --from=base /app/.next/static ./.next/static
COPY --from=base /app/public ./public

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["bun", "server.js"]