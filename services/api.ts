// API service for handling authentication and other backend calls
const API_BASE_URL = 'http://localhost:3000/api/v1';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      email: string;
      username: string;
      firstName: string;
      lastName: string;
      role: string;
      isVerified: boolean;
    };
    accessToken: string;
    refreshToken: string;
  };
}

export interface UserProfile {
  id: string;
  bio?: string;
  location?: string;
  dietaryPreferences: string[];
  allergies: string[];
  preferredRadius: number;
}

export interface UpdateProfileData {
  bio?: string;
  location?: string;
  dietaryPreferences?: string[];
  allergies?: string[];
  preferredRadius?: number;
}

export interface FoodItem {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  expiryDate?: string;
  pickupBy: string;
  quantity: number;
  unit: string;
  cuisine?: string;
  ingredients: string[];
  allergens: string[];
  tags: string[];
  images: string[];
  isActive: boolean;
  isReserved: boolean;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  location?: {
    id: string;
    address: string;
    city: string;
    country: string;
    zipCode?: string;
    latitude: number;
    longitude: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateFoodData {
  title: string;
  description: string;
  category: string;
  condition?: string;
  expiryDate?: string;
  pickupBy: string;
  quantity: number;
  unit?: string;
  cuisine?: string;
  ingredients?: string[];
  allergens?: string[];
  tags?: string[];
  images?: string[];
  address?: string;
  city?: string;
  country?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
}

export interface FoodFilters {
  category?: string;
  search?: string;
  location?: string;
  condition?: string;
  dietary?: string[];
  radius?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

class ApiService {
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      return { response, data };
    } catch {
      throw new Error('Network error. Please check your connection.');
    }
  }

  async login(loginData: LoginData): Promise<AuthResponse> {
    const { response, data } = await this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  }

  async register(registerData: RegisterData): Promise<AuthResponse> {
    const { response, data } = await this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(registerData),
    });

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    return data;
  }

  async forgotPassword(email: string) {
    const { response, data } = await this.makeRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send reset email');
    }

    return data;
  }

  async refreshToken(refreshToken: string) {
    const { response, data } = await this.makeRequest('/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error(data.message || 'Token refresh failed');
    }

    return data;
  }

  async getUserProfile(token: string): Promise<UserProfile> {
    const { response, data } = await this.makeRequest('/users/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get profile');
    }

    return data.data;
  }

  async updateUserProfile(token: string, profileData: UpdateProfileData): Promise<UserProfile> {
    const { response, data } = await this.makeRequest('/users/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update profile');
    }

    return data.data;
  }
  // Food-related endpoints
  async getFoodItems(filters?: FoodFilters): Promise<ApiResponse<FoodItem[]>> {
    const queryParams = new URLSearchParams();
    if (filters?.category) queryParams.append('category', filters.category);
    if (filters?.search) queryParams.append('search', filters.search);
    if (filters?.location) queryParams.append('location', filters.location);
    if (filters?.condition) queryParams.append('condition', filters.condition);
    if (filters?.radius) queryParams.append('radius', filters.radius.toString());

    const { response, data } = await this.makeRequest(`/foods?${queryParams.toString()}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get food items');
    }

    return data;
  }

  async getFoodById(id: string): Promise<ApiResponse<FoodItem>> {
    const { response, data } = await this.makeRequest(`/foods/${id}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get food item');
    }

    return data;
  }

  async createFood(foodData: CreateFoodData): Promise<ApiResponse<FoodItem>> {
    const { response, data } = await this.makeRequest('/foods', {
      method: 'POST',
      body: JSON.stringify(foodData),
    });

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create food listing');
    }

    return data;
  }

  async updateFood(id: string, foodData: Partial<CreateFoodData>): Promise<ApiResponse<FoodItem>> {
    const { response, data } = await this.makeRequest(`/foods/${id}`, {
      method: 'PUT',
      body: JSON.stringify(foodData),
    });

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update food listing');
    }

    return data;
  }

  async deleteFood(id: string): Promise<ApiResponse> {
    const { response, data } = await this.makeRequest(`/foods/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete food listing');
    }

    return data;
  }
  async getMyFoodItems(): Promise<ApiResponse<FoodItem[]>> {
    const { response, data } = await this.makeRequest('/foods/my-foods', {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get your food listings');
    }

    return data;
  }
}

export const apiService = new ApiService();
export default apiService;
