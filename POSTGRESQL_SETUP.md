# 🐘 PostgreSQL Setup Guide

## 📥 **Step 1: Install PostgreSQL**

### **Windows Installation:**

1. **Download PostgreSQL:**
   - Go to https://www.postgresql.org/download/windows/
   - Download the latest version (PostgreSQL 16.x)
   - Choose the Windows x86-64 installer

2. **Run the Installer:**
   - Run the downloaded `.exe` file as Administrator
   - Follow the installation wizard
   - **Important Settings:**
     - Port: `5432` (default)
     - Superuser password: Choose a strong password (remember this!)
     - Locale: Default

3. **Complete Installation:**
   - Install pgAdmin 4 (PostgreSQL management tool)
   - Install Stack Builder (optional)

## 🔧 **Step 2: Create Your Database**

### **Using pgAdmin (GUI Method):**

1. **Open pgAdmin 4:**
   - Find it in your Start Menu
   - Connect using the password you set during installation

2. **Create Database:**
   - Right-click on "PostgreSQL 16" server
   - Select "Create" → "Database"
   - Database name: `feest_db`
   - Owner: `postgres`
   - Click "Save"

### **Using Command Line (Terminal Method):**

1. **Open Command Prompt as Administrator**

2. **Connect to PostgreSQL:**
   ```bash
   psql -U postgres
   ```

3. **Create Database:**
   ```sql
   CREATE DATABASE feest_db;
   \q
   ```

## ⚙️ **Step 3: Configure Your Backend**

### **Create .env File:**

1. **Copy the example file:**
   ```bash
   cd backend
   copy .env.example .env
   ```

2. **Update your .env file:**
   ```bash
   # Database Configuration
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/feest_db"
   
   # Replace YOUR_PASSWORD with the password you set during PostgreSQL installation
   ```

### **Example .env Configuration:**
```bash
# Database Configuration
DATABASE_URL="postgresql://postgres:mypassword123@localhost:5432/feest_db"

# JWT Configuration
JWT_SECRET="feest-super-secret-jwt-key-2024"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_SECRET="feest-refresh-token-secret-2024"
JWT_REFRESH_EXPIRES_IN="30d"

# Server Configuration
PORT=3000
NODE_ENV="development"
API_VERSION="v1"

# CORS Configuration
FRONTEND_URL="http://localhost:8081"
MOBILE_DEEP_LINK="feest://"
```

## 🚀 **Step 4: Initialize Your Database**

### **Run Prisma Migrations:**

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies (if not done):**
   ```bash
   npm install
   ```

3. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

4. **Push database schema:**
   ```bash
   npx prisma db push
   ```

5. **Seed the database (optional):**
   ```bash
   npm run seed
   ```

## ✅ **Step 5: Test Your Connection**

### **Test Database Connection:**
```bash
npx prisma studio
```
This opens a web interface to view your database at http://localhost:5555

### **Start Your Backend:**
```bash
npm run dev
```

You should see:
```
🚀 Server running on port 3000
✅ Database connected successfully
```

## 🛠️ **Alternative: Docker Setup (Advanced)**

If you prefer Docker:

1. **Create docker-compose.yml:**
   ```yaml
   version: '3.8'
   services:
     postgres:
       image: postgres:16
       environment:
         POSTGRES_DB: feest_db
         POSTGRES_USER: postgres
         POSTGRES_PASSWORD: yourpassword
       ports:
         - "5432:5432"
       volumes:
         - postgres_data:/var/lib/postgresql/data
   
   volumes:
     postgres_data:
   ```

2. **Run Docker:**
   ```bash
   docker-compose up -d
   ```

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **"Database does not exist" error:**
   - Make sure you created the `feest_db` database
   - Check your DATABASE_URL in .env file

2. **"Password authentication failed":**
   - Verify your PostgreSQL password in DATABASE_URL
   - Make sure PostgreSQL service is running

3. **"Connection refused":**
   - Check if PostgreSQL is running (Windows Services)
   - Verify port 5432 is not blocked

4. **Prisma migration errors:**
   - Delete `prisma/migrations` folder
   - Run `npx prisma db push` instead of migrate

### **Check PostgreSQL Status:**
```bash
# Windows - Check if service is running
sc query postgresql-x64-16
```

## 📱 **Next Steps**

Once PostgreSQL is set up:

1. ✅ Database is running
2. ✅ Backend connects successfully
3. ✅ Prisma schema is applied
4. ✅ Sample data is seeded
5. ✅ Ready to connect with your React Native frontend!

Your Feest app backend will now have a proper database for storing users, food listings, and all other app data! 🎉
