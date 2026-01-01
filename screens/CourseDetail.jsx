import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";

    
const lessonStages = [
  {
    stage: "အဆင့် ၁ – Scratch ကို စတင်သုံးခြင်း (Intro & Setup)",
    lessons: [
      { title: "Lesson 001: Scratch Programming Intro", description: "Scratch အကြောင်း၊ programming concept အခြေခံများကို ရှင်းပြပြီး interface ကို မိတ်ဆက်ပေးပါတယ်။" },
      { title: "Lesson 002: Getting Start", description: "Scratch မှာ project များဖန်တီးနည်း၊ basic navigation နဲ့ workspace setup ကို သင်ကြားပါတယ်။" },
    ],
  },
  {
    stage: "အဆင့် ၂ – Scratch Interface & Basic Controls",
    lessons: [
      { title: "Lesson 003: Using Green Flag", description: "Program start နဲ့ run ချင်း concept ကို သင်ကြားသည်။" },
      { title: "Lesson 004: Change Background and Add Character", description: "Stage & sprite (character) များ add/change နည်းကို လေ့လာနိုင်သည်။" },
      { title: "Lesson 005: Say Something", description: "Sprite များကို message display စေခြင်း၊ basic interaction concept နဲ့ logic လေ့လာခြင်း။" },
    ],
  },
  {
    stage: "အဆင့် ၃ – Project Management & Key Concepts",
    lessons: [
      { title: "Lesson 006: Title Project Name Save Project", description: "Project save နည်း၊ naming conventions, file management ကို သင်ကြားပေးသည်။" },
      { title: "Lesson 007: Key points", description: "Scratch ရဲ့ important blocks, commands, best practices အကြောင်းကို ရှင်းပြသည်။" },
      { title: "Lesson 008: User Interface", description: "UI လေ့လာခြင်း၊ menu, toolbar, stage interaction များကို အကျယ်သိရှိနိုင်သည်။" },
    ],
  },
  {
    stage: "အဆင့် ၄ – Motion & Animation",
    lessons: [
      { title: "Lesson 009: Move Cat", description: "Sprite movement basics, direction & coordinates concept သင်ကြားသည်။" },
      { title: "Lesson 010: Hop Block", description: "Jump motion သင်ကြားခြင်း၊ sequence motion logic လေ့လာနိုင်သည်။" },
      { title: "Lesson 011: Turn Cat", description: "Rotation & angle concepts နဲ့ control block အသုံးပြုမှု သင်ယူပါ။" },
    ],
  },
  {
    stage: "အဆင့် ၅ – Interaction & Control",
    lessons: [
      { title: "Lesson 012: Hide and Seek", description: "Visibility, show/hide blocks အသုံးပြုခြင်းကို လေ့ကျင့်ပါ။" },
      { title: "Lesson 013: Repeat and Repeat Forever", description: "Loops & repetition logic, infinite loop concept သင်ယူပါ။" },
      { title: "Lesson 018: Set Speed Block", description: "Timing & event control concept သင်ယူပါ။" },
      { title: "Lesson 019: Wait", description: "Pause/wait block ကို သုံးပြီး event sequencing လေ့ကျင့်ပါ။" },
      { title: "Lesson 020: Wait Your Turn", description: "Concurrency, turn-based control logic နဲ့ timing concept သင်ယူပါ။" },
    ],
  },
  {
    stage: "အဆင့် ၆ – Creative Expression & Storytelling",
    lessons: [
      { title: "Lesson 014: Old MacDonald Farm", description: "Simple animation, sound integration, multi-sprite coordination လေ့ကျင့်ပါ။" },
      { title: "Lesson 015: Scratchjr in Yourself", description: "Scratchjr စွမ်းဆောင်နိုင်မှု နဲ့ idea generation လေ့ကျင့်ခြင်း။" },
      { title: "Lesson 016: Find Your Voice", description: "Interactive storytelling, narration concept ကို သင်ယူပါ။" },
      { title: "Lesson 017: Turn The Page", description: "Page-turn animation concept, interactive storytelling ကို လေ့ကျင့်ပါ။" },
    ],
  },
  {
    stage: "အဆင့် ၇ – Drawing & Painting",
    lessons: [
      { title: "Lesson 021: Paint", description: "Sprite design, custom drawing tools နဲ့ creativity training လေ့ကျင့်ပါ။" },
    ],
  },
  {
    stage: "အဆင့် ၈ – Mini Games & Interactive Projects",
    lessons: [
      { title: "Lesson 025: Pick a Peach", description: "Simple game creation, sprite interaction, scoring logic သင်ယူပါ။" },
      { title: "Lesson 026: Blast OFF!", description: "Game mechanics, motion control, fun interactive project ဖန်တီးပါ။" },
      { title: "Lesson 027: Play Tag!", description: "Player interaction, collision detection, basic game rules သင်ယူပါ။" },
      { title: "Lesson 028: Guess Game", description: "Variables, condition checking, interactive game logic ကို လေ့ကျင့်ပါ။" },
      { title: "Lesson 029: Cat Vs Bird", description: "Sprite interaction, event handling, simple competitive game design သင်ယူပါ။" },
    ],
  },
  {
    stage: "အဆင့် ၉ – Learning from Examples",
    lessons: [
      { title: "Lesson 030: Study Other Projects", description: "Sample projects ကို reverse engineer လုပ်ပြီး idea generation လေ့ကျင့်ပါ။" },
    ],
  },
  {
    stage: "အဆင့် ၁၀ – Next Steps",
    lessons: [
      { title: "Lesson 031: What is Next", description: "Advanced Scratch concept, project ideas, next steps လေ့ကျင့်ပါ။" },
      { title: "Lesson 032: Move to Scratch Programming", description: "Next level learning, paid course or advanced programming transition guide သင်ယူပါ။" },
    ],
  },
];

export default function LessonStages() {
  return (
    <ScrollView className="p-4 bg-gray-100 flex-1">
      {lessonStages.map((stage, idx) => (
        <View key={idx} className="mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-3">{stage.stage}</Text>
          {stage.lessons.map((lesson, lidx) => (
            <TouchableOpacity key={lidx} className="bg-white rounded-xl shadow-md p-4 mb-3">
              <Text className="text-lg font-semibold mb-1">{lesson.title}</Text>
              <Text className="text-gray-700">{lesson.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
      <View className="mt-6 p-4 bg-blue-50 rounded-xl">
        <Text className="text-gray-800">
          💡 Summary: ဒီ free lessons သင်ခန်းစာက Scratch programming ကို အခြေခံမှစပြီး gradually animation, interaction, game creation နဲ့ mini projects ဖန်တီးနိုင်အောင် လမ်းပြထားပါတယ်။ Video tutorials တွေက practical, step-by-step လေ့ကျင့်မှုပါရှိပြီး learners များအတွက် စိတ်ဝင်စားစေမယ်၊ လေ့လာရလွယ်ကူပြီး creative ဖြစ်စေပါတယ်။
        </Text>
      </View>
    </ScrollView>
  );
}
