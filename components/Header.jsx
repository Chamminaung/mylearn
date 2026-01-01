// components/Header.jsx
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Header() {
  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white shadow-md">
      {/* Logo and App Name */}
      <View className="flex-row items-center">
        <Image
          source={require("../assets/images/icon.png")} // replace later
          className="w-10 h-10 rounded-full"
        />
        <Text className="ml-2 text-xl font-semibold text-gray-800">
          CodeLearn
        </Text>
      </View>

      {/* Right side icons */}
      <TouchableOpacity>
        <Ionicons name="person-circle-outline" size={28} color="#555" />
      </TouchableOpacity>
    </View>
  );
}
