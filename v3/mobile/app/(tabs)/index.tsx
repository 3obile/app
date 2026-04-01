import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';
import StoriesBar from '@/components/StoriesBar';
import { useAuthStore } from '@/store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';

interface Room {
  id: string;
  name: string;
  type: string;
  created_at: string;
  last_message?: string;
  unread_count?: number;
}

export default function ChatListScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme as 'light' | 'dark'];
  const { token, user } = useAuthStore();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRooms = async () => {
    try {
      const response = await fetch('http://10.0.2.2:3000/rooms', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setRooms(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRooms();
    setRefreshing(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.push('/create-room')} style={styles.headerIcon}>
          <Ionicons name="create-outline" size={28} color={theme.primary} />
        </Pressable>
        <Text style={[styles.title, { color: theme.text }]}>الرسائل</Text>
        <Pressable onPress={() => router.push('/settings')} style={styles.headerIcon}>
          <Ionicons name="settings-outline" size={28} color={theme.text} />
        </Pressable>
      </View>
      
      <FlatList
        data={rooms.filter(r => r.type === 'private')} // Only 1v1 for now
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<StoriesBar />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}
        renderItem={({ item }) => (
          <Pressable 
            style={styles.chatItem} 
            onPress={() => router.push({ pathname: '/chat/[id]', params: { id: item.id } })}
          >
            <View style={[styles.avatarPlaceholder, { backgroundColor: theme.primary + '15' }]}>
              <Text style={{ color: theme.primary, fontWeight: 'bold', fontSize: 20 }}>
                {item.name ? item.name[0].toUpperCase() : '?'}
              </Text>
              {item.unread_count ? (
                <View style={[styles.unreadBadge, { backgroundColor: theme.primary }]}>
                   <Text style={styles.unreadText}>{item.unread_count}</Text>
                </View>
              ) : null}
            </View>
            <View style={styles.chatInfo}>
              <View style={styles.chatHeader}>
                <Text style={styles.time}>
                  {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                <Text style={[styles.chatName, { color: theme.text }]} numberOfLines={1}>
                  {item.name || 'مستخدم'}
                </Text>
              </View>
              <View style={styles.lastMessageRow}>
                 {item.type === 'private' && <Ionicons name="lock-closed" size={12} color={theme.placeholder} style={{marginLeft: 4}} />}
                 <Text style={[styles.lastMessage, { color: theme.placeholder }]} numberOfLines={1}>
                  {item.last_message || 'لا توجد رسائل بعد'}
                </Text>
              </View>
            </View>
          </Pressable>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  headerIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(0,0,0,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
  },
  chatItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginLeft: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  unreadBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  unreadText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'right',
  },
  lastMessageRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    textAlign: 'right',
    flex: 1,
  },
  time: {
    fontSize: 12,
    color: '#94a3b8',
  }
});
