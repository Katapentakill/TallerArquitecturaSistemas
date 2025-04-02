import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Video, VideoSchema } from 'src/entities/video.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }]),

    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret', // Se recomienda utilizar variables de entorno para mayor seguridad
      signOptions: { expiresIn: '60m' }, // El token expira en 60 minutos
    }),
  
  ],
  controllers: [VideosController],
  providers: [VideosService]
})
export class VideosModule {}
