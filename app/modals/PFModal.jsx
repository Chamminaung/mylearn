import { View, Text, ScrollView } from "react-native";

export default function PFOverview() {
  return (
    <ScrollView className="flex-1 bg-white px-4 py-6">
      {/* TITLE */}
      <Text className="text-2xl font-bold text-gray-900 mb-3">
        🎓 Free Programming Foundation Course
      </Text>

      <Text className="text-base text-gray-700 mb-6 leading-6">
        ဒီ Free Course ဟာ Programming ကို လုံးဝမသိသေးတဲ့ Beginner များကနေ
        နည်းပညာအခြေခံ ခိုင်မာတဲ့ Programmer တစ်ယောက် ဖြစ်လာအောင်
        တဖြည်းဖြည်း တက်သွားနိုင်ဖို့ ဒီဇိုင်းလုပ်ထားတဲ့ သင်ခန်းစာစုစည်းမှု ဖြစ်ပါတယ်။
      </Text>

      <Text className="text-base text-gray-700 mb-6 leading-6">
        အခြေခံ Concept → Practice → Thinking Style → Advanced Topics ဆိုတဲ့
        လမ်းကြောင်းနဲ့ သင်ကြားထားတာကြောင့် ဘာကြောင့် ဒီလိုရေးရတာလဲ၊
        ဘယ်လိုစဉ်းစားရမလဲ ဆိုတာကို နားလည်လာပါလိမ့်မယ်။
      </Text>

      {/* MODULE 1 */}
      <Module
        title="📘 Module 1: Programming Fundamentals"
        lessons="Lesson 001 – 006"
        description={[
          "Programming ဆိုတာဘာလဲ",
          "Computer က Program ကို ဘယ်လိုနားလည်သလဲ",
          "Programming Environment ပြင်ဆင်နည်း",
          "JavaScript ကို ဘာကြောင့် သင်ရတာလဲ",
          "ပထမဆုံး Program ကို ကိုယ်တိုင်ရေးနိုင်အောင် သင်ပေးထားပါတယ်",
        ]}
        goal="🎯 Goal – Code ကို ကြောက်စရာမလိုဘဲ စရေးနိုင်လာဖို့"
      />

      {/* MODULE 2 */}
      <Module
        title="🧱 Module 2: Basic Building Blocks"
        lessons="Lesson 007 – 016"
        description={[
          "Input ဆိုတာဘာလဲ",
          "Variable ရဲ့ အရေးပါမှု",
          "Data Type (Number, String)",
          "Operators (Arithmetic, Assignment)",
          "Comment နဲ့ White Space ရဲ့ အရေးပါမှု",
        ]}
        goal="👉 Code ကို ဖတ်လည်းနားလည်၊ ရေးလည်းရေးနိုင်လာမယ်"
      />

      {/* MODULE 3 */}
      <Module
        title="🔀 Module 3: Decision Making & Logic"
        lessons="Lesson 017 – 020"
        description={[
          "Conditional Code concept",
          "if / else / else if",
          "Comparison & Logical Operators",
          "switch statement အသုံးပြုနည်း",
        ]}
        goal="🧠 Programming Logic ကို စတင်တည်ဆောက်လာမယ်"
      />

      {/* MODULE 4 */}
      <Module
        title="🧩 Module 4: Functions & Code Structure"
        lessons="Lesson 021 – 025"
        description={[
          "Function concept",
          "Function create & call",
          "Parameters, arguments, return value",
          "Variable Scope",
          "File ခွဲရေးတဲ့ Concept",
        ]}
        goal="🎯 Clean & Reusable Code ကို နားလည်လာမယ်"
      />

      {/* MODULE 5 */}
      <Module
        title="🔁 Module 5: Loops & Iteration"
        lessons="Lesson 026 – 028"
        description={[
          "Iteration concept",
          "while loop",
          "for & do while loop",
        ]}
        goal="👉 Program နဲ့ အလုပ်ကို အလိုအလျောက်လုပ်နိုင်လာမယ်"
      />

      {/* MODULE 6 */}
      <Module
        title="🧵 Module 6: Strings & Arrays"
        lessons="Lesson 029 – 035"
        description={[
          "String concatenation & functions",
          "Regular Expression အခြေခံ",
          "Array concept & iteration",
          "အခြား Language တွေမှာ Array သုံးပုံ",
        ]}
        goal="📦 Real-world Data Handling ကို နားလည်လာမယ်"
      />

      {/* MODULE 7 */}
      <Module
        title="✍️ Module 7: Programming Thinking & Style"
        lessons="Lesson 036 – 038"
        description={[
          "Programming Style Guidelines",
          "Pseudocode",
          "Input / Output & Data Persistence",
        ]}
        goal="🧠 Code မရေးခင် စဉ်းစားတတ်လာမယ်"
      />

      {/* MODULE 8 */}
      <Module
        title="🌐 Module 8: DOM & Event Driven Programming"
        lessons="Lesson 039 – 041"
        description={[
          "DOM ထဲက Data ဖတ်ရေးနည်း",
          "Event driven programming",
          "File Input / Output",
        ]}
        goal="👉 User interaction ပါတဲ့ Program တွေကို စလုပ်နိုင်လာမယ်"
      />

      {/* MODULE 9 */}
      <Module
        title="🐞 Module 9: Debugging & Error Handling"
        lessons="Lesson 042 – 045"
        description={[
          "Debugging concept",
          "Code trace လုပ်နည်း",
          "Error message ဖတ်နည်း",
          "Debugger အသုံးပြုနည်း",
        ]}
        goal="🛠️ Bug တွေကို မကြောက်တော့ဘူး"
      />

      {/* MODULE 10 */}
      <Module
        title="🧱 Module 10: Object-Oriented Programming"
        lessons="Lesson 046 – 048"
        description={[
          "OOP concept",
          "Class & Object",
          "OOP review",
        ]}
        goal="🎯 Real application structure ကို နားလည်လာမယ်"
      />

      {/* MODULE 11 */}
      <Module
        title="🚀 Module 11: Advanced Concepts & Languages Overview"
        lessons="Lesson 049 – 059"
        description={[
          "Memory management",
          "Algorithms introduction",
          "Multithreading",
          "Programming Languages overview",
          "Libraries & Frameworks",
        ]}
        goal="🌍 နောက်ဘာကို ဆက်လေ့လာသင့်လဲ ကို သိလာမယ်"
      />

      {/* WHO SHOULD JOIN */}
      <View className="mt-8 p-4 bg-green-50 rounded-xl">
        <Text className="text-lg font-bold text-green-800 mb-2">
          ✅ ဒီ Free Course ကို ဘယ်သူတွေ တက်သင့်လဲ?
        </Text>
        <Text className="text-base text-green-700 leading-6">
          ✔ Programming ကို အစကနေ စတင်ချင်သူ{"\n"}
          ✔ Computer Science အခြေခံ မရှိသေးသူ{"\n"}
          ✔ Web / Mobile / Software Development ဆက်လေ့လာချင်သူ{"\n"}
          ✔ Logic နဲ့ Thinking Skill တိုးတက်ချင်သူ
        </Text>
      </View>
    </ScrollView>
  );
}

function Module({ title, lessons, description, goal }) {
  return (
    <View className="mb-6 p-4 bg-gray-50 rounded-xl">
      <Text className="text-lg font-bold text-gray-900">
        {title} ({lessons})
      </Text>

      <View className="mt-2 space-y-1">
        {description.map((item, index) => (
          <Text key={index} className="text-base text-gray-700">
            • {item}
          </Text>
        ))}
      </View>

      {goal && (
        <Text className="mt-3 text-sm font-semibold text-indigo-700">
          {goal}
        </Text>
      )}
    </View>
  );
}
