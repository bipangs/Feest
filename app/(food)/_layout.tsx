import { Stack } from 'expo-router';

export default function FoodLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Food Listings',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="add" 
        options={{ 
          title: 'Add Food',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="[id]" 
        options={{ 
          title: 'Food Details',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="my-listings" 
        options={{ 
          title: 'My Listings',
          headerShown: false 
        }} 
      />
    </Stack>
  );
}
