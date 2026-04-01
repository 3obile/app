import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Pressable, KeyboardAvoidingView, Platform, Alert, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useChatStore } from '@/store/useChatStore';
import { useAuthStore } from '@/store/useAuthStore';
import { initiateSocketConnection, joinRoom, sendMessage, subscribeToMessages } from '@/services/socket';
import { encryptMessage, decryptMessage } from '@/utils/encryption';
import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';

interface Room {
  name: string;
  members: any[];
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const [text, setText] = useState('');
  const { messages, addMessage } = useChatStore();
  const { user, token } = useAuthStore();
  const [room, setRoom] = useState<any>(null);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme as 'light' | 'dark'];
  const router = useRouter();

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await fetch(`http://10.0.2.2:3000/rooms/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setRoom(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchRoomData();
  }, [id]);

  useEffect(() => {
    let socket;
    const setup = async () => {
      socket = await initiateSocketConnection();
      joinRoom(id as string);
      subscribeToMessages((msg) => {
        addMessage(msg);
      });
    };
    setup();
    return () => {
      // Disconnect or cleanup socket if needed
    };
  }, [id]);

  const handleSend = async () => {
    if (!text.trim()) return;

    // 1. Encrypt message (E2EE)
    const encrypted = await encryptMessage(text, 'placeholder_public_key');

    // 2. Send via Socket
    sendMessage(id as string, encrypted, user.id);

    // 3. Clear input
    setText('');
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      
      // Upload to Backend
      const formData = new FormData();
      formData.append('file', {
        uri: asset.uri,
        name: asset.fileName || 'upload.jpg',
        type: asset.type || 'image/jpeg',
      } as any);

      try {
        const response = await fetch('http://10.0.2.2:3000/media/upload', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${await AsyncStorage.getItem('access_token')}`
          },
        });
        const data = await response.json();
        
        // Send Media Message
        sendMessage(id as string, `media:${data.url}`, user.id);
      } catch (error) {
        Alert.alert('خطأ', 'فشل رفع الملف');
      }
    }
  };

  const handleCall = () => {
    router.push({ pathname: '/call/[id]', params: { id: id as string, type: 'voice' } });
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={[styles.header, { borderBottomColor: 'rgba(0,0,0,0.05)' }]}>
        <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
          <Pressable onPress={() => router.back()} style={{ marginLeft: 15 }}>
            <Ionicons name="arrow-forward" size={24} color={theme.text} />
          </Pressable>
          <View style={[styles.headerAvatar, { backgroundColor: theme.primary + '15' }]}>
             <Text style={{ color: theme.primary, fontWeight: 'bold' }}>
                {room?.name ? room.name[0].toUpperCase() : '?'}
              </Text>
          </View>
          <View style={{ marginRight: 10 }}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>{room?.name || 'مستخدم'}</Text>
            <Text style={{ fontSize: 12, color: theme.placeholder, textAlign: 'right' }}>
              متصل الآن
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row-reverse' }}>
          <Pressable onPress={handleCall} style={{ marginLeft: 15 }}>
            <Ionicons name="call-outline" size={24} color={theme.primary} />
          </Pressable>
          <Pressable onPress={() => {}}>
            <Ionicons name="ellipsis-vertical" size={24} color={theme.text} />
          </Pressable>
        </View>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          const isMine = item.sender_id === user?.id;
          return (
            <View style={[
              styles.messageBubble,
              isMine ? styles.myMessage : styles.theirMessage,
              { backgroundColor: isMine ? theme.primary : (colorScheme === 'dark' ? '#1e293b' : '#fff') }
            ]}>
              {item.content.startsWith('media:') ? (
                <Image source={{ uri: item.content.replace('media:', '') }} style={styles.messageImage} />
              ) : (
                <View>
                  <Text style={[styles.messageText, { color: isMine ? '#fff' : theme.text }]}>
                    {item.content.startsWith('enc_') ? '🔒 رسالة مشفرة' : item.content}
                  </Text>
                  <View style={styles.messageFooter}>
                    <Text style={[styles.messageTime, { color: isMine ? 'rgba(255,255,255,0.7)' : theme.placeholder }]}>
                      {new Date(item.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                    {isMine && (
                      <Ionicons 
                        name={item.status === 'read' ? "checkmark-done" : "checkmark"} 
                        size={16} 
                        color={item.status === 'read' ? "#4ade80" : "rgba(255,255,255,0.7)"} 
                      />
                    )}
                  </View>
                </View>
              )}
            </View>
          );
        }}
        contentContainerStyle={{ padding: 15, paddingBottom: 20 }}
      />

      <View style={[styles.inputContainer, { backgroundColor: theme.background }]}>
        <View style={[styles.inputWrapper, { backgroundColor: colorScheme === 'dark' ? '#1e293b' : '#fff' }]}>
          <Pressable onPress={handlePickImage} style={styles.attachButton}>
            <Ionicons name="attach" size={24} color={theme.placeholder} />
          </Pressable>
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="رسالة..."
            placeholderTextColor={theme.placeholder}
            value={text}
            onChangeText={setText}
            multiline
          />
          <Pressable style={styles.emojiButton}>
            <Ionicons name="happy-outline" size={24} color={theme.placeholder} />
          </Pressable>
        </View>
        <Pressable 
          style={[styles.sendButton, { backgroundColor: text.trim() ? theme.primary : theme.primary + '80' }]} 
          onPress={handleSend}
          disabled={!text.trim()}
        >
          <Ionicons name={text.trim() ? "send" : "mic-outline"} size={22} color="#fff" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 70,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderBottomWidth: 0.5,
    marginTop: 40,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'right',
  },
  messageBubble: {
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 18,
    marginBottom: 4,
    maxWidth: '80%',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  myMessage: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  theirMessage: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 16,
    textAlign: 'right',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 2,
  },
  messageTime: {
    fontSize: 11,
    marginRight: 4,
  },
  messageImage: {
    width: 250,
    height: 180,
    borderRadius: 12,
  },
  inputContainer: {
    flexDirection: 'row-reverse',
    padding: 8,
    alignItems: 'flex-end',
    paddingBottom: 25,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 10,
    marginLeft: 8,
    minHeight: 45,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  attachButton: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiButton: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,
    textAlign: 'right',
    fontSize: 16,
    maxHeight: 120,
  },
  sendButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  }
});
