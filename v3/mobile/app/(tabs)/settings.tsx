import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, Switch, ScrollView, Alert } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';
import { useAuthStore } from '@/store/useAuthStore';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme as 'light' | 'dark'];
  const { user, token } = useAuthStore();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

  const handleTogglePremium = async () => {
    try {
      const response = await fetch('http://10.0.2.2:3000/users/premium', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        Alert.alert('نجاح', 'تم تحديث حالتك! يرجى إعادة التشغيل لتفعيل كافة المزايا.');
      }
    } catch (e) {
      Alert.alert('خطأ', 'فشل الاتصال بالخادم');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>الإعدادات</Text>
      
      {/* Premium Banner */}
      <View style={[styles.premiumBanner, { backgroundColor: user?.is_premium ? '#ff9500' : theme.primary }]}>
        <Text style={styles.premiumTitle}>
          {user?.is_premium ? 'أنت عضو مميز 🌟' : 'احصل على المميزات الرهيبة!'}
        </Text>
        <Text style={styles.premiumDesc}>
          {user?.is_premium ? 'شكراً لدعمك لنا. استمتع بتجربة بلا حدود.' : 'خلفيات حصرية، تشفير متقدم، ودعم متميز.'}
        </Text>
        {!user?.is_premium && (
          <Pressable style={styles.premiumButton} onPress={handleTogglePremium}>
            <Text style={styles.premiumButtonText}>اشترك الآن</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.tint }]}>الحساب</Text>
        <Pressable style={styles.item}>
          <Text style={{ color: theme.text }}>الملف الشخصي</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.tint }]}>المظهر</Text>
        <View style={styles.itemBetween}>
          <Text style={{ color: theme.text }}>الوضع الليلي</Text>
          <Switch 
            value={isDarkMode} 
            onValueChange={setIsDarkMode} 
            trackColor={{ false: '#767577', true: theme.primary }}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.tint }]}>عام</Text>
        <Pressable style={styles.item}>
          <Text style={{ color: theme.text }}>الخصوصية والأمان</Text>
        </Pressable>
        <Pressable style={styles.item}>
          <Text style={{ color: theme.error }}>تسجيل الخروج</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'right',
    margin: 20,
    marginTop: 60,
  },
  premiumBanner: {
    margin: 20,
    padding: 20,
    borderRadius: 20,
    alignItems: 'flex-end',
  },
  premiumTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  premiumDesc: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    textAlign: 'right',
    marginBottom: 15,
  },
  premiumButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  premiumButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'right',
  },
  item: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    alignItems: 'flex-end',
  },
  itemBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  }
});
