import React from "react"
import { Text } from "react-native"
import { Card } from "./Card"

type StatCardProps = {
  label: string
  value: string | number
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <Card>
      <Text className="text-slate-400 text-sm">{label}</Text>
      <Text className="text-2xl font-bold text-white mt-1">
        {value}
      </Text>
    </Card>
  )
}
