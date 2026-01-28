import { ErrorBoundary } from "@/components/ErrorBoundary";
import Header from "@/components/Header";
import { AlertProvider } from "@/context/AlertContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import "../global.css";

export default function RootLayout() {
  const insets = useSafeAreaInsets();

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingTop: insets.top }}>
          <AlertProvider>
            <StatusBar style="dark" backgroundColor="#fff" />

            <Stack screenOptions={{ header: () => <Header /> }}>
              <Stack.Screen name="(home)" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="courseDetail/[id]" />
              <Stack.Screen name="lessons/[id]" />
              <Stack.Screen
                name="pay/[id]"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="quizs/[id]" />
            </Stack>

          </AlertProvider>
        </View>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
