import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";

const ScratchOverview = ({ navigation }) => {
  return (
    <ScrollView className="flex-1 bg-white">
      
      {/* HERO SECTION */}
      <View className="bg-indigo-600 px-6 py-10 rounded-b-3xl">
        <Text className="text-white text-3xl font-bold mb-3">
          🎮 Free Scratch Programming Course
        </Text>
        <Text className="text-indigo-100 text-base leading-6">
          Programming ကို လုံးဝမသိသေးတဲ့ Beginner များအတွက်  
          အဆင့်လိုက် လွယ်ကူစွာ သင်ကြားပေးထားတဲ့ Free Course ဖြစ်ပါတယ်။
        </Text>
      </View>

      {/* COURSE INTRO */}
      <View className="px-6 py-6">
        <Text className="text-xl font-semibold mb-3">
          📘 Course Overview
        </Text>
        <Text className="text-gray-700 leading-6">
          ဒီ Course ဟာ Scratch Programming ကို အသုံးပြုပြီး  
          Coding Concept၊ Logical Thinking နဲ့ Creative Skill တွေကို  
          ကလေးလူကြီး မရွေး နားလည်လွယ်အောင် သင်ကြားပေးထားပါတယ်။
          {"\n\n"}
          Lesson တစ်ခန်းချင်းစီဟာ Video + Practical Project ပုံစံနဲ့  
          စုစည်းထားပြီး Game၊ Story၊ Animation တွေကို ကိုယ်တိုင်  
          ဖန်တီးနိုင်အောင် လမ်းညွှန်ပေးပါတယ်။
        </Text>
      </View>

      {/* WHAT YOU WILL LEARN */}
      <View className="px-6 py-4">
        <Text className="text-xl font-semibold mb-4">
          🧠 What You Will Learn
        </Text>

        <View className="space-y-3">
          <Text className="text-gray-700">✅ Programming Concept အခြေခံများ</Text>
          <Text className="text-gray-700">✅ Logic & Problem Solving Skills</Text>
          <Text className="text-gray-700">✅ Animation & Game Design</Text>
          <Text className="text-gray-700">✅ Creative Thinking & Confidence</Text>
          <Text className="text-gray-700">✅ Next Level Programming Path</Text>
        </View>
      </View>

      {/* COURSE STRUCTURE */}
      <View className="px-6 py-6">
        <Text className="text-xl font-semibold mb-3">
          🗂 Course Structure
        </Text>
        <Text className="text-gray-700 leading-6">
          📌 Total Lessons – 32 Lessons{"\n"}
          📌 Level – Beginner{"\n"}
          📌 Type – Video + Hands-on Practice{"\n"}
          📌 Language – Easy & Simple Explanation{"\n"}
          📌 Price – 100% FREE 🎉
        </Text>
      </View>

      {/* CTA */}
      <View className="px-6 py-8">
        <Pressable
          onPress={() => navigation?.navigate("Lessons")}
          className="bg-indigo-600 py-4 rounded-xl"
        >
          <Text className="text-white text-center text-lg font-semibold">
            🚀 Start Learning Now
          </Text>
        </Pressable>

        <Text className="text-center text-gray-500 mt-4 text-sm">
          No experience required • Learn at your own pace
        </Text>
      </View>

    </ScrollView>
  );
};

export default ScratchOverview;
