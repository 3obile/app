import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import { register as registerApi } from '@/services/auth';
import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme as 'light' | 'dark'];

  const handleRegister = async () => {
    if (!email || !password || !fullName) return Alert.alert('خطأ', 'يرجى ملء جميع الحقول');
    
    setLoading(true);
    try {
      const data = await registerApi({ email, password, full_name: fullName });
      await setAuth(data.user, data.access_token);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ أثناء التسجيل');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>إنشاء حساب</Text>
      
      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.tint }]}
        placeholder="الاسم الكامل"
        placeholderTextColor="#999"
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.tint }]}
        placeholder="البريد الإلكتروني"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.tint }]}
        placeholder="كلمة المرور"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable 
        style={[styles.button, { backgroundColor: theme.primary }]} 
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>تسجيل</Text>
        )}
      </Pressable>

      <Pressable onPress={() => router.back()}>
        <Text style={[styles.link, { color: theme.tint }]}>لديك حساب بالفعل؟ سجل دخول</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'right',
    marginBottom: 40,
  },
  input: {
    height: 55,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    textAlign: 'right',
  },
  button: {
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  link: {
    marginTop: 25,
    textAlign: 'center',
    fontWeight: '600',
  }
});
