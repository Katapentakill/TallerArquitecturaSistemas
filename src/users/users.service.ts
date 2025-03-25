import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { AuthUser } from 'src/entities/authUser.entity';
import { CreateUserDto } from '../DTO/createUserDto';
import { JwtService } from '@nestjs/jwt';

/**
 * Servicio para la gestión de usuarios y autenticación.
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User, 'userConnection') private userRepository: Repository<User>,
    @InjectRepository(AuthUser, 'authConnection') private authUserRepository: Repository<AuthUser>,
    private jwtService: JwtService
  ) {}

  /**
   * Registra un nuevo usuario en el sistema.
   */
  async register(createUserDto: CreateUserDto): Promise<any> {
    try {
      const { email, name, lastname, password, confirmPassword, role = 'Cliente' } = createUserDto;
      const errors: string[] = [];
  
      // Verificar si las contraseñas coinciden
      if (password !== confirmPassword) {
        errors.push('Las contraseñas no coinciden');
      }
  
      // Verificar si el usuario ya existe en `users`
      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser) errors.push('El correo ya está registrado.');
  
      // Verificar si el usuario ya tiene credenciales en `auth_users`
      const existingAuthUser = await this.authUserRepository.findOne({ where: { email } });
      if (existingAuthUser) errors.push('El correo ya tiene credenciales.');
  
      if (errors.length > 0) {
        throw new HttpException({ message: 'Error al registrar usuario', errors }, HttpStatus.BAD_REQUEST);
      }
  
      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Crear y guardar el usuario en `users`
      const newUser = this.userRepository.create({ email, name, lastname, role });
      await this.userRepository.save(newUser);
  
      // Crear y guardar credenciales en `auth_users`
      const newAuthUser = this.authUserRepository.create({ email, password: hashedPassword });
      await this.authUserRepository.save(newAuthUser);
  
      // Generar el token de autenticación
      const payload = { email: newUser.email, sub: newUser.id, role: newUser.role };
      const token = this.jwtService.sign(payload);
  
      // Devolver los datos del usuario, sin el hash de la contraseña
      const userResponse = { ...newUser, password: undefined }; // No devolver la contraseña
  
      return { user: userResponse, token };
    } catch (error) {
      throw new HttpException(
        { message: 'Error inesperado en el registro', errors: [error.message] },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }



  /**
   * Actualiza los datos de un usuario autenticado.
   */
  async updateUser(userId: number, updateData: { email?: string; name?: string; lastname?: string }) {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new HttpException('Usuario no encontrado.', HttpStatus.NOT_FOUND);
      }

      // Actualizar solo los campos proporcionados
      if (updateData.email) user.email = updateData.email;
      if (updateData.name) user.name = updateData.name;
      if (updateData.lastname) user.lastname = updateData.lastname;

      await this.userRepository.save(user);
      return user;
    } catch (error) {
      throw new HttpException(
        { message: 'Error al actualizar el usuario', errors: [error.message] },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Obtiene los datos del usuario autenticado.
   */
  async getUserProfile(userId: number) {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new HttpException('Usuario no encontrado.', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new HttpException(
        { message: 'Error al obtener perfil de usuario', errors: [error.message] },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Obtiene los datos de un usuario específico (solo para administradores).
   */
  async getUserByAdmin(userId: number) {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new HttpException('Usuario no encontrado.', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new HttpException(
        { message: 'Error al obtener usuario', errors: [error.message] },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Obtiene la lista de todos los usuarios registrados con filtros opcionales.
   */
  async getAllUsers(filters: { email?: string; name?: string; lastname?: string }) {
    try {
      const whereCondition: any = { status: true }; // Excluye usuarios eliminados

      if (filters.email) whereCondition.email = Like(`%${filters.email}%`);
      if (filters.name) whereCondition.name = Like(`%${filters.name}%`);
      if (filters.lastname) whereCondition.lastname = Like(`%${filters.lastname}%`);

      const users = await this.userRepository.find({
        where: whereCondition,
        select: ['id', 'email', 'name', 'lastname', 'role', 'createdAt']
      });

      if (!users.length) {
        throw new HttpException('No se encontraron usuarios.', HttpStatus.NOT_FOUND);
      }

      return users;
    } catch (error) {
      throw new HttpException(
        { message: 'Error al obtener lista de usuarios', errors: [error.message] },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Realiza un "soft delete" del usuario cambiando su estado a `false`.
   * 
   * - Evita eliminar administradores.
   */
  async deleteUser(userId: number): Promise<void> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });

      if (!user) {
        throw new HttpException('Usuario no encontrado.', HttpStatus.NOT_FOUND);
      }

      if (user.role === 'Administrador') {
        throw new HttpException('No se puede eliminar un usuario con rol de Administrador.', HttpStatus.FORBIDDEN);
      }

      user.status = false;
      await this.userRepository.save(user);
    } catch (error) {
      throw new HttpException(
        { message: 'Error al eliminar el usuario', errors: [error.message] },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}