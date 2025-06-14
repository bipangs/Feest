import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen() {
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          className="flex-1"
        >
          <View className="flex-1 px-6 py-8">
            {/* Header */}
            <View className="items-center mb-8 mt-12">
              <View className="w-20 h-20 bg-primary-500 rounded-full items-center justify-center mb-4">
                <Ionicons name="restaurant" size={40} color="white" />
              </View>
              <Text className="text-3xl font-bold text-neutral-800 mb-2">
                Welcome Back!
              </Text>
              <Text className="text-neutral-600 text-center text-base">
                Sign in to continue sharing and discovering amazing food
              </Text>
            </View>

            {/* Login Form */}
            <View className="space-y-4">
              {/* Email Input */}
              <View>
                <Text className="text-neutral-700 font-medium mb-2">Email</Text>
                <View className="relative">
                  <TextInput
                    className="w-full px-4 py-4 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-800 text-base"
                    placeholder="Enter your email"
                    placeholderTextColor="#a3a3a3"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <View className="absolute right-4 top-4">
                    <Ionicons name="mail-outline" size={20} color="#a3a3a3" />
                  </View>
                </View>
              </View>

              {/* Password Input */}
              <View>
                <Text className="text-neutral-700 font-medium mb-2">Password</Text>
                <View className="relative">
                  <TextInput
                    className="w-full px-4 py-4 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-800 text-base pr-12"
                    placeholder="Enter your password"
                    placeholderTextColor="#a3a3a3"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    className="absolute right-4 top-4"
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color="#a3a3a3"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity className="self-end">
                <Text className="text-primary-500 font-medium">
                  Forgot Password?
                </Text>
              </TouchableOpacity>              {/* Login Button */}
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

              {/* Divider */}
              <View className="flex-row items-center my-6">
                <View className="flex-1 h-px bg-neutral-200" />
                <Text className="px-4 text-neutral-500">or</Text>
                <View className="flex-1 h-px bg-neutral-200" />
              </View>

              {/* Social Login Buttons */}
              <View className="space-y-3">
                <TouchableOpacity className="w-full py-4 border border-neutral-200 rounded-xl flex-row items-center justify-center">
                  <Ionicons name="logo-google" size={20} color="#4285F4" />
                  <Text className="ml-3 text-neutral-700 font-medium">
                    Continue with Google
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity className="w-full py-4 border border-neutral-200 rounded-xl flex-row items-center justify-center">
                  <Ionicons name="logo-apple" size={20} color="#000" />
                  <Text className="ml-3 text-neutral-700 font-medium">
                    Continue with Apple
                  </Text>
                </TouchableOpacity>
              </View>
            </View>            {/* Sign Up Link */}
            <View className="flex-row justify-center items-center mt-8">
              <Text className="text-neutral-600">Don&apos;t have an account? </Text>
              <TouchableOpacity onPress={() => router.push('./register' as any)}>
                <Text className="text-primary-500 font-semibold">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
