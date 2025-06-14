import { router } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      // Only redirect once authentication status is determined
      const timer = setTimeout(() => {
        if (isAuthenticated) {
          router.replace('/(tabs)' as any);
        } else {
          router.replace('/(auth)/login' as any);
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading]);

  // Show loading screen while checking authentication or redirecting
  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Text className="text-primary-500 text-xl font-semibold">
        {isLoading ? 'Checking authentication...' : 'Loading...'}
      </Text>
    </View>
  );
}
