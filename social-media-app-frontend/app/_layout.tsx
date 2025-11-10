import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import ToastProvider from "../components/ToastProvider";
import { store } from "../store";

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>

    <Provider store={store}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="modals/profile-edit" options={{ presentation: 'modal', headerShown: false }} />
          <Stack.Screen name="modals/post-details" options={{ presentation: 'modal', headerShown: false, animation: "fade", }} />
        </Stack>
        <StatusBar style="auto" />
        <ToastProvider />
      </ThemeProvider>
    </Provider>
    </SafeAreaProvider>
  );
}
