import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { AuthUser } from 'src/entities/authUser.entity';
import { JwtModule } from '@nestjs/jwt';

/**
 * Módulo de usuarios encargado de gestionar la creación y autenticación de usuarios.
 * 
 * Este módulo se encarga de importar las dependencias necesarias para la gestión de usuarios y sus credenciales,
 * incluyendo la conexión con la base de datos y la configuración de JWT.
 */
@Module({
  imports: [
    /**
     * Configuración de TypeORM para manejar múltiples conexiones a bases de datos.
     * Se definen conexiones separadas para la gestión de usuarios y autenticación.
     */

    // Conexión a la base de datos de usuarios
    TypeOrmModule.forFeature([User], 'userConnection'),

    // Conexión a la base de datos de autenticación
    TypeOrmModule.forFeature([AuthUser], 'authConnection'),

    /**
     * Configuración del módulo JWT para la autenticación y generación de tokens.
     * Se utiliza una clave secreta y se define un tiempo de expiración de 60 minutos.
     */
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Se recomienda utilizar variables de entorno para mayor seguridad
      signOptions: { expiresIn: '60m' }, // El token expira en 60 minutos
    }),
  ],
  controllers: [UsersController], // Controlador responsable de gestionar las solicitudes HTTP relacionadas con usuarios
  providers: [UsersService], // Servicio que maneja la lógica de negocio relacionada con los usuarios
  //exports: [JwtModule], // Exporta el módulo JWT para que pueda ser utilizado en otros módulos
})
export class UsersModule {}