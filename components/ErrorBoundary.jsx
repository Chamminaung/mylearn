import React from "react";
import { View, Text, Pressable } from "react-native";

export class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-xl font-semibold text-red-600">
            Something went wrong
          </Text>

          <Text className="mt-2 text-center text-gray-600">
            {this.state.error?.message}
          </Text>

          <Pressable
            className="mt-6 rounded-lg bg-blue-600 px-4 py-2"
            onPress={() => this.setState({ hasError: false })}
          >
            <Text className="text-white">Try Again</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}
