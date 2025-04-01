import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Video, VideoSchema } from 'src/entities/video.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }])],
  controllers: [VideosController],
  providers: [VideosService]
})
export class VideosModule {}
