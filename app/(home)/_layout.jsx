import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';

const TabLayout = () => {
  return (
    <Tabs
    screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: '#2563EB',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: { paddingVertical: 5, height: 60 },
            tabBarIcon: ({ color, size }) => {
              let iconName;
              if (route.name === 'index') iconName = 'home-outline';
              else if (route.name === 'courses') iconName = 'book-outline';
              else if (route.name === 'profile') iconName = 'person-outline';
              else if (route.name === 'about') iconName = 'information-circle-outline';
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })} 
    >
      <Tabs.Screen name="index" options={{ tabBarLabel: 'Home' }} />
      <Tabs.Screen name="profile" options={{ tabBarLabel: 'Profile' }} />
      <Tabs.Screen name="courses" options={{ tabBarLabel: 'Courses' }} />
      <Tabs.Screen name="about" options={{ tabBarLabel: 'About' }} />
    </Tabs>
  )
}

export default TabLayout