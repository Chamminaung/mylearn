import React from 'react';
import { View } from 'react-native';

export default function Card({ children, className = '' }) {
  return (
    <View className={`bg-white rounded-xl shadow-card p-4 ${className}`}>
      {children}
    </View>
  );
}
