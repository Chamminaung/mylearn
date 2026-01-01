import { NavigationContainer } from '@react-navigation/native';
import { TailwindProvider } from 'nativewind';
import { AuthProvider } from './context/AuthContext';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <TailwindProvider>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </TailwindProvider>
  );
}
