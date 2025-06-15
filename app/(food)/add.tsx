import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { apiService, CreateFoodData } from '../../services/api';

export default function AddFoodScreen() {
  const [formData, setFormData] = useState<CreateFoodData>({
    title: '',
    description: '',
    category: '',
    condition: 'FRESH',
    pickupBy: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    quantity: 1,
    unit: 'portions',
    cuisine: '',
    ingredients: [],
    allergens: [],
    tags: [],
    images: [],
    address: '',
    city: '',
    country: '',
    latitude: 0,
    longitude: 0,
  });

  const [showExpiryDatePicker, setShowExpiryDatePicker] = useState(false);
  const [showPickupDatePicker, setShowPickupDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const { isAuthenticated } = useAuth();

  const categories = [
    { id: 'FRUITS', name: 'Fruits', icon: '🍎' },
    { id: 'VEGETABLES', name: 'Vegetables', icon: '🥕' },
    { id: 'GRAINS', name: 'Grains', icon: '🌾' },
    { id: 'DAIRY', name: 'Dairy', icon: '🥛' },
    { id: 'MEAT', name: 'Meat', icon: '🥩' },
    { id: 'SEAFOOD', name: 'Seafood', icon: '🐟' },
    { id: 'BAKED_GOODS', name: 'Baked Goods', icon: '🍞' },
    { id: 'BEVERAGES', name: 'Beverages', icon: '🥤' },
    { id: 'SNACKS', name: 'Snacks', icon: '🍿' },
    { id: 'PREPARED_MEALS', name: 'Prepared Meals', icon: '🍱' },
    { id: 'OTHER', name: 'Other', icon: '🍴' },
  ];

  const conditions = [
    { id: 'FRESH', name: 'Fresh', description: 'Just made or harvested' },
    { id: 'GOOD', name: 'Good', description: 'Still in good condition' },
    { id: 'FAIR', name: 'Fair', description: 'Edible but not perfect' },
    { id: 'EXPIRED', name: 'Past Best By', description: 'Past best by date but still edible' },
  ];

  const units = ['portions', 'kg', 'g', 'liters', 'ml', 'pieces', 'bags', 'boxes', 'cans'];

  const allergenOptions = [
    'Gluten', 'Dairy', 'Eggs', 'Nuts', 'Peanuts', 'Soy', 'Fish', 'Shellfish', 'Sesame'
  ];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to add images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      allowsMultipleSelection: true,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map(asset => asset.uri);
      setSelectedImages(prev => [...prev, ...newImages].slice(0, 5)); // Max 5 images
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleExpiryDateChange = (event: any, selectedDate?: Date) => {
    setShowExpiryDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        expiryDate: selectedDate.toISOString()
      }));
    }
  };

  const handlePickupDateChange = (event: any, selectedDate?: Date) => {
    setShowPickupDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        pickupBy: selectedDate.toISOString()
      }));
    }
  };

  const toggleAllergen = (allergen: string) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens?.includes(allergen)
        ? prev.allergens.filter(a => a !== allergen)
        : [...(prev.allergens || []), allergen]
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return false;
    }
    if (!formData.category) {
      Alert.alert('Error', 'Please select a category');
      return false;
    }
    if (!formData.address?.trim()) {
      Alert.alert('Error', 'Please enter a pickup address');
      return false;
    }
    if (formData.quantity < 1) {
      Alert.alert('Error', 'Quantity must be at least 1');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const foodData = {
        ...formData,
        images: selectedImages, // In a real app, you'd upload these to a service first
      };

      await apiService.createFood(foodData);
      
      Alert.alert('Success!', 'Food item has been added successfully', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to add food item');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text className="text-neutral-500 text-lg">Please log in to add food items</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      {/* Header */}
      <View className="bg-white px-4 py-4 border-b border-neutral-200">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2"
          >
            <Ionicons name="arrow-back" size={24} color="#262626" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-neutral-800">Add Food Item</Text>
          <View className="w-10" />
        </View>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Images Section */}
        <View className="bg-white p-4 rounded-xl mb-4 border border-neutral-100">
          <Text className="text-lg font-semibold text-neutral-800 mb-3">Photos</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
            {selectedImages.map((image, index) => (
              <View key={index} className="mr-3 relative">
                <Image source={{ uri: image }} className="w-20 h-20 rounded-lg" />
                <TouchableOpacity
                  onPress={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
                >
                  <Ionicons name="close" size={16} color="white" />
                </TouchableOpacity>
              </View>
            ))}
            {selectedImages.length < 5 && (
              <TouchableOpacity
                onPress={pickImage}
                className="w-20 h-20 bg-neutral-100 rounded-lg items-center justify-center border-2 border-dashed border-neutral-300"
              >
                <Ionicons name="camera" size={24} color="#737373" />
                <Text className="text-xs text-neutral-500 mt-1">Add Photo</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>

        {/* Basic Information */}
        <View className="bg-white p-4 rounded-xl mb-4 border border-neutral-100">
          <Text className="text-lg font-semibold text-neutral-800 mb-3">Basic Information</Text>
          
          <View className="mb-4">
            <Text className="text-sm font-medium text-neutral-700 mb-2">Title *</Text>
            <TextInput
              className="bg-neutral-50 px-4 py-3 rounded-lg text-neutral-800 border border-neutral-200"
              placeholder="e.g., Fresh Homemade Bread"
              value={formData.title}
              onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-neutral-700 mb-2">Description *</Text>
            <TextInput
              className="bg-neutral-50 px-4 py-3 rounded-lg text-neutral-800 border border-neutral-200"
              placeholder="Describe your food item..."
              multiline
              numberOfLines={3}
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-neutral-700 mb-2">Category *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => setFormData(prev => ({ ...prev, category: category.id }))}
                  className={`flex-row items-center px-4 py-2 rounded-full mr-3 border ${
                    formData.category === category.id
                      ? 'bg-primary-500 border-primary-500'
                      : 'bg-neutral-100 border-neutral-200'
                  }`}
                >
                  <Text className="mr-1">{category.icon}</Text>
                  <Text
                    className={`font-medium ${
                      formData.category === category.id
                        ? 'text-white'
                        : 'text-neutral-700'
                    }`}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-neutral-700 mb-2">Condition</Text>
            <View className="flex-row flex-wrap">
              {conditions.map((condition) => (
                <TouchableOpacity
                  key={condition.id}
                  onPress={() => setFormData(prev => ({ ...prev, condition: condition.id }))}
                  className={`px-4 py-2 rounded-full mr-3 mb-2 border ${
                    formData.condition === condition.id
                      ? 'bg-secondary-500 border-secondary-500'
                      : 'bg-neutral-100 border-neutral-200'
                  }`}
                >
                  <Text
                    className={`font-medium ${
                      formData.condition === condition.id
                        ? 'text-white'
                        : 'text-neutral-700'
                    }`}
                  >
                    {condition.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Quantity & Details */}
        <View className="bg-white p-4 rounded-xl mb-4 border border-neutral-100">
          <Text className="text-lg font-semibold text-neutral-800 mb-3">Quantity & Details</Text>
          
          <View className="flex-row mb-4">
            <View className="flex-1 mr-2">
              <Text className="text-sm font-medium text-neutral-700 mb-2">Quantity *</Text>
              <TextInput
                className="bg-neutral-50 px-4 py-3 rounded-lg text-neutral-800 border border-neutral-200"
                placeholder="1"
                keyboardType="numeric"
                value={formData.quantity.toString()}
                onChangeText={(text) => setFormData(prev => ({ ...prev, quantity: parseInt(text) || 1 }))}
              />
            </View>
            <View className="flex-1 ml-2">
              <Text className="text-sm font-medium text-neutral-700 mb-2">Unit</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {units.map((unit) => (
                  <TouchableOpacity
                    key={unit}
                    onPress={() => setFormData(prev => ({ ...prev, unit }))}
                    className={`px-3 py-2 rounded-full mr-2 border ${
                      formData.unit === unit
                        ? 'bg-accent-500 border-accent-500'
                        : 'bg-neutral-100 border-neutral-200'
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        formData.unit === unit
                          ? 'text-white'
                          : 'text-neutral-700'
                      }`}
                    >
                      {unit}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-neutral-700 mb-2">Cuisine (Optional)</Text>
            <TextInput
              className="bg-neutral-50 px-4 py-3 rounded-lg text-neutral-800 border border-neutral-200"
              placeholder="e.g., Italian, Chinese, Homemade"
              value={formData.cuisine || ''}
              onChangeText={(text) => setFormData(prev => ({ ...prev, cuisine: text }))}
            />
          </View>
        </View>

        {/* Dates */}
        <View className="bg-white p-4 rounded-xl mb-4 border border-neutral-100">
          <Text className="text-lg font-semibold text-neutral-800 mb-3">Important Dates</Text>
          
          <View className="mb-4">
            <Text className="text-sm font-medium text-neutral-700 mb-2">Pickup By *</Text>
            <TouchableOpacity
              onPress={() => setShowPickupDatePicker(true)}
              className="bg-neutral-50 px-4 py-3 rounded-lg border border-neutral-200"
            >
              <Text className="text-neutral-800">
                {new Date(formData.pickupBy).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-neutral-700 mb-2">Expiry Date (Optional)</Text>
            <TouchableOpacity
              onPress={() => setShowExpiryDatePicker(true)}
              className="bg-neutral-50 px-4 py-3 rounded-lg border border-neutral-200"
            >
              <Text className="text-neutral-800">
                {formData.expiryDate 
                  ? new Date(formData.expiryDate).toLocaleDateString()
                  : 'Select expiry date'
                }
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Location */}
        <View className="bg-white p-4 rounded-xl mb-4 border border-neutral-100">
          <Text className="text-lg font-semibold text-neutral-800 mb-3">Pickup Location</Text>
          
          <View className="mb-4">
            <Text className="text-sm font-medium text-neutral-700 mb-2">Address *</Text>
            <TextInput
              className="bg-neutral-50 px-4 py-3 rounded-lg text-neutral-800 border border-neutral-200"
              placeholder="Street address"
              value={formData.address || ''}
              onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
            />
          </View>

          <View className="flex-row">
            <View className="flex-1 mr-2">
              <Text className="text-sm font-medium text-neutral-700 mb-2">City</Text>
              <TextInput
                className="bg-neutral-50 px-4 py-3 rounded-lg text-neutral-800 border border-neutral-200"
                placeholder="City"
                value={formData.city || ''}
                onChangeText={(text) => setFormData(prev => ({ ...prev, city: text }))}
              />
            </View>
            <View className="flex-1 ml-2">
              <Text className="text-sm font-medium text-neutral-700 mb-2">Country</Text>
              <TextInput
                className="bg-neutral-50 px-4 py-3 rounded-lg text-neutral-800 border border-neutral-200"
                placeholder="Country"
                value={formData.country || ''}
                onChangeText={(text) => setFormData(prev => ({ ...prev, country: text }))}
              />
            </View>
          </View>
        </View>

        {/* Allergens */}
        <View className="bg-white p-4 rounded-xl mb-4 border border-neutral-100">
          <Text className="text-lg font-semibold text-neutral-800 mb-3">Allergens (Optional)</Text>
          <Text className="text-sm text-neutral-600 mb-3">Select any allergens present in this food</Text>
          
          <View className="flex-row flex-wrap">
            {allergenOptions.map((allergen) => (
              <TouchableOpacity
                key={allergen}
                onPress={() => toggleAllergen(allergen)}
                className={`px-3 py-2 rounded-full mr-2 mb-2 border ${
                  formData.allergens?.includes(allergen)
                    ? 'bg-red-100 border-red-300'
                    : 'bg-neutral-100 border-neutral-200'
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    formData.allergens?.includes(allergen)
                      ? 'text-red-700'
                      : 'text-neutral-700'
                  }`}
                >
                  {allergen}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          className={`py-4 rounded-xl items-center ${
            loading ? 'bg-neutral-300' : 'bg-primary-500'
          }`}
        >
          <Text className="text-white font-semibold text-lg">
            {loading ? 'Adding Food...' : 'Add Food Item'}
          </Text>
        </TouchableOpacity>

        <View className="h-6" />
      </ScrollView>

      {/* Date Pickers */}
      {showPickupDatePicker && (
        <DateTimePicker
          value={new Date(formData.pickupBy)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handlePickupDateChange}
          minimumDate={new Date()}
        />
      )}

      {showExpiryDatePicker && (
        <DateTimePicker
          value={formData.expiryDate ? new Date(formData.expiryDate) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleExpiryDateChange}
          minimumDate={new Date()}
        />
      )}
    </SafeAreaView>
  );
}
