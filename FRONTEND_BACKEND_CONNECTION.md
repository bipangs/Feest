# 🔗 **Frontend-Backend Data Connection Guide**

## 📊 **Complete Data Flow Architecture**

```
┌─────────────────┐    HTTP Requests    ┌─────────────────┐    Database    ┌─────────────────┐
│  React Native   │ ◄──────────────────► │   Node.js API   │ ◄────────────► │   PostgreSQL    │
│   Frontend      │      JSON Data      │    Backend      │   Prisma ORM   │    Database     │
└─────────────────┘                     └─────────────────┘                └─────────────────┘
```

## 🎯 **1. How Data Flows: Step by Step**

### **Login Process Example:**

**Frontend (React Native):**
```tsx
// User types in login form
const email = "john@example.com";
const password = "mypassword";

// Frontend calls API service
await apiService.login({ email, password });
```

**API Service Layer:**
```typescript
// services/api.ts
async login(loginData: LoginData): Promise<AuthResponse> {
  const { response, data } = await this.makeRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(loginData), // { email: "john@example.com", password: "mypassword" }
  });
  return data;
}
```

**HTTP Request:**
```http
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "mypassword"
}
```

**Backend (Node.js):**
```typescript
// backend/src/controllers/authController.ts
async login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body; // Gets the data from frontend

  // Check database via Prisma
  const user = await prisma.user.findUnique({
    where: { email }
  });

  // Validate password
  const isValid = await bcrypt.compare(password, user.password);

  // Generate JWT tokens
  const { accessToken, refreshToken } = generateTokens(user.id);

  // Send response back to frontend
  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: { id: user.id, email: user.email, ... },
      accessToken,
      refreshToken
    }
  });
}
```

**Database (PostgreSQL):**
```sql
-- Prisma generates and executes:
SELECT id, email, password, firstName, lastName 
FROM users 
WHERE email = 'john@example.com';
```

**Response Back to Frontend:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "cuid123",
      "email": "john@example.com",
      "username": "johndoe",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

## 🛠️ **2. How to Add New Features**

### **Example: Adding Food Listings**

**Step 1: Backend (Add to your existing controllers)**
```typescript
// backend/src/controllers/foodController.ts
export class FoodController {
  async getFoodListings(req: AuthenticatedRequest, res: Response): Promise<void> {
    const foods = await prisma.food.findMany({
      where: { isActive: true },
      include: {
        owner: {
          select: { id: true, username: true, firstName: true }
        }
      }
    });

    res.json({
      success: true,
      data: foods
    });
  }

  async createFoodListing(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { title, description, category, quantity } = req.body;
    const userId = req.user?.id;

    const food = await prisma.food.create({
      data: {
        title,
        description,
        category,
        quantity,
        ownerId: userId
      }
    });

    res.json({
      success: true,
      message: 'Food listing created',
      data: food
    });
  }
}
```

**Step 2: Frontend API Service**
```typescript
// services/api.ts - Add new methods
export interface FoodListing {
  id: string;
  title: string;
  description: string;
  category: string;
  quantity: number;
  owner: {
    id: string;
    username: string;
    firstName: string;
  };
}

class ApiService {
  // ...existing methods...

  async getFoodListings(token: string): Promise<FoodListing[]> {
    const { response, data } = await this.makeRequest('/foods', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get food listings');
    }

    return data.data;
  }

  async createFoodListing(token: string, foodData: any): Promise<FoodListing> {
    const { response, data } = await this.makeRequest('/foods', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(foodData),
    });

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create food listing');
    }

    return data.data;
  }
}
```

