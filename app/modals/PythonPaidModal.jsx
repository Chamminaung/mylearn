import React from "react";
import { ScrollView, Text, View } from "react-native";

const modules = [
  {
    icon: "🔰",
    title: "Module 1: Python Setup & Environment",
    lessons: "Lesson 001–009",
    description: "Python ကို စတင်အသုံးပြုဖို့ လိုအပ်တဲ့ အခြေခံအဆင့်များ",
    items: [
      "Python Download & Installation",
      "Python Interpreter စစ်ဆေးနည်း",
      "Programming Intro & Python Overview",
      "Interactive Mode vs Script Mode",
      "IDLE Shell အသုံးပြုပုံ",
    ],
    outcome: "Python ကို စနစ်တကျ install လုပ်ပြီး run လို့ရလာမယ်",
  },
  {
    icon: "🧠",
    title: "Module 2: Python Basics & Syntax",
    lessons: "Lesson 010–014",
    description: "Programming အခြေခံ concept များ",
    items: ["Python Syntax", "Variables & Identifiers Naming Rules", "Keywords", "Object Types Intro"],
    outcome: "Python code ရဲ့ အခြေခံ structure ကို နားလည်မယ်",
  },
  {
    icon: "🔢",
    title: "Module 3: Data Types – Numbers & Operators",
    lessons: "Lesson 015–041",
    description: "Python ရဲ့ numeric system ကို အပြည့်အစုံလေ့လာခြင်း",
    items: [
      "Numbers & Literals",
      "Arithmetic, Comparison, Logical, Bitwise Operators",
      "Operator Precedence",
      "math, cmath, decimal, fractions, random modules",
      "Number Handling & Key Points",
    ],
    outcome: "Calculation တွေကို မှန်ကန်စွာရေးနိုင်မယ်",
  },
  {
    icon: "🔤",
    title: "Module 4: String & Text Processing",
    lessons: "Lesson 042–074",
    description: "Python မှာ text ကို ကိုင်တွယ်တဲ့ နည်းလမ်းအားလုံး",
    items: [
      "String Literal, Index, Slice",
      "String Operators & Escape Characters",
      "Conversion, Search, Padding Functions",
      "Unicode, ASCII, Encode / Decode",
      "print(), input()",
      "format(), f-string (Beginner → Advanced)",
    ],
    outcome: "Text processing ကို professional level နားလည်မယ်",
  },
  {
    icon: "📋",
    title: "Module 5: List, Tuple, Set, Dictionary",
    lessons: "Lesson 075–100",
    description: "Python Collection Data Types အပြည့်အစုံ",
    items: [
      "List create, slice, operators, methods",
      "List Comprehension & Performance",
      "Tuple & List Comparison",
      "Dictionary create, access, methods, comprehension",
      "Set & FrozenSet operations",
      "Practical Examples",
    ],
    outcome: "Data structure ကို ထိရောက်စွာ အသုံးချနိုင်မယ်",
  },
  {
    icon: "🔁",
    title: "Module 6: Control Flow & Loops",
    lessons: "Lesson 101–118",
    description: "Program flow ကို ထိန်းချုပ်နည်း",
    items: [
      "if / elif / else",
      "Nested if",
      "while & for loops",
      "break, continue, pass",
      "range(), enumerate(), zip(), map()",
      "Loop Best Practices",
    ],
    outcome: "Logic ပါတဲ့ program တွေကို ရေးနိုင်မယ်",
  },
  {
    icon: "🧩",
    title: "Module 7: Functions & Advanced Concepts",
    lessons: "Lesson 119–152",
    description: "Python Function အပြည့်အစုံ",
    items: [
      "Function Intro & Examples",
      "Arguments (*args, **kwargs)",
      "Scope & LEGB Rule",
      "Lambda Functions",
      "Iterator & Generator",
      "Decorator",
      "Recursion & Closure",
    ],
    outcome: "Reusable & clean code ရေးနိုင်မယ်",
  },
  {
    icon: "📦",
    title: "Module 8: Modules & Packages",
    lessons: "Lesson 153–174",
    description: "Python project structure နားလည်ခြင်း",
    items: [
      "Module & Package Intro",
      "import styles",
      "__init__.py & __all__",
      "Absolute vs Relative Import",
      "sys, os, time, random, fileinput",
      "Third-party library intro",
    ],
    outcome: "Large project structure ကို စီမံနိုင်မယ်",
  },
  {
    icon: "⚠️",
    title: "Module 9: Exception Handling",
    lessons: "Lesson 175–187",
    description: "Error ကို professional နည်းနဲ့ ကိုင်တွယ်ခြင်း",
    items: ["try / except", "else / finally", "raise & assert", "with & contextmanager", "if vs try"],
    outcome: "Crash မဖြစ်တဲ့ program တွေ ရေးနိုင်မယ်",
  },
  {
    icon: "📂",
    title: "Module 10: File System & I/O",
    lessons: "Lesson 188–210",
    description: "File & OS interaction",
    items: [
      "File system intro",
      "os, pathlib",
      "File read/write modes",
      "seek(), tell()",
      "Pickle & Serialization",
      "shelve database",
    ],
    outcome: "File-based application တွေ ရေးနိုင်မယ်",
  },
  {
    icon: "🗄️",
    title: "Module 11: Database Programming",
    lessons: "Lesson 211–220",
    description: "Python + Database",
    items: [
      "Database intro & types",
      "connect(), cursor(), execute()",
      "insert, update, fetch",
      "Parameter styles",
      "Database summary",
    ],
    outcome: "Database app အခြေခံရေးနိုင်မယ်",
  },
  {
    icon: "📦",
    title: "Module 12: Distribution & Executable",
    lessons: "Lesson 221–226",
    description: "Python program ကို share & deploy လုပ်ခြင်း",
    items: ["setup.py", "build / install commands", "sdist, bdist", "py2exe", "Creating .exe files"],
    outcome: "Python app ကို exe အဖြစ် ပြောင်းနိုင်မယ်",
  },
  {
    icon: "🚀",
    title: "Module 13: Real Projects & Scripts",
    lessons: "Lesson 227–238",
    description: "လက်တွေ့ Project များ",
    items: [
      "Number to Words Project",
      "Custom Module Development",
      "Facebook Downloader Script (Step-by-step)",
    ],
    outcome: "Real-world Python projects ကို ကိုယ်တိုင်ရေးနိုင်မယ်",
  },
];

