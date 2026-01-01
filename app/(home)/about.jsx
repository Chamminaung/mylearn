import {
  View,
  Text,
  ScrollView,
  Pressable,
  Linking,
  Image,
  useColorScheme,
} from "react-native";
import React, { useState } from "react";
import * as Application from "expo-application";


const About = () => {
  const theme = useColorScheme();
  const isDark = theme === "dark";
  const [lang, setLang] = useState("en");

  const appVersion =
    Application.nativeApplicationVersion || "1.0.0";

  const content = {
    en: {
      title: "Video Learn App",
      description:
        "Video Learn App is an online learning platform that allows users to learn through video lessons, track progress, and continue learning on mobile and web.",
      purpose:
        "This platform is built to help learners study easily with structured lessons and real learning progress tracking.",
      developer:
        "Developed by a full-stack developer passionate about education systems and online learning platforms.",
      terms:
        "By using this app, you agree to our Terms of Service and Privacy Policy.",
    },
    mm: {
      title: "Video Learn App အကြောင်း",
      description:
        "Video Learn App သည် video သင်ခန်းစာများဖြင့် လေ့လာနိုင်ပြီး mobile နှင့် web မှာ အသုံးပြုနိုင်သော online learning platform ဖြစ်ပါသည်။",
      purpose:
        "သင်ခန်းစာများကို စနစ်တကျ လေ့လာနိုင်ပြီး learning progress ကို အချိန်နှင့်တပြေးညီ သိမ်းဆည်းပေးပါသည်။",
      developer:
        "ပညာရေးဆိုင်ရာ system များကို စိတ်ဝင်စားသော full-stack developer မှ ဖန်တီးထားပါသည်။",
      terms:
        "ဒီ app ကို အသုံးပြုခြင်းဖြင့် Terms နှင့် Privacy Policy ကို သဘောတူပါသည်။",
    },
  };

  const t = content[lang];

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: isDark ? "#000" : "#f6f6f6" }}
      >
        <View className="w-full max-w-3xl px-4 py-6">

          {/* Language Switch */}
          <View className="flex-row justify-end mb-3">
            <Pressable onPress={() => setLang("en")}>
              <Text className={`mr-3 ${lang === "en" ? "font-bold" : ""}`}>EN</Text>
            </Pressable>
            <Pressable onPress={() => setLang("mm")}>
              <Text className={`${lang === "mm" ? "font-bold" : ""}`}>MM</Text>
            </Pressable>
          </View>

          {/* Card */}
          <View
            className="rounded-2xl p-5"
            style={{
              backgroundColor: isDark ? "#111" : "#fff",
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 10,
            }}
          >
            {/* APP LOGO */}
            <View className="items-center mb-4">
              <Image
                source={require('@/assets/favicon.png')}
                className="w-24 h-24 rounded-2xl"
                resizeMode="contain"
              />
              <Text className="text-xl font-bold mt-2">{t.title}</Text>
              <Text className="text-xs text-gray-400">
                Version {appVersion}
              </Text>
            </View>

            {/* Description */}
            <Text className="text-base mb-4 leading-6 text-center">
              {t.description}
            </Text>

            {/* Purpose */}
            <Text className="text-lg font-semibold mb-2">🎯 Purpose</Text>
            <Text className="text-base mb-4 leading-6">{t.purpose}</Text>

            {/* Developer Section */}
            <Text className="text-lg font-semibold mb-2">👨‍💻 Developer</Text>

            <View className="flex-row items-center mb-4">
              <Image
                source={require('@/assets/favicon.png')}
                className="w-16 h-16 rounded-full mr-4"
              />
              <Text className="text-base flex-1 leading-6">
                {t.developer}
              </Text>
            </View>

            {/* Contact */}
            <Text className="text-lg font-semibold mb-2">📞 Contact</Text>

            <Pressable onPress={() => Linking.openURL("https://t.me/yourusername")}>
              <Text className="text-blue-500 mb-1">Telegram</Text>
            </Pressable>

            <Pressable onPress={() => Linking.openURL("https://facebook.com/yourpage")}>
              <Text className="text-blue-500 mb-4">Facebook</Text>
            </Pressable>

            {/* Terms */}
            <Text className="text-xs text-gray-500 text-center">
              {t.terms}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default About;