**Step 3: React Native Component**
```tsx
// components/FoodListings.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { apiService, FoodListing } from '../services/api';

export default function FoodListings() {
  const [foods, setFoods] = useState<FoodListing[]>([]);
  const [loading, setLoading] = useState(false);
  const { accessToken } = useAuth();

  useEffect(() => {
    loadFoodListings();
  }, []);

  const loadFoodListings = async () => {
    if (!accessToken) return;

    setLoading(true);
    try {
      const foodData = await apiService.getFoodListings(accessToken);
      setFoods(foodData);
    } catch (error) {
      console.error('Error loading foods:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewFood = async () => {
    if (!accessToken) return;

    try {
      const newFood = await apiService.createFoodListing(accessToken, {
        title: 'Fresh Bread',
        description: 'Homemade sourdough',
        category: 'BAKED_GOODS',
        quantity: 2
      });
      
      setFoods(prev => [newFood, ...prev]);
    } catch (error) {
      console.error('Error creating food:', error);
    }
  };

  return (
    <View className="flex-1 p-4">
      <TouchableOpacity 
        className="bg-primary-500 p-4 rounded-lg mb-4"
        onPress={createNewFood}
      >
        <Text className="text-white text-center font-semibold">Add Food</Text>
      </TouchableOpacity>

      <FlatList
        data={foods}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-white p-4 rounded-lg mb-2 shadow">
            <Text className="text-lg font-semibold">{item.title}</Text>
            <Text className="text-gray-600">{item.description}</Text>
            <Text className="text-sm text-primary-500">by {item.owner.firstName}</Text>
          </View>
        )}
        refreshing={loading}
        onRefresh={loadFoodListings}
      />
    </View>
  );
}
```

## 🔐 **3. Authentication & Token Management**

### **How Tokens Work:**

1. **Login** → Backend sends `accessToken` + `refreshToken`
2. **Store tokens** → Frontend saves in AsyncStorage
3. **API calls** → Include `Authorization: Bearer {accessToken}` header
4. **Token expires** → Use `refreshToken` to get new `accessToken`
5. **Logout** → Clear all stored tokens

### **Implementation Example:**
```typescript
// Making authenticated requests
const makeAuthenticatedRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = await AsyncStorage.getItem('accessToken');
  
  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
};
```

## 📱 **4. Real Example: Complete User Profile Flow**

### **Frontend Component:**
```tsx
const ProfileScreen = () => {
  const [profile, setProfile] = useState(null);
  const { accessToken } = useAuth();

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await apiService.getUserProfile(accessToken);
        setProfile(profileData);
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    if (accessToken) {
      loadProfile();
    }
  }, [accessToken]);

  // Update profile
  const updateProfile = async (newData) => {
    try {
      const updatedProfile = await apiService.updateUserProfile(accessToken, newData);
      setProfile(updatedProfile);
      Alert.alert('Success', 'Profile updated!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View>
      {profile && (
        <View>
          <Text>Bio: {profile.bio}</Text>
          <Text>Location: {profile.location}</Text>
          <TouchableOpacity onPress={() => updateProfile({ bio: 'New bio!' })}>
            <Text>Update Bio</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
```

## 🔧 **5. Configuration & Customization**

### **API URL Configuration:**
```typescript
// services/api.ts
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api/v1'  // Development
  : 'https://your-app.com/api/v1';  // Production

// Or use environment variables:
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
```

### **Error Handling:**
```typescript
// Global error handler
const handleApiError = (error: any) => {
  if (error.message.includes('401')) {
    // Token expired, logout user
    logout();
  } else if (error.message.includes('Network')) {
    Alert.alert('Connection Error', 'Please check your internet connection');
  } else {
    Alert.alert('Error', error.message);
  }
};
```

## 🎯 **6. What You Can Modify**

### **Backend (Node.js):**
- **Add new routes:** Create new endpoints in `routes/` folder
- **Add business logic:** Implement in `controllers/` folder  
- **Database changes:** Update `prisma/schema.prisma`
- **Authentication:** Modify `middleware/auth.ts`

### **Frontend (React Native):**
- **API calls:** Add new methods to `services/api.ts`
- **UI components:** Create new screens/components
- **State management:** Use React Context or Redux
- **Navigation:** Update routing in layout files

### **Data Types:**
- **Add interfaces:** Define TypeScript types for new data
- **Validation:** Add form validation rules
- **Error handling:** Customize error messages

## 🚀 **Quick Start Checklist**

1. ✅ **Backend running:** `npm start` in backend folder
2. ✅ **Database connected:** PostgreSQL + Prisma setup
3. ✅ **Frontend configured:** Update API_BASE_URL to your backend
4. ✅ **Test connection:** Try login/register from mobile app
5. ✅ **Add features:** Follow the patterns above

Your data connection is now complete and ready to extend! 🎉
