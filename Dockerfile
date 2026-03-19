# Etapa de construcción (builder)
FROM node:18-alpine AS builder

# Establecer directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos de configuración de dependencias
COPY package*.json ./

# Instalar dependencias de producción
RUN npm ci --only=production

# Copiar el código fuente
COPY . .

# Compilar el código TypeScript a JavaScript
RUN npm run build

# Etapa de producción (imagen final ligera)
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production --ignore-scripts

# Copiar el código compilado desde la etapa builder
COPY --from=builder /app/dist ./dist

# Puerto que expone la aplicación (referencial para este ejercicio)
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["node", "dist/index.js"]