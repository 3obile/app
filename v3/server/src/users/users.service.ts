import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string): Promise<User | null | undefined> {
    return this.usersRepository.findOne({ 
      where: { email },
      select: ['id', 'email', 'password_hash', 'is_admin']
    });
  }

  async findOneByPhone(phone: string): Promise<User | null | undefined> {
    return this.usersRepository.findOne({ 
      where: { phone },
      select: ['id', 'phone', 'password_hash', 'is_admin']
    });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async findOne(id: string): Promise<User | null | undefined> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async togglePremium(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) return null;
    user.is_premium = !user.is_premium;
    return this.usersRepository.save(user);
  }
}
