import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    Text,
    TouchableOpacity
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreenWithContext() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await login(email.toLowerCase(), password);
      
      Alert.alert('Success', 'Login successful!', [
        {
          text: 'OK',
          onPress: () => router.replace('/(tabs)' as any),
        },
      ]);
    } catch (error) {
      Alert.alert('Login Failed', error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* ...existing JSX... */}
      
      {/* Login Button */}
      <TouchableOpacity
        className={`w-full py-4 rounded-xl mt-6 ${
          isLoading
            ? 'bg-neutral-300'
            : 'bg-primary-500 shadow-lg shadow-primary-500/25'
        }`}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text className="text-white text-center font-semibold text-lg">
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Text>
      </TouchableOpacity>
      
      {/* ...rest of JSX... */}
    </SafeAreaView>
  );
}
