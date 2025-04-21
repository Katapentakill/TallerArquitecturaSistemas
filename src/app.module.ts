import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { User } from './entities/user.entity';
import { AuthUser } from './entities/authUser.entity';
import { Invoice } from './entities/invoice.entity';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { InvoicesModule } from './invoices/invoices.module';
import { VideosModule } from './videos/videos.module';
import { SeedModule } from './scripts/seed.module';

/**
 * Módulo principal de la aplicación que configura las conexiones a bases de datos,
 * importa los módulos principales y define los controladores y servicios globales.
 */
@Module({
  imports: [
    // Cargar las variables de entorno desde .env
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Conexión a MariaDB para usuarios e invoices
    TypeOrmModule.forRoot({
      name: 'userConnection',
      type: 'mariadb',
      host: process.env.DB_USERS_HOST,
      port: Number(process.env.DB_USERS_PORT),
      username: process.env.DB_USERS_USERNAME,
      password: process.env.DB_USERS_PASSWORD,
      database: process.env.DB_USERS_NAME,
      entities: [User],
      synchronize: true,
    }),

    // Conexión a PostgreSQL para autenticación
    TypeOrmModule.forRoot({
      name: 'authConnection',
      type: 'postgres',
      host: process.env.DB_AUTH_HOST, // Utiliza el nuevo host del pooler
      port: Number(process.env.DB_AUTH_PORT), // El puerto sigue siendo 5432
      username: process.env.DB_AUTH_USERNAME, // El nuevo nombre de usuario
      password: process.env.DB_AUTH_PASSWORD, // Tu contraseña
      database: process.env.DB_AUTH_NAME, // El nombre de la base de datos
      entities: [AuthUser], // Asegúrate de incluir las entidades que necesitas
      synchronize: true, // Usualmente en desarrollo, evita usar en producción
    }),

    // Conexión a MariaDB para invoices
    TypeOrmModule.forRoot({
      name: 'invoiceConnection',
      type: 'mariadb',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Invoice],
      synchronize: true,
    }),

    // Conexión a MongoDB
    MongooseModule.forRoot(process.env.MONGODB_URI!),

    // Otros módulos de la aplicación
    UsersModule,
    AuthModule,
    InvoicesModule,
    VideosModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}