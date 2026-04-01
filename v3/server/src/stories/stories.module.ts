import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoriesService } from './stories.service';
import { StoriesController } from './stories.controller';
import { Story } from './entities/story.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Story])],
  providers: [StoriesService],
  controllers: [StoriesController],
})
export class StoriesModule {}
