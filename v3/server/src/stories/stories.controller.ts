import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('stories')
export class StoriesController {
  constructor(private storiesService: StoriesService) {}

  @Post()
  async create(@Body() storyData: any) {
    return this.storiesService.create(storyData);
  }

  @Get()
  async findAll() {
    return this.storiesService.findAllActive();
  }
}
