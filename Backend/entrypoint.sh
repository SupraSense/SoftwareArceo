#!/bin/sh
echo "Applying migrations..."
npx prisma db push --accept-dataloss

echo "Seeding database..."
npx prisma db seed

echo "Starting application..."
npm run dev
