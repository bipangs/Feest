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

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const { register, isLoading } = useAuth();

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { firstName, lastName, username, email, password, confirmPassword } = formData;

    if (!firstName || !lastName || !username || !email || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    if (!agreeToTerms) {
      Alert.alert('Error', 'Please agree to the Terms of Service');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    return true;
  };  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email.toLowerCase(),
        password: formData.password,
        phone: formData.phone,
      });

      Alert.alert(
        'Success!',
        'Account created successfully! Please check your email for verification.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Registration Failed', 
        error instanceof Error ? error.message : 'Something went wrong'
      );
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
            <View className="items-center mb-8 mt-4">
              <View className="w-16 h-16 bg-secondary-500 rounded-full items-center justify-center mb-4">
                <Ionicons name="person-add" size={32} color="white" />
              </View>
              <Text className="text-3xl font-bold text-neutral-800 mb-2">
                Join Feest
              </Text>
              <Text className="text-neutral-600 text-center text-base">
                Create your account and start sharing food with your community
              </Text>
            </View>

            {/* Registration Form */}
            <View className="space-y-4">
              {/* Name Fields */}
              <View className="flex-row space-x-3">
                <View className="flex-1">
                  <Text className="text-neutral-700 font-medium mb-2">First Name *</Text>
                  <TextInput
                    className="w-full px-4 py-4 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-800"
                    placeholder="John"
                    placeholderTextColor="#a3a3a3"
                    value={formData.firstName}
                    onChangeText={(value) => updateFormData('firstName', value)}
                    autoCapitalize="words"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-neutral-700 font-medium mb-2">Last Name *</Text>
                  <TextInput
                    className="w-full px-4 py-4 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-800"
                    placeholder="Doe"
                    placeholderTextColor="#a3a3a3"
                    value={formData.lastName}
                    onChangeText={(value) => updateFormData('lastName', value)}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              {/* Username */}
              <View>
                <Text className="text-neutral-700 font-medium mb-2">Username *</Text>
                <View className="relative">
                  <TextInput
                    className="w-full px-4 py-4 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-800"
                    placeholder="johndoe"
                    placeholderTextColor="#a3a3a3"
                    value={formData.username}
                    onChangeText={(value) => updateFormData('username', value)}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <View className="absolute right-4 top-4">
                    <Ionicons name="at-outline" size={20} color="#a3a3a3" />
                  </View>
                </View>
              </View>

              {/* Email */}
              <View>
                <Text className="text-neutral-700 font-medium mb-2">Email *</Text>
                <View className="relative">
                  <TextInput
                    className="w-full px-4 py-4 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-800"
                    placeholder="john@example.com"
                    placeholderTextColor="#a3a3a3"
                    value={formData.email}
                    onChangeText={(value) => updateFormData('email', value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <View className="absolute right-4 top-4">
                    <Ionicons name="mail-outline" size={20} color="#a3a3a3" />
                  </View>
                </View>
              </View>

              {/* Phone */}
              <View>
                <Text className="text-neutral-700 font-medium mb-2">Phone (Optional)</Text>
                <View className="relative">
                  <TextInput
                    className="w-full px-4 py-4 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-800"
                    placeholder="+1 (555) 123-4567"
                    placeholderTextColor="#a3a3a3"
                    value={formData.phone}
                    onChangeText={(value) => updateFormData('phone', value)}
                    keyboardType="phone-pad"
                  />
                  <View className="absolute right-4 top-4">
                    <Ionicons name="call-outline" size={20} color="#a3a3a3" />
                  </View>
                </View>
              </View>

              {/* Password */}
              <View>
                <Text className="text-neutral-700 font-medium mb-2">Password *</Text>
                <View className="relative">
                  <TextInput
                    className="w-full px-4 py-4 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-800 pr-12"
                    placeholder="Minimum 6 characters"
                    placeholderTextColor="#a3a3a3"
                    value={formData.password}
                    onChangeText={(value) => updateFormData('password', value)}
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

              {/* Confirm Password */}
              <View>
                <Text className="text-neutral-700 font-medium mb-2">Confirm Password *</Text>
                <View className="relative">
                  <TextInput
                    className="w-full px-4 py-4 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-800 pr-12"
                    placeholder="Re-enter your password"
                    placeholderTextColor="#a3a3a3"
                    value={formData.confirmPassword}
                    onChangeText={(value) => updateFormData('confirmPassword', value)}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    className="absolute right-4 top-4"
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color="#a3a3a3"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Terms and Conditions */}
              <TouchableOpacity
                className="flex-row items-center py-4"
                onPress={() => setAgreeToTerms(!agreeToTerms)}
              >
                <View
                  className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${
                    agreeToTerms
                      ? 'bg-primary-500 border-primary-500'
                      : 'border-neutral-300'
                  }`}
                >
                  {agreeToTerms && (
                    <Ionicons name="checkmark" size={14} color="white" />
                  )}
                </View>
                <View className="flex-1">
                  <Text className="text-neutral-700">
                    I agree to the{' '}
                    <Text className="text-primary-500 font-medium">
                      Terms of Service
                    </Text>{' '}
                    and{' '}
                    <Text className="text-primary-500 font-medium">
                      Privacy Policy
                    </Text>
                  </Text>
                </View>
              </TouchableOpacity>              {/* Register Button */}
              <TouchableOpacity
                className={`w-full py-4 rounded-xl mt-6 ${
                  isLoading
                    ? 'bg-neutral-300'
                    : 'bg-secondary-500 shadow-lg shadow-secondary-500/25'
                }`}
                onPress={handleRegister}
                disabled={isLoading}
              >
                <Text className="text-white text-center font-semibold text-lg">
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </TouchableOpacity>
            </View>            {/* Sign In Link */}
            <View className="flex-row justify-center items-center mt-8 mb-4">
              <Text className="text-neutral-600">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text className="text-primary-500 font-semibold">Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
