import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { ChatsService } from './chats.service';
// import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'chat'
})
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private chatsService: ChatsService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinPersonalRoom')
  handleJoinPersonalRoom(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(userId);
    console.log(`User ${userId} joined their personal signaling room`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(roomId);
    console.log(`Client ${client.id} joined room ${roomId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { roomId: string; content: string; senderId: string; type?: string },
    @ConnectedSocket() client: Socket,
  ) {
    // 1. Save to DB
    const savedMsg = await this.chatsService.saveMessage(
      data.roomId, 
      data.senderId, 
      data.content, 
      data.type || 'text'
    );

    // 2. Broadcast to all clients in the room (including ID and timestamp from DB)
    this.server.to(data.roomId).emit('newMessage', {
      id: savedMsg.id,
      roomId: data.roomId,
      content: data.content,
      senderId: data.senderId,
      created_at: savedMsg.created_at,
      type: savedMsg.type
    });
  }

  @SubscribeMessage('messageRead')
  async handleMessageRead(
    @MessageBody() data: { messageId: string; roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    // 1. Update DB (In a real app, I'd have a specific method in ChatsService)
    // For simplicity, let's assume ChatsService has it or just do it here if possible.
    // I'll add the method to ChatsService.
    await this.chatsService.updateMessageStatus(data.messageId, 'read');

    // 2. Broadcast to room
    this.server.to(data.roomId).emit('messageStatusUpdate', {
      messageId: data.messageId,
      status: 'read'
    });
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { roomId: string; userId: string; isTyping: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    client.to(data.roomId).emit('userTyping', data);
  }

  // --- WebRTC Signaling ---

  @SubscribeMessage('callUser')
  handleCallUser(
    @MessageBody() data: { targetUserId: string; offer: any; fromUserId: string; fromName: string },
    @ConnectedSocket() client: Socket,
  ) {
    // In a real app, I'd map userId to socketId. For now, broadcast to room or relay if socketId known.
    // Simplified: broadcast to the target user's personal 'room' (their userId)
    client.to(data.targetUserId).emit('callReceived', {
      offer: data.offer,
      fromUserId: data.fromUserId,
      fromName: data.fromName
    });
  }

  @SubscribeMessage('acceptCall')
  handleAcceptCall(
    @MessageBody() data: { targetUserId: string; answer: any },
    @ConnectedSocket() client: Socket,
  ) {
    client.to(data.targetUserId).emit('callAccepted', { answer: data.answer });
  }

  @SubscribeMessage('rejectCall')
  handleRejectCall(
    @MessageBody() data: { targetUserId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.to(data.targetUserId).emit('callRejected');
  }

  @SubscribeMessage('iceCandidate')
  handleIceCandidate(
    @MessageBody() data: { targetUserId: string; candidate: any },
    @ConnectedSocket() client: Socket,
  ) {
    client.to(data.targetUserId).emit('iceCandidate', { candidate: data.candidate });
  }
}
