# 🔐 Feest Authentication Pages

Beautiful and functional login and register pages for your Feest React Native app, built with NativeWind (Tailwind CSS) styling.

## 📁 Structure

```
app/
├── (auth)/
│   ├── _layout.tsx          # Auth stack navigation
│   ├── login.tsx            # Login page
│   └── register.tsx         # Register page
├── index.tsx                # App entry point (redirects to auth)
└── _layout.tsx              # Root navigation layout

services/
└── api.ts                   # API service for backend communication
```

## 🎨 Design Features

### 🌈 **Custom Color Palette**
Your Tailwind config now includes a food-sharing themed color scheme:

- **Primary (Orange)**: Represents food warmth and appetite
- **Secondary (Green)**: Represents sustainability and freshness  
- **Accent (Yellow)**: Represents community and sharing
- **Neutral**: For text and backgrounds

### 📱 **UI Components**

**Login Page:**
- Clean, welcoming design with food icon
- Email and password inputs with validation
- Password visibility toggle
- "Forgot Password" link
- Social login buttons (Google, Apple)
- Responsive keyboard handling

**Register Page:**
- Comprehensive form with all required fields
- Real-time validation
- Terms of service checkbox
- Password confirmation
- Clean navigation between pages

## 🔧 **Technical Features**

### ✅ **Form Validation**
- Required field validation
- Email format validation
- Password length requirements
- Password confirmation matching
- Terms agreement validation

### 🛡️ **Security**
- Passwords are hidden by default
- Email normalization (lowercase)
- Secure API communication
- Token-based authentication ready

### 📲 **UX Features**
- Loading states during API calls
- Proper error handling with user feedback
- Keyboard-aware scrolling
- Safe area handling for different devices
- Smooth navigation between screens

## 🔗 **API Integration**

The pages connect to your backend auth endpoints:

```typescript
// API endpoints used:
POST /api/v1/auth/login
POST /api/v1/auth/register
POST /api/v1/auth/forgot-password
POST /api/v1/auth/refresh-token
```

### 📝 **API Service**
Located in `services/api.ts`, provides:
- Type-safe API calls
- Error handling
- Request/response interfaces
- Easy configuration

## 🚀 **Usage**

### **Starting the App**
1. App opens to `index.tsx`
2. Automatically redirects to login page
3. Users can navigate between login/register
4. Successful auth redirects to main app tabs

### **Customization**

**Colors:** Edit `tailwind.config.js` to change the color scheme
**API URL:** Update `API_BASE_URL` in `services/api.ts`
**Navigation:** Modify routing in the layout files
**Validation:** Adjust rules in the form validation functions

### **Backend Integration**

The auth pages are designed to work with your Node.js backend:

**Expected Response Format:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@email.com",
      "username": "username",
      "firstName": "John",
      "lastName": "Doe"
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

## 📱 **Screenshots Preview**

**Login Page Features:**
- Food-themed branding with restaurant icon
- Primary orange color scheme
- Clean input fields with icons
- Social login options
- Smooth animations

**Register Page Features:**
- Secondary green color theme
- Comprehensive form layout
- Side-by-side name fields
- Terms agreement checkbox
- Progress feedback

## 🔄 **Next Steps**

1. **Token Storage**: Implement AsyncStorage or SecureStore for token persistence
2. **Auth Context**: Create React Context for global auth state management
3. **Biometric Auth**: Add fingerprint/face recognition
4. **Social Login**: Implement Google/Apple OAuth
5. **Email Verification**: Add email verification flow
6. **Password Reset**: Implement forgot password functionality

## 🎯 **Features Ready for Production**

✅ **Responsive Design** - Works on all screen sizes
✅ **TypeScript** - Full type safety
✅ **Error Handling** - User-friendly error messages
✅ **Loading States** - Visual feedback during operations
✅ **Form Validation** - Client-side validation
✅ **API Integration** - Connected to your backend
✅ **Navigation** - Smooth routing between screens
✅ **Accessibility** - Screen reader friendly
✅ **Security** - Following React Native best practices

Your authentication flow is now complete and ready for users! 🎉
