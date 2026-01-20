import { View, Text, Pressable, Platform } from "react-native"
import { router, usePathname } from "expo-router"
import { useState } from "react"
import { Ionicons } from "@expo/vector-icons"

const menu = [
  { label: "Dashboard", path: "/(admin)" },
  { label: "Users", path: "/(admin)/users" },
  { label: "Courses", path: "/(admin)/courses" },
  { label: "Lessons", path: "/(admin)/lessons" },
  { label: "Payments", path: "/(admin)/payments" },
  { label: "Analytics", path: "/(admin)/analytics" },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* ===== Mobile Top Bar ===== */}
      <View className="lg:hidden flex-row items-center justify-between px-4 py-3 border-b border-border bg-background">
        <Text className="text-lg font-bold text-white">
          Admin Panel
        </Text>

        <Pressable onPress={() => setOpen(!open)}>
          <Ionicons name="menu" size={26} color="white" />
        </Pressable>
      </View>

      {/* ===== Overlay (Mobile) ===== */}
      {open && (
        <Pressable
          className="lg:hidden absolute inset-0 bg-black/50 z-40"
          onPress={() => setOpen(false)}
        />
      )}

      {/* ===== Sidebar ===== */}
      <View
        className={`
          fixed lg:static
          top-0 left-0 h-full
          w-64
          bg-background
          border-r border-border
          p-4
          z-50
          transition-transform
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <Text className="text-xl font-bold text-white mb-6">
          Admin Panel
        </Text>

        {menu.map((item) => {
          const active = pathname === item.path

          return (
            <Pressable
              key={item.path}
              onPress={() => {
                router.push(item.path as any)
                setOpen(false)
              }}
              className={`
                py-3 px-3 rounded-lg mb-1
                ${active ? "bg-slate-800" : "hover:bg-slate-800"}
              `}
            >
              <Text
                className={`
                  ${active ? "text-white" : "text-slate-300"}
                `}
              >
                {item.label}
              </Text>
            </Pressable>
          )
        })}
      </View>
    </>
  )
}
