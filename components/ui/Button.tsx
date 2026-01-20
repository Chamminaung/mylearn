import { Pressable, Text } from "react-native"

export function Button({ title, onPress, variant = "default" }: { title: string; onPress?: () => void; variant?: "default" | "outline" }) {
  return (
    <Pressable
      onPress={onPress}
      className={`px-4 py-2 rounded-lg
        ${variant === "outline"
          ? "border border-border"
          : "bg-primary"
        }`}
    >
      <Text className="text-white text-center font-medium">
        {title}
      </Text>
    </Pressable>
  )
}
