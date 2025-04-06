import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity'; // Entidad de usuarios del sistema
import { AuthUser } from '../entities/authUser.entity'; // Entidad de autenticación
import { SeederService } from './seed';
import { Invoice } from 'src/entities/invoice.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { Video, VideoSchema } from '../entities/video.entity'; // Importa Video y su esquema

@Module({
  imports: [
    // Configuración de TypeORM para la base de datos de usuarios
    TypeOrmModule.forFeature([User, Invoice], 'userConnection'), 

    // Configuración de la base de datos de autenticación
    TypeOrmModule.forFeature([AuthUser], 'authConnection'),

    // Registra el esquema de Video en MongoDB
    MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }]),
  ],
  providers: [SeederService],
})
export class SeedModule {}
