import { router } from 'expo-router';
import { useEffect } from 'react';

export default function FoodTab() {
  useEffect(() => {
    // Redirect to the food listings page
    router.replace('/(food)' as any);
  }, []);

  return null;
}
