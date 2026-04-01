import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Room } from './room.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Room)
  room: Room;

  @ManyToOne(() => User)
  sender: User;

  @Column({ type: 'text' })
  content_encrypted: string;

  @Column({ default: 'text' })
  type: string;

  @Column({ default: 'sent' })
  status: string; // sent, delivered, read

  @Column({ type: 'jsonb', default: {} })
  metadata: any;

  @CreateDateColumn()
  created_at: Date;
}
