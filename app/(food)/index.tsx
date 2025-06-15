import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { apiService, FoodItem } from '../../services/api';

export default function FoodListingsScreen() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  
  const { isAuthenticated } = useAuth();

  const categories = [
    { id: 'ALL', name: 'All', icon: '🍽️' },
    { id: 'FRUITS', name: 'Fruits', icon: '🍎' },
    { id: 'VEGETABLES', name: 'Vegetables', icon: '🥕' },
    { id: 'GRAINS', name: 'Grains', icon: '🌾' },
    { id: 'DAIRY', name: 'Dairy', icon: '🥛' },
    { id: 'MEAT', name: 'Meat', icon: '🥩' },
    { id: 'SEAFOOD', name: 'Seafood', icon: '🐟' },
    { id: 'BAKED_GOODS', name: 'Baked', icon: '🍞' },
    { id: 'BEVERAGES', name: 'Drinks', icon: '🥤' },
    { id: 'SNACKS', name: 'Snacks', icon: '🍿' },
    { id: 'PREPARED_MEALS', name: 'Meals', icon: '🍱' },
    { id: 'OTHER', name: 'Other', icon: '🍴' },
  ];
  const fetchFoodItems = React.useCallback(async () => {
    try {
      setLoading(true);
      const filters = {
        category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
        search: searchQuery || undefined,
      };
      
      const response = await apiService.getFoodItems(filters);
      setFoodItems(response.data || []);
    } catch (error) {
      console.error('Error fetching food items:', error);
      Alert.alert('Error', 'Failed to load food listings');
      setFoodItems([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFoodItems();
    }
  }, [isAuthenticated, fetchFoodItems]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchFoodItems();
    setRefreshing(false);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'FRESH': return 'text-secondary-600';
      case 'GOOD': return 'text-accent-600';
      case 'FAIR': return 'text-orange-600';
      case 'EXPIRED': return 'text-red-600';
      default: return 'text-neutral-600';
    }
  };

  const getDietaryBadgeColor = (dietary: string) => {
    switch (dietary.toLowerCase()) {
      case 'vegetarian': return 'bg-secondary-100 text-secondary-800';
      case 'vegan': return 'bg-secondary-200 text-secondary-800';
      case 'gluten-free': return 'bg-accent-100 text-accent-800';
      case 'organic': return 'bg-primary-100 text-primary-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-50 justify-center items-center">
        <Text className="text-lg text-neutral-600">Please log in to view food listings</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">      {/* Header with Search */}
      <View className="bg-white px-4 py-3 border-b border-neutral-200">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => setSidebarVisible(true)}
              className="mr-3 p-2 rounded-lg bg-neutral-100"
            >
              <Ionicons name="menu" size={24} color="#374151" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-primary-600">🍽️ Food Share</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/(food)/add' as any)}
            className="bg-primary-500 px-4 py-2 rounded-full"
          >
            <Text className="text-white font-semibold">+ Add Food</Text>
          </TouchableOpacity>
        </View>
        
        <View className="flex-row items-center bg-neutral-100 rounded-lg px-3 py-2">
          <Ionicons name="search" size={20} color="#737373" />
          <TextInput
            className="flex-1 ml-2 text-neutral-800"
            placeholder="Search food items..."
            placeholderTextColor="#a3a3a3"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="bg-white border-b border-neutral-200"
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => setSelectedCategory(category.id)}
            className={`flex-row items-center px-4 py-2 rounded-full mr-3 ${
              selectedCategory === category.id
                ? 'bg-primary-500'
                : 'bg-neutral-100'
            }`}
          >
            <Text className="mr-1">{category.icon}</Text>
            <Text
              className={`font-medium ${
                selectedCategory === category.id
                  ? 'text-white'
                  : 'text-neutral-700'
              }`}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Food Listings */}
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {loading ? (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-neutral-500">Loading food listings...</Text>
          </View>
        ) : foodItems.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-xl mb-2">🍽️</Text>
            <Text className="text-lg font-semibold text-neutral-700 mb-2">No food items found</Text>
            <Text className="text-neutral-500 text-center px-8">
              {searchQuery || selectedCategory !== 'ALL'
                ? 'Try adjusting your search or filters'
                : 'Be the first to share food in your area!'}
            </Text>            <TouchableOpacity
              onPress={() => router.push('/(food)/add' as any)}
              className="bg-primary-500 px-6 py-3 rounded-full mt-4"
            >
              <Text className="text-white font-semibold">Share Food</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="p-4">
            {foodItems.map((item) => (              <TouchableOpacity
                key={item.id}
                onPress={() => router.push(`/(food)/${item.id}` as any)}
                className="bg-white rounded-xl mb-4 shadow-sm border border-neutral-100"
              >
                {/* Food Image */}
                <View className="relative">
                  <Image
                    source={{
                      uri: item.images?.[0] || 'https://via.placeholder.com/400x200?text=No+Image',
                    }}
                    className="w-full h-48 rounded-t-xl"
                    resizeMode="cover"
                  />
                  <View className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full">
                    <Text className={`text-sm font-medium ${getConditionColor(item.condition)}`}>
                      {item.condition}
                    </Text>
                  </View>
                  {item.isReserved && (
                    <View className="absolute top-3 left-3 bg-red-500 px-3 py-1 rounded-full">
                      <Text className="text-white text-sm font-medium">Reserved</Text>
                    </View>
                  )}
                </View>

                {/* Food Details */}
                <View className="p-4">
                  <View className="flex-row items-start justify-between mb-2">
                    <Text className="text-lg font-bold text-neutral-800 flex-1">
                      {item.title}
                    </Text>
                    <Text className="text-primary-600 font-bold ml-2">
                      {item.quantity} {item.unit}
                    </Text>
                  </View>

                  <Text className="text-neutral-600 mb-3" numberOfLines={2}>
                    {item.description}
                  </Text>

                  {/* Location & Time */}
                  <View className="flex-row items-center mb-3">
                    <Ionicons name="location-outline" size={16} color="#737373" />
                    <Text className="text-neutral-500 text-sm ml-1 flex-1">
                      {item.location?.address || item.location?.city || 'Location not specified'}
                    </Text>
                    <Text className="text-neutral-400 text-sm">
                      {formatTimeAgo(item.createdAt)}
                    </Text>
                  </View>

                  {/* Pickup By */}
                  <View className="flex-row items-center mb-3">
                    <Ionicons name="time-outline" size={16} color="#737373" />
                    <Text className="text-neutral-500 text-sm ml-1">
                      Pickup by: {new Date(item.pickupBy).toLocaleDateString()}
                    </Text>
                  </View>

                  {/* Allergens & Tags */}
                  {item.allergens && item.allergens.length > 0 && (
                    <View className="flex-row flex-wrap mb-3">
                      {item.allergens.slice(0, 3).map((allergen, index) => (
                        <View
                          key={index}
                          className={`px-2 py-1 rounded-full mr-2 mb-1 ${getDietaryBadgeColor(allergen)}`}
                        >
                          <Text className="text-xs font-medium">
                            {allergen}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* User Info */}
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 bg-primary-100 rounded-full items-center justify-center mr-3">
                      {item.owner.avatar ? (
                        <Image
                          source={{ uri: item.owner.avatar }}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <Text className="text-primary-600 font-bold text-sm">
                          {item.owner.firstName[0]}{item.owner.lastName[0]}
                        </Text>
                      )}
                    </View>
                    <Text className="text-neutral-700 font-medium">
                      {item.owner.firstName} {item.owner.lastName}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>        )}
      </ScrollView>
      
      {/* Sidebar */}
      <Sidebar 
        isVisible={sidebarVisible} 
        onClose={() => setSidebarVisible(false)} 
      />
    </SafeAreaView>
  );
}
