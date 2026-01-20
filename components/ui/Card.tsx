import { View } from "react-native"
import type { ReactNode } from "react"

type Props = {
  children?: ReactNode
}

export function Card({ children }: Props) {
  return (
    <View className="bg-card border border-border rounded-xl p-4">
      {children}
    </View>
  )
}
