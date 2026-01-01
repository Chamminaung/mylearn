import React from 'react';
import { View } from 'react-native';

export default function ProgressBar({ progress = 0 }) {
  return (
    <View className="h-2 w-full bg-grayLight rounded-full mt-2">
      <View className="h-2 bg-primary rounded-full" style={{ width: `${progress}%` }} />
    </View>
  );
}
