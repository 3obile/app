import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '@/constants/Config';

const SOCKET_URL = Config.socketUrl;

let socket: any = null;

export const initiateSocketConnection = async () => {
  const token = await AsyncStorage.getItem('access_token');
  
  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    console.log('Connected to socket server');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from socket server');
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};

export const joinRoom = (roomId: string) => {
  if (socket) socket.emit('joinRoom', roomId);
};

export const sendMessage = (roomId: string, content: string, senderId: string) => {
  if (socket) socket.emit('sendMessage', { roomId, content, senderId });
};

export const joinPersonalRoom = (userId: string) => {
  if (socket) socket.emit('joinPersonalRoom', userId);
};

export const startCall = (targetUserId: string, offer: any, fromUserId: string, fromName: string) => {
  if (socket) socket.emit('callUser', { targetUserId, offer, fromUserId, fromName });
};

export const acceptCall = (targetUserId: string, answer: any) => {
  if (socket) socket.emit('acceptCall', { targetUserId, answer });
};

export const subscribeToCalls = (cb: (data: any) => void) => {
  if (!socket) return;
  socket.on('callReceived', (data: any) => {
    cb(data);
  });
};

export const subscribeToMessages = (cb: (msg: any) => void) => {
  if (!socket) return;
  socket.on('newMessage', (msg: any) => {
    cb(msg);
  });
};
