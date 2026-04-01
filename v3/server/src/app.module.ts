import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChatsModule } from './chats/chats.module';
import { StoriesModule } from './stories/stories.module';
import { MediaModule } from './media/media.module';
import { User } from './users/entities/user.entity';
import { Room } from './chats/entities/room.entity';
import { Message } from './chats/entities/message.entity';
import { Story } from './stories/entities/story.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, Room, Message, Story],
      synchronize: true, // Only for development!
      ssl: { rejectUnauthorized: false }
    }),
    AuthModule,
    UsersModule,
    ChatsModule,
    StoriesModule,
    MediaModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
})
export class AppModule {}
