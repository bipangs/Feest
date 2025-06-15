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
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { apiService, FoodItem } from '../../services/api';

export default function MyListingsScreen() {
  const [myFoodItems, setMyFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyFoodItems();
    }
  }, [isAuthenticated]);

  const fetchMyFoodItems = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMyFoodItems();
      setMyFoodItems(response.data || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch your food listings');
      console.error('Error fetching my food items:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMyFoodItems();
    setRefreshing(false);
  };

  const handleDeleteItem = (item: FoodItem) => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${item.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await apiService.deleteFood(item.id);
              setMyFoodItems(prev => prev.filter(i => i.id !== item.id));
              Alert.alert('Success', 'Item deleted successfully');            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert('Error', 'Failed to delete item');
            }
          }
        }
      ]
    );
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

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#737373', fontSize: 18 }}>Please log in to view your listings</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fafafa' }}>
      {/* Header */}
      <View style={{ backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 16, shadowOpacity: 0.1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ padding: 8 }}
          >
            <Ionicons name="arrow-back" size={24} color="#262626" />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#262626' }}>My Listings</Text>
          <TouchableOpacity
            onPress={() => router.push('/food/add' as any)}
            style={{ padding: 8 }}
          >
            <Ionicons name="add" size={24} color="#f2812a" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1, padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 80 }}>
            <Text style={{ color: '#737373' }}>Loading your listings...</Text>
          </View>
        ) : myFoodItems.length === 0 ? (
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 80 }}>
            <Text style={{ fontSize: 64, marginBottom: 16 }}>📦</Text>
            <Text style={{ color: '#525252', fontSize: 20, fontWeight: '600', marginBottom: 8 }}>No listings yet</Text>
            <Text style={{ color: '#737373', textAlign: 'center', marginBottom: 24 }}>
              Start sharing food with your community by adding your first item!
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/food/add' as any)}
              style={{
                backgroundColor: '#f2812a',
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 12
              }}
            >
              <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Add First Item</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ paddingBottom: 24 }}>
            <Text style={{ fontSize: 16, color: '#737373', marginBottom: 16 }}>
              {myFoodItems.length} item{myFoodItems.length !== 1 ? 's' : ''} shared
            </Text>

            {myFoodItems.map((item) => (
              <View
                key={item.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: 16,
                  marginBottom: 16,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                  overflow: 'hidden'
                }}
              >
                {/* Food Image */}
                <TouchableOpacity
                  onPress={() => router.push(`/food/${item.id}` as any)}
                >
                  <View style={{ position: 'relative' }}>
                    <Image
                      source={{
                        uri: item.images?.[0] || 'https://via.placeholder.com/400x200?text=No+Image'
                      }}
                      style={{ width: '100%', height: 180 }}
                      resizeMode="cover"
                    />
                    <View style={{ 
                      position: 'absolute', 
                      top: 12, 
                      right: 12, 
                      backgroundColor: 'rgba(255,255,255,0.9)', 
                      paddingHorizontal: 8, 
                      paddingVertical: 4, 
                      borderRadius: 12 
                    }}>
                      <Text style={{ fontSize: 12, fontWeight: '600', color: getConditionColor(item.condition) }}>
                        {item.condition}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Content */}
                <View style={{ padding: 16 }}>
                  <TouchableOpacity
                    onPress={() => router.push(`/food/${item.id}` as any)}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#262626', flex: 1, marginRight: 12 }}>
                        {item.title}
                      </Text>                      
                      <Text style={{ fontSize: 16, fontWeight: '600', color: '#f2812a' }}>
                        Qty: {item.quantity}
                      </Text>
                    </View>

                    <Text style={{ color: '#525252', marginBottom: 12, lineHeight: 20 }} numberOfLines={2}>
                      {item.description}
                    </Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                      <Ionicons name="location-outline" size={16} color="#737373" />                      
                      <Text style={{ color: '#737373', fontSize: 14, marginLeft: 4, flex: 1 }}>
                        {item.location?.address}, {item.location?.city}
                      </Text>
                      <Text style={{ color: '#737373', fontSize: 14 }}>
                        {formatTimeAgo(item.createdAt)}
                      </Text>
                    </View>                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
                        {item.tags.slice(0, 3).map((tag: string, index: number) => (
                          <View
                            key={index}
                            style={{
                              backgroundColor: '#f0fdf4',
                              paddingHorizontal: 8,
                              paddingVertical: 4,
                              borderRadius: 8,
                              marginRight: 6,
                              marginBottom: 4
                            }}
                          >
                            <Text style={{ fontSize: 12, fontWeight: '500', color: '#166534' }}>
                              {tag}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </TouchableOpacity>

                  {/* Action Buttons */}
                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                    <TouchableOpacity
                      onPress={() => router.push(`/food/${item.id}` as any)}
                      style={{
                        flex: 1,
                        backgroundColor: '#f5f5f5',
                        paddingVertical: 10,
                        borderRadius: 8,
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'center'
                      }}
                    >
                      <Ionicons name="eye-outline" size={16} color="#525252" />
                      <Text style={{ fontSize: 14, fontWeight: '500', color: '#525252', marginLeft: 4 }}>
                        View
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => Alert.alert('Feature Coming Soon', 'Edit functionality will be available soon!')}
                      style={{
                        flex: 1,
                        backgroundColor: '#fdeeda',
                        paddingVertical: 10,
                        borderRadius: 8,
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'center'
                      }}
                    >
                      <Ionicons name="create-outline" size={16} color="#f2812a" />
                      <Text style={{ fontSize: 14, fontWeight: '500', color: '#f2812a', marginLeft: 4 }}>
                        Edit
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleDeleteItem(item)}
                      style={{
                        flex: 1,
                        backgroundColor: '#fef2f2',
                        paddingVertical: 10,
                        borderRadius: 8,
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'center'
                      }}
                    >
                      <Ionicons name="trash-outline" size={16} color="#ef4444" />
                      <Text style={{ fontSize: 14, fontWeight: '500', color: '#ef4444', marginLeft: 4 }}>
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
