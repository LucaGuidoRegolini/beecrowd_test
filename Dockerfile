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

# Estágio de teste
FROM node:18-alpine AS tester

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/test ./test
COPY --from=builder /app/jest.config.js ./
COPY --from=builder /app/tsconfig.json ./

RUN apk add --no-cache curl \
  && curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin

RUN trivy rootfs --exit-code 1 --ignore-unfixed --severity CRITICAL --no-progress /

RUN npm run test:cov

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
