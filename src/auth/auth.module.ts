import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity'; // Entidad de usuarios del sistema
import { AuthUser } from '../entities/authUser.entity'; // Entidad de autenticación
import { JwtModule } from '@nestjs/jwt'; // Módulo de autenticación JWT para la gestión de tokens

/**
 * Módulo de autenticación que gestiona la seguridad y el inicio de sesión del sistema.
 * Se encarga de manejar la autenticación con JWT y la conexión con las bases de datos.
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
     * Configuración del módulo JWT para la generación y validación de tokens.
     * Se utiliza una clave secreta y se define un tiempo de expiración de 1 hora.
     */
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret', // Clave secreta para firmar los tokens
      signOptions: { expiresIn: '1h' }, // Tiempo de expiración del token
    }),
  ],
  controllers: [AuthController], // Controlador responsable de manejar las rutas de autenticación
  providers: [AuthService], // Servicio encargado de la lógica de autenticación
})
export class AuthModule {}