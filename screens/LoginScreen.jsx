import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  async function handleLogin() {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      await login(token, user);
    } catch (err) {
      console.log(err);
      alert('Login failed');
    }
  }

  return (
    <View className="flex-1 justify-center p-6 bg-gray-50">
      <Text className="text-3xl font-bold mb-6 text-center text-blue-600">Login</Text>

      <Text className="mb-1 text-gray-700">Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        className="border border-gray-300 rounded-lg p-3 mb-4 bg-white"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text className="mb-1 text-gray-700">Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="********"
        className="border border-gray-300 rounded-lg p-3 mb-4 bg-white"
        secureTextEntry
      />

      <Pressable
        onPress={handleLogin}
        className="bg-blue-600 py-3 rounded-lg mb-4"
      >
        <Text className="text-white text-center font-semibold">Login</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('Register')}>
        <Text className="text-center text-blue-600">Don&#39;t have an account? Register</Text>
      </Pressable>
    </View>
  );
}
