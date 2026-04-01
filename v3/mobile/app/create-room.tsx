import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';
import { useAuthStore } from '@/store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';

interface User {
  id: string;
  full_name: string;
  email: string;
}

export default function StartChatScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme as 'light' | 'dark'];
  const { token, user: currentUser } = useAuthStore();
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://10.0.2.2:3000/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        // Filter out current user
        setUsers(data.filter((u: User) => u.id !== currentUser?.id));
      } catch (e) {
        Alert.alert('خطأ', 'فشل تحميل المستخدمين');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleStartChat = async (targetUser: User) => {
    setLoading(true);
    try {
      const response = await fetch('http://10.0.2.2:3000/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          name: targetUser.full_name, 
          type: 'private',
          members: [targetUser.id] 
        })
      });
      const data = await response.json();
      if (response.ok) {
        router.replace({ pathname: '/chat/[id]', params: { id: data.id } });
      } else {
        Alert.alert('خطأ', 'فشل بدء المحادثة');
        setLoading(false);
      }
    } catch (e) {
      Alert.alert('خطأ', 'فشل الاتصال بالخادم');
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-forward" size={24} color={theme.text} />
        </Pressable>
        <Text style={[styles.title, { color: theme.text }]}>بدء محادثة جديدة</Text>
      </View>

      {loading && users.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable style={styles.userItem} onPress={() => handleStartChat(item)}>
              <View style={[styles.avatar, { backgroundColor: theme.primary + '15' }]}>
                <Text style={{ color: theme.primary, fontWeight: 'bold' }}>
                  {item.full_name[0].toUpperCase()}
                </Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={[styles.userName, { color: theme.text }]}>{item.full_name}</Text>
                <Text style={[styles.userEmail, { color: theme.placeholder }]}>{item.email}</Text>
              </View>
              <Ionicons name="chevron-back" size={20} color={theme.placeholder} />
            </Pressable>
          )}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginRight: 10,
    flex: 1,
    textAlign: 'right',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  userInfo: {
    flex: 1,
    paddingRight: 10,
  },
  userName: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'right',
  },
  userEmail: {
    fontSize: 14,
    textAlign: 'right',
  }
});
