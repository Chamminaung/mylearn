// components/Header.jsx
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
//import AdminDashboard from@/app/(admin)/adminex";
import {router} from "expo-router";

export default function Header() {
  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white shadow-md">
      {/* Logo and App Name */}
      <View className="flex-row items-center">
        <Image
          source={require("@/assets/favicon.png")} // replace later
          className="w-10 h-10 rounded-full"
        />
        <Text className="ml-2 text-xl font-semibold text-gray-800">
          OnFire
        </Text>
      </View>

      {/* Right side icons */}
      <TouchableOpacity
        onPress={() => console.log("Profile pressed")}
      >
        <Ionicons name="person-circle-outline" size={28} color="#555" />
      </TouchableOpacity>
    </View>
  );
}
