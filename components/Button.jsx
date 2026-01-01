import React from 'react';
import { Pressable, Text } from 'react-native';

export default function Button({ title, onPress, type = 'primary', className = '' }) {
  const colors = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    danger: 'bg-danger text-white',
  };

  return (
    <Pressable
      onPress={onPress}
      className={`py-3 px-5 rounded-xl ${colors[type]} ${className}`}
    >
      <Text className="text-center font-semibold">{title}</Text>
    </Pressable>
  );
}
