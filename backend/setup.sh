#!/bin/bash

# Feest Backend Setup Script
echo "🍀 Setting up Feest Backend..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment file
if [ ! -f .env ]; then
  echo "📝 Creating environment file..."
  cp .env.example .env
  echo "⚠️  Please edit .env file with your configuration before running the server"
else
  echo "✅ Environment file already exists"
fi

# Generate Prisma client
echo "🗄️  Setting up database..."
npx prisma generate

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your PostgreSQL database URL and other settings"
echo "2. Run 'npm run db:migrate' to create database tables"
echo "3. Run 'npm run db:seed' to add sample data (optional)"
echo "4. Run 'npm run dev' to start the development server"
echo ""
echo "🚀 Happy coding!"
