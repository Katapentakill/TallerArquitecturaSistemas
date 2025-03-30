import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity'; // Entidad de usuarios (gestión de perfiles y roles)
import { AuthUser } from './entities/authUser.entity'; // Entidad de autenticación (manejo de credenciales)
import { Invoice } from './entities/invoice.entity'; // Entidad de facturación (si se usa MariaDB)
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoicesService } from './invoices/invoices.service';
import { InvoicesController } from './invoices/invoices.controller';
import { InvoicesModule } from './invoices/invoices.module';

/**
 * Módulo principal de la aplicación que configura las conexiones a bases de datos,
 * importa los módulos principales y define los controladores y servicios globales.
 */
@Module({
  imports: [
    /**
     * Configuración de TypeORM para la base de datos de usuarios en MariaDB.
     * 
     * - Almacena la información de los usuarios, incluyendo datos personales y roles.
     * - También maneja la entidad `Invoice` si se usa facturación.
     * - Se recomienda **NO** usar `synchronize: true` en producción, ya que puede afectar los datos existentes.
     */
    TypeOrmModule.forRoot({
      name: 'userConnection', // Nombre de la conexión para los usuarios
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123', // Se recomienda utilizar variables de entorno para mayor seguridad
      database: 'users_db',
      entities: [User, Invoice], // Entidades almacenadas en MariaDB
      synchronize: true, // Solo debe usarse en desarrollo, desactivar en producción
    }),

    /**
     * Configuración de TypeORM para la base de datos de autenticación en PostgreSQL.
     * 
     * - Se usa exclusivamente para el manejo de credenciales y autenticación.
     * - Almacena las contraseñas encriptadas y datos de login.
     * - Al igual que la configuración anterior, `synchronize: true` solo debe usarse en desarrollo.
     */
    TypeOrmModule.forRoot({
      name: 'authConnection', // Nombre de la conexión para autenticación
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123', // Se recomienda utilizar variables de entorno para mayor seguridad
      database: 'auth_db',
      entities: [AuthUser], // Entidades almacenadas en PostgreSQL
      synchronize: true, // Solo en desarrollo, deshabilitar en producción
    }),

    MongooseModule.forRoot('mongodb://localhost:27017/videos_db'),

    // Módulo de gestión de usuarios (registro, administración de roles, etc.)
    UsersModule,

    // Módulo de autenticación (inicio de sesión, manejo de tokens JWT, etc.)
    AuthModule,

    // Módulo de facturación (manejo de facturas, pagos, etc.)
    InvoicesModule
  ],
  controllers: [AppController], // Controlador principal de la aplicación
  providers: [AppService], // Servicio global para la lógica de negocio general
})
export class AppModule {}