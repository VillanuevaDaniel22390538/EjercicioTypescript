# Etapa de construcción
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Etapa de producción
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production --ignore-scripts

# Copiar código compilado y archivos públicos
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/db ./db

EXPOSE 3000 3001

# Comando para ejecutar API y frontend
CMD ["sh", "-c", "npm run api:simple & npm run frontend"]