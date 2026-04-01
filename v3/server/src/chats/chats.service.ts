import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Room } from './entities/room.entity';
import { Message } from './entities/message.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createRoom(name: string, members: string[]) {
    const room = this.roomsRepository.create({ name });
    const users = await this.usersRepository.find({
      where: { id: In(members) }
    });
    room.members = users;
    return this.roomsRepository.save(room);
  }

  async saveMessage(roomId: string, senderId: string, content: string, type: string = 'text') {
    const room = await this.roomsRepository.findOne({ where: { id: roomId } });
    const sender = await this.usersRepository.findOne({ where: { id: senderId } });
    
    if (!room || !sender) throw new Error('Room or Sender not found');

    const message = this.messagesRepository.create({
      room,
      sender,
      content_encrypted: content,
      type,
    });

    return this.messagesRepository.save(message);
  }

  async getRoomMessages(roomId: string) {
    return this.messagesRepository.find({
      where: { room: { id: roomId } },
      relations: ['sender'],
      order: { created_at: 'ASC' },
    });
  }

  async updateMessageStatus(messageId: string, status: string) {
    return this.messagesRepository.update(messageId, { status });
  }

  async getUserRooms(userId: string) {
    return this.roomsRepository.find({
      where: { members: { id: userId } },
      relations: ['members', 'created_by'],
    });
  }

  async addMemberToRoom(roomId: string, userId: string) {
    const room = await this.roomsRepository.findOne({ where: { id: roomId }, relations: ['members'] });
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!room || !user) throw new Error('Room or User not found');
    
    if (!room.members.find(m => m.id === userId)) {
      room.members.push(user);
    }
    return this.roomsRepository.save(room);
  }

  async removeMemberFromRoom(roomId: string, userId: string) {
    const room = await this.roomsRepository.findOne({ where: { id: roomId }, relations: ['members'] });
    if (!room) throw new Error('Room not found');
    
    room.members = room.members.filter(m => m.id !== userId);
    return this.roomsRepository.save(room);
  }

  async getRoomDetails(roomId: string) {
    return this.roomsRepository.findOne({
      where: { id: roomId },
      relations: ['members', 'created_by'],
    });
  }
}
