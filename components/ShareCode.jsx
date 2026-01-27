import { getDeviceInfo } from "@/utils/deviceInfo";
import * as Clipboard from "expo-clipboard";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";




const COURSE_ID = "691ecdda14416da1439ba447"; // Replace with your actual course ID
export default function ShareCodeScreen({courseId, title}) {
  const [code, setCode] = useState(null);
  const [used, setUsed] = useState(false);
  const [expiresAt, setExpiresAt] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const deviceId = 'web-c6fda664-766d-49aa-bd46-7fecd33e1327'; // For web testing purpose
  //const deviceId = await getDeviceInfo().then(info => info.id); 

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!expiresAt) return;

    const timer = setInterval(() => {
      const diff = Math.max(
        Math.floor((new Date(expiresAt) - new Date()) / 1000),
        0
      );
      setSecondsLeft(diff);
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  const load = async () => {
    const deviceId = await getDeviceInfo().then(info => info.id); 
    const res = await fetch(
      `https://api-for-lessonsapp.vercel.app/api/payments/share-code?courseId=${courseId}&deviceId=${deviceId}`
    );
    const data = await res.json();
    //console.log("Share code data:", data);

    setCode(data.code);
    setUsed(data.used);
    setExpiresAt(data.expiresAt);
  };

  const copy = async () => {
    if (secondsLeft <= 0 || used) return;
    await Clipboard.setStringAsync(code);
  };

  //console.log("Used status:", used);

  if (used === undefined) {
    return null; // or a loading indicator
  }

  return (
    <View className="flex-1 bg-white px-6 justify-center">
      <Text className="text-xl font-bold text-center mb-4">
        Share Access Codes For {title}
      </Text>

      <View className="border-2 border-black rounded-2xl py-6 mb-4">
        <Text className="text-4xl font-bold text-center tracking-widest">
          {secondsLeft > 0 ? code : "----"}
        </Text>
      </View>

      {used ? (
        <Text className="text-center text-red-500">
          Code အသုံးပြုပြီးသား
        </Text>
      ) : secondsLeft === 0 ? (
        <Text className="text-center text-red-500">
          Code Expired ⏱️
        </Text>
      ) : (
        <>
          <Text className="text-center text-gray-500 mb-4">
            Expires in {Math.floor(secondsLeft / 60)}:
            {(secondsLeft % 60).toString().padStart(2, "0")}
          </Text>

          <Pressable
            onPress={copy}
            className="bg-black py-4 rounded-xl"
          >
            <Text className="text-white text-center text-lg font-semibold">
              Copy Code
            </Text>
          </Pressable>
        </>
      )}
    </View>
  );
}
