import { AlertProvider } from "@/context/AlertContext";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "../global.css";
//import { AdminProvider } from "@/context/AdminContext";
import { router } from "expo-router";

export default function RootLayout() {
  const insets = useSafeAreaInsets();

  return (
    <ErrorBoundary>

    <GestureHandlerRootView style={{ flex: 1 }}>
      <AlertProvider>  
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(home)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="courseDetail/[id]" />
        <Stack.Screen name="lessons/[id]" />
        <Stack.Screen name="quizs/[id]" />
        <Stack.Screen name="pay/[id]" />
      </Stack>
      </AlertProvider>
    </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
