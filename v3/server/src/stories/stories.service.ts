import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Story } from './entities/story.entity';

@Injectable()
export class StoriesService {
  constructor(
    @InjectRepository(Story)
    private storiesRepository: Repository<Story>,
  ) {}

  async create(storyData: any) {
    const story = this.storiesRepository.create(storyData);
    return this.storiesRepository.save(story);
  }

  async findAllActive() {
    return this.storiesRepository.find({
      where: {
        expires_at: MoreThan(new Date())
      },
      relations: ['user'],
      order: { created_at: 'DESC' }
    });
  }
}
