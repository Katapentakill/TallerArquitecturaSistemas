import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { AuthUser } from '../entities/authUser.entity';
import { SeederService } from './seed';
import { Invoice } from 'src/entities/invoice.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { Video, VideoSchema } from '../entities/video.entity';
import { SeedController } from './seed.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Invoice], 'userConnection'),
    TypeOrmModule.forFeature([AuthUser], 'authConnection'),
    MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }]),
  ],
  providers: [SeederService],
  controllers: [SeedController], // <-- añade aquí
})
export class SeedModule {}
