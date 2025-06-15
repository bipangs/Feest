import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function Sidebar({ isVisible, onClose }: SidebarProps) {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              onClose();            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout');
            }
          }
        }
      ]
    );
  };

  const menuItems = [
    {
      icon: 'home-outline',
      label: 'Home',
      route: '/',
      color: '#4F46E5'
    },
    {
      icon: 'leaf-outline',
      label: 'Food Listings',
      route: '/(food)',
      color: '#10B981'
    },
    {
      icon: 'add-circle-outline',
      label: 'Add Food',
      route: '/(food)/add',
      color: '#F59E0B'
    },
    {
      icon: 'list-outline',
      label: 'My Listings',
      route: '/(food)/my-listings',
      color: '#EF4444'
    },
    {
      icon: 'person-outline',
      label: 'Profile',
      route: '/profile',
      color: '#8B5CF6'
    },
    {
      icon: 'settings-outline',
      label: 'Settings',
      route: '/settings',
      color: '#6B7280'
    }
  ];

  const handleNavigation = (route: string) => {
    onClose();
    if (route === '/') {
      router.push('/(tabs)' as any);
    } else {
      router.push(route as any);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={{ 
        flex: 1, 
        backgroundColor: 'rgba(0,0,0,0.5)',
        flexDirection: 'row'
      }}>
        {/* Overlay - tap to close */}
        <TouchableOpacity 
          style={{ flex: 0.3 }} 
          activeOpacity={1}
          onPress={onClose}
        />
        
        {/* Sidebar Content */}
        <View style={{ 
          flex: 0.7,
          backgroundColor: 'white',
          shadowColor: '#000',
          shadowOffset: { width: -2, height: 0 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5
        }}>
          <ScrollView style={{ flex: 1 }}>
            {/* Header */}
            <View style={{ 
              backgroundColor: '#4F46E5',
              paddingTop: 60,
              paddingBottom: 30,
              paddingHorizontal: 20
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <Text style={{ 
                    fontSize: 24, 
                    fontWeight: 'bold', 
                    color: 'white',
                    marginRight: 8
                  }}>
                    🍽️ Feest
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={onClose}
                  style={{ 
                    padding: 8,
                    borderRadius: 20,
                    backgroundColor: 'rgba(255,255,255,0.2)'
                  }}
                >
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>
              
              {/* User Info */}
              {isAuthenticated && user ? (
                <View style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  marginTop: 20,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  padding: 16,
                  borderRadius: 12
                }}>
                  <View style={{ 
                    width: 50, 
                    height: 50, 
                    backgroundColor: 'rgba(255,255,255,0.2)', 
                    borderRadius: 25, 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    marginRight: 12
                  }}>                    {/* User avatar placeholder - avatar property doesn't exist in User interface */}
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                      {user.firstName[0]}{user.lastName[0]}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: '600', color: 'white' }}>
                      {user.firstName} {user.lastName}
                    </Text>
                    <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
                      @{user.username}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={{ 
                  marginTop: 20,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  padding: 16,
                  borderRadius: 12,
                  alignItems: 'center'
                }}>
                  <Text style={{ fontSize: 16, color: 'white', marginBottom: 12 }}>
                    Welcome to Feest!
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      onClose();
                      // TODO: Navigate to login screen
                      Alert.alert('Login', 'Login feature coming soon!');
                    }}
                    style={{
                      backgroundColor: 'white',
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      borderRadius: 20
                    }}
                  >
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#4F46E5' }}>
                      Sign In
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Menu Items */}
            <View style={{ padding: 20 }}>
              <Text style={{ 
                fontSize: 16, 
                fontWeight: '600', 
                color: '#374151', 
                marginBottom: 16,
                textTransform: 'uppercase',
                letterSpacing: 0.5
              }}>
                Navigation
              </Text>
              
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleNavigation(item.route)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 16,
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    marginBottom: 8,
                    backgroundColor: '#F9FAFB'
                  }}
                >
                  <View style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: `${item.color}20`,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 16
                  }}>
                    <Ionicons name={item.icon as any} size={20} color={item.color} />
                  </View>
                  <Text style={{ 
                    fontSize: 16, 
                    fontWeight: '500', 
                    color: '#374151',
                    flex: 1
                  }}>
                    {item.label}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              ))}
            </View>

            {/* Footer Actions */}
            {isAuthenticated && (
              <View style={{ 
                padding: 20,
                borderTopWidth: 1,
                borderTopColor: '#E5E7EB',
                marginTop: 20
              }}>
                <TouchableOpacity
                  onPress={handleLogout}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 16,
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    backgroundColor: '#FEF2F2'
                  }}
                >
                  <View style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: '#FECACA',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 16
                  }}>
                    <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                  </View>
                  <Text style={{ 
                    fontSize: 16, 
                    fontWeight: '500', 
                    color: '#EF4444',
                    flex: 1
                  }}>
                    Logout
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* App Info */}
            <View style={{ 
              padding: 20,
              alignItems: 'center',
              borderTopWidth: 1,
              borderTopColor: '#E5E7EB'
            }}>
              <Text style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 4 }}>
                Feest - Food Sharing App
              </Text>
              <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
                Version 1.0.0
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
