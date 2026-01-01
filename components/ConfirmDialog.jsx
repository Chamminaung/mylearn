import { Modal, View, Text, Pressable } from "react-native";

export default function ConfirmDialog({
  visible,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = "Yes",
  cancelText = "Cancel",
  destructive = false,
}) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 bg-black/40 items-center justify-center">
        <View className="w-[90%] max-w-sm rounded-2xl bg-white p-6 shadow-xl">
          
          <Text className="text-lg font-semibold text-gray-900">
            {title}
          </Text>

          {description && (
            <Text className="mt-2 text-gray-600">
              {description}
            </Text>
          )}

          <View className="mt-6 flex-row justify-end space-x-3">
            <Pressable
              onPress={onCancel}
              className="rounded-lg px-4 py-2 bg-gray-100"
            >
              <Text className="text-gray-700">
                {cancelText}
              </Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              className={`rounded-lg px-4 py-2 ${
                destructive ? "bg-red-600" : "bg-blue-600"
              }`}
            >
              <Text className="text-white font-medium">
                {confirmText}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
