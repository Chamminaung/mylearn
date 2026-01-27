import { View, Text, TextInput, Pressable, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import * as Device from "expo-device";
import { getDeviceInfo } from "@/utils/deviceInfo";
import { API_URL } from "@/api/apiURL";


export default  function EnterCodeScreen({courseId}) {
  //const { courseId } = useLocalSearchParams();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  

  const submitCode = async () => {
    const deviceInfo = await getDeviceInfo();
  console.log("Device Info:", deviceInfo.id); // Log device info for debugging
    if (code.length !== 4) {
      Alert.alert("Error", "4-digit code ထည့်ပါ");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${API_URL}/api/payments/activate-code`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            deviceId: deviceInfo.id,
            courseId,
            code,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Failed", data.error || "Activation failed");
        return;
      }

      if (data.error === "Code expired") {
  Alert.alert("Expired", "Code သက်တမ်းကုန်သွားပါပြီ");
}


      Alert.alert("Success 🎉", "ဒီ device မှာ course အသုံးပြုလို့ရပါပြီ");

      // go back to course screen
      router.replace(`/course/${courseId}`);
    } catch (err) {
      Alert.alert("Error", "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="bg-white px-6">
      <Text className="text-2xl font-bold text-center mb-2">
        Enter Access Code
      </Text>
      <Text className="text-center text-gray-500 mb-6">
        Course ကို unlock လုပ်ဖို့ 4-digit code ထည့်ပါ
      </Text>
      <TextInput
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        maxLength={4}
        className="border border-gray-300 rounded-xl text-center text-2xl tracking-widest py-4 mb-6"
        placeholder="____"
      />

      <Pressable
        disabled={loading}
        onPress={submitCode}
        className={`py-4 rounded-xl ${
          loading ? "bg-gray-400" : "bg-black"
        }`}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-center font-semibold text-lg">
            Activate
          </Text>
        )}
      </Pressable>
    </View>
  );
}
