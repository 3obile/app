import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';

export default function CallScreen() {
  const { id, type } = useLocalSearchParams(); // type: 'voice' | 'video'
  const [callStatus, setCallStatus] = useState('جاري الاتصال...');
  const { user } = useAuthStore();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme as 'light' | 'dark'];
  const router = useRouter();

  useEffect(() => {
    // In a real implementation, this is where we'd initialize WebRTC PeerConnection
    const timer = setTimeout(() => {
      setCallStatus('متصل');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleEndCall = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#121212' }]}>
      <View style={styles.header}>
        <Text style={styles.statusText}>{callStatus}</Text>
        <Text style={styles.userName}>{id === '1' ? 'أحمد محمد' : 'مستخدم Sawalef'}</Text>
      </View>

      <View style={styles.videoPlaceholder}>
        {type === 'video' ? (
          <View style={styles.videoBox}>
            <Text style={{ color: '#fff' }}>[كاميرا الفيديو قيد التشغيل]</Text>
          </View>
        ) : (
          <View style={styles.avatarLarge}>
             <Text style={{ fontSize: 40 }}>👤</Text>
          </View>
        )}
      </View>

      <View style={styles.controls}>
        <Pressable style={styles.iconButton}>
           <Text style={{ fontSize: 24 }}>🔇</Text>
        </Pressable>
        <Pressable style={[styles.iconButton, { backgroundColor: '#ff3b30' }]} onPress={handleEndCall}>
           <Text style={{ fontSize: 24 }}>📞</Text>
        </Pressable>
        <Pressable style={styles.iconButton}>
           <Text style={{ fontSize: 24 }}>🔊</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  statusText: {
    color: '#aaa',
    fontSize: 16,
    marginBottom: 10,
  },
  userName: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoBox: {
    width: '90%',
    height: 400,
    backgroundColor: '#333',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLarge: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 50,
    paddingHorizontal: 20,
  },
  iconButton: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
