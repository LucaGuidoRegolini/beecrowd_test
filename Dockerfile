# Estágio de construção
FROM node:18-alpine AS builder

WORKDIR /app

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate

COPY . .

RUN npm run build

# Estágio de produção
FROM node:18-alpine

WORKDIR /app

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate

COPY --from=builder /app/dist ./dist

COPY docker/entrypoint.sh .
RUN chmod +x entrypoint.sh

EXPOSE 3000

# CMD ["npm", "run", "start:prod"]
CMD ["sh", "entrypoint.sh"]
