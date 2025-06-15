import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const quickActions = [
    {
      icon: 'leaf',
      title: 'Browse Food',
      subtitle: 'Find fresh food nearby',
      color: '#10B981',
      route: '/(food)'
    },
    {
      icon: 'add-circle',
      title: 'Share Food',
      subtitle: 'List your extra food',
      color: '#F59E0B',
      route: '/(food)/add'
    },
    {
      icon: 'people',
      title: 'Community',
      subtitle: 'Connect with neighbors',
      color: '#8B5CF6',
      route: '/community'
    },
    {
      icon: 'stats-chart',
      title: 'Impact',
      subtitle: 'See your contribution',
      color: '#EF4444',
      route: '/impact'
    }
  ];

  const stats = [
    { label: 'Meals Shared', value: '2.5K+', icon: '🍽️' },
    { label: 'Food Saved', value: '850kg', icon: '🌱' },
    { label: 'Active Users', value: '1.2K+', icon: '👥' },
    { label: 'Communities', value: '45+', icon: '🏘️' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setSidebarVisible(true)}
          style={styles.menuButton}
        >
          <Ionicons name="menu" size={24} color="#374151" />
        </TouchableOpacity>
        
        <View style={styles.headerTitle}>
          <Text style={styles.logo}>🍽️ Feest</Text>
          <Text style={styles.tagline}>Share • Save • Sustain</Text>
        </View>
        
        <TouchableOpacity
          onPress={() => router.push('/(food)' as any)}
          style={styles.searchButton}
        >
          <Ionicons name="search" size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>
              {isAuthenticated 
                ? `Welcome back,\n${user?.firstName}! 👋` 
                : 'Reduce Food Waste,\nHelp Your Community 🌍'
              }
            </Text>
            <Text style={styles.heroSubtitle}>
              {isAuthenticated
                ? 'Ready to share some food today?'
                : 'Join thousands sharing fresh food and reducing waste in their neighborhoods.'
              }
            </Text>
            
            <TouchableOpacity
              onPress={() => router.push('/(food)' as any)}
              style={styles.ctaButton}
            >
              <Text style={styles.ctaButtonText}>
                {isAuthenticated ? 'Browse Food' : 'Get Started'}
              </Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.heroImage}>
            <Image
              source={require('@/assets/images/react-logo.png')}
              style={styles.heroImageStyle}
              contentFit="contain"
            />
            <View style={styles.heroOverlay}>
              <Text style={styles.heroOverlayText}>Fresh • Local • Free</Text>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Our Community Impact</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={styles.statIcon}>{stat.icon}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.actionCard, { borderLeftColor: action.color }]}
                onPress={() => router.push(action.route as any)}
              >
                <View style={[styles.actionIcon, { backgroundColor: `${action.color}20` }]}>
                  <Ionicons name={action.icon as any} size={28} color={action.color} />
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* How It Works */}
        <View style={styles.howItWorksSection}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.stepsContainer}>
            <View style={styles.step}>
              <View style={[styles.stepNumber, { backgroundColor: '#10B981' }]}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepTitle}>List Your Food</Text>
              <Text style={styles.stepDescription}>
                Have extra food? Take a photo and list it for your community
              </Text>
            </View>
            
            <View style={styles.step}>
              <View style={[styles.stepNumber, { backgroundColor: '#F59E0B' }]}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepTitle}>Connect & Pickup</Text>
              <Text style={styles.stepDescription}>
                Browse nearby listings and connect with food sharers
              </Text>
            </View>
            
            <View style={styles.step}>
              <View style={[styles.stepNumber, { backgroundColor: '#8B5CF6' }]}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepTitle}>Make Impact</Text>
              <Text style={styles.stepDescription}>
                Reduce waste, save money, and strengthen your community
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => router.push('/(food)' as any)}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Text style={styles.activityEmoji}>🥖</Text>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Fresh Bread Available</Text>
                <Text style={styles.activitySubtitle}>2 hours ago • 0.5km away</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Text style={styles.activityEmoji}>🍎</Text>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Organic Apples Shared</Text>
                <Text style={styles.activitySubtitle}>5 hours ago • 1.2km away</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Text style={styles.activityEmoji}>🥗</Text>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Homemade Salad Ready</Text>
                <Text style={styles.activitySubtitle}>1 day ago • 0.8km away</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom Padding */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Sidebar */}
      <Sidebar 
        isVisible={sidebarVisible} 
        onClose={() => setSidebarVisible(false)} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
  },
  headerTitle: {
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  tagline: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  searchButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  heroContent: {
    marginBottom: 30,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    lineHeight: 40,
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 24,
  },
  ctaButton: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginRight: 8,
  },
  heroImage: {
    alignItems: 'center',
    position: 'relative',
  },
  heroImageStyle: {
    width: screenWidth * 0.6,
    height: 200,
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'rgba(79, 70, 229, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  heroOverlayText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  statsSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#F9FAFB',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '47%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  actionsSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  actionsGrid: {
    gap: 16,
  },
  actionCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  howItWorksSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#F9FAFB',
  },
  stepsContainer: {
    gap: 24,
  },
  step: {
    alignItems: 'center',
    textAlign: 'center',
  },
  stepNumber: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  stepNumberText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  recentSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  seeAllText: {
    fontSize: 16,
    color: '#4F46E5',
    fontWeight: '600',
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  activityEmoji: {
    fontSize: 24,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  activitySubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
