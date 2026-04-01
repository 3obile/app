import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChatsService } from './chats.service';

@Controller('rooms')
@UseGuards(JwtAuthGuard)
export class RoomsController {
  constructor(private chatsService: ChatsService) {}

  @Post()
  async createRoom(@Body() data: { name: string; members: string[] }, @Request() req) {
    // Ensure creator is included in members
    const members = Array.from(new Set([...data.members, req.user.userId]));
    return this.chatsService.createRoom(data.name, members);
  }

  @Get()
  async getMyRooms(@Request() req) {
    return this.chatsService.getUserRooms(req.user.userId);
  }

  @Get(':id')
  async getRoom(@Param('id') id: string) {
    return this.chatsService.getRoomDetails(id);
  }

  @Post(':id/members')
  async addMember(@Param('id') id: string, @Body('userId') userId: string) {
    return this.chatsService.addMemberToRoom(id, userId);
  }

  @Delete(':id/members/:userId')
  async removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    return this.chatsService.removeMemberFromRoom(id, userId);
  }
}
