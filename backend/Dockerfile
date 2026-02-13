FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --only=production && \
    npm install -g typescript

# Copy source code
COPY src ./src
COPY tsconfig.json .
COPY schema.sql .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:3000/health || exit 1

# Start application with production database path
ENV NODE_ENV=production
ENV DB_PATH=/app/data/carelink.db

# Create data directory for SQLite
RUN mkdir -p /app/data

# Run application
CMD ["npm", "start"]
