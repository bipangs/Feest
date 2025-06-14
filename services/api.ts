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

  // Add food-related endpoints
  async getFoodListings(token: string, filters?: any) {
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

  async createFoodListing(token: string, foodData: any) {
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

export const apiService = new ApiService();
export default apiService;
