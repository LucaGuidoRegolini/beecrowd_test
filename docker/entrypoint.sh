#!/bin/sh
echo "Starting migration..."
npm run prisma:migrate
echo "Migration done"

npm run start:prod