export default function PythonCourseOutlineExpo() {
  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 26, fontWeight: "bold", marginBottom: 6 }}>🐍 Python Programming Course Outline</Text>
      <Text style={{ fontSize: 14, marginBottom: 16 }}>Beginner → Advanced → Practical Projects</Text>

      {modules.map((m, idx) => (
        <View key={idx} style={{ marginBottom: 20, padding: 16, borderRadius: 16, backgroundColor: "#ffffff", elevation: 3 }}>
          <Text style={{ fontSize: 20, fontWeight: "600" }}>
            {m.icon} {m.title}
          </Text>
          <Text style={{ fontSize: 12, opacity: 0.6 }}>{m.lessons}</Text>
          <Text style={{ marginVertical: 6 }}>{m.description}</Text>

          {m.items.map((item, i) => (
            <Text key={i} style={{ marginLeft: 10 }}>• {item}</Text>
          ))}

          <Text style={{ marginTop: 8, fontWeight: "600" }}>🎯 Outcome: {m.outcome}</Text>
        </View>
      ))}

      <View style={{ padding: 16, borderRadius: 16, backgroundColor: "#eef6ff", marginBottom: 40 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>✅ Course Summary</Text>
        <Text>Total Lessons: 238</Text>
        <Text>Level: Beginner → Advanced</Text>
        <Text>Focus: Strong Python Foundation + Practical Projects</Text>
      </View>
    </ScrollView>
  );
}
