import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/store/useAuthStore';
import { initiateSocketConnection, subscribeToCalls, joinPersonalRoom } from '@/services/socket';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const { user, token, loadAuth } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      loadAuth();
    }
  }, [loaded]);

  useEffect(() => {
    if (!loaded) return;

    if (user) {
      const setup = async () => {
        await initiateSocketConnection();
        joinPersonalRoom(user.id);
        subscribeToCalls((data) => {
          router.push({
            pathname: '/call/[id]',
            params: { id: data.fromUserId, name: data.fromName, type: 'voice' }
          });
        });
      };
      setup();
    }
    
    if (!user && segments[0] !== 'auth') {
      router.replace('/auth/login');
    } else if (user && segments[0] === 'auth') {
      router.replace('/(tabs)');
    }
  }, [user, segments, loaded, router]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
