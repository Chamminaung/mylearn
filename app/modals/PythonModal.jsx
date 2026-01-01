import React from 'react';
import { ScrollView, Text, View } from 'react-native';

export default function PythonCourseOverview() {
  return (
    <ScrollView className="flex-1 bg-gray-900 p-4">
      <Text className="text-3xl font-bold text-yellow-400 mb-4">
        🐍 Python Programming Complete Course – Full Overview
      </Text>

      <Text className="text-gray-200 mb-4 leading-relaxed">
        ဒီ Python Course ဟာ Programming ကို လုံးဝမသိသေးတဲ့ Beginner ကနေ
        Practical Application တစ်ခုကို ကိုယ်တိုင် တည်ဆောက်နိုင်တဲ့ အဆင့်အထိ
        တဖြည်းဖြည်း တက်သွားနိုင်အောင် စနစ်တကျ ဒီဇိုင်းလုပ်ထားတဲ့ သင်ခန်းစာစုစည်းမှုကြီး ဖြစ်ပါတယ်။
      </Text>

      <Text className="text-gray-200 mb-4 leading-relaxed">
        သင်ခန်းစာပေါင်း 124 ခန်း ပါဝင်ပြီး
        {"\n"}👉 Concept
        {"\n"}👉 Coding Practice
        {"\n"}👉 Real-world Usage
        {"\n"}👉 GUI App & Installer ထုတ်ခြင်း
        {"\n"}အထိ အပြည့်အစုံ လေ့လာနိုင်ပါတယ်။
      </Text>

      {/* Section 1 */}
      <Text className="text-xl font-semibold text-white mt-4 mb-2">
        🔰 အပိုင်း (၁) – Python Environment & Setup (Lesson 001 – 008)
      </Text>
      <Text className="text-gray-200 mb-4 leading-relaxed">
        ဒီအပိုင်းမှာ
        {"\n"}• Python ဆိုတာဘာလဲ
        {"\n"}• Python ကို ဘယ်လိုအသုံးပြုမလဲ
        {"\n"}• Computer မှာ Python Environment ကို မှန်မှန်ကန်ကန် Install လုပ်နည်း
        {"\n"}• Python IDLE (Shell Mode / Edit Mode) ကို အသုံးပြုပုံ
        {"\n\n"}အစရှိတာတွေကို လုံးဝ Beginner နားလည်အောင် သေချာရှင်းပြပေးထားပါတယ်။
        {"\n\n"}👉 Programming ကို စတင်မယ့်သူအတွက် အရေးကြီးဆုံး အခြေခံအုတ်မြစ်
      </Text>

      {/* Section 2 */}
      <Text className="text-xl font-semibold text-white mt-4 mb-2">
        🧠 အပိုင်း (၂) – Python Basic Concepts (Lesson 009 – 023)
      </Text>
      <Text className="text-gray-200 mb-4 leading-relaxed">
        ဒီအပိုင်းမှာ Python ရဲ့ အခြေခံ Concept တွေဖြစ်တဲ့
        {"\n"}• Statement & Expression
        {"\n"}• WhiteSpace, Comment
        {"\n"}• print()
        {"\n"}• Data Type & Value
        {"\n"}• Type Conversion
        {"\n"}• Error & Debugging
        {"\n"}• Operator (Arithmetic, Logical, Relational, Assignment, Bitwise…)
        {"\n"}• Operator Precedence
        {"\n\n"}တွေကို Example များစွာနဲ့ လေ့လာရမှာဖြစ်ပါတယ်။
        {"\n\n"}👉 Programming Logic ကို စနစ်တကျ စဉ်းစားတတ်လာအောင် လေ့ကျင့်ပေးတဲ့ အပိုင်း
      </Text>

      {/* Section 3 */}
      <Text className="text-xl font-semibold text-white mt-4 mb-2">
        🧩 အပိုင်း (၃) – Function & Module (Lesson 024 – 032)
      </Text>
      <Text className="text-gray-200 mb-4 leading-relaxed">
        ဒီအပိုင်းမှာ
        {"\n"}• Function ဆိုတာဘာလဲ
        {"\n"}• Function Create လုပ်နည်း
        {"\n"}• Parameter, Argument
        {"\n"}• Return Value
        {"\n"}• Global / Local Variable
        {"\n"}• Module & import
        {"\n\n"}တွေကို လေ့လာပြီး
        {"\n"}👉 Reusable Code ရေးတတ်လာအောင် လေ့ကျင့်ပေးပါတယ်။
      </Text>

      {/* Section 4 */}
      <Text className="text-xl font-semibold text-white mt-4 mb-2">
        🔀 အပိုင်း (၄) – Decision & Looping (Lesson 033 – 043)
      </Text>
      <Text className="text-gray-200 mb-4 leading-relaxed">
        ဒီအပိုင်းမှာ
        {"\n"}• if / elif / else
        {"\n"}• Decision Combination
        {"\n"}• for loop / while loop
        {"\n"}• range()
        {"\n"}• break / continue / pass
        {"\n\n"}တွေကို အသုံးပြုပြီး
        {"\n"}👉 Program Flow ကို ထိန်းချုပ်နိုင်အောင် လေ့လာရပါမယ်။
      </Text>

      {/* Section 5 */}
      <Text className="text-xl font-semibold text-white mt-4 mb-2">
        ⚠️ အပိုင်း (၅) – Error & Exception Handling (Lesson 044 – 056)
      </Text>
      <Text className="text-gray-200 mb-4 leading-relaxed">
        ဒီအပိုင်းက Beginner များ အရမ်းကြောက်တတ်တဲ့ Error တွေကို မကြောက်တော့အောင် သင်ပေးထားတဲ့ အပိုင်းပါ။
        {"\n"}• Exception ဆိုတာဘာလဲ
        {"\n"}• try / except / else / finally
        {"\n"}• Multi Exception
        {"\n"}• raise Exception
        {"\n"}• Custom Exception
        {"\n\n"}👉 Professional Programmer တစ်ယောက်လို Error ကို ကိုင်တွယ်နိုင်လာအောင်
      </Text>

      {/* Section 6 */}
      <Text className="text-xl font-semibold text-white mt-4 mb-2">
        📦 အပိုင်း (၆) – String & Sequence Data Types (Lesson 060 – 076)
      </Text>
      <Text className="text-gray-200 mb-4 leading-relaxed">
        ဒီအပိုင်းမှာ
        {"\n"}• String Structure
        {"\n"}• String Manipulation & Functions
        {"\n"}• List, Tuple, Set, Dictionary
        {"\n"}• Stack, Queue, Deque
        {"\n\n"}တွေကို လေ့လာပြီး
        {"\n"}👉 Data ကို ထိထိရောက်ရောက် ကိုင်တွယ်နိုင်လာအောင် သင်ပေးထားပါတယ်။
      </Text>

      {/* Section 7 */}
      <Text className="text-xl font-semibold text-white mt-4 mb-2">
        🧱 အပိုင်း (၇) – Object Oriented Programming (Lesson 077 – 086)
      </Text>
      <Text className="text-gray-200 mb-4 leading-relaxed">
        ဒီအပိုင်းမှာ
        {"\n"}• Class & Object
        {"\n"}• Constructor
        {"\n"}• Instance / Class Variable
        {"\n"}• Inheritance
        {"\n"}• Polymorphism
        {"\n\n"}တွေကို လေ့လာပြီး
        {"\n"}👉 Real-world Application တွေအတွက် Structure ကောင်းကောင်းရေးတတ်လာအောင် လမ်းညွှန်ပေးပါတယ်။
      </Text>

      {/* Section 8 */}
      <Text className="text-xl font-semibold text-white mt-4 mb-2">
        📁 အပိုင်း (၈) – File Handling & CSV (Lesson 090 – 100)
      </Text>
      <Text className="text-gray-200 mb-4 leading-relaxed">
        ဒီအပိုင်းမှာ
        {"\n"}• File open / read / write
        {"\n"}• File Mode (r, w, a)
        {"\n"}• CSV File Create / Read / Update / Delete
        {"\n\n"}👉 Data သိမ်းဆည်းခြင်း၊ ပြန်ဖတ်ခြင်းတွေကို လက်တွေ့အသုံးချနိုင်လာပါမယ်
      </Text>

      {/* Section 9 */}
      <Text className="text-xl font-semibold text-white mt-4 mb-2">
        🖥️ အပိုင်း (၉) – GUI with Tkinter (Lesson 101 – 117)
      </Text>
      <Text className="text-gray-200 mb-4 leading-relaxed">
        ဒီအပိုင်းမှာ
        {"\n"}• Tkinter Intro
        {"\n"}• Label, Button, Entry, Listbox
        {"\n"}• RadioButton, CheckButton
        {"\n"}• Image in UI
        {"\n"}• Layout Design
        {"\n\n"}👉 Python နဲ့ Desktop Application ကို ကိုယ်တိုင် UI ဆွဲနိုင်လာပါမယ်
      </Text>

      {/* Section 10 */}
      <Text className="text-xl font-semibold text-white mt-4 mb-2">
        🚀 အပိုင်း (၁၀) – Application Build & Installer (Lesson 118 – 124)
      </Text>
      <Text className="text-gray-200 mb-4 leading-relaxed">
        ဒီနောက်ဆုံးအပိုင်းမှာ
        {"\n"}• cx_Freeze Install
        {"\n"}• setup.py Create
        {"\n"}• Installer Build
        {"\n"}• App ကို End-user သုံးနိုင်အောင် ထုတ်နည်း
        {"\n\n"}👉 Python Project တစ်ခုကို Software တစ်ခုအဖြစ် ပြီးစီးအောင် လုပ်နိုင်တဲ့ အဆင့်
      </Text>

      {/* Outcomes */}
      <Text className="text-xl font-semibold text-white mt-4 mb-2">
        🎯 ဒီ Course ပြီးသွားရင်…
      </Text>
      <Text className="text-gray-200 mb-8 leading-relaxed">
        ✔ Python Basic → Advanced Concept နားလည်လာမယ်
        {"\n"}✔ Logic & Problem Solving တိုးတက်မယ်
        {"\n"}✔ Desktop Application ကို ကိုယ်တိုင်ရေးနိုင်မယ်
        {"\n"}✔ Real Project တစ်ခုကို Installer အထိ ထုတ်နိုင်မယ်
      </Text>
    </ScrollView>
  );
}
