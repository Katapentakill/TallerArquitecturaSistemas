import { Controller, Post, Put, Delete, Get, Param, Body } from '@nestjs/common';
import { VideosService } from './videos.service';
import { CreateVideoDto } from '../DTO/createVideoDto';
import { ChangeVideoDataDto } from '../DTO/changeVideoDataDto';
import { VideoDataDto } from '../DTO/videoDataDto';

@Controller('videos')
export class VideosController {

    constructor(private readonly videosService: VideosService) {}

    @Post()
    async uploadVideo(@Body() createVideoDto: CreateVideoDto) {
        return this.videosService.createVideo(createVideoDto);

    }
    
    @Get(':id')
    async getVideo(@Param('id') id: string) {    
        return this.videosService.getVideoById(id);
    }

    @Put(':id')
    async updateVideo(@Param('id') id: string, @Body() changeVideoDataDto: ChangeVideoDataDto) {
        return this.videosService.updateVideoData(id, changeVideoDataDto);
    }

    @Delete(':id')
    async deleteVideo(@Param('id') id: string) {
        return this.videosService.deleteVideo(id);
    }
}
