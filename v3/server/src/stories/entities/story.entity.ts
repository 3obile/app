import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('stories')
export class Story {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: User;

  @Column()
  content_url: string;

  @Column({ default: 'image' })
  type: string;

  @Column({ nullable: true })
  caption: string;

  @Column({ type: 'timestamptz', default: () => "NOW() + INTERVAL '24 hours'" })
  expires_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
