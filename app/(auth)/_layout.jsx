import { Stack } from "expo-router";
import { useAuth } from '../../context/AuthContext';

export default function AuthLayout() {
  const { user } = useAuth();
  
  return <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" />
    <Stack.Screen name="Register" />
  </Stack>;
}