import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const osid = Platform.constants

  if (osid) {
    console.log(osid)
  } 

  return (
    <View className="flex-1 justify-center items-center bg-gray-50 p-6">
      <Text className="text-2xl font-bold mb-4">Profile</Text>
      {user ? (
        <>
          <Text className="text-lg mb-2">Name: {user.name}</Text>
          <Text className="text-lg mb-4">Email: {user.email}</Text>
        </>
      ) : (
        <Text className="text-lg mb-4">No user information available</Text>
      )}

      <Pressable
        onPress={logout}
        className="bg-red-600 py-3 px-8 rounded-lg"
      >
        <Text className="text-white font-semibold">Logout</Text>
      </Pressable>
    </View>
  );
}
