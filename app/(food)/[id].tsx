import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { apiService, FoodItem } from '../../services/api';

const { width: screenWidth } = Dimensions.get('window');

export default function FoodDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [foodItem, setFoodItem] = useState<FoodItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const { user, isAuthenticated } = useAuth();
  const fetchFoodItem = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getFoodById(id!);
      setFoodItem(response.data || null);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch food item details');
      console.error('Error fetching food item:', error);
      router.back();
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id && isAuthenticated) {
      fetchFoodItem();
    }
  }, [id, isAuthenticated, fetchFoodItem]);

  const getDietaryBadgeColor = (dietary: string) => {
    switch (dietary.toLowerCase()) {
      case 'vegetarian': return { bg: '#dcfce7', text: '#15803d' };
      case 'vegan': return { bg: '#bbf7d0', text: '#166534' };
      case 'gluten-free': return { bg: '#fef9c3', text: '#a16207' };
      case 'organic': return { bg: '#fdeeda', text: '#bc501c' };
      default: return { bg: '#f5f5f5', text: '#525252' };
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'excellent': return '#22c55e';
      case 'good': return '#eab308';
      case 'fair': return '#f2812a';
      case 'poor': return '#ef4444';
      default: return '#737373';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const handleContact = () => {
    if (!foodItem) return;
      Alert.alert(
      'Contact Seller',
      `Would you like to contact ${foodItem.owner.firstName} about this food item?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send Message', 
          onPress: () => {
            // TODO: Navigate to messaging/contact screen
            Alert.alert('Feature Coming Soon', 'Messaging feature will be available soon!');
          }
        }
      ]
    );
  };

  const handleReserve = () => {
    if (!foodItem) return;
    
    Alert.alert(
      'Reserve Item',
      `Would you like to reserve "${foodItem.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reserve', 
          onPress: () => {
            // TODO: Implement reservation logic
            Alert.alert('Success', 'Item reserved! The seller will be notified.');
          }
        }
      ]
    );
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#737373', fontSize: 18 }}>Please log in to view food details</Text>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#737373', fontSize: 18 }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!foodItem) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#737373', fontSize: 18 }}>Food item not found</Text>
      </SafeAreaView>
    );
  }

  const isOwnItem = user?.id === foodItem.owner.id;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Header */}
      <View style={{ position: 'absolute', top: 50, left: 16, right: 16, zIndex: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 20 }}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        {isOwnItem && (
          <TouchableOpacity
            onPress={() => Alert.alert('Edit Item', 'Edit functionality coming soon!')}
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 20 }}
          >
            <Ionicons name="create-outline" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={{ flex: 1 }}>
        {/* Images */}
        <View style={{ position: 'relative' }}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
              setCurrentImageIndex(index);
            }}
          >
            {foodItem.images && foodItem.images.length > 0 ? (
              foodItem.images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={{ width: screenWidth, height: 300 }}
                  resizeMode="cover"
                />
              ))
            ) : (
              <View style={{ 
                width: screenWidth, 
                height: 300, 
                backgroundColor: '#f5f5f5', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <Ionicons name="image-outline" size={64} color="#d4d4d4" />
                <Text style={{ color: '#a3a3a3', marginTop: 8 }}>No image available</Text>
              </View>
            )}
          </ScrollView>

          {/* Image Indicators */}
          {foodItem.images && foodItem.images.length > 1 && (
            <View style={{ 
              position: 'absolute', 
              bottom: 16, 
              left: 0, 
              right: 0, 
              flexDirection: 'row', 
              justifyContent: 'center' 
            }}>
              {foodItem.images.map((_, index) => (
                <View
                  key={index}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: index === currentImageIndex ? 'white' : 'rgba(255,255,255,0.5)',
                    marginHorizontal: 4
                  }}
                />
              ))}
            </View>
          )}
        </View>

        {/* Content */}
        <View style={{ padding: 16 }}>
          {/* Title and Condition */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#262626', flex: 1, marginRight: 16 }}>
              {foodItem.title}
            </Text>
            <View style={{ backgroundColor: '#f5f5f5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: getConditionColor(foodItem.condition) }}>
                {foodItem.condition}
              </Text>
            </View>
          </View>

          {/* Quantity and Time */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>            <Text style={{ fontSize: 18, fontWeight: '600', color: '#f2812a', marginRight: 16 }}>
              Qty: {foodItem.quantity}
            </Text>
            <Text style={{ fontSize: 14, color: '#737373' }}>
              • Posted {formatTimeAgo(foodItem.createdAt)}
            </Text>
          </View>

          {/* Description */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#262626', marginBottom: 8 }}>Description</Text>
            <Text style={{ fontSize: 16, color: '#525252', lineHeight: 24 }}>
              {foodItem.description}
            </Text>
          </View>          {/* Dietary Information */}
          {foodItem.tags && foodItem.tags.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: '#262626', marginBottom: 12 }}>Tags</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {foodItem.tags.map((tag: string, index: number) => {
                  const colors = getDietaryBadgeColor(tag);
                  return (
                    <View
                      key={index}
                      style={{
                        backgroundColor: colors.bg,
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 16,
                        marginRight: 8,
                        marginBottom: 8
                      }}
                    >
                      <Text style={{ fontSize: 14, fontWeight: '500', color: colors.text }}>
                        {tag}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Location and Expiry */}
          <View style={{ backgroundColor: '#fafafa', padding: 16, borderRadius: 12, marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <Ionicons name="location-outline" size={20} color="#737373" />              <Text style={{ fontSize: 16, color: '#525252', marginLeft: 8, fontWeight: '500' }}>
                {foodItem.location?.address}, {foodItem.location?.city}
              </Text>
            </View>
            
            {foodItem.expiryDate && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="calendar-outline" size={20} color="#737373" />
                <Text style={{ fontSize: 16, color: '#525252', marginLeft: 8 }}>
                  Best before: {formatDate(foodItem.expiryDate)}
                </Text>
              </View>
            )}
          </View>

          {/* Seller Information */}
          <View style={{ 
            backgroundColor: 'white', 
            padding: 16, 
            borderRadius: 12, 
            marginBottom: 20,
            borderWidth: 1,
            borderColor: '#e5e5e5'
          }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#262626', marginBottom: 12 }}>Shared by</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ 
                width: 48, 
                height: 48, 
                backgroundColor: '#fdeeda', 
                borderRadius: 24, 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginRight: 12 
              }}>                {foodItem.owner.avatar ? (
                  <Image
                    source={{ uri: foodItem.owner.avatar }}
                    style={{ width: 48, height: 48, borderRadius: 24 }}
                  />
                ) : (
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#f2812a' }}>
                    {foodItem.owner.firstName[0]}{foodItem.owner.lastName[0]}
                  </Text>
                )}
              </View>
              <View style={{ flex: 1 }}>                <Text style={{ fontSize: 18, fontWeight: '600', color: '#262626' }}>
                  {foodItem.owner.firstName} {foodItem.owner.lastName}
                </Text>
                <Text style={{ fontSize: 14, color: '#737373' }}>
                  Community member
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      {!isOwnItem && (
        <View style={{ 
          padding: 16, 
          backgroundColor: 'white', 
          borderTopWidth: 1, 
          borderTopColor: '#e5e5e5',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5
        }}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              onPress={handleContact}
              style={{
                flex: 1,
                backgroundColor: 'white',
                borderWidth: 2,
                borderColor: '#f2812a',
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center'
              }}
            >
              <Ionicons name="chatbubble-outline" size={20} color="#f2812a" />
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#f2812a', marginLeft: 8 }}>
                Message
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleReserve}
              style={{
                flex: 1,
                backgroundColor: '#f2812a',
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                shadowColor: '#f2812a',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8
              }}
            >
              <Ionicons name="bookmark-outline" size={20} color="white" />
              <Text style={{ fontSize: 16, fontWeight: '600', color: 'white', marginLeft: 8 }}>
                Reserve
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
