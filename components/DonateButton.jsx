import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

export default function DonateButton() {
  const [visible, setVisible] = useState(false);

  const phoneNumber = "09798702049";

  const copyPhone = async () => {
    await Clipboard.setStringAsync(phoneNumber);
    Alert.alert("Copied ✅", "Phone number copied to clipboard");
  };

  return (
    <View className="items-center">
      {/* Donate Button */}
      <Pressable
        onPress={() => setVisible(true)}
        className="flex-row items-center bg-red-500 px-6 py-3 rounded-full"
      >
        <MaterialCommunityIcons name="heart" size={20} color="white" />
        <Text className="text-white font-semibold ml-2">
          Donate
        </Text>
      </Pressable>

      {/* Modal */}
      <Modal transparent animationType="fade" visible={visible}>
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white w-80 rounded-2xl p-5">
            <Text className="text-lg font-bold text-center mb-3">
              💖 Donation Info
            </Text>

            <Text className="text-gray-700 mb-1">
              👤 Acc Name: cham min aung
            </Text>

            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-gray-700">
                📞 Phone: {phoneNumber}
              </Text>
              <Pressable onPress={copyPhone}>
                <Ionicons name="copy-outline" size={20} color="#2563eb" />
              </Pressable>
            </View>

            <Text className="text-gray-700 mb-1">💳 Pay Methods:</Text>
            <Text className="text-gray-600 ml-2">
              • KPay{"\n"}
              • AYA Pay{"\n"}
              • CB Pay{"\n"}
              • Wave Pay
            </Text>

            <Pressable
              onPress={() => setVisible(false)}
              className="mt-4 bg-gray-200 py-2 rounded-lg"
            >
              <Text className="text-center font-semibold">
                Close
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
